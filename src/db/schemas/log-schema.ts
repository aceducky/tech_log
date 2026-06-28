import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";
import { MAX_LOG_CONTENT_LEN, MAX_LOG_TITLE_LEN } from "@/config/constants";
import { timestamps } from "../utils/timestamps";
import { user } from "./auth-schema";

export const logTable = pgTable("log", {
  id: uuid("id").defaultRandom().primaryKey(),
  authorId: text("author_id")
    .notNull()
    .references(() => user.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  coverImgUrl: text("image_url"),
  count: integer("count"),
  ...timestamps,
});

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
