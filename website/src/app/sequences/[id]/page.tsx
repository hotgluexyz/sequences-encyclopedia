import Link from "next/link";
import { notFound } from "next/navigation";
import { getSequence } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function SequencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const sequence = await getSequence((await params).id);
  if (!sequence) notFound();

  return (
    <main>
      <Link href="/">All sequences</Link>
      <h1>{sequence.id}</h1>
      <h2>{sequence.name}</h2>
      <p>{sequence.terms.join(", ")}</p>
      <dl>
        <dt>Keywords</dt>
        <dd>{sequence.keywords ?? "None"}</dd>
        <dt>Offset</dt>
        <dd>{sequence.offset ?? "None"}</dd>
      </dl>
    </main>
  );
}
