import { NextResponse } from "next/server"

// Topic-specific search queries so articles stay on-theme
const TOPIC_QUERIES: Record<string, string> = {
  Climate: "climate change OR renewable energy OR sustainability",
  AI: "artificial intelligence OR machine learning OR AI technology",
  Design: "product design OR UX design OR design thinking",
  Surfing: "surfing OR surf culture OR ocean waves",
}
// Fallback: NewsAPI top-headlines category
const HEADLINES_CATEGORY: Record<string, string> = {
  Climate: "science",
  AI: "technology",
  Design: "general",
  Surfing: "sports",
}

function pickArticle(articles: Array<{ title?: string; url?: string; description?: string; source?: { name?: string } }>) {
  const valid = articles.filter(
    (a) => a?.title && a?.url && !String(a.title).includes("[Removed]")
  )
  const article = valid[Math.floor(Math.random() * valid.length)] ?? valid[0]
  if (!article) return null
  return {
    headline: article.title ?? "",
    source: article.source?.name ?? "Unknown",
    description: article.description ?? "",
    url: article.url ?? "",
  }
}

export async function GET(request: Request) {
  const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: "NewsAPI key not configured", headline: null, source: null, description: null, url: null },
      { status: 503 }
    )
  }
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category") ?? "AI"
  const searchQuery = TOPIC_QUERIES[category] ?? category
  const headlinesCategory = HEADLINES_CATEGORY[category] ?? "general"

  try {
    // 1) Prefer topic-specific search (everything endpoint) so articles match your themes
    const everythingUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&language=en&sortBy=publishedAt&pageSize=15&apiKey=${apiKey}`
    const everythingRes = await fetch(everythingUrl, { next: { revalidate: 0 } })
    const everythingData = await everythingRes.json()

    if (everythingData.status === "error") {
      const msg = everythingData.message ?? everythingData.code ?? "NewsAPI error"
      return NextResponse.json(
        { error: msg, headline: null, source: null, description: null, url: null },
        { status: 200 }
      )
    }

    if (everythingData.status === "ok" && Array.isArray(everythingData.articles) && everythingData.articles.length > 0) {
      const article = pickArticle(everythingData.articles)
      if (article) {
        return NextResponse.json(article)
      }
    }

    // 2) Fallback: top-headlines by category (broader but reliable)
    const headlinesUrl = `https://newsapi.org/v2/top-headlines?country=us&category=${headlinesCategory}&pageSize=15&apiKey=${apiKey}`
    const headlinesRes = await fetch(headlinesUrl, { next: { revalidate: 0 } })
    const headlinesData = await headlinesRes.json()

    if (headlinesData.status === "ok" && Array.isArray(headlinesData.articles) && headlinesData.articles.length > 0) {
      const article = pickArticle(headlinesData.articles)
      if (article) {
        return NextResponse.json(article)
      }
    }

    return NextResponse.json(
      { error: "No articles found. Try another category or check your API key at newsapi.org.", headline: null, source: null, description: null, url: null },
      { status: 200 }
    )
  } catch (e) {
    console.error("Thesis article fetch error:", e)
    return NextResponse.json(
      { error: "Failed to fetch article", headline: null, source: null, description: null, url: null },
      { status: 500 }
    )
  }
}
