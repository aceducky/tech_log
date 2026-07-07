import { pgTable, primaryKey, uuid, varchar } from "drizzle-orm/pg-core";
import { logTable } from "./log-schema";

export const logViewsTable = pgTable(
  "log_views",
  {
    logId: uuid("log_id")
      .notNull()
      .references(() => logTable.id, {
        onDelete: "cascade",
      }),

    viewerKey: varchar("viewer_key", {
      length: 32, // length of better auth user id, the generated anonymous id will also be of same length
    }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.logId, table.viewerKey],
    }),
  ],
);
