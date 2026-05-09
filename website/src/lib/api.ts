export type Sequence = {
  id: string;
  number: number;
  name: string;
  data: string;
  terms: string[];
  keywords: string | null;
  offset: string | null;
};

const API_URL = process.env.API_URL ?? "http://localhost:5001";

async function get<T>(path: string) {
  const response = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!response.ok) return null;
  return (await response.json()) as T;
}

export function getSequences(q: string | null) {
  return get<Sequence[]>(`/sequences${`?q=${encodeURIComponent(q ?? "")}` ?? ''}`);
}

export function getSequence(id: string) {
  return get<Sequence>(`/sequences/${encodeURIComponent(id)}`);
}
