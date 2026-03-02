"use client"

import { useRef, useState, useEffect, useLayoutEffect } from "react"
import {
  Briefcase,
  Bookmark,
  ArrowUp,
  RefreshCw,
  Pencil,
  Copy,
  Check,
  Circle,
  MoreVertical,
  ChevronDown,
  Mail,
  Play,
} from "lucide-react"

const HERO_WIDTH = 1240
const HERO_HEIGHT = 775

// Preview-only loop: delay after entrance before cursor appears, then check 1→2→3→4, uncheck all, repeat
const ENTRANCE_DELAY_MS = 1200
const MOVE_MS = 380
const CLICK_MS = 320
const DONE_PAUSE_MS = 700
const RESET_PAUSE_MS = 900

/** Static Meetings Brief UI for Tasks project — full scale on case study; homepage uses preview=true and scales in a wrapper */
export function TasksHero({ preview = false }: { preview?: boolean }) {
  const tasks = [
    { label: "Research key stakeholders at Voltra", day: "Friday", done: false },
    { label: "Review Voltra's current marketing strategy", day: "Friday", done: false },
    { label: "Schedule follow-up call with Voltra team", day: "Friday", done: true, highlight: true },
    { label: "Send Voltra tailored proposal", day: "Friday", done: false },
  ]

  const qualLetters = [
    { letter: "M", filled: true },
    { letter: "E", filled: false },
    { letter: "D", filled: true },
    { letter: "D", filled: false },
    { letter: "P", filled: true },
    { letter: "I", filled: true },
    { letter: "C", filled: false },
    { letter: "C", filled: false },
  ]

  const sectionDelay = (i: number) => `${i * 0.06}s`

  // Preview-only: cursor + check/uncheck loop (runs once on load, restarts when you hover away and back)
  const containerRef = useRef<HTMLDivElement>(null)
  const taskCheckRefs = useRef<(HTMLDivElement | null)[]>([])
  const taskPositionsRef = useRef<{ x: number; y: number }[]>([])
  const loopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cancelledRef = useRef(false)
  const [measured, setMeasured] = useState(false)
  const [cursorAt, setCursorAt] = useState<number | null>(null)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [cursorClicking, setCursorClicking] = useState(false)
  const [loopDone, setLoopDone] = useState<boolean[]>([false, false, false, false])

  useLayoutEffect(() => {
    if (!preview || !containerRef.current) return
    const container = containerRef.current.getBoundingClientRect()
    // Hero is inside a scaled parent; getBoundingClientRect returns scaled (viewport) coords.
    // Convert to hero-local coords (1240×775) so position:absolute left/top are correct.
    const scaleX = container.width / HERO_WIDTH
    const scaleY = container.height / HERO_HEIGHT
    const positions: { x: number; y: number }[] = []
    for (let i = 0; i < 4; i++) {
      const el = taskCheckRefs.current[i]
      if (el) {
        const r = el.getBoundingClientRect()
        const viewportCenterX = r.left - container.left + r.width / 2
        const viewportCenterY = r.top - container.top + r.height / 2
        const localX = viewportCenterX / scaleX
        const localY = viewportCenterY / scaleY
        // Cursor SVG tip is at (5,3) in 24×24 viewBox
        positions.push({ x: localX - 5, y: localY - 3 })
      } else {
        positions.push({ x: 180, y: 420 + i * 56 })
      }
    }
    taskPositionsRef.current = positions
  }, [preview, measured])

  useEffect(() => {
    if (!preview) return
    const t = setTimeout(() => setMeasured(true), ENTRANCE_DELAY_MS)
    return () => clearTimeout(t)
  }, [preview])

  useEffect(() => {
    if (!preview || !measured) return
    const positions = taskPositionsRef.current
    if (positions.length < 4) return

    cancelledRef.current = false
    const runCycle = () => {
      if (cancelledRef.current) return
      let step = 0
      const next = () => {
        if (cancelledRef.current) return
        if (step < 4) {
          setCursorAt(step)
          setCursorPos(positions[step])
          setCursorClicking(false)
          loopTimeoutRef.current = setTimeout(() => {
            if (cancelledRef.current) return
            setCursorClicking(true)
            setLoopDone((prev) => {
              const next_ = [...prev]
              next_[step] = true
              return next_
            })
            loopTimeoutRef.current = setTimeout(() => {
              if (cancelledRef.current) return
              setCursorClicking(false)
              step += 1
              loopTimeoutRef.current = setTimeout(next, CLICK_MS)
            }, 150)
          }, MOVE_MS)
        } else {
          setCursorAt(null)
          loopTimeoutRef.current = setTimeout(() => {
            if (cancelledRef.current) return
            setLoopDone([false, false, false, false])
            loopTimeoutRef.current = setTimeout(runCycle, RESET_PAUSE_MS)
          }, DONE_PAUSE_MS)
        }
      }
      next()
    }

    const startDelay = setTimeout(runCycle, 300)
    return () => {
      cancelledRef.current = true
      clearTimeout(startDelay)
      if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current)
    }
  }, [preview, measured])

  return (
    <div
      ref={containerRef}
      className={`relative bg-white rounded-t-[28px] border border-[#e5e7eb] overflow-hidden ${
        preview
          ? "shadow-[0px_6px_20px_rgba(164,164,164,0.25)]"
          : "shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_6px_16px_-4px_rgba(0,0,0,0.08),0_12px_32px_-8px_rgba(0,0,0,0.06)]"
      } ${preview ? "" : "w-full max-w-[1240px]"}`}
      style={{
        ...(preview ? { width: HERO_WIDTH, height: HERO_HEIGHT } : { minHeight: HERO_HEIGHT }),
        animation: "tasks-hero-enter 0.5s ease-out forwards",
      }}
    >
      {/* Preview-only: fake cursor that moves and clicks checkboxes */}
      {preview && cursorAt !== null && (
        <div
          className="absolute z-10 pointer-events-none"
          style={{
            left: cursorPos.x,
            top: cursorPos.y,
            transition: "left 0.25s ease-out, top 0.25s ease-out",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className={cursorClicking ? "scale-90" : ""}
            style={{
              transition: "transform 0.1s ease-out",
              filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))",
            }}
          >
            <path
              d="M5 3l14 9-6.5 1.5L9 21l-4-18z"
              fill="#111"
              stroke="#fff"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
      {/* Header */}
      <div
        className="flex items-center justify-between gap-4 px-10 pt-10 pb-3"
        style={{
          animation: "tasks-hero-section 0.4s ease-out forwards",
          animationDelay: sectionDelay(0),
          opacity: 0,
          animationFillMode: "forwards",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-8 items-center justify-center rounded bg-[#93c5fd] text-white text-xs font-bold">
            A
          </div>
          <h1 className="text-[26px] font-semibold text-[#181d27]">
            Acme &lt;&gt; Voltra Demo
          </h1>
          <span className="rounded-md border border-[#f5d0e9] bg-[#fdf2f9] px-2.5 py-0.5 text-sm font-medium text-[#be185d]">
            Sales
          </span>
          <span className="rounded-md border border-[#f5d0e9] bg-[#fdf2f9] px-2.5 py-0.5 text-sm font-medium text-[#be185d]">
            Demo
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg border border-[#2563eb] bg-white px-4 py-2.5 text-sm font-semibold text-[#2563eb]"
          >
            <Briefcase className="h-5 w-5" />
            Voltra.io
          </button>
          <button
            type="button"
            className="rounded-lg bg-[#1d4ed8] px-4 py-2.5 text-sm font-semibold text-white"
          >
            Join now
          </button>
        </div>
      </div>

      {/* Ask Sybill bar */}
      <div
        className="px-10 pb-6"
        style={{
          animation: "tasks-hero-section 0.4s ease-out forwards",
          animationDelay: sectionDelay(1),
          opacity: 0,
          animationFillMode: "forwards",
        }}
      >
        <div className="flex h-[70px] items-center justify-between rounded-lg border border-[#a78bfa] bg-[#faf5ff] px-4">
          <span className="text-lg text-[#6b7280]">
            Ask Sybill to further prepare for this meeting
          </span>
          <div className="flex items-center gap-1.5">
            <button type="button" className="rounded-lg p-2.5 hover:bg-gray-100">
              <Bookmark className="h-5 w-5 text-[#6b7280]" />
            </button>
            <button type="button" className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-2.5">
              <ArrowUp className="h-5 w-5 text-[#6b7280]" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs + actions */}
      <div
        className="flex h-12 items-center justify-between border-b border-[#e9eaeb] px-10"
        style={{
          animation: "tasks-hero-section 0.4s ease-out forwards",
          animationDelay: sectionDelay(2),
          opacity: 0,
          animationFillMode: "forwards",
        }}
      >
        <div className="flex gap-4">
          <button
            type="button"
            className="border-b-2 border-[#1d4ed8] pb-4 pt-1 text-sm font-semibold text-[#1d4ed8]"
          >
            Summary
          </button>
          <button
            type="button"
            className="pb-4 pt-1 text-sm font-semibold text-[#6b7280] hover:text-[#181d27]"
          >
            Activity
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" className="flex items-center gap-1.5 text-sm font-semibold text-[#535862]">
            <RefreshCw className="h-5 w-5" />
            Regenerate
          </button>
          <button type="button" className="flex items-center gap-1.5 text-sm font-semibold text-[#535862]">
            <Pencil className="h-5 w-5" />
            Edit
          </button>
          <button type="button" className="p-1.5">
            <Copy className="h-5 w-5 text-[#535862]" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6 px-10 py-6">
        {/* Agenda */}
        <section
          style={{
            animation: "tasks-hero-section 0.4s ease-out forwards",
            animationDelay: sectionDelay(3),
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          <h2 className="text-[23px] font-semibold text-[#181d27]">Agenda</h2>
          <p className="mt-1.5 text-[20px] leading-[29px] text-[#181d27]">
            This session will equip Acme to demo value to Voltra&apos;s sales and customer
            teams. We&apos;ll highlight key features like automated note taking, real-time
            collaboration, and post-meeting action items.
          </p>
        </section>

        {/* Open Tasks */}
        <section
          style={{
            animation: "tasks-hero-section 0.4s ease-out forwards",
            animationDelay: sectionDelay(4),
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          <h2 className="text-[23px] font-semibold text-[#181d27]">Open Tasks</h2>
          <div className="mt-3 overflow-hidden rounded-lg border border-[#e9eaeb] bg-white">
            {tasks.map((task, i) => {
              const done = preview ? loopDone[i] : task.done
              const rowHighlight = preview && cursorAt === i
              return (
                <div
                  key={i}
                  className={`flex items-center gap-6 border-b border-[#e9eaeb] px-6 py-4 last:border-b-0 ${
                    rowHighlight ? "bg-[#f8faff]" : ""
                  }`}
                >
                  <div className="flex flex-1 items-center gap-4">
                    <div
                      ref={(el) => {
                        if (preview && el) taskCheckRefs.current[i] = el
                      }}
                      className="h-8 w-8 shrink-0 flex items-center justify-center"
                    >
                      {done ? (
                        <div className="h-8 w-8 rounded-full bg-[#dcfce7] flex items-center justify-center">
                          <Check className="h-5 w-5 text-[#1d4ed8]" strokeWidth={2.5} />
                        </div>
                      ) : (
                        <Circle
                          className={`h-8 w-8 shrink-0 ${
                            rowHighlight ? "text-[#93c5fd]" : "text-[#e5e7eb]"
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <span className="text-[17px] font-medium text-[#181d27]">
                        {task.label}
                      </span>
                      <span className="shrink-0 text-[17px] text-[#717680]">{task.day}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 shrink-0 rounded-full bg-[#e8e4dc]" />
                    <button
                      type="button"
                      className="flex items-center gap-1.5 rounded-full border border-[#2563eb] bg-white px-3 py-1.5 text-xs font-medium text-[#2563eb]"
                    >
                      <Play className="h-3.5 w-3.5" />
                      Start
                    </button>
                    <button type="button" className="p-1">
                      <MoreVertical className="h-6 w-6 text-[#535862]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Qualification */}
        <section
          style={{
            animation: "tasks-hero-section 0.4s ease-out forwards",
            animationDelay: sectionDelay(5),
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          <h2 className="text-[23px] font-semibold text-[#181d27]">Qualification</h2>
          <div className="mt-3 flex flex-wrap gap-4">
            {qualLetters.map(({ letter, filled }, i) => (
              <div
                key={i}
                className={`flex h-[70px] w-[70px] items-center justify-center rounded-full text-[23px] font-semibold ${
                  filled
                    ? "bg-[#16a34a] text-white"
                    : "border border-[#e5e7eb] bg-[#dcfce7] text-[#374151]"
                }`}
              >
                {letter}
              </div>
            ))}
          </div>
        </section>

        {/* Participants */}
        <section
          style={{
            animation: "tasks-hero-section 0.4s ease-out forwards",
            animationDelay: sectionDelay(6),
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          <div className="flex items-center gap-2">
            <h2 className="text-[23px] font-semibold text-[#181d27]">Participants</h2>
            <ChevronDown className="h-5 w-5 text-[#535862]" />
          </div>
          <div className="mt-3 rounded-lg border border-[#e9eaeb] bg-white p-6">
            <div className="flex gap-4">
              <div className="h-12 w-12 shrink-0 rounded-full bg-[#e5ddce]" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[23px] font-semibold text-[#181d27]">
                    Edward Cline
                  </span>
                  <span className="rounded-full border border-[#bbf7d0] bg-[#dcfce7] px-2.5 py-0.5 text-xs font-medium text-[#15803d]">
                    Champion
                  </span>
                </div>
                <p className="mt-1 text-[20px] text-[#181d27]">
                  Account Executive at Voltra • 6 months
                </p>
                <p className="mt-2 text-[20px] leading-[29px] text-[#181d27]">
                  Initial engagement started with Ben from Sales Assembly introducing
                  Sybill to Acme. product positioning and customer base.
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fee4e2]">
                  <span className="text-[10px] font-medium text-[#1275b1]">in</span>
                </div>
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fee4e2]"
                >
                  <Mail className="h-5 w-5 text-[#535862]" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
