import { type SQL, sql } from "drizzle-orm";
import {
  customType,
  index,
  integer,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";
import { MAX_LOG_CONTENT_LEN, MAX_LOG_TITLE_LEN } from "@/config/constants";
import { timestamps } from "../utils/timestamps";
import { user } from "./auth-schema";

const tsvector = customType<{ data: string }>({
  dataType() {
    return "tsvector";
  },
});

export const logTable = pgTable(
  "log",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    authorId: text("author_id")
      .notNull()
      .references(() => user.id),
    title: text("title").notNull(),
    content: text("content").notNull(),
    coverImgUrl: text("image_url"),
    pageViews: integer("page_views"),
    searchVector: tsvector("search_vector")
      .notNull()
      .generatedAlwaysAs(
        (): SQL =>
          sql`
              setweight(to_tsvector('english', ${logTable.title}), 'A')
              ||
              setweight(to_tsvector('english', ${logTable.content}), 'B')
            `,
      ),
    ...timestamps,
  },
  (table) => [index("log_search_idx").using("gin", table.searchVector)],
);

export type Log = typeof logTable.$inferSelect;

export const createLogFormSchema = createInsertSchema(logTable, {
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(MAX_LOG_TITLE_LEN, "Title is too long"),
  content: z
    .string()
    .trim()
    .min(1, "Content is required")
    .max(MAX_LOG_CONTENT_LEN, "Content is too long"),
  coverImgUrl: z.url("Invalid image URL").trim().optional(),
}).pick({
  title: true,
  content: true,
  coverImgUrl: true,
});

export type CreateLogFormValues = z.infer<typeof createLogFormSchema>;

export const logIdSchema = z.uuid("Invalid log id");

export const editLogFormSchema = createLogFormSchema.partial().extend({
  id: logIdSchema,
  coverImgUrl: z.url("Invalid image URL").trim().optional().nullable(),
});

export type EditLogFormValues = z.infer<typeof editLogFormSchema>;
