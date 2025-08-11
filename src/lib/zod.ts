// Shared Zod contracts used on the client to parse API responses
import { z } from "zod";

export const Image = z.object({ url: z.string().url(), width: z.number().optional(), height: z.number().optional() });

export const Recipe = z.object({
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

export const SearchResponse = z.object({
  hits: z.array(z.object({ recipe: Recipe })),
  _links: z.object({ next: z.object({ href: z.string().url() }).optional() }).optional(),
});

export type RecipeType = z.infer<typeof Recipe>;
export type SearchResponseType = z.infer<typeof SearchResponse>;


