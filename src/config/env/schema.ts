import z from "zod";

export const envSchema = z.object({
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
  DATABASE_URL: z.url(),
  UPLOADTHING_TOKEN: z.string().min(1),
  BETTER_AUTH_URL: z.url(),
  NEXT_PUBLIC_BETTER_AUTH_URL: z.url(),
});
