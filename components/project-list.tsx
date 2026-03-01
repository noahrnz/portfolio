"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { projects } from "@/lib/projects"

const PREVIEW_OFFSET_RIGHT = 320
const VIEWPORT_PADDING = 24

// Match touch devices or narrow viewports where hover preview isn't useful
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (max-width: 768px)")
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  return isMobile
}

export function ProjectList() {
  const isMobile = useIsMobile()
  const [activeProject, setActiveProject] = useState<string | null>(null)
  const [comingSoonProject, setComingSoonProject] = useState<string | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [windowSize, setWindowSize] = useState({ w: 1920, h: 1080 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const update = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight })
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  // Auto-clear "coming soon" after a few seconds so hover works again
  useEffect(() => {
    if (!comingSoonProject) return
    const t = setTimeout(() => setComingSoonProject(null), 2500)
    return () => clearTimeout(t)
  }, [comingSoonProject])

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }

  const activeData = projects.find((p) => p.id === activeProject)
  const comingSoonData = projects.find((p) => p.id === comingSoonProject)
  const previewData = comingSoonData ?? activeData

  const previewW = previewData ? Math.min(previewData.previewWidth, 600) : 0
  const previewH = previewData ? Math.min(previewData.previewHeight, 450) : 0
  const left = previewData
    ? Math.max(
        VIEWPORT_PADDING,
        Math.min(mousePos.x + PREVIEW_OFFSET_RIGHT, windowSize.w - previewW - VIEWPORT_PADDING)
      )
    : 0
  const top = previewData
    ? Math.max(
        VIEWPORT_PADDING,
        Math.min(mousePos.y - previewH / 2, windowSize.h - previewH - VIEWPORT_PADDING)
      )
    : 0
  const showComingSoonOnPreview = Boolean(comingSoonProject && comingSoonData)

  // On mobile: tap once to show preview, tap same row again for "coming soon"
  const handleProjectClick = (projectId: string) => {
    if (isMobile) {
      if (activeProject === projectId) {
        setComingSoonProject(projectId)
      } else {
        setActiveProject(projectId)
        setComingSoonProject(null)
      }
    } else {
      setComingSoonProject(projectId)
    }
  }

  const PreviewBlock = ({ inline = false }: { inline?: boolean }) =>
    previewData ? (
      <div
        className={`overflow-hidden bg-secondary relative ${inline ? "w-full max-w-md mx-auto rounded-lg" : ""}`}
        style={
          inline
            ? { aspectRatio: `${previewData.previewWidth} / ${previewData.previewHeight}` }
            : { width: previewW, height: previewH }
        }
      >
        <Image
          src={previewData.image}
          alt={previewData.title}
          width={previewData.previewWidth}
          height={previewData.previewHeight}
          sizes={inline ? "100vw" : `${previewW}px`}
          quality={90}
          className={`w-full h-full object-cover ${showComingSoonOnPreview ? "brightness-[0.35]" : "animate-[preview-zoom-in_2.5s_ease-out_forwards]"}`}
          priority
        />
        {showComingSoonOnPreview && (
          <span className="absolute inset-0 flex items-center justify-center text-white text-center text-[11px] font-medium tracking-wide px-4">
            Good things take time. Like building this portfolio
          </span>
        )}
      </div>
    ) : null

  return (
    <div
      ref={containerRef}
      className="project-list w-full max-w-2xl px-6 sm:px-12 space-y-2"
      onMouseMove={handleMouseMove}
    >
      {/* Mobile: show preview in-flow above the list when a project is selected */}
      {isMobile && previewData && (
        <div className="mb-6 min-h-0">
          <PreviewBlock inline />
        </div>
      )}

      {/* Desktop: floating preview that follows cursor */}
      {!isMobile && (
        <div
          className="fixed pointer-events-none z-50 transition-opacity duration-300 ease-out"
          style={{
            left,
            top,
            opacity: previewData ? 1 : 0,
            visibility: previewData ? "visible" : "hidden",
          }}
        >
          <PreviewBlock />
        </div>
      )}

      {projects.map((project) => (
        <div
          key={project.id}
          className="group relative py-4 border-b border-transparent hover:border-foreground/5 transition-colors touch-manipulation"
          onMouseEnter={() => {
            if (!isMobile) {
              setActiveProject(project.id)
              setComingSoonProject(null)
            }
          }}
          onMouseLeave={() => {
            if (!isMobile) setActiveProject(null)
          }}
        >
          <button
            type="button"
            onClick={() => handleProjectClick(project.id)}
            className="flex items-center justify-between w-full text-left py-2 -my-2 min-h-[44px]"
          >
            <div className="flex items-baseline gap-6">
              <span className="text-[10px] font-medium text-foreground/30 tracking-widest">
                {project.number}
              </span>
              <h2 className="text-sm font-normal tracking-[0.15em] uppercase transition-all group-hover:pl-4">
                {project.title.includes(" — ") ? (
                  <>
                    {project.title.split(" — ")[0]}
                    <span className="text-foreground/50"> — {project.title.split(" — ").slice(1).join(" — ")}</span>
                  </>
                ) : (
                  project.title
                )}
              </h2>
            </div>
            <span className="text-[10px] font-medium text-foreground/30 tracking-widest uppercase">
              {project.tag}
            </span>
          </button>
        </div>
      ))}

    </div>
  )
}
