import Link from "next/link"
import type { SidebarItem } from "@/types"
import { SidebarIcon } from "./sidebar-icon"

interface SidebarMenuItemProps {
  item: SidebarItem
}

export function SidebarMenuItem({ item }: SidebarMenuItemProps) {
  return (
    <li>
      <Link href={item.href} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
        <SidebarIcon name={item.icon} />
        <span className="ml-3">{item.label}</span>
      </Link>
    </li>
  )
}
