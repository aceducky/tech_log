import { index, pgTable, text, uuid, vector } from "drizzle-orm/pg-core";
import { logTable } from "./log-schema";

export const logEmbeddingsTable = pgTable(
  "log_embeddings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    logId: uuid("log_id").references(() => logTable.id, {
      onDelete: "cascade",
    }),
    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: 1024 }).notNull(),
  },
  (t) => [
    index("embeddingIndex").using("hnsw", t.embedding.op("vector_cosine_ops")),
  ],
);
