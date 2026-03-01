"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { type Project, projects } from "@/lib/projects"

export function CaseStudyContent({ project }: { project: Project }) {
  const [showComingSoon, setShowComingSoon] = useState(false)
  const currentIndex = projects.findIndex((p) => p.id === project.id)
  const nextProject = projects[(currentIndex + 1) % projects.length]

  const handleImageClick = () => {
    setShowComingSoon(true)
    setTimeout(() => setShowComingSoon(false), 1500)
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-background/90 backdrop-blur-md">
        <nav className="mx-auto max-w-[1400px] px-12 h-20 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 text-xs font-medium tracking-[0.2em] uppercase text-foreground hover:opacity-50 transition-opacity"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </Link>
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-foreground/30">
            {project.number} / 04
          </span>
        </nav>
      </header>

      {/* Hero */}
      <section className="pt-40 pb-20 px-12">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex items-baseline gap-6 mb-6">
            <span className="text-[10px] font-medium text-foreground/30 tracking-widest">
              {project.number}
            </span>
            <span className="text-[10px] font-medium text-foreground/30 tracking-widest uppercase">
              {project.tag}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight text-balance leading-tight mb-8">
            {project.title.includes(" — ") ? (
              <>
                {project.title.split(" — ")[0]}
                <span className="text-foreground/50"> — {project.title.split(" — ").slice(1).join(" — ")}</span>
              </>
            ) : (
              project.title
            )}
          </h1>
          <p className="text-sm text-foreground/50 max-w-lg leading-relaxed">
            {project.description}
          </p>
        </div>
      </section>

      {/* Hero Image */}
      <section className="px-12 pb-24">
        <div className="mx-auto max-w-[1400px]">
          <button
            type="button"
            onClick={handleImageClick}
            className="relative w-full aspect-[16/9] overflow-hidden bg-secondary block cursor-pointer group"
          >
            <Image
              src={project.image}
              alt={project.title}
              width={1400}
              height={788}
              className="w-full h-full object-cover"
              priority
            />
            {showComingSoon && (
              <span className="absolute inset-0 flex items-center justify-center bg-foreground/80 text-background text-sm font-medium tracking-widest uppercase animate-in fade-in duration-200">
                Coming soon
              </span>
            )}
          </button>
        </div>
      </section>

      {/* Info Grid */}
      <section className="px-12 pb-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-foreground/10 pt-12">
            <div>
              <p className="text-[10px] font-medium text-foreground/30 tracking-widest uppercase mb-3">
                Role
              </p>
              <p className="text-sm font-light">{project.role}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-foreground/30 tracking-widest uppercase mb-3">
                Client
              </p>
              <p className="text-sm font-light">{project.client}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-foreground/30 tracking-widest uppercase mb-3">
                Year
              </p>
              <p className="text-sm font-light">{project.year}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study Sections */}
      <section className="px-12 pb-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="max-w-2xl space-y-20">
            <div>
              <p className="text-[10px] font-medium text-foreground/30 tracking-widest uppercase mb-6">
                Overview
              </p>
              <p className="text-base font-light leading-[1.8] text-foreground/80">
                {project.overview}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-foreground/30 tracking-widest uppercase mb-6">
                Challenge
              </p>
              <p className="text-base font-light leading-[1.8] text-foreground/80">
                {project.challenge}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-foreground/30 tracking-widest uppercase mb-6">
                Solution
              </p>
              <p className="text-base font-light leading-[1.8] text-foreground/80">
                {project.solution}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-foreground/30 tracking-widest uppercase mb-6">
                Result
              </p>
              <p className="text-base font-light leading-[1.8] text-foreground/80">
                {project.result}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Next Project */}
      <section className="px-12 pb-32 pt-12">
        <div className="mx-auto max-w-[1400px] border-t border-foreground/10 pt-16">
          <p className="text-[10px] font-medium text-foreground/30 tracking-widest uppercase mb-8">
            Next Project
          </p>
          <Link
            href={`/project/${nextProject.id}`}
            className="group flex items-baseline gap-6"
          >
            <span className="text-[10px] font-medium text-foreground/30 tracking-widest">
              {nextProject.number}
            </span>
            <h2 className="text-2xl md:text-4xl font-light tracking-tight transition-all group-hover:pl-4">
              {nextProject.title}
            </h2>
          </Link>
        </div>
      </section>
    </div>
  )
}
