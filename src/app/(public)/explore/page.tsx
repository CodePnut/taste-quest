"use client";

import { useEffect, useMemo, useState } from "react";
import { SearchResponse, type SearchResponseType } from "@/lib/zod";
import { RecipeList } from "@/components/RecipeList";

// Simple FilterRail: only a query input and a calories max for Phase 1
export default function ExplorePage() {
  const [q, setQ] = useState("chicken");
  const [calMax, setCalMax] = useState<number | undefined>(500);
  const [data, setData] = useState<SearchResponseType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ q });
    if (calMax) params.set("calories", `0-${calMax}`);
    fetch(`/api/recipes?${params.toString()}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((j) => {
        const parsed = SearchResponse.safeParse(j);
        if (parsed.success) {
          setData(parsed.data);
          setError(null);
        } else {
          setError("Invalid data");
        }
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError("Failed to load");
      });
    return () => controller.abort();
  }, [q, calMax]);

  const items = useMemo(() => {
    return (
      data?.hits.map((h) => ({
        id: h.recipe.uri,
        title: h.recipe.label,
        imageUrl: h.recipe.images?.REGULAR?.url,
        caloriesPerServing: h.recipe.calories && h.recipe.yield ? h.recipe.calories / h.recipe.yield : undefined,
        time: h.recipe.totalTime,
        healthLabels: h.recipe.healthLabels ?? [],
      })) ?? []
    );
  }, [data]);

  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <label htmlFor="q" className="block text-sm font-medium">Search</label>
          <input id="q" value={q} onChange={(e) => setQ(e.target.value)} className="mt-1 w-full rounded-lg border bg-background p-2" placeholder="e.g., chicken" />
        </div>
        <div>
          <label htmlFor="cal" className="block text-sm font-medium">Max kcal/recipe</label>
          <input id="cal" type="number" min={0} step={50} value={calMax ?? 0} onChange={(e) => setCalMax(Number(e.target.value) || undefined)} className="mt-1 w-40 rounded-lg border bg-background p-2" />
        </div>
      </div>

      {error && <p className="text-rose-600">{error}</p>}

      <RecipeList items={items} />
    </main>
  );
}


