import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { z } from "zod";

config({ path: ".env.local" });

const dbEnv = z
  .object({
    DATABASE_URL: z.url(),
  })
  .parse(process.env);

export default defineConfig({
  schema: "./src/db/schemas/*.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: dbEnv.DATABASE_URL,
  },
});
