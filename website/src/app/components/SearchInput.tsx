"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type initialParams = {
  initialValue: string;
};

function SearchInput({ initialValue }: initialParams) {
  let [query, setQuery] = useState<string>(initialValue);
  let [debouncedQuery, setDebouncedQuery] = useState<string>(initialValue);
  let router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    router.replace(`?q=${encodeURIComponent(debouncedQuery)}`);
  }, [debouncedQuery]);

  return (
    <input
      className={"search-input"}
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

export default SearchInput;
