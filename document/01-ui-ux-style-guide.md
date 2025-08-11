# 01 · UI/UX Style Guide — TasteQuest (Healthy & Yummy)
> Companion to the **Master MCP**. This guide defines visual language, components, motion, accessibility, and copy tone. The MCP remains the single source of truth for scope and acceptance criteria.

## 1) Brand Mood & Visual Direction
- **Mood/Brand**: Playful‑premium and professional. The app feels friendly and motivational without looking toy‑ish.
- **Healthy cues**: fresh produce shapes, soft gradients, light textures.
- **Imagery**: Editorial‑style dish photos; avoid over‑processed stock images.

### Typography
- **Font**: **Roboto** (Google). Keep it consistent across headings and body.
  - H1: 32–40 / 1.2, weight 700
  - H2: 24–28 / 1.25, weight 700
  - Body: 16–18 / 1.6, weight 400–500
  - UI labels & chips: 12–14, weight 500

### Colour System (Tailwind tokens)
Healthy‑forward, light greens with calm neutrals. Both options support dark mode.
- **Option A – Fresh Mint**
  - Primary: `emerald-500` / hover `emerald-600`
  - Accents: `lime-400`, `teal-400`
  - Neutrals: `slate-50`, `slate-100`, `slate-800`, `slate-900`
  - Feedback: success `green-500`, warning `amber-500`, error `rose-500`
- **Option B – Herb Garden**
  - Primary: `green-500` / hover `green-600`
  - Accents: `emerald-400`, `cyan-400`
  - Neutrals: `zinc-*` scale

> **Contrast**: All text/background combos must meet **WCAG AA**. Test chips, badges, and tinted surfaces explicitly.

## 2) Layout Patterns
- **Explore (Home)**: Sticky header with search; **left filter rail** on desktop; grid: 3 columns (340–380px cards) desktop, 2 columns tablet, 1 column mobile.
- **Recipe Detail**: Hero image; meta ribbon with kcal/serving, time, diet/health chips; tabs (Overview, Nutrition, Substitutions).
- **Quest Builder**: 3‑step wizard (Pantry → Preferences → Goal/Theme) with persistent summary rail (XP/difficulty).
- **Cook Mode**: Large stepper with timers; bottom action bar; “Coach Tips” expandable drawer.
- **Profile**: streak calendar, XP bar, achievements grid, saved recipes.

## 3) Interactive Background (engagement + motivation)
- **Style**: Subtle particles (leaf, droplet, seed, veggie silhouettes) at 5–10% opacity; soft gradient **pulse** on milestones.
- **Controls**: Header toggle **Background: On/Off**; remember per user; always respect `prefers-reduced-motion`.
- **Performance**: Target ≤2–3% CPU on laptops; auto‑downgrade density/FPS on mobile; disable when tab is not visible.
- **Skins**: *Spring Greens*, *Citrus Glow*, *Berry Sunset* — unlockable via streaks/achievements.

**Implementation tiers**
- Tier 1 (default): DOM/SVG + Framer Motion (low overhead).
- Tier 2: Canvas 2D particles (≤60 entities desktop, 30 mobile; 30 FPS cap).
- Tier 3 (flagged): WebGL via Pixi/Three with device capability gate.

## 4) Components (Shadcn + Tailwind)
### 4.1 RecipeCard (hero component)
- **Structure**: image (4:3), title (2‑line clamp), kcal/serving badge (top‑right), time icon, top 3 health chips, actions (Save, View, Start Quest).
- **Style**: `rounded-2xl`, soft shadow, thin border (`border-zinc-200/30`), dark glass surface in dark mode.
- **Motion**: hover lift (`-translate-y-0.5`), image zoom 1.03 on hover, micro‑confetti on Save, background pulse event on achievements.
- **Loading**: skeleton shimmer for image, title, and chips.

### 4.2 FilterRail
- Calories slider (0–800; default 0–500), Diet select, Health multi‑select chips, Time quick pills (≤20/30/45), Meal & Cuisine selects.
- Desktop sticky; mobile drawer with “Apply” button.

### 4.3 Steppers, Tabs, Chips, Badges
- Steppers: big touch targets; visible progress; keyboard accessible.
- Tabs: underline or pill style; maintain focus ring.
- Chips: rounded‑full, solid background; ensure text contrast ≥ 4.5:1 if small.

## 5) Motion Guidelines
- Entry/exit: 200–250ms, `ease-out`.
- Hover/focus: 100–120ms.
- Achievement modal: 300ms with slight overshoot.
- Always honour `prefers-reduced-motion` (disable nonessential motion).

## 6) Accessibility
- **Keyboard**: logical tab order; focus rings (`outline-emerald-500/70`) always visible.
- **ARIA**: labels on sliders/steppers; announce timer start/stop.
- **Colour**: ensure chip text contrast; test dark mode separately.
- **Forms**: descriptive error messages; inline validation.

## 7) Content & Tone
- Tagline: *“Healthy recipes, gamified.”*
- Microcopy: upbeat, concise (“Nice pick — +10 XP!”).
- Errors: calm + actionable (“No recipes match. Try relaxing calories or time.”).

## 8) Assets
- Icons: **lucide-react** set.
- Images: Use Edamam `images.REGULAR` when available; for uploads, **Cloudinary** with `f_auto,q_auto` and blur placeholders.
