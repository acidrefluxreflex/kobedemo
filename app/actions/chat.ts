'use server'

import { openai, ASSISTANT_ID } from '../lib/openai';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { ProductQuestion } from '@/types/products';
import { ApiResponse, Message } from '@/types/chat';

// スレッドIDの取得・保存
const getThreadId = async () => {
  const cookieStore = await cookies();
  return cookieStore.get('threadId')?.value;
};

const saveThreadId = async (threadId: string) => {
  const cookieStore = await cookies();
  cookieStore.set('threadId', threadId, { 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1週間
    path: '/',
  });
};

// 新規スレッド作成
async function createThread() {
  const thread = await openai.beta.threads.create();
  await saveThreadId(thread.id);
  return thread.id;
}

// メッセージを送信し、応答を取得する
export async function sendMessage(message: string): Promise<ApiResponse> {
  try {
    // スレッドIDの取得または新規作成
    let threadId = await getThreadId();
    if (!threadId) {
      threadId = await createThread();
    }
    
    // スレッドにメッセージを追加
    await openai.beta.threads.messages.create(
      threadId,
      { role: 'user', content: message }
    );
    
    // アシスタントに処理を依頼
    const run = await openai.beta.threads.runs.create(
      threadId,
      { assistant_id: ASSISTANT_ID! }
    );
    
    // 処理完了を待機
    let runStatus = await openai.beta.threads.runs.retrieve(
      threadId,
      run.id
    );
    
    console.log(`ステータス初期状態: ${runStatus.status}`);
    console.log(`Run情報: ${JSON.stringify({
      id: run.id,
      status: runStatus.status,
      started_at: runStatus.started_at,
      thread_id: threadId,
    })}`);
    
    // 完了まで定期的に状態確認（タイムアウト15秒）
    let attempts = 0;
    const maxAttempts = 30; // 最大30回（90秒）
    
    while (runStatus.status !== 'completed' && attempts < maxAttempts) {
      // 失敗・キャンセルの場合はエラー
      if (['failed', 'cancelled', 'expired'].includes(runStatus.status)) {
        console.error(`処理が失敗しました: ${runStatus.status}`);
        console.error(`詳細情報: ${JSON.stringify(runStatus)}`);
        
        // エラー内容を詳細に表示
        if (runStatus.last_error) {
          console.error(`エラー詳細: ${JSON.stringify(runStatus.last_error)}`);
        }
        
        throw new Error(`処理が失敗しました: ${runStatus.status} - ${runStatus.last_error?.message || '詳細不明'}`);
      }
      
      // エラー状態の場合
      if (runStatus.status === 'requires_action') {
        console.error(`アクションが必要です: ${JSON.stringify(runStatus.required_action)}`);
        throw new Error('アクションが必要です');
      }
      
      console.log(`待機中... 試行回数: ${attempts + 1}, 現在のステータス: ${runStatus.status}`);
      
      // 3秒待機
      await new Promise(resolve => setTimeout(resolve, 3000));
      attempts++;
      
      // 状態再取得
      try {
        runStatus = await openai.beta.threads.runs.retrieve(
          threadId,
          run.id
        );
        console.log(`新しいステータス: ${runStatus.status} (試行回数: ${attempts})`);
      } catch (retrieveError) {
        console.error(`状態取得エラー: ${retrieveError}`);
        throw new Error(`状態取得に失敗しました: ${retrieveError}`);
      }
    }
    
    // タイムアウトの場合
    if (attempts >= maxAttempts) {
      console.error(`タイムアウト: 最大試行回数(${maxAttempts})を超えました。最終ステータス: ${runStatus.status}`);
      throw new Error('応答タイムアウト');
    }
    
    console.log(`処理完了: ステータス=${runStatus.status}`);
    
    // 応答メッセージを取得
    const messages = await openai.beta.threads.messages.list(threadId);
    
    // 最新の応答を取得
    const latestMessage = messages.data
      .filter(msg => msg.role === 'assistant')
      .sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];
    
    if (!latestMessage || !latestMessage.content || latestMessage.content.length === 0) {
      throw new Error('応答が空です');
    }
    
    // テキスト形式の応答を取得
    const content = latestMessage.content[0];
    if (content.type !== 'text') {
      throw new Error('テキスト以外の応答です');
    }
    
    // JSON形式の応答をパース
    try {
      console.log(`応答内容: ${content.text.value.substring(0, 200)}...`); // 最初の200文字をログ出力
      
      const jsonMatch = content.text.value.match(/```json\n([\s\S]*?)\n```/) || 
                        content.text.value.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        console.log(`パース対象JSON文字列: ${jsonStr.substring(0, 200)}...`); // 最初の200文字をログ出力
        
        const responseData = JSON.parse(jsonStr) as ProductQuestion;
        console.log(`パース成功: Question=${responseData.question}, Answer長=${responseData.answer?.length || 0}`);
        return {
          success: true,
          data: responseData
        };
      } else {
        return {
          success: true,
          data: { 
            question: message,
            answer: [] // 空のProduct配列
          }
        };
      }
    } catch (e) {
      console.error('JSON解析エラー:', e);
      return {
        success: false,
        error: 'データの形式が不正です'
      };
    }
    
  } catch (error) {
    console.error('エラー:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました'
    };
  } finally {
    // キャッシュを更新して最新の状態を反映
    revalidatePath('/');
  }
}

// スレッドのメッセージ履歴を取得
export async function getMessageHistory(): Promise<ApiResponse> {
  const threadId = await getThreadId();
  if (!threadId) {
    return { success: true, data: [] };
  }
  
  try {
    const messages = await openai.beta.threads.messages.list(threadId);
    
    const formattedMessages = messages.data.map(msg => ({
      id: msg.id,
      role: msg.role as 'user' | 'assistant',
      content: msg.content[0]?.type === 'text' ? msg.content[0].text.value : '',
      createdAt: new Date(msg.created_at * 1000)
    })).reverse();
    
    return {
      success: true,
      data: formattedMessages
    };
  } catch (error) {
    console.error('メッセージ履歴取得エラー:', error);
    return {
      success: false,
      error: '履歴の取得に失敗しました'
    };
  }
}

// スレッドを削除（新規チャット用）
export async function deleteThread(): Promise<ApiResponse> {
  const threadId = await getThreadId();
  if (!threadId) {
    return { success: true };
  }
  
  try {
    // OpenAI APIでスレッド削除
    await openai.beta.threads.del(threadId);
    
    // Cookieからスレッドを削除
    const cookieStore = await cookies();
    cookieStore.delete('threadId');
    
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('スレッド削除エラー:', error);
    return {
      success: false,
      error: 'スレッドの削除に失敗しました'
    };
  }
}
