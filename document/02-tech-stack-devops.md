# 02 · Tech Stack & DevOps — TasteQuest
Companion to MCP. Defines versions, envs, deployment, CI, and ops.

## 1) Stack (locked)
- **Next.js 14+ (App Router)**, **TypeScript**
- **Tailwind CSS**, **Shadcn/UI**, **Framer Motion**
- **TanStack Query** (client caching/retries)
- **Prisma** (ORM) with **PostgreSQL**
- **NextAuth** (Google + email magic link)
- **Cloudinary** (signed uploads)
- **Recharts**, **Zod**
- Observability: **Sentry**, **Vercel Analytics**
- Hosting: **Vercel** (web + API routes). DB: **Neon** or **Railway**

## 2) Environments & Secrets
`.env.local` (dev), project envs (Vercel):
- `EDAMAM_APP_ID`, `EDAMAM_APP_KEY`
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- `DATABASE_URL` (Postgres)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
> Keys are **server‑only**; Edamam is always called via the BFF.

## 3) Scripts
```json
"dev": "next dev",
"build": "next build",
"start": "next start",
"lint": "next lint",
"typecheck": "tsc --noEmit",
"test": "vitest run",
"test:e2e": "playwright test",
"migrate": "prisma migrate deploy"
```

## 4) Deployment
- **Vercel** previews per PR; production on `main` after CI green.
- **Postgres** (Neon/Railway): run `migrate` on deploy.
- **Cloudinary**: signed upload route; restrict unsigned uploads.

## 5) CI/CD
- Jobs: typecheck, lint, unit, integration, **Playwright E2E**, Lighthouse CI.
- Required checks: all green before merge.
- Artifacts: Playwright traces/videos, Lighthouse reports.

## 6) Observability & Logging
- Structured logs: request ID, user ID, route, duration, outcome, error code.
- Sentry: capture server/client errors with release tags.
- Metrics: search latency, LLM latency, quest creation, cook completions, background enable rate.

## 7) Performance Budgets
- p95 recipe search (cached): **< 1.5s**
- Explore TTI: **< 2.5s** (Fast 3G emulation)
- Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms
- Background CPU: ≤ 2–3% laptops

## 8) Feature Flags
- `battles`, `substitutions`, `tasteProfile`, `ocrPantry`, `bg.webgl`

## 9) Local Dev
- `pnpm i && pnpm dev`
- Seed a .env with test keys; use Prisma SQLite for quick local if desired.
