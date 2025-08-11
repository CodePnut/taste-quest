# TasteQuest (Healthy & Yummy Edition) — MCP

> **Purpose**: A gamified healthy recipe discovery app focused on low‑calorie, delicious meals. This Maker/Control Plan is the single source of truth for **UI/UX**, **Front‑end**, **Back‑end**, **Testing & Error Handling**, and **Agile delivery**. Built for the stack: **Next.js + TypeScript + Node.js + Tailwind CSS + Shadcn/UI** with **Framer Motion**, **TanStack Query**, **Prisma (PostgreSQL)**, **NextAuth**, **Cloudinary**, **Recharts**, and **Zod**.

---

## 0. Product Overview
- **One‑liner**: “Turn your pantry into healthy quests under 500 kcal.”
- **Primary users**: Health‑conscious home cooks; beginners to intermediate.
- **Core value**: Fast discovery of **healthy** recipes with images + a fun quest mechanic that drives engagement and habit formation.
- **North‑star metric**: 7‑day return rate and weekly quests completed.

### Objectives
1) Reduce decision fatigue for healthy meals.
2) Make cooking feel like a game (XP, streaks, achievements).
3) Provide clear nutrition and reliable filters (kcal, diet, health labels).

### Non‑goals (MVP)
- Grocery delivery, complex meal‑planning calendars, full macro tracking beyond per‑recipe.

---

## 1. UI/UX Specification

### 1.1 Design Principles
- **Healthy aesthetic**: light, airy; wellness palette (emerald, mint, cream, peach). Dark mode supported.
- **Zero‑friction**: fast perceived performance (skeleton loading, cache, prefetch).
- **Delightful micro‑interactions**: subtle motion (Framer Motion), confetti on XP, progress rings.
- **Accessible**: WCAG AA colour contrast; keyboard navigation; ARIA on interactive components.
- **Engaging, optional interactive background**: tasteful, low‑contrast motion that subtly celebrates healthy living (see §3.6). Must respect **prefers‑reduced‑motion**, pause on blur, and keep CPU/GPU usage minimal.

### 1.2 Information Architecture
- **Public**: Home/Explore, Recipe Detail (public), Auth.
- **Authed**: Quest Builder, Cook Mode, Profile (Progress, Achievements, Saved), Settings.
- **(MVP+)**: Battles (Lobby, Room, Results).

### 1.3 Key Screens (MVP)
1. **Home / Explore**
   - Header: logo, search bar (q), health toggle (≤500 kcal default), theme switch, sign‑in.
   - Left filter rail: calories slider, diet (balanced/high‑protein/low‑fat/low‑carb), health labels (gluten‑free, alcohol‑free, sugar‑conscious…), time (0–20/30/45), meal type, cuisine type.
   - Results grid: **RecipeCard** (image, label, kcal/serving, top 3 health chips). Infinite scroll or “Load more”.
   - Empty/No results: friendly illustration + tips to broaden filters.

2. **Recipe Detail**
   - Hero: REGULAR image, label, kcal/serving, diet/health chips, total time.
   - Tabs: Overview (ingredients, source link), Nutrition (per‑serving calories/macros), Substitutions (allergy‑aware AI), Reviews (local only, optional).
   - CTA bar: Save, Start Quest, Start Cook Mode.

3. **Quest Builder (Wizard)**
   - Step 1: Pantry selector (chips; free text add; recent history).
   - Step 2: Preferences (diet, allergies, time, calories ceiling).
   - Step 3: Goal & Theme (e.g., Mediterranean ≤20 min) → **Generate Quest** (LLM). Live preview of XP/difficulty.

4. **Cook Mode**
   - Stepper with timers; large legible steps; “Coach Tips” drawer; substitution panel; checklist interactions (persist progress).
   - Finish screen: photo upload (Cloudinary), XP award animation, share link, save to favourites.

5. **Profile / Progress**
   - Streak calendar, XP bar, level, achievements, saved recipes grid. Simple weekly calories chart.

