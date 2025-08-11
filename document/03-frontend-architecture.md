# 03 · Front‑end Architecture — TasteQuest
Companion to MCP. Structure, routing, state, error handling, and components.

## 1) Project Structure
```
/app
  /(public)/explore
  /recipe/[id]
  /quest/builder
  /cook/[questId]
  /profile
/components
  RecipeCard.tsx
  FilterRail.tsx
  BackgroundLayer.tsx
  Stepper.tsx
  ProgressRing.tsx
/lib
  api.ts        // fetch wrappers + query keys
  edamam.ts     // BFF helpers
  zod.ts        // schemas
  telemetry.ts  // logging helpers
  store.ts      // Zustand or Context for UI state
/styles
/tests
/packages/contracts // shared Zod (FE/BE)
```

## 2) Data & State
- **TanStack Query** for server data (`recipes`, `recipe`, `profile`, `quest`).
- Local state (Zustand/Context): filters, background toggle, cook step state.
- Optimistic updates for favourites and XP award.

## 3) Routing & UX
- App Router with nested layouts.
- SEO via route `metadata` (canonical, Open Graph from recipe image).
- Error boundaries + `not-found.tsx`.
- Suspense + skeletons for Explore grid and Recipe detail.

## 4) Interactive Background
- `BackgroundLayer` wraps `<body>` content.
- Listens to custom events: `xp:awarded`, `quest:completed`, `favourite:added` → pulse.
- DOM/SVG default; Canvas/WebGL behind flags.

## 5) Theming
- Tailwind config for colours/radii/shadows.
- Dark mode via `class`. Ensure chip contrast in both themes.

## 6) Accessibility & Internationalisation
- Keyboard focus managed for steppers/drawers.
- Announce timer start/stop via `aria-live` polite.
- Easy to localise microcopy; centralise strings.

## 7) Conventions
- Components colocate styles; one responsibility each.
- Props typed strictly; avoid `any`.
- Prefer composition over prop drilling.
