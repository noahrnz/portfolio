"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProjectList } from "@/components/project-list"

export function HomePage() {
  return (
    <div className="relative min-h-screen min-h-[100dvh] w-full flex flex-col text-foreground cursor-default selection:bg-foreground selection:text-background overflow-x-hidden bg-background">
      <Header />
      <main className="flex-1 min-h-[100dvh] flex flex-col justify-center items-center pb-16 sm:pb-0">
        <ProjectList />
      </main>
      <Footer />
    </div>
  )
}
