import { Bot } from "lucide-react"

export function WelcomeSection() {
  return (
    <div className="text-center max-w-2xl mx-auto mb-8">
      <div className="flex justify-center mb-4">
        <Bot className="h-16 w-16 text-gray-800" />
      </div>
      <h1 className="text-2xl font-medium text-gray-800 mb-2">RAG-BASEへようこそ</h1>
      <p className="text-gray-600">社内のFAQや過去の案件情報についてお気軽にお尋ねください。</p>
    </div>
  )
}
