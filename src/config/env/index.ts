import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    DATABASE_URL: z.url(),
    UPLOADTHING_TOKEN: z.string().min(1),
    BETTER_AUTH_URL: z.url(),
  },
  client: {
    NEXT_PUBLIC_BETTER_AUTH_URL: z.url(),
  },
  runtimeEnv: {
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  },
});
