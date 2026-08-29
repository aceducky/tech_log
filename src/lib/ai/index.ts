import { createWorkersAI } from "workers-ai-provider";
import { env } from "@/config/env";

export const workersAI = createWorkersAI({
  accountId: env.CF_ACCOUNT_ID,
  apiKey: env.AI_API_KEY,
});

export const chatModel = workersAI.chat(env.CHAT_MODEL);

export const embeddingModel = workersAI.textEmbeddingModel(env.EMBEDDING_MODEL);
