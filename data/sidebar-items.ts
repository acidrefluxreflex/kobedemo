import type { SidebarItem } from "@/types"

export const sidebarItems: SidebarItem[] = [
  {
    id: "freechat",
    label: "チャット",
    icon: "chat",
    href: "/freechat",
  },
  {
    id: "resources",
    label: "リソース管理",
    icon: "resources",
    href: "/resource-management",
  },
  {
    id: "templates",
    label: "テンプレート管理",
    icon: "template",
    href: "/templates",
  },
  {
    id: "knowledge",
    label: "知識追加",
    icon: "knowledge",
    href: "/knowledge",
  },
  {
    id: "dictionary",
    label: "専門用語辞書",
    icon: "dictionary",
    href: "/dictionary",
  },
  {
    id: "users",
    label: "ユーザー管理",
    icon: "users",
    href: "/users",
  },
  {
    id: "analytics",
    label: "効果分析",
    icon: "analytics",
    href: "/analytics",
  },
  {
    id: "settings",
    label: "モデル設定",
    icon: "settings",
    href: "/settings",
  },
]
