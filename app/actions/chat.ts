"use server";

import { openai, ASSISTANT_ID } from "../lib/openai";
import { revalidatePath } from "next/cache";
import { ProductQuestion } from "@/types/products";
import { ApiResponse, Message } from "@/types/chat";

// シンプルなインメモリキャッシュ（型安全な定義）
const messageCache = new Map<string, ProductQuestion>();
const CACHE_TTL = 60 * 60 * 1000; // 1時間（ミリ秒）
const MAX_CACHE_SIZE = 100; // 最大キャッシュエントリ数

// キャッシュのON/OFF制御（環境変数から取得、未設定の場合はON）
const CACHE_ENABLED = process.env.DISABLE_CHAT_CACHE !== "true";

// キャッシュエントリのTTL処理を行う安全な関数（任意の値を文字列として処理）
function setTTLForCacheEntry(key: string | undefined): void {
  if (CACHE_TTL <= 0) return;
  
  // nullやundefinedの場合も安全に処理
  if (key === undefined || key === null) {
    console.log("🔄 キャッシュキーが無効:", key);
    return;
  }
  
  // 文字列の完全コピーを作成
  const safeKey = String(key);
  
  setTimeout(() => {
    if (messageCache.has(safeKey)) {
      messageCache.delete(safeKey);
      console.log("🔄 キャッシュTTL期限切れ:", safeKey);
    }
  }, CACHE_TTL);
}

// キャッシュキーの正規化関数 - 常に有効な文字列を返すことを保証
function normalizeQuery(query: string | undefined | null): string {
  // 無効な入力値のチェック
  if (query === undefined || query === null || typeof query !== "string") {
    return "invalid-query"; // 文字列でない場合のフォールバック
  }
  
  // 簡易的な正規化: 余分な空白を削除、小文字化
  const normalized = query.trim().toLowerCase();
  
  // 空文字列チェック
  return normalized || "empty-query";
}

// 新規スレッド作成
async function createThread() {
  const thread = await openai.beta.threads.create();
  // nullやundefinedの可能性に対応
  return thread.id || "";
}

