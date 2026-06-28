import type { InferSelectModel } from "drizzle-orm";
import type { user } from "@/db/schemas/auth-schema";

export type DbUser = InferSelectModel<typeof user>;
