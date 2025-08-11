import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export async function fetchJson<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}


