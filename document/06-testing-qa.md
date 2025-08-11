# 06 · Testing & QA Plan — TasteQuest
Companion to MCP. Test matrix, fixtures, perf budgets, and accessibility checks.

## 1) Pyramid
- **Unit (Vitest/Jest)**: XP/level maths, streak logic, Zod schemas, reducers, background intensity reducer.
- **Integration (Node)**: API routes (recipes, quests) with mocked Edamam/LLM; Prisma test DB.
- **E2E (Playwright)**: Explore → Detail; Quest → Cook → Complete; Save; Background toggle; Auth happy path.

## 2) Fixtures & Mocks
- **Edamam**: record fixtures for common queries (e.g., empty, big list).
- **LLM**: deterministic template with edge cases (missing steps, too many steps, too high calories) to exercise validation.

## 3) QA Checklist (MVP)
- Explore grid shows image + kcal/serving + chips.
- Filters affect query string and results; pagination works.
- Recipe detail renders REGULAR image or SMALL fallback.
- Quest generation returns valid JSON (Zod) and persists to DB.
- Cook Mode timers continue when tab is visible; state persists on refresh.
- XP/level/streak update atomically.
- Background toggle persists; honours reduced motion.

## 4) Performance & Vitals
- Lighthouse budgets: LCP < 2.5s, CLS < 0.1, INP < 200ms.
- p95 recipe search < 1.5s (cached).
- Background CPU ≤ 3% laptops; auto‑downgrade on mobile.

## 5) Accessibility
- Axe checks; keyboard traps; labelled controls.
- Contrast audits for chips/badges in dark & light modes.
