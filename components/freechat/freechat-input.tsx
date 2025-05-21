'use client'

import { useState, FormEvent, useRef, useEffect } from 'react'
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface FreeChatInputProps {
  onSend: (message: string) => Promise<any>;
  isLoading: boolean;
}

export function FreeChatInput({ onSend, isLoading }: FreeChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // テキストエリアの自動リサイズ
  useEffect(() => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, [message]);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isLoading) return;
    
    await onSend(message);
    setMessage('');
    
    // リセット後にもう一度高さ調整
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };
  
  // Enter送信（Shift+Enterで改行）
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="relative">
      <Textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="何でも質問してください..."
        className="pr-12 resize-none min-h-[56px] max-h-[200px]"
        disabled={isLoading}
      />
      <Button 
        type="submit"
        size="icon" 
        className="absolute right-2 bottom-2 bg-gray-200 hover:bg-gray-300 text-gray-700"
        disabled={isLoading || !message.trim()}
      >
        <Send className="h-4 w-4" />
        <span className="sr-only">送信</span>
      </Button>
    </form>
  );
}
