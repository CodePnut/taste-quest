# Commenting and Docs Guide (Junior‑friendly)

Our goal is clarity. Use simple language and explain the intent ("why"), not just the code ("what").

## Principles
- Prefer short JSDoc blocks on exported functions and complex components.
- Add inline comments for non‑obvious lines: explain what it does and why it is needed.
- Avoid restating code. Only comment when it adds context or background.
- Keep comments in sync with code; update or remove when behavior changes.

## Examples

### JSDoc for an exported function
```ts
/**
 * Fetch a JSON route and throw for non‑2xx status.
 * Why: centralise error handling so callers stay simple.
 */
export async function fetchJson<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}
```

### Inline comments for tricky UI code
```tsx
// Respect reduced motion for accessibility
const media = window.matchMedia('(prefers-reduced-motion: reduce)');
```

## Where to comment
- API routes: top‑level JSDoc describing responsibilities and validation.
- Components: brief header comment stating purpose and key props.
- Business logic: document formulas and edge cases.
- Config/workflows: why we chose this approach (e.g., Corepack for pnpm).

## What to avoid
- Redundant comments (e.g., `let x = 1 // set x to one`).
- Long essays; keep it crisp and actionable.

## Tooling
- Use ESLint/Prettier; keep comments wrapped reasonably (<100 cols).
- Storybook (Phase 1+) for live component docs.

