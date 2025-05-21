import { LogOut, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onNewChat?: () => void;
}

export function Header({ onNewChat }: HeaderProps) {
  return (
    <header className="h-14 border-b border-gray-200 flex items-center justify-between px-4">
      <Button variant="ghost" onClick={onNewChat} className="text-gray-700 hover:text-gray-900">
        <Plus className="mr-2 h-4 w-4" />
        新規チャット
      </Button>
      <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-transparent">
        <LogOut className="mr-2 h-4 w-4" />
        ログアウト
      </Button>
    </header>
  )
}