### 1.4 Components (Shadcn + Tailwind)
- `RecipeCard`, `FilterRail`, `SearchBar`, `Chip`, `Badge`, `Tabs`, `Stepper`, `Timer`, `ProgressRing`, `AchievementModal`, `Toast`, `Skeleton`, `EmptyState`, `ErrorState`.
- Background system: `BackgroundLayer` (layout wrapper), `HealthParticles` (Canvas/WebGL or DOM), `HealthPulse` (subtle radial gradient pulse), `BackgroundToggle` (header control), `ReduceMotionGate` (disable animations when requested).

### 1.5 Brand & Tokens
- **Palette**: `emerald-500`, `emerald-600`, mint/teal accents, neutrals; dark mode variants.
- **Radius**: `rounded-2xl` for cards, `rounded-lg` for inputs.
- **Motion**: entry transitions ≤250ms; easing `ease-out`.
- **Typography**: clean sans; bold for headings; 1.125rem base.

---

## 2. MVP Feature Set & Acceptance Criteria

### 2.1 Search & Filter (Edamam)
- Users can search by keyword and apply calories/time/diet/health filters.
- **AC**: Results include image, label, per‑serving kcal, top 3 health labels. Pagination via `from/to` or `_links.next`.

### 2.2 Recipe Detail
- **AC**: Show REGULAR image; kcal/serving; ingredient lines; link to source; time; chips. 404/empty states handled.

### 2.3 Quest Generation (LLM)
- Input: pantry, preferences (diet/allergies), time, calories cap.
- Output: JSON quest (title, theme, required/optional ingredients, 6–8 steps, difficulty 1–5, XP, tips).
- **AC**: JSON schema validated; stored per user; “Start Cook Mode” available.

### 2.4 Cook Mode
- **AC**: Stepper UI, timers, step completion persists; end screen awards XP; optional photo upload.

### 2.5 Progression
- **AC**: XP increments; level auto‑computed; streak updates on day with completed quest; achievements for first cook, 3‑day streak.

### 2.6 Auth & Save
- **AC**: Sign in with Google/email; save favourites; view saved list in Profile.

### 2.7 Resilience
- **AC**: API rate‑limit message; offline/timeout states with retry; telemetry logs.

---

## 3. Front‑end Specification

### 3.1 Stack
- **Next.js 14+** (App Router), **TypeScript**, **Tailwind CSS**, **Shadcn/UI**, **Framer Motion**.
- **State/query**: TanStack Query for data fetching; Zustand/Context for lightweight app state.
- **Charts**: Recharts for weekly macros/progress.

### 3.2 API Integration (Client → BFF)
- Client never calls Edamam directly; use a Next.js API route (BFF) to inject creds and cache.
- Caching: `stale-while-revalidate` with 5–15 min TTL by query string; debounce search input.

### 3.3 Contracts (Zod)
Define schemas to validate Edamam and Quest outputs before rendering.
```ts
const Image = z.object({ url: z.string().url(), width: z.number().optional(), height: z.number().optional() });
export const Recipe = z.object({
  uri: z.string(), label: z.string(),
  images: z.object({ THUMBNAIL: Image.optional(), SMALL: Image.optional(), REGULAR: Image.optional() }),
  url: z.string().url(), yield: z.number().optional(), calories: z.number().optional(), totalTime: z.number().optional(),
  dietLabels: z.array(z.string()).optional(), healthLabels: z.array(z.string()).optional(), ingredientLines: z.array(z.string())
});
export const SearchResponse = z.object({ hits: z.array(z.object({ recipe: Recipe })), _links: z.object({ next: z.object({ href: z.string().url() }).optional() }).optional() });

export const Quest = z.object({ id: z.string().optional(), userId: z.string().optional(), title: z.string(), theme: z.string(),
  required: z.array(z.string()), optional: z.array(z.string()).optional(), steps: z.array(z.string()).min(4).max(10),
  difficulty: z.number().min(1).max(5), xp: z.number().min(10), tips: z.array(z.string()).optional(), sourceRecipeUri: z.string().optional() });
```

