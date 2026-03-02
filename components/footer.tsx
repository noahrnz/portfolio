export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full px-4 sm:px-12 py-5 sm:py-10 z-40 pointer-events-none">
      <div className="mx-auto max-w-[1400px] flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-start sm:items-end">
        <div className="max-w-xs">
          <p className="text-[10px] font-medium text-foreground/40 leading-relaxed tracking-wider uppercase">
            Product Design Engineer <br />
            Based in San Francisco, CA.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 sm:gap-8 pointer-events-auto">
          <a
            className="text-[10px] font-medium tracking-widest uppercase text-foreground hover:text-foreground/40 transition-colors py-2 -my-2 min-h-[44px] inline-flex items-center"
            href="/Noah-Ahrens-Resume-2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume
          </a>
          <a
            className="text-[10px] font-medium tracking-widest uppercase text-foreground hover:text-foreground/40 transition-colors py-2 -my-2 min-h-[44px] inline-flex items-center"
            href="https://linkedin.com/in/noahahrens"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            className="text-[10px] font-medium tracking-widest uppercase text-foreground hover:text-foreground/40 transition-colors py-2 -my-2 min-h-[44px] inline-flex items-center"
            href="mailto:noahsahrens@gmail.com"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}
