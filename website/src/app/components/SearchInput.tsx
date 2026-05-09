"use client"
import {useEffect, useState} from "react";
import {router} from "next/client";
import {useRouter} from "next/navigation";

type initialParams = {
	initialValue: string;
}

function SearchInput({initialValue}: initialParams) {
	let [query, setQuery] = useState<string>(initialValue);
	let router = useRouter();

	useEffect(() => {
		router.replace(`?q=${encodeURIComponent(query)}`)
	}, [query])
	return (
		<input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
	);
}

export default SearchInput;