### 3.4 Key Pages
- `/(public)/explore`
- `/recipe/[id]` (decode Edamam URI)
- `/quest/builder`
- `/cook/[questId]`
- `/profile`

### 3.5 UX States
- **Loading**: skeleton cards, animated shimmer.
- **Empty**: helpful suggestions to relax filters.
- **Error**: descriptive messages; retry button; bug reporting link.
- **Optimistic UI**: saving favourites and awarding XP.

### 3.6 Interactive Background System (Engagement & Motivation)
**Purpose**: Reinforce the healthy‑living theme with subtle, performant visuals that never distract from content.

**Design motifs**
- *HealthParticles*: slow‑moving abstract shapes inspired by fruit/veg silhouettes (leaf, droplet, seed) at 5–10% opacity.
- *HealthPulse*: gentle radial gradient pulse that brightens slightly when users complete actions (save, finish step, earn XP).
- *Seasonal skins*: optional presets (Spring Greens, Citrus Glow, Berry Sunset). Tied to achievements or streaks.

**Behaviour**
- Pauses on tab blur / when `prefers-reduced-motion` is true.
- Intensity scales with engagement: small pulse on save, larger pulse on quest completion.
- Toggle in header: `Background: On | Off` remembered per user (DB or localStorage).

**Implementation options**
- **DOM/CSS** (default): layered gradients + SVG shapes animated with Framer Motion (lowest overhead).
- **Canvas**: lightweight 2D canvas for particles with capped FPS (30) and object count (≤60) on desktop; reduce by 50% on mobile.
- **WebGL** (stretch): Pixi.js/Three.js shader for ultra‑smooth motion; only when device GPU score is high.

**Performance & accessibility**
- Target ≤2–3% main‑thread CPU on laptops; memory stable.
- Respect `prefers-reduced-motion`; provide manual toggle; ensure contrast ratios remain AA.
- Test on mid‑tier mobile; dynamically degrade effects via `matchMedia`.

**Interfaces**
- `BackgroundLayer` props: `{ variant?: "dom" | "canvas"; theme?: "spring" | "citrus" | "berry"; intensity?: 0|1|2; enabled?: boolean }`.
- Events to listen for: `quest:completed`, `xp:awarded`, `favourite:added` → trigger pulses.

**Telemetry**
- Log enable/disable rate; measure frame time and drop to lower mode if p95 > 18ms.

---

## 4. Back‑end Specification

### 4.1 Stack
- **Next.js API routes** (BFF) + **Node.js** runtime.
- **PostgreSQL** with **Prisma ORM**.
- **Auth**: NextAuth (Google, email magic link).
- **Storage**: Cloudinary for user photos (signed uploads).
- **LLM**: Provider‑agnostic; JSON‑mode; guardrails via Zod.

### 4.2 Services & Endpoints
- `GET /api/recipes` → proxies Edamam with filters; caches; validates `SearchResponse`.
- `GET /api/recipes/[id]` → fetch by Edamam `uri`.
- `POST /api/quests` → body: pantry, prefs; calls LLM; validates `Quest`; persists.
- `POST /api/cook/complete` → body: questId, photoUrl? → awards XP, updates streaks/achievements.
- `POST /api/favourites` → add/remove recipe by `uri`.
- `GET /api/profile` → progress summary (xp, level, streak, achievements, saved count).

