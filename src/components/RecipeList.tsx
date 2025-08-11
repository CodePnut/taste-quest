import { RecipeCard } from "./RecipeCard";

type Item = {
  id: string;
  title: string;
  imageUrl?: string;
  caloriesPerServing?: number;
  time?: number;
  healthLabels?: string[];
};

export function RecipeList({ items }: { items: Item[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((r) => (
        <RecipeCard
          key={r.id}
          title={r.title}
          imageUrl={r.imageUrl}
          caloriesPerServing={r.caloriesPerServing}
          time={r.time}
          healthLabels={r.healthLabels}
        />)
      )}
    </div>
  );
}


