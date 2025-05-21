import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NewChatButton() {
  return (
    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
      <PlusCircle className="mr-2 h-4 w-4" />
      新しい会話
    </Button>
  )
}
