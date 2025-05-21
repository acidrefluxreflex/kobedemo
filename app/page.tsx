import { Layout } from "@/components/layout"
import { Sidebar } from "@/components/sidebar/sidebar"
import { MainContent } from "@/components/main-content/main-content"
import { sidebarItems } from "@/data/sidebar-items"
import { recommendedQuestions } from "@/data/recommended-questions"

export default function Home() {
  return (
    <Layout>
      <Sidebar items={sidebarItems} />
      <MainContent recommendedQuestions={recommendedQuestions} />
    </Layout>
  )
}
