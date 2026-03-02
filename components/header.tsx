import Link from "next/link"

export function Header({ backgroundColor }: { backgroundColor?: string }) {
  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 backdrop-blur-md transition-colors duration-300 ${!backgroundColor ? "bg-background/90" : ""}`}
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <nav className="mx-auto max-w-[1400px] px-4 sm:px-12 h-14 sm:h-20 flex items-center justify-between">
        <div>
          <Link
            href="/"
            className="text-xs font-medium tracking-[0.2em] uppercase text-foreground"
          >
            Noah Ahrens
          </Link>
        </div>
        <div className="flex items-center gap-6 sm:gap-10">
          <Link
            href="/"
            className="text-xs font-medium tracking-[0.2em] uppercase text-foreground hover:opacity-50 transition-opacity py-3 -my-3 min-h-[44px] inline-flex items-center"
          >
            Work
          </Link>
          <Link
            href="/about"
            className="text-xs font-medium tracking-[0.2em] uppercase text-foreground hover:opacity-50 transition-opacity py-3 -my-3 min-h-[44px] inline-flex items-center"
          >
            About
          </Link>
        </div>
      </nav>
    </header>
  )
}
