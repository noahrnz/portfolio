import type { Metadata } from "next"
import { EntropyIVisual } from "@/components/entropy-i-visual"

export const metadata: Metadata = {
  title: "Entropy I — Noah Ahrens",
  description: "Audio-reactive particle shape.",
}

/**
 * Entropy I — full-screen page with no back button.
 * The shape reacts to the Half Light of Dawn MP3.
 */
export default function EntropyIPage() {
  return (
    <div className="fixed inset-0 w-full h-full bg-black">
      <EntropyIVisual />
    </div>
  )
}
