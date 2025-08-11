import { NextRequest } from "next/server";
import { z } from "zod";

// Shared schemas (Sprint 0 minimal inline version)
const Image = z.object({ url: z.string().url(), width: z.number().optional(), height: z.number().optional() });
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

const SearchResponse = z.object({
  hits: z.array(z.object({ recipe: Recipe })),
  _links: z.object({ next: z.object({ href: z.string().url() }).optional() }).optional(),
});

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

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const params = Object.fromEntries(url.searchParams.entries());
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

  try {
    const res = await fetch(edamamUrl.toString(), { next: { revalidate: 600 } });
    if (!res.ok) {
      return Response.json({ error: "Upstream error" }, { status: 502 });
    }
    const json = await res.json();
    const parsed = SearchResponse.safeParse(json);
    if (!parsed.success) {
      return Response.json({ error: "Invalid upstream format" }, { status: 502 });
    }
    return Response.json(parsed.data, { status: 200 });
  } catch {
    return Response.json({ error: "Network error" }, { status: 504 });
  }
}


