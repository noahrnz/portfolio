"use client"

/**
 * Wraps content (e.g. an iframe) in an iPhone 16-style frame with rounded corners
 * and a small Dynamic Island pill at the top. Use for embedding interactive prototypes.
 * Prototypes run inside the iframe so their styles/JS are isolated from the portfolio (no bleed).
 * Pass src only when the prototype should load (e.g. after hover or when in view) to avoid blocking main page.
 */
export function IphoneFrame({
  src,
  title = "Prototype",
  className = "",
  compact = false,
  mini = false,
  sleek = false,
  lockInteraction = false,
  contentScale,
}: {
  src: string
  title?: string
  className?: string
  /** When true, use a smaller width (~220px) for preview areas like the homepage */
  compact?: boolean
  /** When true, use an extra-small phone size for tight mobile preview cards. */
  mini?: boolean
  /** When true, use a slimmer bezel for a more modern look. */
  sleek?: boolean
  /** When true, disable interactions inside iframe (used for mobile preview cards). */
  lockInteraction?: boolean
  /** Scale the content inside the frame (e.g. 0.85 for bookings). Only used on portfolio preview. */
  contentScale?: number
}) {
  const scale = contentScale != null && contentScale > 0 && contentScale <= 1 ? contentScale : 1
  const effectiveSrc = src || "about:blank"

  return (
    <div
      className={`flex justify-center ${className}`}
      aria-label={`Interactive prototype: ${title}`}
      data-prototype-embed
    >
      {/* iPhone 16–style frame: rounded corners, bezel, Dynamic Island */}
      <div
        className={`relative max-w-[90vw] ${mini ? "w-[122px]" : compact ? "w-[200px]" : "w-[260px]"} ${
          sleek
            ? "bg-[#15161a] rounded-[2.2rem] p-2 shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
            : "bg-[#1c1c1e] rounded-[3rem] p-3 shadow-2xl"
        }`}
        style={{
          // iPhone 16 viewport aspect 393×852; slightly smaller so full phone fits without cropping
          aspectRatio: "393 / 852",
          maxHeight: "min(88vh, 760px)",
        }}
      >
        <div className={`relative w-full h-full overflow-hidden bg-black ${sleek ? "rounded-[1.85rem]" : "rounded-[2.25rem]"}`}>
          {/* Dynamic Island pill — small so it doesn’t dominate when iframe is loading or blank */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 z-10 max-w-[28%] rounded-full bg-black shrink-0 ${
              sleek ? "top-1.5 h-1.5 w-[58px]" : "top-2 h-2 w-[70px]"
            }`}
            aria-hidden
          />
          {/* Screen area: always use same wrapper so iframe never remounts when scale toggles (avoids flicker) */}
          <div className={`absolute inset-0 overflow-hidden ${sleek ? "rounded-[1.85rem]" : "rounded-[2.25rem]"}`}>
            <div
              style={{
                width: `${100 / scale}%`,
                height: `${100 / scale}%`,
                transform: `scale(${scale})`,
                transformOrigin: "0 0",
              }}
            >
              <iframe
                src={effectiveSrc}
                title={title}
                loading="lazy"
                scrolling={lockInteraction ? "no" : undefined}
                className={`w-full h-full border-0 ${sleek ? "rounded-[1.85rem]" : "rounded-[2.25rem]"} ${
                  lockInteraction ? "pointer-events-none" : ""
                }`}
                style={{ clipPath: sleek ? "inset(0 round 1.85rem)" : "inset(0 round 2.25rem)" }}
                tabIndex={lockInteraction ? -1 : undefined}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
