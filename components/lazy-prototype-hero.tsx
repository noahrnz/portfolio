"use client"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { IphoneFrame } from "@/components/iphone-frame"
import type { Project } from "@/lib/projects"

const CLIMBING_GYM_ID = "climbing-gym"
const CLIMBING_PROTOTYPE_SRC = "/prototypes/climbing-gym/index.html#/"

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

function useInView() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        // Load prototype during idle time so it doesn't block main thread
        const schedule = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 0))
        schedule(() => setInView(true))
      },
      { rootMargin: "100px", threshold: 0.1 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return { ref, inView }
}

/**
 * Renders the climbing-gym prototype hero with:
 * - Lazy load: iframe src only set when section is in view (Intersection Observer)
 * - Mobile: static screenshot + "Best viewed on desktop" (no live prototype)
 * - Device frame (phone) and scoped embed so prototype doesn't block or bleed
 */
export function LazyPrototypeHero({ project }: { project: Project }) {
  const isMobile = useIsMobile()
  const { ref, inView } = useInView()

  if (project.id !== CLIMBING_GYM_ID) return null

  if (isMobile) {
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-full max-w-[280px] mx-auto">
          <div
            className="overflow-hidden bg-secondary rounded-[2.25rem] border-4 border-[#1c1c1e] shadow-xl"
            style={{ aspectRatio: "393 / 852" }}
          >
            <Image
              src={project.image}
              alt={project.title}
              width={393}
              height={852}
              sizes="280px"
              className="w-full h-full object-cover"
              priority={false}
            />
          </div>
          <span
            className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded text-[10px] font-medium tracking-wider uppercase text-foreground/60 bg-background/90 backdrop-blur-sm"
            aria-hidden
          >
            Best viewed on desktop
          </span>
        </div>
      </div>
    )
  }

  return (
    <div ref={ref} className="flex flex-col items-center" data-prototype-embed>
      <IphoneFrame
        src={inView ? CLIMBING_PROTOTYPE_SRC : "about:blank"}
        title={`${project.title} — Touchstone app prototype`}
      />
    </div>
  )
}
