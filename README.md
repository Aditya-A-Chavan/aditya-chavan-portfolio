# Aditya Chavan — Portfolio

Next.js 16 (App Router, Cache Components), React 19, TypeScript, Tailwind CSS 4, GSAP and Lenis. Deployed on Vercel.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint
```

## Where things live

- `src/content/site.ts` — all home-page copy, projects, services, skills, certifications and contact options. Edit copy here.
- `src/content/case-studies/` — one file per case study (`/work/<slug>`).
- `src/components/home/` — home-page sections; `src/components/layout/` — top bar, menu, footer, boot screen, pinned button, smooth scroll; `src/components/terminal/` — the mini-terminal; `src/components/visuals/` — project diagrams; `src/components/ui/` — shared primitives.
- `src/lib/seo.ts` — metadata, Search Console verification; `src/components/seo/` — Google Analytics and JSON-LD.

## Contact form (EmailJS)

The form sends through EmailJS. Ids default to the existing account and can be overridden with `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`, `NEXT_PUBLIC_EMAILJS_SERVICE_ID` and `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`. The template must include: `from_name`, `from_email`, `message`, `to_name`, `work_types`, `timeline`, `budget`, `link`.