### 4.3 Data Model (Prisma sketch)
```prisma
model User { id String @id @default(cuid())
  email String @unique
  name String?
  image String?
  xp Int @default(0)
  level Int @default(1)
  streak Int @default(0)
  lastCookedAt DateTime?
  createdAt DateTime @default(now())
  quests Quest[]
  favourites Favourite[]
  achievements UserAchievement[]
}

model Quest { id String @id @default(cuid())
  userId String
  user User @relation(fields: [userId], references: [id])
  title String
  theme String
  required Json
  optional Json?
  steps Json
  difficulty Int
  xp Int
  sourceRecipeUri String?
  createdAt DateTime @default(now())
}

model Favourite { id String @id @default(cuid())
  userId String
  user User @relation(fields: [userId], references: [id])
  recipeUri String
  createdAt DateTime @default(now())
  @@unique([userId, recipeUri])
}

model UserAchievement { id String @id @default(cuid())
  userId String
  user User @relation(fields: [userId], references: [id])
  code String // e.g., FIRST_COOK, STREAK_3
  awardedAt DateTime @default(now())
  @@unique([userId, code])
}
```

### 4.4 Business Logic
- **XP & Level**: `level = floor(1 + sqrt(xp/100))` (simple growth). Award quest.xp on completion.
- **Streak**: if cooked today and `lastCookedAt` < today, increment; if missed a day, reset.
- **Achievements**: rules table evaluated on completion (e.g., first cook, 3‑day streak, under‑20‑min meal).

### 4.5 Edamam Integration
- Required params: `type=public`, `app_id`, `app_key`, `q`, `from`, `to`.
- Healthy defaults: `calories=0-500`, selectable `diet`, multiple `health`, `time`.
- Image consumption: prefer `images.REGULAR.url` then `SMALL`.

### 4.6 LLM Prompts (JSON‑strict)
**System**: *You are a culinary quest designer. Always return valid JSON that matches the provided schema. Keep steps concise (≤8), healthy, and under the calorie cap.*

**User Template**:
```json
{
  "pantry": ["chicken breast", "spinach", "lemon"],
  "preferences": { "diet": "high-protein", "allergies": ["peanut"], "time": 20, "calories": 450 },
  "cuisine": "mediterranean"
}
```
**Output (schema `Quest`)**: `{ "title": "…", "theme": "…", "required": [..], "optional": [..], "steps": [..], "difficulty": 2, "xp": 40, "tips": [..], "sourceRecipeUri": "…" }`

**Validation**: Run Zod parse; on failure, retry with explicit JSON repair or fallback template.

### 4.7 Security & Privacy
- Store API keys server‑side only.
- Validate all inputs (Zod) and enforce per‑user rate limits.
- Sanitize/transform user‑generated content (photo filenames, captions) and run image moderation if opened to public.
- Protect PII; allow account deletion/export (MVP: export JSON on request).

---

## 5. Testing Strategy & Error Handling

### 5.1 Testing Pyramid
- **Unit (Vitest/Jest)**: utils (XP/level math, streak logic), Zod schemas, reducers, background intensity reducer.
- **Integration (Node)**: API routes with mocked Edamam/LLM; DB interactions via Prisma test DB.
- **E2E (Playwright)**: critical flows — search & filter; open recipe; build quest; cook & complete; save favourite; auth; **background toggle persists & honours prefers‑reduced‑motion**.

### 5.2 Test Cases (examples)
- Search returns cards with image + kcal; respects `calories` filter.
- Quest generation returns valid JSON; rejects missing `steps`.
- Cook Mode persists step state on refresh.
- XP/Level updates correctly; streak increments once/day.
- Favourites unique per user; duplicates rejected (409).
- **Background**: toggle stored; disables animations when `prefers-reduced-motion`; CPU/FPS budget assertions on CI via Lighthouse.

### 5.3 Error Handling Policy
- **Categories**:
  - *User errors* (bad filters): show empty state + suggestions.
  - *Network/API errors* (Edamam down, timeouts): toast + retry CTA; cached last success if available.
  - *Validation errors* (Zod): log with context ID; show generic error; auto‑retry LLM once.
  - *Auth errors*: redirect to sign‑in; keep returnTo.
- **Surfacing**:
  - Use a unified `Result<T>` pattern in API; client toasts + inline messages.
  - Global error boundary routes for 500/404.

