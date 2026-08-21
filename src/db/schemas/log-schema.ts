import { type SQL, sql } from "drizzle-orm";
import {
  customType,
  index,
  pgTable,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";
import { MAX_LOG_CONTENT_LEN, MAX_LOG_TITLE_LEN } from "@/config/constants";
import { MAX_SLUG_LENGTH, SLUG_SUFFIX_LENGTH } from "@/lib/slug";
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
    slug: varchar("slug", { length: MAX_SLUG_LENGTH }).notNull().unique(),
    authorId: text("author_id")
      .notNull()
      .references(() => user.id),
    title: text("title").notNull(),
    content: text("content").notNull(),
    coverImgUrl: text("image_url"),
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
  (table) => [
    index("log_search_idx").using("gin", table.searchVector),
    index("log_author_id_idx").on(table.authorId),
    index("log_created_at_idx").on(table.createdAt),
  ],
);

export type Log = typeof logTable.$inferSelect;

export const createLogFormSchema = createInsertSchema(logTable, {
  title: z
    .string({ error: "Title is required." })
    .trim()
    .min(1, { error: "Please enter a title." })
    .max(MAX_LOG_TITLE_LEN, {
      error: `Title cannot exceed ${MAX_LOG_TITLE_LEN} characters.`,
    }),
  content: z
    .string({ error: "Content is required." })
    .trim()
    .min(1, { error: "Log content cannot be empty." })
    .max(MAX_LOG_CONTENT_LEN, {
      error: `Content cannot exceed ${MAX_LOG_CONTENT_LEN} characters.`,
    }),
  coverImgUrl: z
    .url({ error: "Please enter a valid image URL." })
    .trim()
    .optional(),
}).pick({
  title: true,
  content: true,
  coverImgUrl: true,
});

export type CreateLogFormValues = z.infer<typeof createLogFormSchema>;

const slugRegex = new RegExp(
  `^[a-z0-9]+(?:-[a-z0-9]+)*-[a-z0-9]{${SLUG_SUFFIX_LENGTH}}$`,
);

export const logSlugSchema = z
  .string()
  .max(MAX_SLUG_LENGTH, {
    error: `Slug cannot exceed ${MAX_SLUG_LENGTH} characters.`,
  })
  .regex(slugRegex, "Invalid log slug format.");

export const editLogFormSchema = createLogFormSchema.partial().extend({
  coverImgUrl: z
    .url({ error: "Please enter a valid image URL." })
    .trim()
    .optional()
    .nullable(),
});

export type EditLogFormValues = z.infer<typeof editLogFormSchema>;

export const updateLogSchema = editLogFormSchema.extend({
  slug: logSlugSchema,
});

export type UpdateLogValues = z.infer<typeof updateLogSchema>;
