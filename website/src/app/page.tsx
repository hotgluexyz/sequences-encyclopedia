import Link from "next/link";
import { getSequences } from "@/lib/api";
import SearchInput from "@/app/components/SearchInput";

export const dynamic = "force-dynamic";

type SearchPage = {
  searchParams: Promise<{ q?: string }>;
}

export default async function Home({searchParams}: SearchPage) {
  let query: string | null = (await searchParams)?.q;
  const sequences = (await getSequences(query)) ?? [];

  return (
    <main>
      <h1>Sequences Encyclopedia</h1>
      <SearchInput initialValue={query ?? ""} />
      <ul>
        {sequences.map((sequence) => (
          <li key={sequence.id}>
            <Link href={`/sequences/${sequence.id}`}>{sequence.id}</Link>
            <span>{sequence.name}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