### 5.4 Observability
- **Logging**: request IDs, user IDs, route, duration, outcome (success/fail), error code.
- **Metrics**: recipe search latency, LLM latency, success rate, quest creation rate, cook completions, daily active cooks, **background enable rate**.
- **Tracing**: wrap Edamam + LLM calls; add correlation IDs from client.

---

## 6. Agile Delivery Plan

### 6.1 Cadence & Artefacts
- **Sprints**: 1‑week iterations.
- **Backlog**: user stories with INVEST; each has AC + test notes.
- **Definition of Ready (DoR)**: scoped, AC written, UX stub ready, API contract drafted.
- **Definition of Done (DoD)**: code + tests merged, E2E green on CI, Storybook updated (key components), telemetry added, docs updated.

### 6.2 Roles
- You (dev/PM), Agent (code gen/boilerplate), Reviewer (you again, context aware).

### 6.3 Sprint 0 (Scaffold)
- Next.js + TS + Tailwind + Shadcn setup; theme; auth; basic layout; logging.
- API route for `/api/recipes`; Zod schemas; first RecipeCard + skeleton.

### 6.4 Sprint 1 (Search & Detail)
- Filter rail → Edamam proxy → cards grid; pagination.
- Recipe detail page with kcal/serving + chips.
- Tests: unit for Zod, integration for `/api/recipes`, E2E for search.

### 6.5 Sprint 2 (Quests & Cook Mode)
- Quest Builder wizard + LLM call; Cook Mode stepper + timers.
- Progression: XP/level/streaks; achievements (first cook, 3‑day streak).
- Tests: quest schema, cook flow E2E.

### 6.6 Sprint 3 (Profile & Polish)
- Profile dashboard (streak calendar, XP bar, saved grid), favourites.
- Error/empty/loading states; SEO; dark‑mode polish; analytics & logs.

### 6.7 Stretch (MVP+)
- Battles (Socket room + voting), substitutions (allergy‑aware), taste profiling, pantry OCR.

### 6.8 Release Criteria (MVP)
- Core flows pass E2E in CI; p95 search < 1.5s (cached); no P0/P1 bugs; accessibility quick audit passed.

---

## 7. Acceptance Criteria (Condensed Matrix)

| Feature | Must‑have AC |
|---|---|
| Search | Keyword + filters hit Edamam via BFF; cards show image, kcal/serving, chips; pagination works; empty state helpful. |
| Recipe Detail | REGULAR image visible; kcal/serving computed; source link; time shown; tabs render gracefully if data missing. |
| Quest | Valid JSON schema; saved to DB; Start Cook Mode navigates correctly. |
| Cook Mode | Stepper, timers, completion persists; XP awarded; optional photo upload stored. |
| Progression | XP/level/streak/achievements update atomically; profile summary accurate. |
| Auth/Save | Google/email login; favourite add/remove idempotent; list loads <500ms cached. |
| Resilience | API/network errors surfaced with retry; logs include correlation IDs; rate‑limited endpoints return friendly message. |
| Background | Toggle persists; honours `prefers-reduced-motion`; CPU/FPS budget respected; visually non‑obtrusive. |

---

## 8. Risks & Mitigations
- **Edamam rate limits/costs**: cache aggressively; debounce search; prefetch on filter change.
- **LLM JSON drift**: enforce schema + retries; fallback template.
- **Nutrition accuracy disputes**: present data as provided by source; include disclaimer.
- **Scope creep**: MVP line guarded by AC and release criteria.

---

## 9. Implementation Notes (Agent‑friendly)
- Create `packages/contracts` for Zod schemas shared FE/BE.
- Use feature flags for Battles & Substitutions.
- Use environment‑based config module; never hardcode keys.
- Add Storybook for `RecipeCard`, `FilterRail`, `Stepper`, `Timer`.
- CI: lint, type‑check, unit, integration, Playwright E2E (Chromium), deploy preview.

**End of MCP**
