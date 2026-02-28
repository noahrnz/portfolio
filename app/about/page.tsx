import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col bg-background text-foreground cursor-default selection:bg-foreground selection:text-background">
      <Header />
      <main className="flex-1 flex flex-col pt-32 pb-32">
        <div className="mx-auto max-w-[1400px] w-full px-12">
          <div className="max-w-2xl">
            <h1 className="text-xs font-medium tracking-[0.2em] uppercase text-foreground/60 mb-8">
              About
            </h1>
            <div className="space-y-6 text-foreground/90 leading-relaxed">
              <p>
                Product design engineer based in San Francisco. I design and build
                interfaces for the age of AI—focusing on 0–1 experiences that
                feel clear and human.
              </p>
              <p>
                I care about craft, systems, and making complex tools simple to
                use. If you’d like to work together or just say hi, get in touch.
              </p>
            </div>
            <div className="mt-12">
              <Link
                href="/"
                className="text-xs font-medium tracking-[0.2em] uppercase text-foreground hover:opacity-50 transition-opacity"
              >
                ← Back to Work
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
