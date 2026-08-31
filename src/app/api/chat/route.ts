import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  safeValidateUIMessages,
  stepCountIs,
  streamText,
  toUIMessageStream,
} from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { chatModel } from "@/lib/ai";
import {
  fullTextSearchTool,
  getLogBySlugTool,
  ragTool,
} from "@/lib/ai/chat_tools";
import { buildSystemPrompt } from "@/lib/ai/prompts";

export const maxDuration = 30;

const bodySchema = z.object({
  messages: z.unknown(),
  currentSlug: z.string().nullish(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { currentSlug } = parsed.data;

  const validationRes = await safeValidateUIMessages({
    messages: parsed.data.messages,
  });
  if (!validationRes.success) {
    return NextResponse.json(
      { error: "Invalid messages payload" },
      { status: 400 },
    );
  }

  const uiMessages = validationRes.data.filter(
    (message) => message.role !== "system",
  );

  const result = streamText({
    model: chatModel,
    system: buildSystemPrompt(currentSlug),
    messages: await convertToModelMessages(uiMessages),
    tools: { getLogBySlugTool, ragTool, fullTextSearchTool },
    stopWhen: stepCountIs(5),
    timeout: {
      totalMs: 30_000,
      firstChunkMs: 15_000,
    },
    maxRetries:3
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      sendReasoning: false,
      onError: (error) => {
        console.error("[chat] Stream error:", error);
        if (
          error instanceof Error &&
          error.name === "TimeoutError"
        ) {
          return "The AI model took too long to respond. Please try again.";
        }
        return "Something went wrong. Please try again.";
      },
    }),
  });
}
