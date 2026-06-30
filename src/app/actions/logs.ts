"use server";

import type { User } from "better-auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redis } from "@/cache";
import { db } from "@/db";
import {
  createLogFormSchema,
  editLogFormSchema,
  type Log,
  logIdSchema,
  logTable,
} from "@/db/schemas/log-schema";
import { requireSessionServer } from "@/lib/auth/require_session_server";
import { GET_LOGS_KEY } from "@/lib/dal";
import type { Result } from "@/lib/result";
import { Err, Ok, ValidationErr } from "@/lib/result";

export async function createLog(data: unknown): Promise<Result<Log["id"]>> {
  const { user } = await requireSessionServer();

  const validated = createLogFormSchema.safeParse(data);

  if (!validated.success) {
    return ValidationErr({ zodErr: validated.error });
  }

  try {
    const [res] = await db
      .insert(logTable)
      .values({ ...validated.data, authorId: user.id })
      .returning({ id: logTable.id });
    revalidatePath("/");

    redis.del(GET_LOGS_KEY);

    return Ok({ message: "Created log successfully", data: res.id });
  } catch (err) {
    console.error(err);
    return Err({ message: "Failed to create log" });
  }
}

export async function hasOwnership(
  incomingUserId: User["id"],
  incomingLogId: Log["id"],
): Promise<Result<{ isOwner: boolean }>> {
  try {
    const [row] = await db
      .select({ authorId: logTable.authorId })
      .from(logTable)
      .where(eq(logTable.id, incomingLogId));

    if (!row) {
      return Err({ message: "Log not found" });
    }

    return Ok({
      data: { isOwner: row.authorId === incomingUserId },
    });
  } catch (err) {
    console.error(err);
    return Err({ message: "Couldn't fetch log details" });
  }
}

export async function updateLog(data: unknown): Promise<Result> {
  const { user } = await requireSessionServer();

  const validated = editLogFormSchema.safeParse(data);
  if (!validated.success) {
    return ValidationErr({ zodErr: validated.error });
  }

  const hasOwnershipRes = await hasOwnership(user.id, validated.data.id);
  if (hasOwnershipRes.error) {
    return hasOwnershipRes;
  }

  if (!hasOwnershipRes.data?.isOwner) {
    return Err({ message: "Not authorized to update the log" });
  }

  const { id, ...update } = validated.data;

  if (Object.keys(update).length === 0) {
    return Ok({ message: "No changes to update" });
  }

  try {
    await db
      .update(logTable)
      .set(update)
      .where(eq(logTable.id, validated.data.id));
    revalidatePath("/");
    revalidatePath(`/logs/${validated.data.id}`);
    return Ok({ message: "Log is updated" });
  } catch (err) {
    console.error(err);
    return Err({ message: "Couldn't update log" });
  }
}

export async function deleteLog(logId: unknown): Promise<Result> {
  const { user } = await requireSessionServer();
  const validatedId = logIdSchema.safeParse(logId);

  if (!validatedId.success) {
    return ValidationErr({ message: "Invalid log id" });
  }

  const hasOwnershipRes = await hasOwnership(user.id, validatedId.data);
  if (hasOwnershipRes.error) {
    return hasOwnershipRes;
  }

  if (!hasOwnershipRes.data?.isOwner) {
    return Err({ message: "Not authorized to delete" });
  }

  try {
    await db.delete(logTable).where(eq(logTable.id, validatedId.data));
    revalidatePath("/");
    revalidatePath(`/logs/${validatedId.data}`);
    return Ok({ message: "Log is deleted" });
  } catch (err) {
    console.error(err);
    return Err({ message: "Couldn't delete log" });
  }
}
