import { z } from "zod";
import { searchLogsForAi } from "@/lib/dal/logs_dal";

export const fullTextSearchToolInputSchema = z.object({
  query: z
    .string()
    .trim()
    .min(1)
    .describe("Exact terms or keywords to search across all logs"),
});

export async function fullTextSearchToolFn({ query }: { query: string }) {
  const res = await searchLogsForAi(query);
  if (res.error) {
    return `Error searching logs: ${res.message}`;
  }

  if (res.data.logs.length === 0) {
    return "No matching logs found for this query.";
  }

  return JSON.stringify({
    query,
    totalResults: res.data.totalLogs,
    results: res.data.logs.map((log) => ({
      slug: log.slug,
      title: log.title,
      authorName: log.authorName,
      authorUsername: log.authorUsername,
      createdAt: log.createdAt,
      updatedAt: log.updatedAt,
    })),
  });
}
