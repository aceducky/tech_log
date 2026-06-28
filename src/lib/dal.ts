import "server-only";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { user } from "@/db/schemas/auth-schema";
import { type Log, logTable } from "@/db/schemas/log-schema";
import type { DbUser } from "./auth/types";
import { Err, Ok, type Result } from "./result";

export type LogWithAuthor = Omit<Log, "authorId"> & {
  authorId: DbUser["id"];
  authorName: DbUser["name"] | null;
  authorUsername: DbUser["username"] | null;
};

export async function getLogs(): Promise<Result<LogWithAuthor[]>> {
  try {
    const res = await db
      .select({
        id: logTable.id,
        title: logTable.title,
        content: logTable.content,
        authorId: logTable.authorId,
        authorUsername: user.username,
        authorName: user.name,
        createdAt: logTable.createdAt,
        updatedAt: logTable.updatedAt,
        count: logTable.count,
        coverImgUrl: logTable.coverImgUrl,
      })
      .from(logTable)
      .leftJoin(user, eq(logTable.authorId, user.id));

    return Ok({ data: res });
  } catch (err) {
    console.error(err);
    return Err({ message: "Couldn't fetch the logs" });
  }
}

export async function getLogById(
  id: Log["id"],
): Promise<Result<LogWithAuthor>> {
  try {
    const [row] = await db
      .select({
        id: logTable.id,
        title: logTable.title,
        content: logTable.content,
        authorId: logTable.authorId,
        authorUsername: user.username,
        authorName: user.name,
        createdAt: logTable.createdAt,
        updatedAt: logTable.updatedAt,
        count: logTable.count,
        coverImgUrl: logTable.coverImgUrl,
      })
      .from(logTable)
      .leftJoin(user, eq(logTable.authorId, user.id))
      .where(eq(logTable.id, id));

    if (!row) {
      return Err({ message: "Log not found" });
    }

    return Ok({ data: row });
  } catch (err) {
    console.error(err);
    return Err({ message: "Couldn't fetch the log" });
  }
}
