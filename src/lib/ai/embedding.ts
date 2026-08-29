import { MarkdownTextSplitter } from "@langchain/textsplitters";
import { embed, embedMany } from "ai";
import { asc, cosineDistance, desc, eq, gt, sql } from "drizzle-orm";
import { db } from "@/db";
import { user } from "@/db/schemas/auth-schema";
import { logEmbeddingsTable } from "@/db/schemas/log-embeddings-schema";
import { logTable } from "@/db/schemas/log-schema";
import { Err, Ok, type Result } from "../result";
import { embeddingModel } from ".";

async function generateChunks(content: string): Promise<Result<string[]>> {
  try {
    const splitter = new MarkdownTextSplitter({
      chunkSize: 500,
      chunkOverlap: 100,
    });
    const chunks = await splitter.splitText(content);
    return Ok({ data: chunks });
  } catch (error) {
    console.error("Error generating chunks:", error);
    return Err({ message: "Couldn't generate chunks" });
  }
}

export async function generateEmbeddings(
  value: string,
): Promise<Result<Array<{ embedding: number[]; content: string }>>> {
  const chunkRes = await generateChunks(value);
  if (chunkRes.error) {
    return chunkRes;
  }
  const chunks = chunkRes.data;
  if (chunks.length === 0) {
    return Err({
      message: "Error: Empty data chunks given to generate embeddings",
    });
  }
  try {
    const { embeddings } = await embedMany({
      model: embeddingModel,
      values: chunks,
    });
    const mapping = embeddings.map((e, i) => ({
      embedding: e,
      content: chunks[i],
    }));
    return Ok({ data: mapping });
  } catch (error) {
    console.error("Error generating embeddings:", error);
    return Err({ message: "Couldn't generate embeddings" });
  }
}

export async function generateAndStoreEmbeddings({
  content,
  logId,
}: {
  content: string;
  logId: string;
}): Promise<Result> {
  try {
    const embeddingsRes = await generateEmbeddings(content);
    if (embeddingsRes.error) {
      console.error(embeddingsRes.error);
      return Err({ message: "Couldn't generate embeddings" });
    }
    const embeddings = embeddingsRes.data;

    await db
      .delete(logEmbeddingsTable)
      .where(eq(logEmbeddingsTable.logId, logId));

    await db.insert(logEmbeddingsTable).values(
      embeddings.map((embedding) => {
        return {
          logId,
          ...embedding,
        };
      }),
    );

    await db
      .update(logTable)
      .set({
        ragStatus: "done",
      })
      .where(eq(logTable.id, logId));

    return Ok({ data: undefined });
  } catch (e) {
    console.error("Error while generating or inserting embeddings into db:", e);
    return Err({ message: "Couldn't store embeddings" });
  }
}
export async function generatePendingLogEmbeddings(limit = 10): Promise<
  Result<{
    processed: number;
    failed: number;
    results: Array<{
      slug: string;
      status: "done" | "failed";
    }>;
  }>
> {
  try {
    const pendingLogs = await db
      .select({
        id: logTable.id,
        slug: logTable.slug,
        content: logTable.content,
      })
      .from(logTable)
      .where(eq(logTable.ragStatus, "pending"))
      .orderBy(asc(logTable.updatedAt), asc(logTable.id))
      .limit(limit);

    const results: Array<{
      slug: string;
      status: "done" | "failed";
    }> = [];

    for (const log of pendingLogs) {
      const res = await generateAndStoreEmbeddings({
        content: log.content,
        logId: log.id,
      });

      if (res.error) {
        results.push({ slug: log.slug, status: "failed" });
        continue;
      }

      results.push({
        slug: log.slug,
        status: "done",
      });
    }

    return Ok({
      data: {
        processed: results.filter((result) => result.status === "done").length,
        failed: results.filter((result) => result.status === "failed").length,
        results,
      },
    });
  } catch (e) {
    console.error("Error while processing pending embeddings:", e);
    return Err({ message: "Couldn't process pending embeddings" });
  }
}

export async function generateEmbedding(
  query: string,
): Promise<Result<number[]>> {
  const input = query.replaceAll("\\n", " ").trim();

  if (!input) {
    return Err({ message: "Input is empty" });
  }

  try {
    const { embedding } = await embed({
      model: embeddingModel,
      value: input,
    });
    return Ok({ data: embedding });
  } catch (e) {
    const message = "Error while generating embedding for user query";
    console.error(message, e);
    return Err({ message });
  }
}

export type RelevantContent = {
  content: string;
  similarity: number;
  slug: string;
  title: string;
  authorName: string;
  authorUsername: string;
};

export async function findRelevantContent(
  query: string,
): Promise<Result<RelevantContent[]>> {
  const queryEmbedRes = await generateEmbedding(query);
  if (queryEmbedRes.error) {
    return queryEmbedRes;
  }
  const queryEmbedding = queryEmbedRes.data;

  const similarity = sql<number>`1 - (${cosineDistance(
    logEmbeddingsTable.embedding,
    queryEmbedding,
  )})`;

  try {
    const similarLogs = await db
      .select({
        content: logEmbeddingsTable.content,
        similarity,
        slug: logTable.slug,
        title: logTable.title,
        authorName: user.name,
        authorUsername: user.username,
      })
      .from(logEmbeddingsTable)
      .innerJoin(logTable, eq(logEmbeddingsTable.logId, logTable.id))
      .innerJoin(user, eq(logTable.authorId, user.id))
      .where(gt(similarity, 0.5))
      .orderBy((t) => desc(t.similarity))
      .limit(5);

    const formattedLogs = similarLogs.map((log) => ({
      ...log,
      similarity: Number(log.similarity.toFixed(4)),
    }));

    return Ok({ data: formattedLogs });
  } catch (e) {
    const message = "Error while fetching similar logs";
    console.error(message, e);
    return Err({ message });
  }
}
