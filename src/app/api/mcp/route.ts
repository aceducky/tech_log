import { createMcpHandler } from "mcp-handler";
import {
  fullTextSearchToolFn,
  fullTextSearchToolInputSchema,
  getLogBySlugToolFn,
  getLogBySlugToolInputSchema,
  ragToolFn,
  ragToolInputSchema,
} from "@/lib/ai/tool-handlers";

const handler = createMcpHandler((server) => {
  server.registerTool(
    "ragTool",
    {
      title: "RAG tool",
      description:
        "Semantic search across TechLog logs for conceptual or natural-language questions. Rephrase the query concisely if helpful. Returns relevant snippets with slug, title, and author. Use to answer from snippets or to discover relevant logs.",
      inputSchema: ragToolInputSchema,
    },
    async ({ query }) => {
      const res = await ragToolFn({ query });
      return {
        content: [{ type: "text", text: res }],
      };
    },
  );
  server.registerTool(
    "getLogBySlugTool",
    {
      title: "Get log by slug",
      description:
        "Fetch a TechLog log by slug to get its full markdown content. Use when you need details, quotes, or to answer specifics about a log.",
      inputSchema: getLogBySlugToolInputSchema,
    },
    async ({ slug }) => {
      const res = await getLogBySlugToolFn({ slug });
      return {
        content: [{ type: "text", text: res }],
      };
    },
  );
  server.registerTool(
    "fullTextSearchTool",
    {
      title: "Full text search tool",
      description:
        "Full-text search across TechLog logs for exact terms like error messages, package names, or title words. Returns matching logs as metadata (title, slug, author, dates) without content. Use to list or check what exists; fetch full content with getLogBySlugTool only if needed.",
      inputSchema: fullTextSearchToolInputSchema,
    },
    async ({ query }) => {
      const res = await fullTextSearchToolFn({ query });
      return {
        content: [{ type: "text", text: res }],
      };
    },
  );
});

export { handler as GET, handler as POST };
