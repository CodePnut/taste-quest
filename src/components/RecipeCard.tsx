import Image from "next/image";

// Minimal recipe card used in Explore grid and lists.
// Shows image, title, kcal/serving, and up to 3 health labels.
type Props = {
  title: string;
  imageUrl?: string;
  caloriesPerServing?: number;
  time?: number;
  healthLabels?: string[];
};

export function RecipeCard({ title, imageUrl, caloriesPerServing, time, healthLabels = [] }: Props) {
  return (
    <article className="rounded-2xl border bg-card text-card-foreground shadow-sm overflow-hidden">
      {/* 4:3 image area; if no image yet, render a pulsing placeholder */}
      <div className="aspect-[4/3] w-full bg-muted">
        {imageUrl ? (
          <Image src={imageUrl} alt="" width={640} height={480} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full animate-pulse" />
        )}
      </div>
      <div className="p-4 space-y-3">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug">{title}</h3>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {typeof caloriesPerServing === "number" && <span>{Math.round(caloriesPerServing)} kcal/serving</span>}
          {typeof time === "number" && <span>· {time} min</span>}
        </div>
        {healthLabels.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {healthLabels.slice(0, 3).map((h) => (
              <span key={h} className="text-xs rounded-full bg-accent text-accent-foreground px-2 py-1">
                {h}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}


