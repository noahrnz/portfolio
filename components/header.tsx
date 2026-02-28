import Link from "next/link"

export function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-background/90 backdrop-blur-md">
      <nav className="mx-auto max-w-[1400px] px-12 h-20 flex items-center justify-between">
        <div>
          <Link
            href="/"
            className="text-xs font-medium tracking-[0.2em] uppercase text-foreground"
          >
            Noah Ahrens
          </Link>
        </div>
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="text-xs font-medium tracking-[0.2em] uppercase text-foreground hover:opacity-50 transition-opacity"
          >
            Work
          </Link>
          <Link
            href="#"
            className="text-xs font-medium tracking-[0.2em] uppercase text-foreground hover:opacity-50 transition-opacity"
          >
            About
          </Link>
        </div>
      </nav>
    </header>
  )
}
