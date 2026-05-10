"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type initialParams = {
  initialValue: string;
};

function SearchInput({ initialValue }: initialParams) {
  const [query, setQuery] = useState<string>(initialValue);
  const router = useRouter();

  useEffect(() => {
    if (query === initialValue) return;
    const timer = setTimeout(() => {
      router.replace(query ? `?q=${encodeURIComponent(query)}` : "/");
    }, 300);
    return () => clearTimeout(timer);
  }, [query, initialValue, router]);

  return (
    <input
      className="search-input"
      type="text"
      placeholder={"Search sequences..."}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

export default SearchInput;
