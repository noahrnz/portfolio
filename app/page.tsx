import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProjectList } from "@/components/project-list"

export default function Home() {
  return (
    <div className="relative min-h-screen w-full flex flex-col bg-background text-foreground cursor-default selection:bg-foreground selection:text-background">
      <Header />
      <main className="flex-1 flex flex-col justify-center items-center pt-24 sm:pt-32 pb-28 sm:pb-32">
        <ProjectList />
      </main>
      <Footer />
    </div>
  )
}
