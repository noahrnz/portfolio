"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProjectList } from "@/components/project-list"

// Very light brand tints for page background on project hover
const PROJECT_HOVER_BG: Record<string, string> = {
  "credits-and-conversion": "oklch(0.98 0.02 145)",  // very light green (project 1)
  "ai-task-manager": "oklch(0.98 0.01 250)",         // very light blue (project 2)
  "climbing-gym": "oklch(0.99 0.02 75)",              // very light orange (Touchstone)
  "thesis": "oklch(0.98 0.015 300)",                 // very light purple (Experimental)
}

export function HomePage() {
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null)
  const bg = hoveredProjectId ? PROJECT_HOVER_BG[hoveredProjectId] : "var(--background)"

  return (
    <div
      className="relative min-h-screen min-h-[100dvh] w-full flex flex-col text-foreground cursor-default selection:bg-foreground selection:text-background transition-colors duration-300 overflow-x-hidden"
      style={{ backgroundColor: bg }}
    >
      <Header backgroundColor={bg} />
      <main className="flex-1 flex flex-col justify-center items-center pt-20 sm:pt-32 pb-32 sm:pb-32">
        <ProjectList onActiveProjectChange={setHoveredProjectId} />
      </main>
      <Footer />
    </div>
  )
}
