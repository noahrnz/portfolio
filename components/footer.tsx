export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full px-6 sm:px-12 py-6 sm:py-10 z-50 pointer-events-none">
      <div className="mx-auto max-w-[1400px] flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-start sm:items-end">
        <div className="max-w-xs">
          <p className="text-[10px] font-medium text-foreground/40 leading-relaxed tracking-wider uppercase">
            Product Design Engineer <br />
            Based in San Francisco, CA.
          </p>
        </div>
        <div className="flex gap-8 pointer-events-auto">
          <a
            className="text-[10px] font-medium tracking-widest uppercase text-foreground hover:text-foreground/40 transition-colors"
            href="https://noahahrens.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume
          </a>
          <a
            className="text-[10px] font-medium tracking-widest uppercase text-foreground hover:text-foreground/40 transition-colors"
            href="https://linkedin.com/in/noahahrens"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            className="text-[10px] font-medium tracking-widest uppercase text-foreground hover:text-foreground/40 transition-colors"
            href="mailto:noahsahrens@gmail.com"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}
