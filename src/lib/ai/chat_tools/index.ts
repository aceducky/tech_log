import { tool } from "ai";
import {
  fullTextSearchToolFn,
  fullTextSearchToolInputSchema,
  getLogBySlugToolFn,
  getLogBySlugToolInputSchema,
  ragToolFn,
  ragToolInputSchema,
} from "../tool-handlers";

export const getLogBySlugTool = tool({
  description:
    "Fetch a TechLog log by slug to get its full markdown content. Use when you need details, quotes, or to answer specifics about a log. If the user says 'this log' or 'current log' and a current log is in context, use that slug.",
  inputSchema: getLogBySlugToolInputSchema,
  execute: getLogBySlugToolFn,
});

export const fullTextSearchTool = tool({
  description:
    "Full-text search across TechLog logs for exact terms like error messages, package names, or title words. Returns matching logs as metadata (title, slug, author, dates) without content. Use to list or check what exists; fetch full content with getLogBySlugTool only if needed.",
  inputSchema: fullTextSearchToolInputSchema,
  execute: fullTextSearchToolFn,
});

export const ragTool = tool({
  description:
    "Semantic search across TechLog logs for conceptual or natural-language questions. Rephrase the query concisely if helpful. Returns relevant snippets with slug, title, and author. Use to answer from snippets or to discover relevant logs.",
  inputSchema: ragToolInputSchema,
  execute: ragToolFn,
});
