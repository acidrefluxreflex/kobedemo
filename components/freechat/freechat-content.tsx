'use client'

import { useState, useEffect } from 'react';
import { Header } from "../main-content/header"
import { WelcomeSection } from "../main-content/welcome-section"
import { FreeChatInput } from "./freechat-input"
import { useFreechat } from "@/hooks/use-freechat"

// メッセージリスト用コンポーネント
function FreeChatMessageList({ messages, isLoading }: { 
  messages: any[],
  isLoading: boolean
}) {
  return (
    <div className="flex flex-col space-y-4 p-4">
      {messages.map(message => (
        <div 
          key={message.id}
          className={`flex ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[80%] rounded-lg p-3 ${
              message.role === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100'
            } whitespace-pre-wrap`}
          >
            {message.content}
          </div>
        </div>
      ))}
      
      {isLoading && (
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-lg p-3 bg-gray-100">
            <div className="flex space-x-2">
              <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"></div>
              <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
              <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function FreeChatContent() {
  const { messages, isLoading, error, resultData, sendMessage, startNewChat } = useFreechat();
  const [showWelcome, setShowWelcome] = useState(true);
  
  // メッセージがあれば歓迎表示を非表示
  useEffect(() => {
    if (messages.length > 0) {
      setShowWelcome(false);
    }
  }, [messages]);
  
  // 新規チャットボタンクリック時
  const handleNewChat = async () => {
    await startNewChat();
    setShowWelcome(true);
  };
  
  return (
    <div className="flex-1 flex flex-col">
      <Header onNewChat={handleNewChat} />
      <div className="flex-1 overflow-auto">
        {showWelcome ? (
          <div className="p-6 flex flex-col items-center justify-center h-full">
            <WelcomeSection />
            <div className="mt-8 text-center text-lg">
              <p>自由にAIとチャットを楽しめます。</p>
              <p>何でも質問してください！</p>
            </div>
          </div>
        ) : (
          <FreeChatMessageList 
            messages={messages}
            isLoading={isLoading}
          />
        )}
        {error && (
          <div className="p-2 text-sm text-center text-red-500 bg-red-50">
            エラー: {error}
          </div>
        )}
      </div>
      <div className="p-4 border-t border-gray-200">
        <FreeChatInput onSend={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  )
}
