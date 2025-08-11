# 08 · Roadmap & Sprints — TasteQuest
Grounded in the MCP. 1‑week sprints assumed.

## Sprint 0 · Scaffold
- Next.js, Tailwind, Shadcn, theme, auth, layout
- `/api/recipes` BFF; Zod schemas; RecipeCard + skeleton; logging/metrics

## Sprint 1 · Search & Detail
- Filter rail → Edamam → cards grid + pagination
- Recipe detail (image, kcal/serving, chips)
- Tests: unit + integration + E2E (Explore)

## Sprint 2 · Quest & Cook
- Quest Builder (LLM) + schema validation
- Cook Mode (stepper + timers) + XP/Streaks
- Tests: quest schema, cook E2E

## Sprint 3 · Profile & Polish
- Profile (streak/XP/achievements/favourites)
- Error/empty/loading; SEO; dark‑mode polish; analytics

## Stretch Candidates
- Battles + live voting
- Substitutions (allergy‑aware)
- Taste profile (sentiment‑derived)
- Pantry OCR (vision)

## Release Criteria (MVP)
- Critical E2E green, no P0/P1
- p95 search < 1.5s (cached)
- Lighthouse budgets pass
- Accessibility quick audit OK
