// Ensure this route is always rendered on demand and never pre-rendered at build
export const dynamic = "force-dynamic";
import { Recipe } from "@/lib/zod";

// Minimal detail page: fetch by Edamam recipe URI (encoded)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function RecipeDetail(props: any) {
  const { id } = (props.params ?? {}) as { id: string };
  // For Phase 1, reuse search endpoint and pick the first matching item (mock friendly)
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/recipes?q=chicken`, { cache: "no-store" });
  const json = await res.json();
  const hit = Array.isArray(json.hits)
    ? json.hits.find((h: unknown) => {
        if (!(h && typeof h === "object" && "recipe" in h)) return false;
        const recipe = (h as Record<string, unknown>).recipe;
        return !!(recipe && typeof recipe === "object" && (recipe as Record<string, unknown>).uri === id);
      })
    : null;
  const parsed = Recipe.safeParse(hit?.recipe);

  if (!parsed.success) {
    return (
      <main className="container mx-auto px-4 py-8">
        <p>Recipe not found.</p>
      </main>
    );
  }

  const r = parsed.data;
  return (
    <main className="container mx-auto px-4 py-8 space-y-4">
      <h1 className="text-2xl font-bold">{r.label}</h1>
      {r.images?.REGULAR?.url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={r.images.REGULAR.url} alt="" className="w-full max-w-2xl rounded-xl" />
      )}
      <div className="text-muted-foreground">
        {typeof r.totalTime === "number" && <span>{r.totalTime} min</span>}
      </div>
      <ul className="list-disc pl-4">
        {(r.ingredientLines ?? []).map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      {r.url && (
        <a href={r.url} target="_blank" className="text-accent underline">View source</a>
      )}
    </main>
  );
}


