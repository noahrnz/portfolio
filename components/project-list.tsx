"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { projects } from "@/lib/projects"
import { IphoneFrame } from "@/components/iphone-frame"
import { TasksHero } from "@/components/tasks-hero"
import { CreditsHero } from "@/components/credits-hero"
import { OrbPreview } from "@/components/orb-preview"
import { EntropyIIPreview } from "@/components/entropy-ii-preview"
import type { Project } from "@/lib/projects"

const CLIMBING_GYM_ID = "climbing-gym"
const ENTROPY_I_ID = "entropy-i"
const ENTROPY_II_ID = "entropy-ii"
const PROJECT_DEFAULT_ID = ENTROPY_II_ID
const CLIMBING_PROTOTYPE_BASE = "/prototypes/climbing-gym/index.html"

const CLIMBING_SWITCH_DELAY_MS = 3000
const CLIMBING_PREVIEW_W = 280
const CLIMBING_PREVIEW_H = Math.round(280 * (852 / 393))

const VIEWPORT_PADDING = 24
// Large preview in right column (same trigger, bigger image)
const PREVIEW_W = 800
const PREVIEW_H = 560

function getProjectHref(projectId: string) {
  if (projectId === ENTROPY_I_ID) return "/entropy-i"
  return `/project/${projectId}`
}

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
  mousePos,
  windowSize,
}: {
  previewData: Project | null
  previewW: number
  previewH: number
  inline: boolean
  climbingScreen?: "" | "/bookings"
  mousePos?: { x: number; y: number }
  windowSize?: { w: number; h: number }
}) {
  if (!previewData) return null

  // Mobile / inline: simple static image + short description + link (no live prototype); full image visible, not cut off
  if (inline) {
    const isEntropy = previewData.id === "entropy-i"
    const isEntropyII = previewData.id === ENTROPY_II_ID
    const isTasks = previewData.id === "ai-task-manager"
    const isCredits = previewData.id === "credits-and-conversion"
    const isPrototype = previewData.id === CLIMBING_GYM_ID
    return (
      <div className="w-full max-w-lg mx-auto space-y-3 overflow-visible">
        <div className="relative overflow-visible">
          {isEntropy && (
            <div
              className="relative w-full rounded-lg overflow-hidden border border-foreground/10 bg-black flex items-center justify-center"
              style={{ aspectRatio: `${previewData.previewWidth} / ${previewData.previewHeight}` }}
            >
              <OrbPreview
                width={previewData.previewHeight}
                height={previewData.previewHeight}
                mouseX={0}
                mouseY={0}
              />
            </div>
          )}

          {isEntropyII && (
            <div
              className="relative w-full rounded-lg overflow-hidden border border-foreground/10 flex items-center justify-center"
              style={{ aspectRatio: `${previewData.previewWidth} / ${previewData.previewHeight}` }}
            >
              <EntropyIIPreview
                width={Math.max(280, Math.min(previewW || previewData.previewWidth, 520))}
                height={Math.round(
                  Math.max(280, Math.min(previewW || previewData.previewWidth, 520)) *
                    (previewData.previewHeight / previewData.previewWidth)
                )}
                mouseX={0}
                mouseY={0}
              />
            </div>
          )}

          {isTasks && (
            <div className="relative w-full rounded-lg overflow-hidden border border-foreground/10 bg-white" style={{ aspectRatio: "1240 / 775" }}>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 origin-center scale-[0.27] sm:scale-[0.34]">
                <TasksHero preview />
              </div>
            </div>
          )}

          {isCredits && (
            <div className="relative w-full rounded-lg overflow-hidden border border-foreground/10 bg-white" style={{ aspectRatio: "1240 / 775" }}>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 origin-center scale-[0.27] sm:scale-[0.34]">
                <CreditsHero preview />
              </div>
            </div>
          )}

          {isPrototype && (
            <div className="relative w-full rounded-lg overflow-hidden border border-foreground/10 bg-[#dfe4ea]" style={{ aspectRatio: "16 / 11" }}>
              <img
                src="/images/climbing-bg-capture.png"
                alt="Climber on an outdoor wall"
                className="absolute inset-0 h-full w-full object-cover object-[34%_26%] opacity-60"
              />
              <div className="absolute inset-0 bg-black/18" />
              <div className="absolute inset-0 p-6 flex items-center justify-center">
                <IphoneFrame
                  src={`${CLIMBING_PROTOTYPE_BASE}#${climbingScreen === "" ? "/" : climbingScreen}`}
                  title="Climbing gym app — prototype"
                  className="scale-[0.66] sm:scale-[0.74]"
                  compact
                  sleek
                  lockInteraction
                  contentScale={0.84}
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between px-1">
          <p className="text-sm font-medium tracking-[0.12em] uppercase text-foreground/85">
            {previewData.title}
          </p>
          <span
            className="inline-flex h-8 w-8 items-center justify-center text-foreground/70"
            aria-hidden
          >
            <ArrowRight className="h-5 w-5" strokeWidth={1.8} />
          </span>
        </div>
      </div>
    )
  }

  // Desktop floating preview
  if (previewData.id === CLIMBING_GYM_ID) return null
  // Scale factor so content fits inside the preview area and isn’t cropped on the right
  if (previewData.id === "entropy-i" && mousePos && windowSize) {
    const mouseX = (mousePos.x / windowSize.w) * 2 - 1
    const mouseY = (mousePos.y / windowSize.h) * 2 - 1
    return (
      <div
        className="overflow-hidden bg-white rounded-xl flex items-center justify-center animate-[project-preview-in_0.45s_ease-out_forwards] shadow-[0_18px_42px_-22px_rgba(15,23,42,0.16),0_6px_14px_-8px_rgba(15,23,42,0.08)]"
        style={{ width: previewW, height: previewH }}
      >
        <OrbPreview
          width={previewW}
          height={previewH}
          mouseX={mouseX}
          mouseY={mouseY}
        />
      </div>
    )
  }
  if (previewData.id === ENTROPY_II_ID && mousePos && windowSize) {
    const mouseX = (mousePos.x / windowSize.w) * 2 - 1
    const mouseY = (mousePos.y / windowSize.h) * 2 - 1
    return (
      <div
        className="overflow-hidden rounded-xl flex items-center justify-center animate-[project-preview-in_0.45s_ease-out_forwards] shadow-[0_18px_42px_-22px_rgba(15,23,42,0.16),0_6px_14px_-8px_rgba(15,23,42,0.08)]"
        style={{ width: previewW, height: previewH }}
      >
        <EntropyIIPreview
          width={previewW}
          height={previewH}
          mouseX={mouseX}
          mouseY={mouseY}
        />
      </div>
    )
  }
  if (previewData.id === "ai-task-manager") {
    const heroW = 1240
    const heroH = 775
    // Leave a small inset so the hero shadow is not clipped by the preview frame.
    const SHADOW_BREATHING_ROOM = 16
    const scale = Math.min((previewW - SHADOW_BREATHING_ROOM) / heroW, (previewH - SHADOW_BREATHING_ROOM) / heroH)
    return (
      <div
        className="overflow-hidden bg-white rounded-xl flex items-center justify-center"
        style={{ width: previewW, height: previewH }}
      >
        <div
          className="origin-center shrink-0"
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
  if (previewData.id === "credits-and-conversion") {
    const heroW = 1240
    const heroH = 775
    // Leave a small inset so the hero shadow is not clipped by the preview frame.
    const SHADOW_BREATHING_ROOM = 16
    const scale = Math.min((previewW - SHADOW_BREATHING_ROOM) / heroW, (previewH - SHADOW_BREATHING_ROOM) / heroH)
    return (
      <div
        className="overflow-hidden bg-white rounded-xl flex items-center justify-center"
        style={{ width: previewW, height: previewH }}
      >
        <div
          className="origin-center shrink-0"
          style={{
            transform: `scale(${scale})`,
            width: heroW,
            height: heroH,
          }}
        >
          <CreditsHero preview />
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
        className="animate-[preview-zoom-in_2.5s_ease-out_forwards] w-full h-full object-cover"
        priority
      />
    </div>
  )
}

export function ProjectList() {
  const isMobile = useIsMobile()
  const [activeProject, setActiveProject] = useState<string | null>(PROJECT_DEFAULT_ID)

  useEffect(() => {
    if (isMobile) {
      setActiveProject(null)
    } else {
      setActiveProject((prev) => prev ?? PROJECT_DEFAULT_ID)
    }
  }, [isMobile])

  const setActive = useCallback((id: string | null) => setActiveProject(id), [])
  const scheduleLeave = useCallback(() => {
    leaveTimeoutRef.current = setTimeout(() => setActive(PROJECT_DEFAULT_ID), 300)
  }, [setActive])
  const [climbingScreen, setClimbingScreen] = useState<"" | "/bookings">("")
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [windowSize, setWindowSize] = useState({ w: 1920, h: 1080 })
  const containerRef = useRef<HTMLDivElement>(null)
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

  // Track mouse for OrbPreview (Entropy I) rotation only
  useEffect(() => {
    const handleMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener("mousemove", handleMove)
    return () => window.removeEventListener("mousemove", handleMove)
  }, [])

  const clearLeaveTimeout = useCallback(() => {
    if (leaveTimeoutRef.current !== null) {
      clearTimeout(leaveTimeoutRef.current)
      leaveTimeoutRef.current = null
    }
  }, [])

  const activeData = projects.find((p) => p.id === activeProject)
  const previewData = activeData

  // Desktop responsive sizing: two downscale steps before mobile.
  const desktopPreviewW = windowSize.w < 1120 ? 640 : windowSize.w < 1320 ? 720 : PREVIEW_W
  const desktopPreviewH = Math.round(desktopPreviewW * (PREVIEW_H / PREVIEW_W))
  const climbingBackdropW = windowSize.w < 1120 ? 640 : windowSize.w < 1320 ? 720 : 800
  const climbingBackdropH = windowSize.w < 1120 ? 520 : windowSize.w < 1320 ? 560 : 620
  const desktopTitleSizeClass = windowSize.w < 1120 ? "text-[13px]" : windowSize.w < 1320 ? "text-sm" : "text-base"
  const desktopSecondarySizeClass = windowSize.w < 1120 ? "text-sm" : windowSize.w < 1320 ? "text-base" : "text-lg"

  // Projects 1, 2, 3 use same large size (right-aligned); project 4 (climbing) smaller
  const useLargePreview =
    previewData &&
    (previewData.id === ENTROPY_I_ID ||
      previewData.id === ENTROPY_II_ID ||
      previewData.id === "ai-task-manager" ||
      previewData.id === "credits-and-conversion")
  const previewW =
    previewData && previewData.id === CLIMBING_GYM_ID
      ? CLIMBING_PREVIEW_W
      : previewData
        ? useLargePreview ? desktopPreviewW : Math.min(previewData.previewWidth, desktopPreviewW)
        : 0
  const previewH =
    previewData && previewData.id === CLIMBING_GYM_ID
      ? CLIMBING_PREVIEW_H
      : previewData
        ? useLargePreview ? desktopPreviewH : Math.min(previewData.previewHeight, desktopPreviewH)
        : 0
  const isClimbingActive = activeProject === CLIMBING_GYM_ID

  return (
    <div
      ref={containerRef}
      className={`project-list w-full ${
        isMobile ? "max-w-2xl mx-auto px-4 sm:px-12" : "max-w-[1400px] mx-auto px-4 sm:px-12"
      }`}
    >
      {/* Mobile: simple stacked feed — preview + title + arrow CTA */}
      {isMobile &&
        projects.map((project, index) => {
          return (
            <Link
              key={project.id}
              href={getProjectHref(project.id)}
              className={`block pb-8 mb-8 border-b border-foreground/18 last:border-b-0 last:pb-0 last:mb-0 ${index === 0 ? "pt-20" : ""}`}
            >
              <ProjectPreviewContent
                previewData={project}
                previewW={previewW}
                previewH={previewH}
                inline
                climbingScreen={climbingScreen}
              />
            </Link>
          )
        })}

      {/* Desktop: two columns — list left, preview right-aligned (aligns with header/footer right edge) */}
      {!isMobile && (
        <div className="flex w-full gap-12 sm:gap-16 lg:gap-20 items-center min-h-[min(85vh,640px)]">
          <div className="w-full max-w-md shrink-0 pt-2">
            {projects.map((project) => {
        const isActive = activeProject === project.id
        const showLine = isActive
        const labelBlock = (
          <div className={`flex items-center gap-5 w-[calc(100%-24px)] max-w-lg text-left pb-5 -mb-5 border-b ${showLine ? "border-foreground/15" : "border-transparent"}`}>
            <div className="inline-block min-w-0">
              <h2 className={`${desktopTitleSizeClass} font-normal tracking-[0.15em] uppercase ${isActive ? "text-foreground" : "text-foreground/70"}`}>
                {project.title.includes(" — ") ? (
                  <>
                    {project.title.split(" — ")[0]}
                    <span className={`ml-[48px] inline ${desktopSecondarySizeClass} text-foreground/50 ${isActive ? "visible" : "invisible"}`}> — {project.title.split(" — ").slice(1).join(" — ")}</span>
                  </>
                ) : (
                  project.title
                )}
              </h2>
            </div>
            <span className={`inline-block min-w-[4.5rem] text-left text-[10px] font-medium text-foreground/30 tracking-widest uppercase shrink-0 ${isActive ? "visible" : "invisible"}`}>
              {project.tag}
            </span>
          </div>
        )

        return (
          <div
            key={project.id}
            className="group relative flex w-full touch-manipulation"
            onMouseEnter={() => {
              clearLeaveTimeout()
              setActive(project.id)
            }}
            onMouseLeave={scheduleLeave}
          >
            <Link
              href={getProjectHref(project.id)}
              className="py-7 shrink-0 w-full text-left"
            >
              {labelBlock}
            </Link>
          </div>
        )
      })}
          </div>

          <div className="flex-1 min-w-0 flex justify-end items-center">
            {previewData && (
              <Link
                href={getProjectHref(previewData.id)}
                className="flex justify-end items-center animate-[project-preview-in_0.45s_ease-out_forwards] cursor-pointer shrink-0 overflow-visible"
                onMouseEnter={clearLeaveTimeout}
                onMouseLeave={scheduleLeave}
              >
                {isClimbingActive ? (
                  <div
                    className="relative flex items-center justify-center overflow-visible animate-[project-preview-in_0.45s_ease-out_forwards]"
                    style={{ width: climbingBackdropW, height: climbingBackdropH }}
                  >
                    <div className="absolute inset-x-0 top-[30px] bottom-[30px] rounded-2xl overflow-hidden border border-foreground/10 bg-[#dfe4ea] shadow-2xl">
                      <img
                        src="/images/climbing-bg-capture.png"
                        alt="Climber on an outdoor wall"
                      className="absolute inset-0 h-full w-full object-cover object-[34%_26%] scale-100 opacity-60"
                      />
                      <div className="absolute inset-0 bg-black/18" />
                    </div>
                    <IphoneFrame
                      src={`${CLIMBING_PROTOTYPE_BASE}#${climbingScreen === "" ? "/" : climbingScreen}`}
                      title="Climbing gym app — prototype"
                      className="relative z-10 translate-y-3 scale-[0.98]"
                      sleek
                      contentScale={climbingScreen === "/bookings" ? 0.92 : undefined}
                    />
                  </div>
                ) : (
                  <ProjectPreviewContent
                    previewData={previewData}
                    previewW={previewW}
                    previewH={previewH}
                    inline={false}
                    mousePos={mousePos}
                    windowSize={windowSize}
                  />
                )}
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
