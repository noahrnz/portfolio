export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full px-12 py-10 z-50 pointer-events-none">
      <div className="mx-auto max-w-[1400px] flex justify-between items-end">
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
            href="mailto:hello@noahahrens.com"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}
