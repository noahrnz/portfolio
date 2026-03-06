"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import Image from "next/image"
import {
  AlertCircle,
  ArrowUpRight,
  Bot,
  Briefcase,
  ChevronLeft,
  ClipboardCheck,
  FileSearch,
  FileText,
  Mail,
  MessageCircle,
  PenSquare,
  Search,
  Send,
  Sparkles,
  X,
} from "lucide-react"

const HERO_WIDTH = 1240
const HERO_HEIGHT = 775
const PREVIEW_ENTRANCE_DELAY_MS = 850
const PREVIEW_CURSOR_MOVE_MS = 520
const PREVIEW_CURSOR_HOVER_MS = 620
const PREVIEW_CURSOR_RESET_MS = 1400
const PREVIEW_HOVER_CARD_INDICES = [0, 1, 2] as const

const CARDS = [
  { icon: FileSearch, label: "What do I need to know for my next call?" },
  { icon: Mail, label: "Write my urgent high impact follow-ups." },
  { icon: Briefcase, label: "Where are my buyers getting stuck?" },
  { icon: FileText, label: "Which deals might be at risk?" },
  { icon: Sparkles, label: "What patterns are emerging across calls?" },
  { icon: ClipboardCheck, label: "What tasks should I prioritize today?" },
]

const sectionDelay = (i: number) => `${i * 0.05}s`

