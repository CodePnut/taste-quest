# 04 · Back‑end Architecture & API — TasteQuest
Companion to MCP. Endpoints, caching, rate limits, DB choices, and security.

## 1) Runtime & Storage
- **Next.js API routes** (BFF) on **Node.js** runtime.
- **PostgreSQL** with **Prisma**.
- **Cloudinary** for user photos (signed uploads).

## 2) Endpoints (BFF)
### `GET /api/recipes`
- **Query**: `q`, `calories`, `diet`, `health`[], `time`, `mealType`, `cuisineType`, `from`, `size`
- **Behaviour**: Proxies Edamam v2; validates with Zod; caches 10 min by query hash; debounced client input.
- **Response**: `{ hits: [{ recipe: Recipe }], _links?: { next?: { href } } }`

### `GET /api/recipes/[id]`
- **Param**: encoded Edamam `uri`
- **Cache**: 60 min

### `POST /api/quests`
- **Body**: `{ pantry: string[], preferences: { diet?: string, allergies?: string[], time?: number, calories?: number }, cuisine?: string, sourceRecipeUri?: string }`
- **Action**: Call LLM → validate `Quest` (Zod) → persist.

### `POST /api/cook/complete`
- **Body**: `{ questId: string, photoUrl?: string }`
- **Action**: Award XP; update streak; grant achievements.

### `POST /api/favourites`
- **Body**: `{ uri: string, op: 'add' | 'remove' }`
- **Idempotent**: ensure unique per user

### `GET /api/profile`
- **Response**: `{ xp, level, streak, achievements, favouritesCount }`

## 3) Caching & Rate Limits
- SWR-style cache: 10 min recipes; 60 min recipe detail.
- Rate limit: 30 req/min per user for search; 5/min for LLM endpoints.

## 4) Prisma Schema (summary)
- See MCP §4.3 for full schema (`User`, `Quest`, `Favourite`, `UserAchievement`).

## 5) Security
- Zod validate all inputs; sanitise output.
- Store keys server-side; never expose Edamam keys.
- Cloudinary signed uploads only; validate MIME.
- Optional moderation hook for public photos.

## 6) OpenAPI
- Generate minimal spec for internal endpoints; publish types via `/packages/contracts`.
