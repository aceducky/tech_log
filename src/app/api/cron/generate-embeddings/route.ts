import { env } from "@/config/env";
import { generatePendingLogEmbeddings } from "@/lib/ai/embedding";

const BATCH_SIZE = 10;

export const maxDuration = 300;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!env.CRON_SECRET || authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await generatePendingLogEmbeddings(BATCH_SIZE);

  if (result.error) {
    return Response.json(
      { error: true, message: result.message },
      { status: 500 },
    );
  }

  return Response.json({
    error: false,
    batchSize: BATCH_SIZE,
    ...result.data,
  });
}
