# Portfolio site: best practices

A short guide for keeping this personal portfolio fast, responsive, and easy to maintain. (Useful as context for AI/Cursor when suggesting changes.)

---

## Loading & performance

### Do
- **Use Next.js `<Image>`** for all photos and graphics — it lazy-loads, resizes, and serves modern formats (WebP/AVIF) automatically. Use it everywhere images are shown.
- **Keep above-the-fold content light** — minimal large images or heavy scripts in the first screen so the site feels instant.
- **Prefer static content** — the site is mostly static; avoid loading big JSON/data files or many external APIs unless needed.
- **Use `priority` on the first image** — for the first image users see, add `priority` to `<Image>` so it loads immediately.

### Avoid
- **Huge unoptimized images** — don’t use raw 4000×3000 PNGs in `<img>`; use `<Image>` and reasonable sizes (e.g. 1200–1600px wide for hero images).
- **Too many fonts** — stick to one or two families.
- **Heavy third-party scripts** — analytics (e.g. Vercel Analytics) are fine; avoid lots of tracking or embeds that block rendering.

---

## Responsiveness

### Do
- **Design mobile-first** — when adding a new section, consider narrow screens and use Tailwind breakpoints (`sm:`, `md:`, `lg:`).
- **Test on real devices or Chrome DevTools** — use device toolbar and resize; tap through links and hover states.
- **Use relative units and flex/grid** — prefer `max-w-...`, `%`, `rem`, or Tailwind spacing over fixed `px` for layout.
- **Touch-friendly targets** — links and buttons at least ~44px tall on mobile.

### Avoid
- **Fixed widths that break on small screens** — prefer `max-w-...` and `w-full` over `w-[800px]` without `max-w-full`.
- **Tiny text on mobile** — keep footer and body text readable on small screens.
- **Hover-only interactions** — ensure important info or actions work on tap/focus too.

---

## Deployments (Vercel)

### Do
- **Push to `main` for production** — Vercel deploys from `main`; each push creates a new deployment.
- **Check the deployment after a push** — confirm new deployment is “Ready” and set as Production if using a custom domain.
- **Keep env vars in Vercel** — Project → Settings → Environment Variables for any API keys or secrets.
- **Leave Root Directory blank** — the app lives at repo root.

### Avoid
- **Force-pushing to `main`** unless necessary — can break Vercel builds.
- **Ignoring failed builds** — read build logs and fix the reported error.
- **Setting Root Directory** unless the app is in a subfolder.

---

## Images & GIFs

### Do
- **Use Next.js `<Image>`** — place files in `public/` (e.g. `public/images/photo.jpg`), reference as `/images/photo.jpg`, and use `<Image>` with `width` and `height` (or fill).
- **Optimize GIFs** — use a tool like ezgif.com or export smaller; prefer short, small-dimension GIFs (e.g. under 2MB, 600–800px wide).
- **Consider video instead of GIF** — for longer motion, use `<video autoplay loop muted playsInline>` with MP4/WebM; often smaller and better quality.
- **Add `alt` text** — always set descriptive `alt` on images for accessibility and SEO.

### Avoid
- **Raw `<img>` for portfolio images** — use `<Image>` for optimization and lazy loading.
- **Very large GIFs (5MB+)** — compress or shorten.
- **Loading many large images at once** — rely on lazy loading or load more on scroll/click.

---

## Quick checklist before going live

- [ ] All images use `<Image>` with sensible `width`/`height` and `alt`.
- [ ] Site is usable on narrow viewport (no horizontal scroll, readable text, tappable links).
- [ ] Contact / Resume / About links and email are correct.
- [ ] Push to `main` and confirm latest Vercel deployment is “Ready” and Production.
- [ ] Open live URL in incognito or another device to confirm latest version.
