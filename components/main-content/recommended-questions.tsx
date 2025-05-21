import type { RecommendedQuestion } from "@/types"
import { QuestionItem } from "./question-item"

interface RecommendedQuestionsProps {
  questions: RecommendedQuestion[];
  onQuestionClick?: (question: string) => void;
}

export function RecommendedQuestions({ questions, onQuestionClick }: RecommendedQuestionsProps) {
  return (
    <div className="w-full max-w-2xl">
      <h2 className="text-lg font-medium text-gray-700 mb-3">おすすめの質問</h2>
      <div className="space-y-2">
        {questions.map((question) => (
          <QuestionItem 
            key={question.id} 
            question={question} 
            onClick={() => onQuestionClick?.(question.text)}
          />
        ))}
      </div>
    </div>
  )
}
