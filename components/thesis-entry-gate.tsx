"use client"

import { useState } from "react"

/**
 * Shows a "this takes time to load" blocker before the thesis project experience.
 * Only for the 3rd project (thesis); user must click Continue to proceed.
 */
export function ThesisEntryGate({ children }: { children: React.ReactNode }) {
  const [allowed, setAllowed] = useState(false)

  if (allowed) {
    return <>{children}</>
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
      <div className="mx-auto max-w-md px-8 text-center">
        <p className="text-sm text-foreground/80 mb-6">
          This experience takes a moment to load.
        </p>
        <button
          type="button"
          onClick={() => setAllowed(true)}
          className="text-xs font-medium tracking-[0.2em] uppercase text-foreground border border-foreground/30 px-6 py-3 rounded-sm hover:bg-foreground/5 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
