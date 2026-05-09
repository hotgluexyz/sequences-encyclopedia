import { getSequences } from "@/lib/api";
import SearchInput from "@/app/components/SearchInput";
import SequenceList from "@/app/components/SequenceList";

export const dynamic = "force-dynamic";

type SearchPage = {
  searchParams: Promise<{ q?: string }>;
};

export default async function Home({ searchParams }: SearchPage) {
  const query: string | null = (await searchParams)?.q;
  const { sequences, hasMore } = (await getSequences(query)) ?? {
    sequences: [],
    hasMore: false,
  };

  return (
    <main>
      <h1>Sequences Encyclopedia</h1>
      <SearchInput initialValue={query ?? ""} />
      <SequenceList
        key={query}
        query={query ?? ""}
        initialItems={sequences}
        hasMore={hasMore}
      />
    </main>
  );
}
