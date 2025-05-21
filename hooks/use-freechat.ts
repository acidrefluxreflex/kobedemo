'use client'

import { useState, useCallback } from 'react';
import { sendMessage as sendMessageAction, deleteThread } from '@/app/actions/testchat';
import { Message } from '@/types/chat';

// 自由チャット用のレスポンス型
interface FreeChatResponse {
  question: string;
  answer: string;
}

// 自由チャット用の状態型
interface FreeChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  resultData: FreeChatResponse | null;
}

export function useFreechat() {
  const [state, setState] = useState<FreeChatState>({
    messages: [],
    isLoading: false,
    error: null,
    resultData: null
  });
  
  // 初期化（空の状態にリセット）
  const initChat = useCallback(() => {
    setState({
      messages: [],
      isLoading: false,
      error: null,
      resultData: null
    });
  }, []);
  
  // メッセージ送信
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return null;
    
    // UIにユーザーメッセージを即時反映
    const tempId = `temp-${Date.now()}`;
    const userMessage: Message = {
      id: tempId,
      role: 'user',
      content,
      createdAt: new Date()
    };
    
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null
    }));
    
    try {
      const response = await sendMessageAction(content);
      
      if (response.success && response.data) {
        const freeChatResponse = response.data as FreeChatResponse;
        
        // 応答メッセージをローカル状態に追加
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: freeChatResponse.answer,
          createdAt: new Date()
        };
        
        setState(prev => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
          resultData: freeChatResponse,
          isLoading: false
        }));
        
        return freeChatResponse;
      } else {
        setState(prev => ({
          ...prev,
          error: response.error || 'メッセージの送信に失敗しました',
          isLoading: false
        }));
        return null;
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'メッセージの送信に失敗しました',
        isLoading: false
      }));
      return null;
    }
  }, []);
  
  // 新規チャット
  const startNewChat = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      await deleteThread();
      
      // ローカル状態をリセット
      setState({
        messages: [],
        isLoading: false,
        error: null,
        resultData: null
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: '新規チャットの開始に失敗しました',
        isLoading: false
      }));
    }
  }, []);
  
  return {
    ...state,
    initChat,
    sendMessage,
    startNewChat
  };
}
