import type { RecommendedQuestion } from "@/types"
import { Button } from "@/components/ui/button"

interface QuestionItemProps {
  question: RecommendedQuestion;
  onClick?: () => void;
}

export function QuestionItem({ question, onClick }: QuestionItemProps) {
  return (
    <Button 
      variant="outline" 
      className="w-full justify-start text-left h-auto py-3 px-4 font-normal"
      onClick={onClick}
    >
      {question.text}
    </Button>
  )
}
