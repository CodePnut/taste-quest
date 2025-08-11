# Phased Delivery Plan — TasteQuest

Repo: https://github.com/CodePnut/taste-quest.git

This plan follows a front‑end‑first approach using mocked APIs and shared contracts, then swaps to a real BFF and database in the back‑end phase. It is derived from the documents in `document/`.

## Phase 0 · Scaffold (completed)
- Next.js 15 (App Router) + TypeScript + Tailwind v4 + shadcn/ui
- Theming via `next-themes`; semantic tokens in `globals.css`
- Providers: React Query + ThemeProvider; `BackgroundLayer`
- Base UI: `RecipeCard`, `RecipeList`
- BFF starter: `GET /api/recipes` with Zod validation and 10‑min cache
- Tooling: ESLint + Prettier, Husky + lint-staged (tests currently on pre‑commit), Vitest sample test, GitHub Actions (typecheck, lint, test)

Open items
- Add Storybook with stories for `RecipeCard` and tokens
- Example fixtures for Edamam + MSW handlers

## Phase 1 · Front‑end (Explore + Detail) — UI with mocks
Objective: Ship Explore grid and Recipe Detail using MSW fixtures; no real API dependency.

Deliverables
- Pages: `/(public)/explore`, `/recipe/[id]`
- Components: `FilterRail`, empty/error/loading states, pagination/infinite scroll
- Accessibility: keyboardable controls, focus rings, WCAG AA chips
- Performance: Debounced search input, list virtualization if needed

Contracts
- Use shared Zod types (`Recipe`, `SearchResponse`) from `packages/contracts` (to be added)
- Mock via MSW: search results, recipe detail

Acceptance criteria
- Explore shows image, label, kcal/serving, top 3 health chips
- Filters update results and URL; pagination works
- Detail shows REGULAR image, kcal/serving, diet/health chips, time; tabs render gracefully

## Phase 2 · Front‑end (Quest Builder + Cook Mode) — UI with mocks
Objective: Prototype wizard and cook stepper; keep data mocked.

Deliverables
- Pages: `/quest/builder`, `/cook/[questId]`
- Components: `Stepper`, `Timer`, `AchievementModal`, `Toast`, `Tabs`
- State: wizard state (Zustand/Context), cook progress persistence
- Background pulses on save/xp events; respects reduced motion

Contracts
- Zod `Quest` schema; deterministic mock LLM outputs (valid + edge cases)

Acceptance criteria
- Quest generate preview renders valid JSON
- Cook stepper + timers; state persists on refresh
- End screen awards XP visually (mocked)

## Phase 3 · Front‑end (Profile + Polish) — UI with mocks
Objective: Profile and global polish while still on mocks.

Deliverables
- Page: `/profile` (streak calendar, XP bar, achievements, saved grid)
- SEO metadata per route; dark‑mode polish; analytics events
- Accessibility audits (axe), contrast checks for chips and badges

Acceptance criteria
- Favourites list loads from mock quickly (<500ms)
- SEO tags present; no major Axe violations in dev

## Phase 4 · Back‑end (BFF + DB + Auth + LLM)
Objective: Replace mocks with real endpoints. Persist and compute progression.

Stack
- Next.js API routes (Node runtime), Prisma + PostgreSQL (Neon/Railway), NextAuth (Google + email), Cloudinary (signed uploads)

Deliverables
- Endpoints: `/api/recipes`, `/api/recipes/[id]`, `/api/quests`, `/api/cook/complete`, `/api/favourites`, `/api/profile`
- Prisma schema: `User`, `Quest`, `Favourite`, `UserAchievement`; XP/level/streak logic
- Caching: 10‑min search, 60‑min detail; rate limits (search 30/min, LLM 5/min)
- LLM integration with strict Zod parsing and retries
- Security: server‑side keys, MIME validation, optional moderation

Acceptance criteria
- Contracts match FE Zod types; integration tests pass with Prisma test DB
- Auth flows (Google/email) succeed and preserve returnTo
- XP/streak updates atomically; unique favourites enforced

## Phase 5 · Integration + Stabilisation
Objective: Swap MSW to real API, run E2E, and meet perf/accessibility budgets.

Deliverables
- Remove MSW in production builds; keep for tests
- Playwright E2E: Explore → Detail; Quest → Cook → Complete; Save; Auth; Background toggle
- Lighthouse budgets: LCP < 2.5s, CLS < 0.1, INP < 200ms; p95 search < 1.5s (cached)
- Observability: Sentry, structured logs, key metrics

Acceptance criteria
- All CI checks green; E2E reliable in CI
- Budgets met on preview/production

## Working agreements
- Front‑end first using mocks for speed and UX polish
- Shared contracts in `packages/contracts` to avoid drift
- Feature flags: `battles`, `substitutions`, `tasteProfile`, `ocrPantry`, `bg.webgl`
- Definition of Done: code + tests merged, CI green, stories/docs updated

## Milestones (1‑week sprints)
- Sprint 0: Scaffold (done)
- Sprint 1: Explore + Detail (UI, mocks)
- Sprint 2: Quest + Cook (UI, mocks)
- Sprint 3: Profile + Polish (UI, mocks)
- Sprint 4: Back‑end (BFF + DB + Auth + LLM)
- Sprint 5: Integration + Release (E2E + budgets)

