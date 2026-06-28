import { envSchema } from "./schema";

// Throws immediately on startup if anything is missing or wrong.
export const env = envSchema.parse(process.env);
