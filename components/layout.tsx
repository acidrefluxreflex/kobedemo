import type { ReactNode } from "react"

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return <div className="flex min-h-screen bg-white">{children}</div>
}
