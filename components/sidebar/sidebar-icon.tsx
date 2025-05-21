import { FileText, Users, BarChart2, Book, Database, Sliders } from "lucide-react"

interface SidebarIconProps {
  name: string
  className?: string
}

export function SidebarIcon({ name, className = "h-5 w-5 text-gray-500" }: SidebarIconProps) {
  switch (name) {
    case "template":
      return <FileText className={className} />
    case "knowledge":
      return <Database className={className} />
    case "dictionary":
      return <Book className={className} />
    case "users":
      return <Users className={className} />
    case "analytics":
      return <BarChart2 className={className} />
    case "settings":
      return <Sliders className={className} />
    default:
      return <FileText className={className} />
  }
}
