"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { after } from "next/server";
import { db } from "@/db";
import {
  createLogFormSchema,
  type Log,
  logSlugSchema,
  logTable,
  updateLogSchema,
} from "@/db/schemas/log-schema";
import { generateAndStoreEmbeddings } from "@/lib/ai/embedding";
import { requireSessionServer } from "@/lib/auth/require_session_server";
import {
  getLogBySlugCacheTag,
  getLogsByUsernameCacheTag,
  getLogsCacheTag,
  getOwnershipBySlug,
} from "@/lib/dal/logs_dal";
import type { Result } from "@/lib/result";
import { Err, Ok, ValidationErr } from "@/lib/result";
import { slugifyTitle } from "@/lib/slug";

export async function createLog(
  data: unknown,
): Promise<Result<Pick<Log, "id" | "slug">>> {
  const { user } = await requireSessionServer();

  const validated = createLogFormSchema.safeParse(data);

  if (!validated.success) {
    return ValidationErr({ zodErr: validated.error });
  }

  const MAX_SLUG_RETRIES = 3;

  for (let attempt = 0; attempt < MAX_SLUG_RETRIES; attempt += 1) {
    try {
      const [res] = await db
        .insert(logTable)
        .values({
          ...validated.data,
          authorId: user.id,
          slug: slugifyTitle(validated.data.title),
        })
        .onConflictDoNothing({ target: logTable.slug })
        .returning({ id: logTable.id, slug: logTable.slug });

      if (!res) {
        continue;
      }

      updateTag(getLogsCacheTag());
      updateTag(getLogsByUsernameCacheTag(user.username));

      after(() => {
        generateAndStoreEmbeddings({
          content: validated.data.content,
          logId: res.id,
        });
      });
      return Ok({ message: "Created log successfully", data: res });
    } catch (err) {
      console.error(err);
      return Err({ message: "Failed to create log" });
    }
  }

  return Err({ message: "Failed to create log" });
}

export async function updateLog(data: unknown): Promise<Result> {
  const { user } = await requireSessionServer();

  const validated = updateLogSchema.safeParse(data);
  if (!validated.success) {
    return ValidationErr({ zodErr: validated.error });
  }

  const { slug, ...update } = validated.data;

  const getOwnershipRes = await getOwnershipBySlug({
    incomingUserId: user.id,
    slug: slug,
  });
  if (getOwnershipRes.error) {
    return getOwnershipRes;
  }

  if (!getOwnershipRes.data.isOwner) {
    return Err({ message: "Not authorized to update the log" });
  }

  if (Object.keys(update).length === 0) {
    return Ok({ data: undefined, message: "No changes to update" });
  }

  try {
    const updatedContent = update.content;

    const updateData = {
      ...update,
      ...(updatedContent !== undefined
        ? { ragStatus: "pending" as const }
        : {}),
    };

    const [{ id: logId }] = await db
      .update(logTable)
      .set(updateData)
      .where(eq(logTable.slug, slug))
      .returning({ id: logTable.id });

    updateTag(getLogsCacheTag());
    updateTag(getLogBySlugCacheTag(slug));
    updateTag(getLogsByUsernameCacheTag(user.username));

    if (updatedContent !== undefined) {
      after(() => {
        generateAndStoreEmbeddings({
          content: updatedContent,
          logId,
        });
      });
    }

    return Ok({ data: undefined, message: "Log is updated" });
  } catch (err) {
    console.error(err);
    return Err({ message: "Couldn't update log" });
  }
}

export async function deleteLog(slug: unknown): Promise<Result> {
  const { user } = await requireSessionServer();
  const validatedSlug = logSlugSchema.safeParse(slug);

  if (!validatedSlug.success) {
    return ValidationErr({ message: "Invalid log slug" });
  }

  const getOwnershipRes = await getOwnershipBySlug({
    incomingUserId: user.id,
    slug: validatedSlug.data,
  });
  if (getOwnershipRes.error) {
    return getOwnershipRes;
  }

  if (!getOwnershipRes.data.isOwner) {
    return Err({ message: "Not authorized to delete" });
  }

  try {
    await db.delete(logTable).where(eq(logTable.slug, validatedSlug.data));

    updateTag(getLogsCacheTag());
    updateTag(getLogBySlugCacheTag(validatedSlug.data));
    updateTag(getLogsByUsernameCacheTag(user.username));

    return Ok({ data: undefined, message: "Log is deleted" });
  } catch (err) {
    console.error(err);
    return Err({ message: "Couldn't delete log" });
  }
}
