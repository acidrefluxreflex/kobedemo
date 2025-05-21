import type { SidebarItem } from "@/types"
import { Logo } from "./logo"
import { NewChatButton } from "./new-chat-button"
import { SidebarMenuItem } from "./sidebar-menu-item"

interface SidebarProps {
  items: SidebarItem[]
}

export function Sidebar({ items }: SidebarProps) {
  return (
    <div className="w-60 border-r border-gray-200 flex flex-col">
      <Logo />
      <div className="px-4 py-4">
        <NewChatButton />
      </div>
      <nav className="flex-1">
        <ul className="space-y-1">
          {items.map((item) => (
            <SidebarMenuItem key={item.id} item={item} />
          ))}
        </ul>
      </nav>
      <div className="px-4 py-2 border-t border-gray-200">
        <h3 className="text-xs font-medium text-gray-500">会話履歴</h3>
        {/* 履歴部分は省略 */}
      </div>
    </div>
  )
}
