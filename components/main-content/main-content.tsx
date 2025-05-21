'use client'

import { useState, useEffect } from 'react';
import type { RecommendedQuestion } from "@/types"
import { Header } from "./header"
import { WelcomeSection } from "./welcome-section"
import { RecommendedQuestions } from "./recommended-questions"
import { ChatInput } from "./chat-input"
import { MessageList } from "./message-list"
import { useChat } from "@/hooks/use-chat"

interface MainContentProps {
  recommendedQuestions: RecommendedQuestion[]
}

export function MainContent({ recommendedQuestions }: MainContentProps) {
  const { messages, isLoading, error, resultData, sendMessage, startNewChat } = useChat();
  const [showWelcome, setShowWelcome] = useState(true);
  
  // メッセージがあれば歓迎表示を非表示
  useEffect(() => {
    if (messages.length > 0) {
      setShowWelcome(false);
    }
  }, [messages]);
  
  // おすすめ質問クリック時
  const handleQuestionClick = async (question: string) => {
    setShowWelcome(false);
    await sendMessage(question);
  };
  
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
            <RecommendedQuestions 
              questions={recommendedQuestions} 
              onQuestionClick={handleQuestionClick}
            />
          </div>
        ) : (
          <MessageList 
            messages={messages}
            isLoading={isLoading}
            resultData={resultData}
          />
        )}
        {error && (
          <div className="p-2 text-sm text-center text-red-500 bg-red-50">
            エラー: {error}
          </div>
        )}
      </div>
      <div className="p-4 border-t border-gray-200">
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  )
}
