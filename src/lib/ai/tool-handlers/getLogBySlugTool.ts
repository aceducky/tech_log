import { z } from "zod";
import { getLogBySlug } from "@/lib/dal/logs_dal";

export const getLogBySlugToolInputSchema = z.object({
  slug: z
    .string()
    .describe(
      "exact log slug, from search results or current viewing context when available",
    ),
});

export async function getLogBySlugToolFn({ slug }: { slug: string }) {
  const getLogRes = await getLogBySlug(slug);
  if (getLogRes.error) {
    return `Error: ${getLogRes.message ?? "Log not found"}`;
  }
  const log = getLogRes.data;
  const filteredData = {
    content: log.content,
    title: log.title,
    createdAt: log.createdAt,
    updatedAt: log.updatedAt,
    authorName: log.authorName,
    authorUsername: log.authorUsername,
    pageviews: log.pageViews,
  };
  return JSON.stringify(filteredData);
}
