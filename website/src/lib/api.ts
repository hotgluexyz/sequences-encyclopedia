import "server-only";

export type Sequence = {
  id: string;
  number: number;
  name: string;
  data: string;
  terms: string[];
  keywords: string | null;
  offset: string | null;
};

export type SequencesResponse = { sequences: Sequence[]; hasMore: boolean };

const API_URL = process.env.API_URL ?? "http://localhost:5001";

async function get<T>(path: string) {
  const response = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!response.ok) return null;
  return (await response.json()) as T;
}

export async function getSequences(q: string | null, page: number = 1) {
  return get<SequencesResponse>(
    `/sequences${`?q=${encodeURIComponent(q ?? "")}&page=${page}`}`,
  );
}

export function getSequence(id: string) {
  return get<Sequence>(`/sequences/${encodeURIComponent(id)}`);
}
