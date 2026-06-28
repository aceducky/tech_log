import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "@/config/env/index";
import * as authSchema from "./schemas/auth-schema";
import * as logSchema from "./schemas/log-schema";

config({ path: ".env.local" });

const schema = {
  ...authSchema,
  ...logSchema,
};

export const db = drizzle(neon(env.DATABASE_URL), { schema });
