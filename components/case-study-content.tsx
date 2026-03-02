"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { type Project, projects } from "@/lib/projects"
import { LazyPrototypeHero } from "@/components/lazy-prototype-hero"
import { TasksHero } from "@/components/tasks-hero"

// Projects that are shown in the "Next project" link (thesis is excluded — has its own entry gate)
const projectsForNextLink = projects.filter((p) => p.id !== "thesis")

export function CaseStudyContent({ project }: { project: Project }) {
  const currentIndex = projectsForNextLink.findIndex((p) => p.id === project.id)
  const nextProject = projectsForNextLink[(currentIndex + 1) % projectsForNextLink.length]

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
        </nav>
      </header>

      {/* Hero — centered article style */}
      <section className="pt-40 pb-20 px-6 sm:px-12">
        <div className="mx-auto max-w-[720px] text-center">
          <div className="flex items-baseline justify-center gap-6 mb-6">
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
          <p className="text-sm text-foreground/50 max-w-lg mx-auto leading-relaxed text-center">
            {project.description}
          </p>
        </div>
      </section>

      {/* Hero: lazy-loaded prototype (phone frame) for climbing-gym, else hero image */}
      <section className="px-6 sm:px-12 pb-24">
        <div className="mx-auto max-w-[1400px]">
          {project.id === "climbing-gym" ? (
            <LazyPrototypeHero project={project} />
          ) : project.id === "ai-task-manager" ? (
            <div
              className="relative w-full flex justify-center"
              style={{
                maxWidth: 992,
                height: 620,
                margin: "0 auto",
              }}
            >
              {/* Positioned so scaled hero (992×620) fits in 620px slot with no cropping */}
              <div
                className="absolute left-1/2 top-0"
                style={{
                  width: 1240,
                  height: 775,
                  transform: "translateX(-50%) scale(0.8)",
                  transformOrigin: "top center",
                }}
              >
                <TasksHero />
              </div>
            </div>
          ) : (
            <div className="relative w-full aspect-[16/9] overflow-hidden bg-secondary">
              <Image
                src={project.image}
                alt={project.title}
                width={1400}
                height={788}
                className="w-full h-full object-cover"
                sizes="(max-width: 1400px) 100vw, 1400px"
                quality={90}
                priority
              />
            </div>
          )}
        </div>
      </section>

      {/* Info Grid — centered */}
      <section className="px-6 sm:px-12 pb-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-foreground/10 pt-12 text-center">
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

      {/* Case Study Sections — left-aligned body copy for readability */}
      <section className="px-6 sm:px-12 pb-24">
        <div className="mx-auto max-w-[720px] text-left space-y-20">
          <div>
            <p className="text-[10px] font-medium text-foreground/30 tracking-widest uppercase mb-6">
              Overview
            </p>
            <p className="text-base font-light leading-[1.8] text-foreground/80">
              {project.overview}
            </p>
          </div>
          {project.id === "credits-and-conversion" && (
            <div>
              <p className="text-[10px] font-medium text-foreground/30 tracking-widest uppercase mb-6">
                Key screens
              </p>
              <div className="space-y-8">
                <div className="rounded-xl overflow-hidden border border-foreground/10 bg-muted/20">
                  <Image
                    src="/images/credits-billing-center.png"
                    alt="Billing Center — plan overview, usage stats, and plan comparison"
                    width={720}
                    height={480}
                    className="w-full h-auto object-contain"
                  />
                </div>
                <div className="rounded-xl overflow-hidden border border-foreground/10 bg-muted/20">
                  <Image
                    src="/images/credits-choose-plan.png"
                    alt="Choose plan modal — Pro vs Business with yearly or monthly billing"
                    width={720}
                    height={480}
                    className="w-full h-auto object-contain"
                  />
                </div>
                <div className="rounded-xl overflow-hidden border border-foreground/10 bg-muted/20">
                  <Image
                    src="/images/credits-manage-plan.png"
                    alt="Manage Plan modal — billing period, seats, and order summary"
                    width={720}
                    height={480}
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            </div>
          )}
          {project.id === "ai-task-manager" && (
            <div>
              <p className="text-[10px] font-medium text-foreground/30 tracking-widest uppercase mb-6">
                Key screens
              </p>
              <div className="space-y-8">
                <div className="rounded-xl overflow-hidden border border-foreground/10 bg-muted/20">
                  <Image
                    src="/images/tasks-list-view.png"
                    alt="Introducing task list view — Sort, Group, New task, keyboard shortcuts"
                    width={720}
                    height={480}
                    className="w-full h-auto object-contain"
                  />
                </div>
                <div className="rounded-xl overflow-hidden border border-foreground/10 bg-muted/20">
                  <Image
                    src="/images/tasks-meeting-detail.png"
                    alt="Meeting detail with Open Tasks — agenda, tasks, qualification"
                    width={720}
                    height={480}
                    className="w-full h-auto object-contain"
                  />
                </div>
                <div className="rounded-xl overflow-hidden border border-foreground/10 bg-muted/20">
                  <Image
                    src="/images/tasks-todo-list.png"
                    alt="My tasks To do list — search, filter, sort, task list with Start"
                    width={720}
                    height={480}
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            </div>
          )}
          {project.id === "climbing-gym" && (
            <div>
              <p className="text-[10px] font-medium text-foreground/30 tracking-widest uppercase mb-6">
                The problem
              </p>
              <p className="text-base font-light leading-[1.8] text-foreground/80 mb-8">
                The current website members use to view schedules and book classes—hard to use on mobile and not built for quick check-in or “my classes” flows.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-items-center">
                <div className="w-full max-w-[280px] rounded-xl overflow-hidden border border-foreground/10 bg-muted/20">
                  <Image
                    src="/images/climbing-gym-before-1.png"
                    alt="Current Touchstone QR code check-in page on mobile"
                    width={280}
                    height={560}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="w-full max-w-[280px] rounded-xl overflow-hidden border border-foreground/10 bg-muted/20">
                  <Image
                    src="/images/climbing-gym-before-2.png"
                    alt="Current Touchstone Mission Cliffs calendar on mobile"
                    width={280}
                    height={560}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          )}
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
      </section>

      {/* Next Project — centered */}
      <section className="px-6 sm:px-12 pb-32 pt-12">
        <div className="mx-auto max-w-[720px] border-t border-foreground/10 pt-16 flex flex-col items-center text-center">
          <p className="text-[10px] font-medium text-foreground/30 tracking-widest uppercase mb-8">
            Next Project
          </p>
          <Link
            href={`/project/${nextProject.id}`}
            className="group flex items-baseline gap-6 justify-center"
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
