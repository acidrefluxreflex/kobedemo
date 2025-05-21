import { Layout } from "@/components/layout"
import { Sidebar } from "@/components/sidebar/sidebar"
import { FreeChatContent } from "@/components/freechat/freechat-content"
import { sidebarItems } from "@/data/sidebar-items"

export default function FreeChatPage() {
  return (
    <Layout>
      <Sidebar items={sidebarItems} />
      <FreeChatContent />
    </Layout>
  )
}
