import { toBaseMessages, toUIMessageStream } from "@ai-sdk/langchain";
import { SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { createUIMessageStreamResponse, type UIMessage } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/config/env";
import { logSlugSchema } from "@/db/schemas/log-schema";
import { getLogBySlug } from "@/lib/dal/logs_dal";

export const maxDuration = 30;

const chatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        id: z.string(),
        role: z.enum(["system", "user", "assistant"]),
        parts: z.array(z.record(z.string(), z.unknown())),
      }),
    )
    .min(1),
  slug: z.string().trim().optional(),
});

function buildSystemPrompt() {
  return [
    "You are Ask AI, an assistant embedded in TechLog - a platform where developers write technical logs.",
    "Answer clearly and concisely, and format responses in Markdown.",
    "If the user is viewing a log, prefer answering questions about that log using its content below.",
    "If you are unsure about something not covered by the log, say so instead of inventing details.",
  ].join(" ");
}

async function buildLogContext(slug: string | undefined) {
  if (!slug) return "";

  const validation = logSlugSchema.safeParse(slug);
  if (!validation.success) return "";

  const result = await getLogBySlug(validation.data);
  if (result.error || !result.data) return "";
    // TODO: make the model aware first that user is on a log page
  return ""
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const validation = chatRequestSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { messages, slug } = validation.data;
  const systemPrompt = buildSystemPrompt() + (await buildLogContext(slug));

  const model = new ChatOpenAI({
    model: env.AI_MODEL,
    apiKey: env.AI_API_KEY,
    configuration: { baseURL: env.AI_ENDPOINT },
  });

  try {
    const langchainMessages = await toBaseMessages(messages as UIMessage[]);
    const stream = await model.stream([
      new SystemMessage(systemPrompt),
      ...langchainMessages,
    ]);

    return createUIMessageStreamResponse({
      stream: toUIMessageStream(stream),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Couldn't process the chat request" },
      { status: 500 },
    );
  }
}
