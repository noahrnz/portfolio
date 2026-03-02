"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { projects } from "@/lib/projects"
import { IphoneFrame } from "@/components/iphone-frame"
import { TasksHero } from "@/components/tasks-hero"
import type { Project } from "@/lib/projects"

// Throttle cursor-following so we don't re-render (and flicker the iframe) on every mousemove
const MOUSE_THROTTLE_MS = 100

const CLIMBING_GYM_ID = "climbing-gym"
const CLIMBING_PROTOTYPE_BASE = "/prototypes/climbing-gym/index.html"

// Time each screen is shown before switching to the other (home ↔ bookings)
const CLIMBING_SWITCH_DELAY_MS = 3000

// Full iPhone frame size (no crop) — iPhone 16 aspect 393×852, frame 280px wide
const CLIMBING_PREVIEW_W = 280
const CLIMBING_PREVIEW_H = Math.round(280 * (852 / 393))

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

// Stable component so preview content (e.g. TasksHero) doesn't remount when only mouse position changes
// When inline (mobile): always static image + description for a simple, fast experience
function ProjectPreviewContent({
  previewData,
  previewW,
  previewH,
  inline,
  climbingScreen = "",
}: {
  previewData: Project | null
  previewW: number
  previewH: number
  inline: boolean
  climbingScreen?: "" | "/bookings"
}) {
  if (!previewData) return null

  // Mobile / inline: simple static image + short description + link (no live prototype)
  if (inline) {
    const isPrototype = previewData.id === CLIMBING_GYM_ID
    return (
      <div className="w-full max-w-md mx-auto space-y-3">
        <div className="relative">
          <div
            className="overflow-hidden bg-secondary relative w-full rounded-lg"
            style={{ aspectRatio: `${previewData.previewWidth} / ${previewData.previewHeight}` }}
          >
            <Image
              src={previewData.image}
              alt={previewData.title}
              width={previewData.previewWidth}
              height={previewData.previewHeight}
              sizes="(max-width: 448px) 100vw, 448px"
              quality={85}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          {isPrototype && (
            <span
              className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded text-[10px] font-medium tracking-wider uppercase text-foreground/60 bg-background/90 backdrop-blur-sm"
              aria-hidden
            >
              Best viewed on desktop
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed px-1">
          {previewData.description}
        </p>
        <Link
          href={`/project/${previewData.id}`}
          className="inline-block text-xs font-medium tracking-widest uppercase text-foreground/70 hover:text-foreground transition-colors"
        >
          View case study →
        </Link>
      </div>
    )
  }

  // Desktop floating preview
  if (previewData.id === CLIMBING_GYM_ID) return null
  if (previewData.id === "ai-task-manager") {
    const heroW = 1240
    const heroH = 775
    const scale = Math.min(previewW / heroW, previewH / heroH)
    return (
      <div
        className="overflow-hidden bg-white rounded-lg"
        style={{ width: previewW, height: previewH }}
      >
        <div
          className="origin-top-left"
          style={{
            transform: `scale(${scale})`,
            width: heroW,
            height: heroH,
          }}
        >
          <TasksHero preview />
        </div>
      </div>
    )
  }
  return (
    <div
      className="overflow-hidden bg-secondary relative"
      style={{ width: previewW, height: previewH }}
    >
      <Image
        src={previewData.image}
        alt={previewData.title}
        width={previewData.previewWidth}
        height={previewData.previewHeight}
        sizes={`${previewW}px`}
        quality={90}
        className="w-full h-full object-cover animate-[preview-zoom-in_2.5s_ease-out_forwards]"
        priority
      />
    </div>
  )
}

export function ProjectList({
  onActiveProjectChange,
}: {
  onActiveProjectChange?: (projectId: string | null) => void
} = {}) {
  const isMobile = useIsMobile()
  const [activeProject, setActiveProject] = useState<string | null>(null)

  const setActive = useCallback(
    (id: string | null) => {
      setActiveProject(id)
      onActiveProjectChange?.(id)
    },
    [onActiveProjectChange]
  )
  const scheduleLeave = useCallback(() => {
    leaveTimeoutRef.current = setTimeout(() => setActive(null), 300)
  }, [setActive])
  const [climbingScreen, setClimbingScreen] = useState<"" | "/bookings">("")
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [windowSize, setWindowSize] = useState({ w: 1920, h: 1080 })
  const containerRef = useRef<HTMLDivElement>(null)
  const latestMouseRef = useRef({ x: 0, y: 0 })
  const mouseThrottleRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (leaveTimeoutRef.current !== null) clearTimeout(leaveTimeoutRef.current)
    }
  }, [])

  // Climbing gym: cycle home → bookings → home every CLIMBING_SWITCH_DELAY_MS (only when this project is active)
  useEffect(() => {
    if (activeProject !== CLIMBING_GYM_ID) return
    setClimbingScreen("")
    const interval = setInterval(() => {
      setClimbingScreen((prev) => (prev === "" ? "/bookings" : ""))
    }, CLIMBING_SWITCH_DELAY_MS)
    return () => clearInterval(interval)
  }, [activeProject])

  useEffect(() => {
    const update = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight })
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  const clearLeaveTimeout = useCallback(() => {
    if (leaveTimeoutRef.current !== null) {
      clearTimeout(leaveTimeoutRef.current)
      leaveTimeoutRef.current = null
    }
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    latestMouseRef.current = { x: e.clientX, y: e.clientY }
    if (mouseThrottleRef.current !== null) return
    setMousePos({ ...latestMouseRef.current })
    mouseThrottleRef.current = setTimeout(() => {
      mouseThrottleRef.current = null
      setMousePos({ ...latestMouseRef.current })
    }, MOUSE_THROTTLE_MS)
  }, [])

  const activeData = projects.find((p) => p.id === activeProject)
  const previewData = activeData

  const previewW =
    previewData && previewData.id === CLIMBING_GYM_ID
      ? CLIMBING_PREVIEW_W
      : previewData
        ? Math.min(previewData.previewWidth, 600)
        : 0
  const previewH =
    previewData && previewData.id === CLIMBING_GYM_ID
      ? CLIMBING_PREVIEW_H
      : previewData
        ? Math.min(previewData.previewHeight, 450)
        : 0
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

  // Position for climbing-gym preview (used when visible; same formula so it follows cursor)
  const climbingLeft = Math.max(
    VIEWPORT_PADDING,
    Math.min(
      mousePos.x + PREVIEW_OFFSET_RIGHT,
      windowSize.w - CLIMBING_PREVIEW_W - VIEWPORT_PADDING
    )
  )
  const climbingTop = Math.max(
    VIEWPORT_PADDING,
    Math.min(
      mousePos.y - CLIMBING_PREVIEW_H / 2,
      windowSize.h - CLIMBING_PREVIEW_H - VIEWPORT_PADDING
    )
  )
  const isClimbingActive = activeProject === CLIMBING_GYM_ID

  return (
    <div
      ref={containerRef}
      className="project-list w-full max-w-2xl px-4 sm:px-12 space-y-2"
      onMouseMove={handleMouseMove}
    >
      {/* Mobile: show preview in-flow above the list when a project is selected */}
      {isMobile && previewData && (
        <div className="mb-6 min-h-0">
          <ProjectPreviewContent
            previewData={previewData ?? null}
            previewW={previewW}
            previewH={previewH}
            inline
            climbingScreen={climbingScreen}
          />
        </div>
      )}

      {/* Desktop: climbing-gym preload + preview — iframe stays mounted so it loads on page load, we just reveal it on hover (no content-appearing effect) */}
      {!isMobile && (
        <div
          className={`fixed z-50 ${isClimbingActive ? "pointer-events-auto" : "pointer-events-none"}`}
          style={{
            left: isClimbingActive ? climbingLeft : -9999,
            top: isClimbingActive ? climbingTop : 0,
            width: CLIMBING_PREVIEW_W,
            height: CLIMBING_PREVIEW_H,
            opacity: isClimbingActive ? 1 : 0,
            visibility: isClimbingActive ? "visible" : "hidden",
          }}
          onMouseEnter={clearLeaveTimeout}
          onMouseLeave={scheduleLeave}
        >
          <div className="relative flex items-center justify-center w-full h-full pointer-events-none">
            <IphoneFrame
              src={
                isClimbingActive
                  ? `${CLIMBING_PROTOTYPE_BASE}#${climbingScreen === "" ? "/" : climbingScreen}`
                  : "about:blank"
              }
              title="Climbing gym app — prototype"
              contentScale={climbingScreen === "/bookings" ? 0.92 : undefined}
            />
          </div>
        </div>
      )}

      {/* Desktop: floating preview for all other projects (images only) */}
      {!isMobile && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left,
            top,
            opacity: previewData && previewData.id !== CLIMBING_GYM_ID ? 1 : 0,
            visibility: previewData && previewData.id !== CLIMBING_GYM_ID ? "visible" : "hidden",
          }}
        >
          <ProjectPreviewContent
            previewData={previewData ?? null}
            previewW={previewW}
            previewH={previewH}
            inline={false}
          />
        </div>
      )}

      {projects.map((project) => {
        const rowContent = (
          <>
            <div className="flex items-baseline gap-3 sm:gap-6">
              <span className="text-[10px] font-medium text-foreground/30 tracking-widest shrink-0">
                {project.number}
              </span>
              <h2 className="text-xs sm:text-sm font-normal tracking-[0.15em] uppercase transition-all group-hover:pl-4 min-w-0">
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
            <span className="text-[10px] font-medium text-foreground/30 tracking-widest uppercase shrink-0">
              {project.tag}
            </span>
          </>
        )
        return (
          <div
            key={project.id}
            className="group relative py-4 border-b border-transparent hover:border-foreground/5 transition-colors touch-manipulation"
            onMouseEnter={() => {
              if (!isMobile) {
                clearLeaveTimeout()
                setActive(project.id)
              }
            }}
            onMouseLeave={() => {
              if (!isMobile) scheduleLeave()
            }}
          >
            <Link
              href={`/project/${project.id}`}
              className="flex items-center justify-between w-full text-left py-3 sm:py-2 -my-2 min-h-[48px] sm:min-h-[44px]"
              onClick={(e) => {
                if (isMobile) {
                  e.preventDefault()
                  setActive(project.id)
                }
              }}
            >
              {rowContent}
            </Link>
          </div>
        )
      })}

    </div>
  )
}
