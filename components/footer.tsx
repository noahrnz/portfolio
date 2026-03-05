export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full py-2 sm:py-3 z-50 pointer-events-none bg-white border-t border-foreground/10 sm:border-t-0">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-12 flex justify-between items-center">
        <p className="text-[10px] font-medium text-foreground/40 leading-relaxed tracking-wider uppercase whitespace-nowrap">
          Product Design Engineer
        </p>
        <div className="pointer-events-auto">
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