// メッセージを送信し、応答を取得する
export async function sendMessage(message: string): Promise<ApiResponse> {
  try {
    // キャッシュ確認
    if (CACHE_ENABLED) {
      try {
        const cacheKey = normalizeQuery(message);
        const cachedResponse = messageCache.get(cacheKey);

        if (cachedResponse) {
          console.log("🔄 キャッシュヒット:", cacheKey);
          return {
            success: true,
            data: cachedResponse,
            fromCache: true, // キャッシュからの応答を識別
          };
        }
        console.log("🔄 キャッシュミス:", cacheKey);
      } catch (cacheError) {
        console.error("🔄 キャッシュ読み取りエラー:", cacheError);
        // キャッシュエラーは無視して通常処理へ
      }
    }

    // 毎回新規スレッドを作成（セッション単位方式）
    const threadId = await createThread();

    // スレッドにメッセージを追加（型安全性の確保）
    if (threadId) {
      await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: message,
      });
    } else {
      throw new Error("スレッドIDの生成に失敗しました");
    }

    // アシスタントに処理を依頼（型安全性の確保）
    let runId = "";
    let runStatus;
    
    if (threadId) {
      const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: ASSISTANT_ID || "",  // nullやundefinedの場合は空文字列
      });
      
      // IDが確実に存在することを保証
      runId = run.id || "";
      
      if (runId) {
        // 処理完了を待機
        runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
      } else {
        throw new Error("Run IDの生成に失敗しました");
      }
    } else {
      throw new Error("Thread IDが無効です");
    }

    // 初期状態のログ出力（runIdを使用）
    console.log(`ステータス初期状態: ${runStatus.status}`);
    console.log(
      `Run情報: ${JSON.stringify({
        id: runId,
        status: runStatus.status,
        started_at: runStatus.started_at,
        thread_id: threadId,
      })}`
    );

    // 完了まで定期的に状態確認（タイムアウト15秒）
    let attempts = 0;
    const maxAttempts = 30; // 最大30回（90秒）

    while (runStatus.status !== "completed" && attempts < maxAttempts) {
      // 失敗・キャンセルの場合はエラー
      if (["failed", "cancelled", "expired"].includes(runStatus.status)) {
        console.error(`処理が失敗しました: ${runStatus.status}`);
        console.error(`詳細情報: ${JSON.stringify(runStatus)}`);

        // エラー内容を詳細に表示
        if (runStatus.last_error) {
          console.error(`エラー詳細: ${JSON.stringify(runStatus.last_error)}`);
        }

        throw new Error(
          `処理が失敗しました: ${runStatus.status} - ${
            runStatus.last_error?.message || "詳細不明"
          }`
        );
      }

      // エラー状態の場合
      if (runStatus.status === "requires_action") {
        console.error(
          `アクションが必要です: ${JSON.stringify(runStatus.required_action)}`
        );
        throw new Error("アクションが必要です");
      }

      console.log(
        `待機中... 試行回数: ${attempts + 1}, 現在のステータス: ${
          runStatus.status
        }`
      );

      // 3秒待機
      await new Promise((resolve) => setTimeout(resolve, 3000));
      attempts++;

      // 状態再取得（再度型安全な実装を確保）
      try {
        // 常にrunIdを使用（値が保証されている）
        runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
        console.log(
          `新しいステータス: ${runStatus.status} (試行回数: ${attempts})`
        );
      } catch (retrieveError) {
        console.error(`状態取得エラー: ${retrieveError}`);
        throw new Error(`状態取得に失敗しました: ${retrieveError}`);
      }
    }

    // タイムアウトの場合
    if (attempts >= maxAttempts) {
      console.error(
        `タイムアウト: 最大試行回数(${maxAttempts})を超えました。最終ステータス: ${runStatus.status}`
      );
      throw new Error("応答タイムアウト");
    }

    console.log(`処理完了: ステータス=${runStatus.status}`);

    // 応答メッセージを取得
    const messages = await openai.beta.threads.messages.list(threadId);

    // 最新の応答を取得
    const latestMessage = messages.data
      .filter((msg) => msg.role === "assistant")
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];

    if (
      !latestMessage ||
      !latestMessage.content ||
      latestMessage.content.length === 0
    ) {
      throw new Error("応答が空です");
    }

    // テキスト形式の応答を取得
    const content = latestMessage.content[0];
    if (content.type !== "text") {
      throw new Error("テキスト以外の応答です");
    }

    // JSON形式の応答をパース
    try {
      // content.text.valueが確実に存在することを確認
      const textValue = content.text.value || "";
      console.log(`応答内容: ${textValue.substring(0, 200)}...`); // 最初の200文字をログ出力

      const jsonMatch =
        textValue.match(/```json\n([\s\S]*?)\n```/) ||
        textValue.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        // matchの1番目があれば使用、なければ0番目を使用
        const jsonStr = jsonMatch[1] || jsonMatch[0] || "{}";

        // jsonStrが必ず文字列であることを確保
        const jsonString = typeof jsonStr === "string" ? jsonStr : "{}";
        console.log(`パース対象JSON文字列: ${jsonString.substring(0, 200)}...`); // 最初の200文字をログ出力

        // 必ず文字列を渡すために同じjsonStringを使用
        const responseData = JSON.parse(jsonString) as ProductQuestion;

        // 完全な型安全を確保するためのデフォルト値設定
        const safeResponseData: ProductQuestion = {
          question:
            typeof responseData.question === "string"
              ? responseData.question
              : "不明な質問",
          answer: Array.isArray(responseData.answer) ? responseData.answer : [],
        };

        const question = safeResponseData.question;
        const answerLength = safeResponseData.answer.length;

        console.log(
          `パース成功: Question=${question}, Answer長=${answerLength}`
        );

        // キャッシュに応答を保存
        if (CACHE_ENABLED) {
          try {
            const cacheKey = normalizeQuery(message);

            // キャッシュサイズ制限チェック
            if (messageCache.size >= MAX_CACHE_SIZE) {
              // 最も古いエントリを削除（単純実装）
              const oldestKey = messageCache.keys().next().value;
              console.log("🔄 キャッシュ容量制限到達、削除:", oldestKey);
              messageCache.delete(oldestKey as string);
            }

            // キャッシュに保存（型安全なオブジェクトを使用）
            messageCache.set(cacheKey, safeResponseData);
            console.log("🔄 キャッシュに保存:", cacheKey);

            // 定義済みの型安全なTTL処理関数を呼び出す
            setTTLForCacheEntry(cacheKey);
          } catch (cacheError) {
            console.error("🔄 キャッシュ保存エラー:", cacheError);
            // キャッシュエラーは無視
          }
        }

        return {
          success: true,
          data: safeResponseData, // 型安全なオブジェクトを返す
        };
      } else {
        return {
          success: true,
          data: {
            question: message,
            answer: [], // 空のProduct配列
          },
        };
      }
    } catch (e) {
      console.error("JSON解析エラー:", e);
      return {
        success: false,
        error: "データの形式が不正です",
      };
    }
  } catch (error) {
    console.error("エラー:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "不明なエラーが発生しました",
    };
  } finally {
    // キャッシュを更新して最新の状態を反映
    revalidatePath("/");
  }
}

// メッセージ履歴を取得（常に空の配列を返す - フロントエンドで履歴管理）
export async function getMessageHistory(): Promise<ApiResponse> {
  return { success: true, data: [] };
}

// スレッドを削除（新規チャット用）- 状態を持たないため実質的には何もしない
export async function deleteThread(): Promise<ApiResponse> {
  revalidatePath("/");
  return { success: true };
}

// キャッシュをクリア（管理用）
export async function clearCache(): Promise<ApiResponse> {
  try {
    messageCache.clear();
    console.log("🔄 キャッシュをクリアしました");
    return { success: true };
  } catch (error) {
    console.error("🔄 キャッシュクリアエラー:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "キャッシュクリアに失敗しました",
    };
  }
}
