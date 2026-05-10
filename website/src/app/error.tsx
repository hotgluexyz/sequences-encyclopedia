"use client";

import SearchInput from "@/app/components/SearchInput";

export default function Error() {
  return (
    <main>
      <h1>Sequences Encyclopedia</h1>
      <SearchInput initialValue={""} />
      <p>Failed to load sequences.</p>
    </main>
  );
}
