'use client'

import { useState, useCallback, useEffect } from 'react';
import { sendMessage as sendMessageAction, getMessageHistory, deleteThread } from '@/app/actions/chat';
import { ChatState, Message, ApiResponse } from '@/types/chat';
import { ProductQuestion } from '@/types/products';

export function useChat() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
    resultData: null
  });
  
  // 初期化（メッセージ履歴読み込み）
  const initChat = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await getMessageHistory();
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          messages: response.data || [],
          isLoading: false
        }));
      } else {
        setState(prev => ({
          ...prev,
          error: response.error || '履歴の読み込みに失敗しました',
          isLoading: false
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: '履歴の読み込みに失敗しました',
        isLoading: false
      }));
    }
  }, []);
  
  // 初回ロード時に履歴を取得
  useEffect(() => {
    initChat();
  }, [initChat]);
  
  // メッセージ送信
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return null;
    
    // UIにユーザーメッセージを即時反映
    const tempId = `temp-${Date.now()}`;
    setState(prev => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          id: tempId,
          role: 'user',
          content,
          createdAt: new Date()
        }
      ],
      isLoading: true,
      error: null
    }));
    
    try {
      const response = await sendMessageAction(content);
      
      if (response.success) {
        // 履歴を再取得して最新状態に
        const historyResponse = await getMessageHistory();
        
        if (historyResponse.success) {
          setState(prev => ({
            ...prev,
            messages: historyResponse.data || prev.messages,
            resultData: response.data as ProductQuestion,
            isLoading: false
          }));
        } else {
          setState(prev => ({
            ...prev,
            error: historyResponse.error || 'メッセージ履歴の更新に失敗しました',
            isLoading: false
          }));
        }
        
        return response.data as ProductQuestion;
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
      const response = await deleteThread();
      
      if (response.success) {
        setState({
          messages: [],
          isLoading: false,
          error: null,
          resultData: null
        });
      } else {
        setState(prev => ({
          ...prev,
          error: response.error || '新規チャットの開始に失敗しました',
          isLoading: false
        }));
      }
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
