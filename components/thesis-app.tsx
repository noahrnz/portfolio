"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Lora } from "next/font/google"

const lora = Lora({ subsets: ["latin"], variable: "--font-thesis" })

const CATEGORIES = ["Climate", "AI", "Design", "Surfing"] as const

const PROMPTS = [
  "What's your take on this? Do you agree with the author?",
  "How does this connect to something you've experienced or read elsewhere?",
  "What would you want to ask the author if you could?",
  "What's one thing this piece gets right, and one thing it might be missing?",
]

type Article = {
  headline: string
  source: string
  description: string
  url: string
} | null

export function ThesisApp() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [category, setCategory] = useState<string>("")
  const [article, setArticle] = useState<Article>(null)
  const [articleLoading, setArticleLoading] = useState(false)
  const [promptIndex, setPromptIndex] = useState(0)
  const [writing, setWriting] = useState("")
  const [copied, setCopied] = useState(false)

  const fetchArticle = useCallback(async (cat: string) => {
    setArticleLoading(true)
    try {
      const res = await fetch(`/api/thesis/article?category=${encodeURIComponent(cat)}`)
      const data = await res.json()
      if (data.headline) {
        setArticle({
          headline: data.headline,
          source: data.source ?? "Unknown",
          description: data.description ?? "",
          url: data.url ?? "",
        })
      } else {
        setArticle({
          headline: "No article found",
          source: "",
          description: data.error ?? "Try another category or regenerate.",
          url: "",
        })
      }
    } catch {
      setArticle({
        headline: "Something went wrong",
        source: "",
        description: "Please try again.",
        url: "",
      })
    } finally {
      setArticleLoading(false)
    }
  }, [])

  const goToArticle = () => {
    if (category) {
      fetchArticle(category)
      setStep(2)
    }
  }

  const regenerateArticle = () => {
    if (category) fetchArticle(category)
  }

  const cyclePrompt = () => {
    setPromptIndex((i) => (i + 1) % PROMPTS.length)
  }

  const copyToClipboard = async () => {
    if (!writing.trim()) return
    await navigator.clipboard.writeText(writing)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={`${lora.variable} ${lora.className} min-h-screen bg-[#faf8f5] text-[#3d3935] antialiased`}
    >
      <div className="mx-auto max-w-[400px] min-h-screen flex flex-col px-6 py-12">
        <Link
          href="/"
          className="text-[11px] uppercase tracking-[0.2em] text-[#8a8580] mb-12 hover:text-[#3d3935] transition-colors"
        >
          ← Back
        </Link>

        <header className="mb-16">
          <h1 className="text-2xl font-medium tracking-tight text-[#2d2a27]">Thesis</h1>
          <p className="mt-2 text-sm text-[#8a8580]">Your daily take on the world.</p>
        </header>

        {/* Step 1: Category */}
        {step === 1 && (
          <div className="flex-1">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#8a8580] mb-6">
              Pick a topic
            </p>
            <div className="flex flex-wrap gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm transition-colors ${
                    category === cat
                      ? "bg-[#3d3935] text-[#faf8f5]"
                      : "bg-[#ebe8e4] text-[#3d3935] hover:bg-[#e0ddd8]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="mt-16">
              <button
                type="button"
                onClick={goToArticle}
                disabled={!category}
                className="w-full py-3.5 text-sm uppercase tracking-[0.15em] border border-[#3d3935] text-[#3d3935] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#3d3935] hover:text-[#faf8f5] transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Article */}
        {step === 2 && (
          <div className="flex-1">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-[11px] uppercase tracking-[0.2em] text-[#8a8580] mb-8 hover:text-[#3d3935]"
            >
              ← Change category
            </button>
            {articleLoading ? (
              <p className="text-[#8a8580]">Loading article…</p>
            ) : article ? (
              <>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#8a8580] mb-4">
                  {article.source}
                </p>
                <h2 className="text-xl font-medium leading-snug text-[#2d2a27] mb-4">
                  {article.headline}
                </h2>
                {article.description && (
                  <p className="text-sm text-[#6b6560] leading-relaxed mb-6">
                    {article.description}
                  </p>
                )}
                {article.url && (
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#3d3935] underline underline-offset-2 hover:no-underline"
                  >
                    Read full article
                  </a>
                )}
                <div className="mt-10 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={regenerateArticle}
                    disabled={articleLoading}
                    className="w-full py-3 text-sm text-[#8a8580] border border-[#c9c5c0] hover:border-[#3d3935] hover:text-[#3d3935] transition-colors disabled:opacity-50"
                  >
                    Regenerate article
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-full py-3.5 text-sm uppercase tracking-[0.15em] border border-[#3d3935] text-[#3d3935] hover:bg-[#3d3935] hover:text-[#faf8f5] transition-colors"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : null}
          </div>
        )}

        {/* Step 3: Prompt */}
        {step === 3 && (
          <div className="flex-1">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-[11px] uppercase tracking-[0.2em] text-[#8a8580] mb-8 hover:text-[#3d3935]"
            >
              ← Back to article
            </button>
            {article && (
              <>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#8a8580] mb-2">
                  {article.source}
                </p>
                <h2 className="text-lg font-medium text-[#2d2a27] mb-8">{article.headline}</h2>
                <div className="border-t border-[#e0ddd8] pt-8">
                  <p className="text-sm text-[#3d3935] italic mb-6">{PROMPTS[promptIndex]}</p>
                  <button
                    type="button"
                    onClick={cyclePrompt}
                    className="text-sm text-[#8a8580] hover:text-[#3d3935]"
                  >
                    Different prompt
                  </button>
                </div>
                <div className="mt-12">
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="w-full py-3.5 text-sm uppercase tracking-[0.15em] border border-[#3d3935] text-[#3d3935] hover:bg-[#3d3935] hover:text-[#faf8f5] transition-colors"
                  >
                    Write your take
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 4: Write */}
        {step === 4 && (
          <div className="flex-1 flex flex-col">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="text-[11px] uppercase tracking-[0.2em] text-[#8a8580] mb-8 hover:text-[#3d3935] self-start"
            >
              ← Back
            </button>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#8a8580] mb-4">
              Your take
            </p>
            <textarea
              value={writing}
              onChange={(e) => setWriting(e.target.value)}
              placeholder="Write your response…"
              rows={12}
              className="w-full resize-none border border-[#c9c5c0] bg-transparent px-0 py-4 text-sm text-[#3d3935] placeholder:text-[#a8a39d] focus:outline-none focus:border-[#3d3935] transition-colors"
            />
            <div className="mt-8 pt-8 border-t border-[#e0ddd8]">
              <button
                type="button"
                onClick={copyToClipboard}
                disabled={!writing.trim()}
                className="w-full py-3.5 text-sm uppercase tracking-[0.15em] border border-[#3d3935] text-[#3d3935] hover:bg-[#3d3935] hover:text-[#faf8f5] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
