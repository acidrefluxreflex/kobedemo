'use client'

import { useEffect, useRef } from 'react';
import { Message } from '@/types/chat';
import { ProductQuestion } from '@/types/products';
import { cn } from '@/lib/utils';
import { ProductDisplay } from './product-display';
import { JsonDisplay } from '@/components/ui/json-display';
import { MarkdownJson } from '@/components/ui/markdown-json';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  resultData: ProductQuestion | null;
}

export function MessageList({ messages, isLoading, resultData }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  
  // 新しいメッセージが来たら自動スクロール
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          まだメッセージはありません。質問を入力してください。
        </div>
      ) : (
        <>
          {messages.map((message) => {
            // AIからのJSON応答を検出
            const isJsonResponse = 
              message.role === 'assistant' && 
              message.content.includes('{') && 
              message.content.includes('}');
              
            // JSONレスポンスの場合、吹き出しなしで直接表示
            if (isJsonResponse) {
              try {
                // JSONを抽出する正規表現
                const jsonMatch = message.content.match(/\{[\s\S]*\}/);
                  
                if (jsonMatch) {
                  const jsonStr = jsonMatch[1] || jsonMatch[0];
                  const parsedData = JSON.parse(jsonStr);
                  
                  // これをチャットUIのメインコンテンツに直接表示
                  return (
                    <div key={message.id} className="w-full my-6">
                      <div className="bg-white hadow-sm">
                        <div className="p-4">
                          <MarkdownJson data={parsedData} />
                          <div className="text-xs text-gray-500 mt-1 text-right">
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              } catch (e) {
                // JSON解析に失敗した場合は標準表示に戻す
                console.error("JSON解析エラー:", e);
              }
            }
            
            // 通常のメッセージ表示（ユーザーメッセージまたはJSON以外のAIメッセージ）
            return (
              <div
                key={message.id}
                className={cn(
                  "flex flex-col max-w-[80%] rounded-lg p-4",
                  message.role === 'user'
                    ? "ml-auto bg-blue-100 text-blue-900"
                    : "mr-auto bg-gray-100 text-gray-900"
                )}
              >
                <div className="text-sm font-medium mb-1">
                  {message.role === 'user' ? 'あなた' : 'アシスタント'}
                </div>
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                <div className="text-xs text-gray-500 mt-1 self-end">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </div>
              </div>
            );
          })}
        </>
      )}
      
      {resultData && (
        <ProductDisplay data={resultData} />
      )}
      
      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          <span className="ml-2 text-sm text-gray-700">回答を生成中...</span>
        </div>
      )}
      
      <div ref={bottomRef} />
    </div>
  );
}
