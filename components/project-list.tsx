"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { projects } from "@/lib/projects"

export function ProjectList() {
  const [activeProject, setActiveProject] = useState<string | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }

  const activeData = projects.find((p) => p.id === activeProject)

  return (
    <div
      ref={containerRef}
      className="project-list w-full max-w-2xl px-12 space-y-2"
      onMouseMove={handleMouseMove}
    >
      {/* Floating preview image that follows cursor */}
      <div
        className="fixed pointer-events-none z-40 transition-opacity duration-300 ease-out"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          transform: "translate(-50%, -50%)",
          opacity: activeProject ? 1 : 0,
          visibility: activeProject ? "visible" : "hidden",
        }}
      >
        {activeData && (
          <div
            className="overflow-hidden bg-secondary"
            style={{
              width: Math.min(activeData.previewWidth, 600),
              height: Math.min(activeData.previewHeight, 450),
            }}
          >
            <Image
              src={activeData.image}
              alt={activeData.title}
              width={activeData.previewWidth}
              height={activeData.previewHeight}
              className="w-full h-full object-cover scale-110 transition-transform duration-[2s] ease-out hover:scale-100"
              priority
            />
          </div>
        )}
      </div>

      {projects.map((project) => (
        <div
          key={project.id}
          className="group relative py-4 border-b border-transparent hover:border-foreground/5 transition-colors"
          onMouseEnter={() => setActiveProject(project.id)}
          onMouseLeave={() => setActiveProject(null)}
        >
          <Link
            href={`/project/${project.id}`}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-baseline gap-6">
              <span className="text-[10px] font-medium text-foreground/30 tracking-widest">
                {project.number}
              </span>
              <h2 className="text-sm font-normal tracking-[0.15em] uppercase transition-all group-hover:pl-4">
                {project.title}
              </h2>
            </div>
            <span className="text-[10px] font-medium text-foreground/30 tracking-widest uppercase">
              {project.tag}
            </span>
          </Link>
        </div>
      ))}
    </div>
  )
}
