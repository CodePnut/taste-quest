import { NextRequest } from "next/server";
import { z } from "zod";

/**
 * API: GET /api/recipes
 * Purpose: Act as a small Back‑end‑for‑Frontend (BFF) in front of Edamam.
 * - Validates incoming query params with Zod so we don't pass bad inputs to Edamam
 * - Attaches server‑side credentials so they never live in the browser
 * - Adds a small cache (revalidate: 600s) to reduce rate‑limit pressure and speed up UX
 */

// Shared schemas (Sprint 0 minimal inline version)
// Schema for a single image variant inside the Edamam response
const Image = z.object({ url: z.string().url(), width: z.number().optional(), height: z.number().optional() });
// Minimal subset of the Edamam Recipe used by our UI
const Recipe = z.object({
  uri: z.string(),
  label: z.string(),
  images: z.object({ THUMBNAIL: Image.optional(), SMALL: Image.optional(), REGULAR: Image.optional() }).partial(),
  url: z.string().url().optional(),
  yield: z.number().optional(),
  calories: z.number().optional(),
  totalTime: z.number().optional(),
  dietLabels: z.array(z.string()).optional(),
  healthLabels: z.array(z.string()).optional(),
  ingredientLines: z.array(z.string()).optional(),
});

// Shape of the Edamam search response we care about
const SearchResponse = z.object({
  hits: z.array(z.object({ recipe: Recipe })),
  _links: z.object({ next: z.object({ href: z.string().url() }).optional() }).optional(),
});

// Query params we accept from the client. Strings are used because URLSearchParams are strings.
const QuerySchema = z.object({
  q: z.string().default(""),
  calories: z.string().optional(),
  diet: z.string().optional(),
  health: z.array(z.string()).optional(),
  time: z.string().optional(),
  mealType: z.string().optional(),
  cuisineType: z.string().optional(),
  from: z.coerce.number().default(0),
  size: z.coerce.number().default(12),
});

/**
 * Handler for GET requests. Next.js uses the exported function name to route.
 * Steps:
 * 1) Read and validate query
 * 2) Build the Edamam URL with only allowed params
 * 3) Fetch with ISR cache (revalidate: 600s)
 * 4) Validate upstream JSON before returning to the client
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const params = Object.fromEntries(url.searchParams.entries());
  // Multiple health labels may be sent, e.g. &health=alcohol-free&health=gluten-free
  const health = url.searchParams.getAll("health");
  const parse = QuerySchema.safeParse({ ...params, health });
  if (!parse.success) {
    return Response.json({ error: "Invalid query" }, { status: 400 });
  }
  const { q, calories, diet, time, mealType, cuisineType, from, size } = parse.data;

  const appId = process.env.EDAMAM_APP_ID;
  const appKey = process.env.EDAMAM_APP_KEY;
  if (!appId || !appKey) {
    return Response.json({ error: "Server not configured" }, { status: 500 });
  }

  // Construct the upstream Edamam URL with only whitelisted parameters
  const edamamUrl = new URL("https://api.edamam.com/api/recipes/v2");
  edamamUrl.searchParams.set("type", "public");
  edamamUrl.searchParams.set("app_id", appId);
  edamamUrl.searchParams.set("app_key", appKey);
  edamamUrl.searchParams.set("q", q);
  edamamUrl.searchParams.set("from", String(from));
  edamamUrl.searchParams.set("to", String(from + size));
  if (calories) edamamUrl.searchParams.set("calories", calories);
  if (diet) edamamUrl.searchParams.set("diet", diet);
  if (time) edamamUrl.searchParams.set("time", time);
  if (mealType) edamamUrl.searchParams.set("mealType", mealType);
  if (cuisineType) edamamUrl.searchParams.set("cuisineType", cuisineType);
  health.forEach((h) => edamamUrl.searchParams.append("health", h));

  // Optional Active User tracking header (required for some Meal Planner plans)
  const headers: Record<string, string> = {};
  if (process.env.EDAMAM_USER_ID) headers["user_id"] = process.env.EDAMAM_USER_ID;

  try {
    // `next: { revalidate }` enables Next.js route caching on the server for 10 minutes
    const res = await fetch(edamamUrl.toString(), { next: { revalidate: 600 }, headers });
    if (res.ok) {
      const json = await res.json();
      const parsed = SearchResponse.safeParse(json);
      if (!parsed.success) {
        return Response.json({ error: "Invalid upstream format" }, { status: 502 });
      }
      return Response.json(parsed.data, { status: 200 });
    }

    // Fallback to v1 /search for accounts where v2 may not be enabled
    const v1 = new URL("https://api.edamam.com/search");
    v1.searchParams.set("app_id", appId);
    v1.searchParams.set("app_key", appKey);
    v1.searchParams.set("q", q);
    v1.searchParams.set("from", String(from));
    v1.searchParams.set("to", String(from + size));
    if (calories) v1.searchParams.set("calories", calories);
    if (diet) v1.searchParams.set("diet", diet);
    if (time) v1.searchParams.set("time", time);
    if (mealType) v1.searchParams.set("mealType", mealType);
    if (cuisineType) v1.searchParams.set("cuisineType", cuisineType);
    health.forEach((h) => v1.searchParams.append("health", h));

    const resV1 = await fetch(v1.toString(), { next: { revalidate: 600 }, headers });
    if (!resV1.ok) {
      return Response.json({ error: "Upstream error" }, { status: 502 });
    }
    const rawV1 = await resV1.json();

    // Normalize v1 shape to our v2-like SearchResponse
    const hits = Array.isArray(rawV1.hits)
      ? rawV1.hits.map((h: any) => {
          const r = h?.recipe ?? {};
          const imageUrl = r.image as string | undefined;
          return {
            recipe: {
              ...r,
              images: imageUrl ? { REGULAR: { url: imageUrl } } : {},
            },
          };
        })
      : [];

    const normalized = { hits };
    const parsedNormalized = SearchResponse.safeParse(normalized);
    if (!parsedNormalized.success) {
      return Response.json({ error: "Invalid upstream format" }, { status: 502 });
    }
    return Response.json(parsedNormalized.data, { status: 200 });
  } catch {
    return Response.json({ error: "Network error" }, { status: 504 });
  }
}