/** Ask Sybill–style credits UI for project 2 preview; same size as TasksHero (1240×775) */
export function CreditsHero({ preview = false }: { preview?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const cardPositionsRef = useRef<{ x: number; y: number; cardIndex: number }[]>([])
  const loopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cancelledRef = useRef(false)
  const [measured, setMeasured] = useState(false)
  const [cursorAt, setCursorAt] = useState<number | null>(null)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })

  useLayoutEffect(() => {
    if (!preview || !containerRef.current) return
    const container = containerRef.current.getBoundingClientRect()
    const scaleX = container.width / HERO_WIDTH
    const scaleY = container.height / HERO_HEIGHT

    const positions: { x: number; y: number; cardIndex: number }[] = []
    PREVIEW_HOVER_CARD_INDICES.forEach((cardIndex) => {
      const el = cardRefs.current[cardIndex]
      if (!el) return
      const r = el.getBoundingClientRect()
      const viewportCenterX = r.left - container.left + r.width / 2
      const viewportCenterY = r.top - container.top + r.height / 2
      const localX = viewportCenterX / scaleX
      const localY = viewportCenterY / scaleY
      // Cursor SVG tip is roughly at (5,3) in 24x24 viewBox.
      positions.push({ x: localX - 5, y: localY - 3, cardIndex })
    })
    cardPositionsRef.current = positions
  }, [preview, measured])

  useEffect(() => {
    if (!preview) return
    const t = setTimeout(() => setMeasured(true), PREVIEW_ENTRANCE_DELAY_MS)
    return () => clearTimeout(t)
  }, [preview])

  useEffect(() => {
    if (!preview || !measured) return
    const positions = cardPositionsRef.current
    if (positions.length === 0) return

    cancelledRef.current = false
    const runCycle = () => {
      if (cancelledRef.current) return
      let step = 0
      const next = () => {
        if (cancelledRef.current) return
        if (step < positions.length) {
          const target = positions[step]
          setCursorAt(target.cardIndex)
          setCursorPos({ x: target.x, y: target.y })
          loopTimeoutRef.current = setTimeout(() => {
            if (cancelledRef.current) return
            step += 1
            loopTimeoutRef.current = setTimeout(next, PREVIEW_CURSOR_HOVER_MS)
          }, PREVIEW_CURSOR_MOVE_MS)
        } else {
          setCursorAt(null)
          loopTimeoutRef.current = setTimeout(runCycle, PREVIEW_CURSOR_RESET_MS)
        }
      }
      next()
    }

    // Start quickly after measurement so preview interaction feels alive.
    const startDelay = setTimeout(runCycle, 120)
    return () => {
      cancelledRef.current = true
      clearTimeout(startDelay)
      if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current)
    }
  }, [preview, measured])

  return (
    <div
      ref={containerRef}
      className={`relative bg-white overflow-hidden ${
        preview
          ? "shadow-[0_18px_42px_-22px_rgba(15,23,42,0.16),0_6px_14px_-8px_rgba(15,23,42,0.08)]"
          : "shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_6px_16px_-4px_rgba(0,0,0,0.08),0_12px_32px_-8px_rgba(0,0,0,0.06)]"
      } ${preview ? "" : "w-full max-w-[1240px]"}`}
      style={{
        ...(preview ? { width: HERO_WIDTH, height: HERO_HEIGHT } : { minHeight: HERO_HEIGHT }),
        animation: "credits-hero-enter 0.5s ease-out forwards",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
      }}
    >
      {preview && cursorAt !== null && (
        <div
          className="absolute z-20 pointer-events-none"
          style={{
            left: cursorPos.x,
            top: cursorPos.y,
            transition: "left 0.34s ease-out, top 0.34s ease-out",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            style={{
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
      <div className="flex h-full">
        {/* Left app rail */}
        <aside
          className="w-[56px] shrink-0 border-r border-[#e9eaeb] bg-[#fafafa] flex flex-col items-center justify-between py-3"
          style={{
            animation: "credits-hero-section 0.4s ease-out forwards",
            animationDelay: sectionDelay(0),
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          <div className="flex flex-col items-center gap-1.5">
            <button type="button" className="rounded-md p-2 text-[#667085] hover:bg-[#f2f4f7] hover:text-[#344054]" aria-label="Ask Sybill">
              <Image
                src="/images/sybill-ask-icon.png"
                alt=""
                width={26}
                height={26}
                className="h-[26px] w-[26px] object-contain scale-150"
              />
            </button>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-6 w-6 overflow-hidden rounded-full bg-[#d0d5dd]">
              <Image
                src="/images/task-participant-avatar.png"
                alt=""
                width={24}
                height={24}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </aside>

        {/* Drawer */}
        <aside
          className="w-[264px] shrink-0 border-r border-[#e9eaeb] bg-[#fcfcfd] flex flex-col"
          style={{
            animation: "credits-hero-section 0.4s ease-out forwards",
            animationDelay: sectionDelay(1),
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          <div className="flex items-center gap-2 px-4 pt-5 pb-4">
            <h2 className="text-[20px] leading-[30px] font-semibold text-[#181d27] truncate">Ask Sybill</h2>
            <button type="button" className="ml-auto p-1 text-[#667085] hover:text-[#344054]" aria-label="Collapse">
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
          <div className="px-3 pb-2">
            <button type="button" className="flex w-full items-center gap-2 rounded-[10px] px-3 py-2.5 text-[15px] font-medium text-[#175cd3] hover:text-[#1849a9]">
              <PenSquare className="h-4 w-4" />
              New chat
            </button>
          </div>
          <div className="px-3 -mt-1 pb-4">
            <button type="button" className="flex w-full items-center gap-2 rounded-[10px] px-3 py-2.5 text-[15px] text-[#667085] hover:text-[#475467]">
              <Search className="h-4 w-4" />
              <span>Search</span>
            </button>
          </div>
          <div className="px-3">
            <p className="px-2 text-[13px] font-semibold text-[#475467]">Today</p>
            <div className="mt-3 rounded-lg px-2 py-2">
              <p className="text-[15px] font-medium text-[#717680] truncate">Demo for Nike follow-up</p>
            </div>
          </div>
          <div className="mt-auto" />
        </aside>

        {/* Main canvas */}
        <main
          className="relative flex-1 min-w-0 flex flex-col items-center bg-white"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.94) 58%, rgba(246,250,255,0.95) 100%)",
          }}
        >
          <div className="h-[68px] w-full shrink-0" />

          <div className="flex flex-col items-center pt-4 pb-7">
            <div
              className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-[#d5d7da] bg-[#f5f3ff] text-[#6941c6]"
              style={{
                animation: "credits-hero-section 0.35s ease-out forwards",
                animationDelay: sectionDelay(2),
                opacity: 0,
                animationFillMode: "forwards",
              }}
            >
              <Image
                src="/images/sybill-globe-icon.png"
                alt=""
                width={26}
                height={26}
                className="h-[26px] w-[26px] object-contain"
              />
            </div>
            <h1
              className="text-[24px] leading-[32px] font-semibold text-[#101828]"
              style={{
                animation: "credits-hero-section 0.35s ease-out forwards",
                animationDelay: sectionDelay(3),
                opacity: 0,
                animationFillMode: "forwards",
              }}
            >
              Hello, Noah
            </h1>
          </div>

          <div
            className="grid grid-cols-3 gap-3 w-[666px]"
            style={{
              animation: "credits-hero-section 0.4s ease-out forwards",
              animationDelay: sectionDelay(4),
              opacity: 0,
              animationFillMode: "forwards",
            }}
          >
            {CARDS.map((card, i) => {
              const Icon = card.icon
              return (
                <div
                  key={i}
                  ref={(el) => {
                    if (el) cardRefs.current[i] = el
                  }}
                  className={`relative overflow-hidden h-[127px] rounded-xl border bg-white p-3.5 transition-colors transition-shadow duration-300 ${
                    preview && cursorAt === i
                      ? "border-[#c9d3ff] bg-[#f5f8ff] shadow-[0_8px_22px_rgba(78,98,255,0.14)]"
                      : "border-[#e9eaeb]"
                  }`}
                >
                  {preview && cursorAt === i && (
                    <span
                      className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/75 to-transparent animate-[credits-card-shimmer_1.6s_ease-in-out_infinite]"
                      aria-hidden
                    />
                  )}
                  <div className="mb-2.5 flex h-[32px] w-[32px] items-center justify-center rounded-lg border border-[#e9eaeb] bg-gradient-to-b from-[#fdf2f8] to-[#eef4ff]">
                    <Icon className="h-4 w-4 text-[#4f46e5]" strokeWidth={1.8} />
                  </div>
                  <p className="text-[15px] leading-[1.35] font-medium text-[#414651]">{card.label}</p>
                </div>
              )
            })}
          </div>

          <div className="flex-1 min-h-[32px]" />

          <div
            className="mt-8 w-[728px] flex flex-col gap-4 pb-4"
            style={{
              animation: "credits-hero-section 0.4s ease-out forwards",
              animationDelay: sectionDelay(5),
              opacity: 0,
              animationFillMode: "forwards",
            }}
          >
            <div className="flex items-center justify-between gap-4 rounded-xl border border-[#c7d7fe] bg-[#eff4ff] px-3.5 py-2.5 shadow-[0_1px_2px_rgba(10,13,18,0.05)]">
              <div className="flex items-center gap-2 text-[15px] text-[#414651]">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d1e0ff]">
                  <AlertCircle className="h-4 w-4 text-[#175cd3]" />
                </span>
                <span>You have 200/500 free credits left until Jan 15.</span>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 font-semibold text-[#175cd3] hover:underline"
                >
                  Upgrade my plan
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
              <button type="button" className="shrink-0 p-1 text-[#667085] hover:text-[#344054]" aria-label="Dismiss">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div
              style={{
                animation: "credits-hero-section 0.4s ease-out forwards",
                animationDelay: sectionDelay(6),
                opacity: 0,
                animationFillMode: "forwards",
              }}
            >
              <div className="flex items-center gap-2 rounded-xl border border-[#d5d7da] bg-white px-3.5 py-2.5 shadow-[0_1px_2px_rgba(10,13,18,0.05)]">
                <span className="flex-1 text-[15px] text-[#717680]">Ask anything. Use &apos;/&apos; to refer to deals and meetings</span>
                <button type="button" className="p-1.5 text-[#667085] hover:text-[#344054]" aria-label="Suggest">
                  <MessageCircle className="h-5 w-5" />
                </button>
                <button type="button" className="p-1.5 text-[#98a2b3] hover:text-[#667085]" aria-label="Send">
                  <Send className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-2 text-center text-[13px] text-[#717680]">
                We&apos;re not perfect, yet. Sybill may occasionally make mistakes.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
