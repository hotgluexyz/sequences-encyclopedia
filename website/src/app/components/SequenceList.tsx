"use client";

import { useState, useTransition } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { Sequence } from "@/lib/api";
import Link from "next/link";
import {fetchSequences} from "@/lib/actions";

type SequenceListParams = {
  query: string;
  initialItems: Sequence[];
  hasMore: boolean;
};

function SequenceList({ query, initialItems, hasMore }: SequenceListParams) {
  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(hasMore);
  const [isPending, startTransition] = useTransition();

  const [sentryRef] = useInfiniteScroll({
    loading: isPending,
    hasNextPage,
    onLoadMore: () => {

      startTransition(async () => {
        const nextPage = page + 1;
        const res = await fetchSequences(query, nextPage);
        if (!res) return;
        setItems((prev) => [...prev, ...res.sequences]);
        setPage(nextPage);
        setHasNextPage(res.hasMore);
      });
    },
    rootMargin: "0px 0px 400px 0px",
  });

  return (
    <>
      <ul>
        {items.map((sequence) => (
          <li key={sequence.id}>
            <Link href={`/sequences/${sequence.id}`}>{sequence.id}</Link>
            <span>{sequence.name}</span>
          </li>
        ))}
      </ul>
      {hasNextPage && <div ref={sentryRef}>Loading...</div>}
      {items.length === 0 && <p>No sequences found</p>}
    </>
  );
}
export default SequenceList;
