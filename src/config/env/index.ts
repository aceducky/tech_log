import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    DATABASE_URL: z.url(),
    UPLOADTHING_TOKEN: z.string().min(1),
    BETTER_AUTH_URL: z.url(),
    RESEND_API_KEY: z.string().min(1),
    DEMO_RECEIVER_EMAIL: z.email(),
    CHAT_MODEL: z.string().min(1),
    AI_API_KEY: z.string().min(1),
    EMBEDDING_MODEL: z.string().min(1),
    CF_ACCOUNT_ID: z.string().min(1),
    CRON_SECRET: z.string().min(1),
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
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    DEMO_RECEIVER_EMAIL: process.env.DEMO_RECEIVER_EMAIL,
    NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    CF_ACCOUNT_ID: process.env.CF_ACCOUNT_ID,
    AI_API_KEY: process.env.AI_API_KEY,
    CHAT_MODEL: process.env.CHAT_MODEL,
    EMBEDDING_MODEL: process.env.EMBEDDING_MODEL,
    CRON_SECRET: process.env.CRON_SECRET,
  },
});
