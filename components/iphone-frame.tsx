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
  contentScale,
}: {
  src: string
  title?: string
  className?: string
  /** When true, use a smaller width (~220px) for preview areas like the homepage */
  compact?: boolean
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
        className={`relative bg-[#1c1c1e] rounded-[3rem] p-3 shadow-2xl max-w-[90vw] ${compact ? "w-[220px]" : "w-[280px]"}`}
        style={{
          // iPhone 16 viewport aspect 393×852
          aspectRatio: "393 / 852",
          maxHeight: "min(85vh, 720px)",
        }}
      >
        <div className="relative w-full h-full rounded-[2.25rem] overflow-hidden bg-black">
          {/* Dynamic Island pill — small so it doesn’t dominate when iframe is loading or blank */}
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 z-10 h-2 w-[70px] max-w-[28%] rounded-full bg-black shrink-0"
            aria-hidden
          />
          {/* Screen area: always use same wrapper so iframe never remounts when scale toggles (avoids flicker) */}
          <div className="absolute inset-0 rounded-[2.25rem] overflow-hidden">
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
                className="w-full h-full border-0 rounded-[2.25rem]"
                style={{ clipPath: "inset(0 round 2.25rem)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
