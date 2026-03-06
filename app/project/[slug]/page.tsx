import { notFound, redirect } from "next/navigation"
import { projects } from "@/lib/projects"
import { CaseStudyContent } from "@/components/case-study-content"
import { ThesisApp } from "@/components/thesis-app"
import { ThesisEntryGate } from "@/components/thesis-entry-gate"
import TestPage from "@/app/test/page"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return projects
    .filter((p) => p.id !== "entropy-i")
    .map((project) => ({ slug: project.id }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((p) => p.id === slug)
  if (!project) return { title: "Not Found" }
  return {
    title: `${project.title} -- Noah Ahrens`,
    description: project.description,
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = projects.find((p) => p.id === slug)

  if (!project) {
    notFound()
  }

  if (slug === "entropy-i") {
    redirect("/entropy-i")
  }

  if (slug === "thesis") {
    return (
      <ThesisEntryGate>
        <ThesisApp />
      </ThesisEntryGate>
    )
  }

  if (slug === "entropy-ii") {
    return <TestPage />
  }

  return <CaseStudyContent project={project} />
}
