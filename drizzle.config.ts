import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { envSchema } from "@/config/env/schema";

config({ path: ".env.local" });
const dbEnvSchema = envSchema.pick({ DATABASE_URL: true });
const dbEnv = dbEnvSchema.parse(process.env);
export default defineConfig({
  schema: "./src/db/schemas/*.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: dbEnv.DATABASE_URL,
  },
});
