"use server";
import { getSequences } from "@/lib/api";

export async function fetchSequences(q: string | null, page: number) {
	return getSequences(q, page);
}