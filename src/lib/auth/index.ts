import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { env } from "@/config/env/index";
import { db } from "@/db";
import * as schema from "../../db/schemas/auth-schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  baseURL: {
    allowedHosts: ["localhost:3000", "techloggers.vercel.app"],
    fallback: env.BETTER_AUTH_URL,
  },
  emailAndPassword: { enabled: false },
  user: {
    additionalFields: {
      username: {
        type: "string",
        required: true,
        unique: true,
      },
    },
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      mapProfileToUser: (profile) => ({
        name: profile.name ?? profile.login,
        username: profile.login,
      }),
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  plugins: [nextCookies()],
});
