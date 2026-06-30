import "server-only";

import { desc, eq } from "drizzle-orm";
import { redis } from "@/cache";
import { db } from "@/db";
import { user } from "@/db/schemas/auth-schema";
import { type Log, logTable } from "@/db/schemas/log-schema";
import type { DbUser } from "./auth/types";
import { Err, Ok, type Result } from "./result";

export type LogWithAuthor = Omit<Log, "authorId"> & {
  authorId: DbUser["id"];
  authorName: DbUser["name"];
  authorUsername: DbUser["username"];
};

export const GET_LOGS_KEY = "logs:get";

export async function getLogs(): Promise<Result<LogWithAuthor[]>> {
  try {
    const cached = await redis.get<LogWithAuthor[]>(GET_LOGS_KEY);
    if (cached) {
      console.log(`Cache hit: ${GET_LOGS_KEY}`);
      return Ok({ data: cached });
    }
    console.log(`Cache miss: ${GET_LOGS_KEY}`);
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
        pageViews: logTable.pageViews,
        coverImgUrl: logTable.coverImgUrl,
      })
      .from(logTable)
      .innerJoin(user, eq(logTable.authorId, user.id))
      .orderBy(desc(logTable.createdAt));

    redis.set(GET_LOGS_KEY, res, {
      ex: 60 * 2,
    });

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
        pageViews: logTable.pageViews,
        coverImgUrl: logTable.coverImgUrl,
      })
      .from(logTable)
      .innerJoin(user, eq(logTable.authorId, user.id))
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

export async function getLogsByUsername(
  username: string,
): Promise<Result<LogWithAuthor[]>> {
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
        pageViews: logTable.pageViews,
        coverImgUrl: logTable.coverImgUrl,
      })
      .from(logTable)
      .innerJoin(user, eq(logTable.authorId, user.id))
      .where(eq(user.username, username))
      .orderBy(desc(logTable.createdAt));

    return Ok({ data: res });
  } catch (err) {
    console.error(err);
    return Err({ message: "Couldn't fetch the logs" });
  }
}
