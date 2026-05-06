import Link from "next/link";
import { getSequences } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function Home() {
  const sequences = (await getSequences()) ?? [];

  return (
    <main>
      <h1>Sequences Encyclopedia</h1>
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
