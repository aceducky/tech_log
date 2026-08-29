import { z } from "zod";
import { findRelevantContent } from "../embedding";

export const ragToolInputSchema = z.object({
  query: z
    .string()
    .trim()
    .min(1)
    .describe("concise semantic query or topic to search for"),
});

export async function ragToolFn({ query }: { query: string }) {
  const res = await findRelevantContent(query);
  if (res.error) {
    return `Error searching logs: ${res.message}`;
  }
  if (res.data.length === 0) {
    return "No relevant logs found for this query.";
  }
  return JSON.stringify({ query, results: res.data });
}
