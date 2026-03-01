import { notFound } from "next/navigation"
import { projects } from "@/lib/projects"
import { CaseStudyContent } from "@/components/case-study-content"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.id }))
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

  return <CaseStudyContent project={project} />
}
