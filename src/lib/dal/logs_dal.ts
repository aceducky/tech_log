import "server-only";

import type { User } from "better-auth";
import { asc, desc, eq, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import z from "zod";
import { db } from "@/db";
import { user } from "@/db/schemas/auth-schema";
import { type Log, logTable } from "@/db/schemas/log-schema";
import { logViewsTable } from "@/db/schemas/log-views-schema";
import type { SearchParams } from "@/types/search_params";
import type { DbUser } from "../auth/types";
import { Err, Ok, type Result } from "../result";

export const LOGS_PER_PAGE = 10;
export const GET_USER_LOGS_KEY = "logs:user";

export const logsSearchParamsSchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  sort: z.enum(["latest", "oldest"]).catch("latest"),
  query: z.string().trim().catch(""),
});

export type LogsSearchParams = z.infer<typeof logsSearchParamsSchema>;
export type LogsSort = LogsSearchParams["sort"];
export type PaginationItem = number | "ellipsis";
export type LogsListInput = Pick<LogsSearchParams, "page" | "sort">;

export type LogWithAuthor = Omit<Log, "authorId" | "searchVector"> & {
  authorId: DbUser["id"];
  authorName: DbUser["name"];
  authorUsername: DbUser["username"];
};

export type LogsPage = {
  logs: LogWithAuthor[];
  currentPage: number;
  totalPages: number;
  totalLogs: number;
  sort: LogsSort;
};

const logWithAuthorSelect = {
  id: logTable.id,
  slug: logTable.slug,
  title: logTable.title,
  content: logTable.content,
  authorId: logTable.authorId,
  authorUsername: user.username,
  authorName: user.name,
  createdAt: logTable.createdAt,
  updatedAt: logTable.updatedAt,
  pageViews: db.$count(logViewsTable, eq(logViewsTable.logId, logTable.id)),
  coverImgUrl: logTable.coverImgUrl,
};

function getFirstSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getPaginationState(totalLogs: number, page: number) {
  const totalPages = Math.max(1, Math.ceil(totalLogs / LOGS_PER_PAGE));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  return {
    currentPage,
    totalPages,
    offset: (currentPage - 1) * LOGS_PER_PAGE,
  };
}

function getSortOrder(sort: LogsSort) {
  return sort === "latest"
    ? [desc(logTable.createdAt), desc(logTable.id)]
    : [asc(logTable.createdAt), asc(logTable.id)];
}

export function parseLogsSearchParams(
  searchParams: SearchParams,
): LogsSearchParams {
  return logsSearchParamsSchema.parse({
    page: getFirstSearchParam(searchParams.page),
    sort: getFirstSearchParam(searchParams.sort),
    query: getFirstSearchParam(searchParams.q),
  });
}

export function buildLogsHref(
  basePath: string,
  { page, sort, query }: LogsSearchParams,
): string {
  const params = new URLSearchParams();

  if (page > 1) params.set("page", String(page));
  if (query) params.set("q", query);
  if (sort !== "latest") params.set("sort", sort);

  const queryString = params.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}

export function getPaginationItems(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: PaginationItem[] = [];
  const left = Math.max(2, currentPage - 1);
  const right = Math.min(totalPages - 1, currentPage + 1);

  items.push(1);

  if (left > 2) items.push("ellipsis");

  for (let page = left; page <= right; page += 1) {
    items.push(page);
  }

  if (right < totalPages - 1) items.push("ellipsis");

  items.push(totalPages);

  return items;
}
export const getLogsCacheTag = () => "getLogs";
export const getLogBySlugCacheTag = (slug: string) => `getLogBySlug-${slug}`;
export const getLogsByUsernameCacheTag = (username: string) =>
  `getLogsByUsername-${username}`;

export async function getLogs(input: LogsListInput): Promise<Result<LogsPage>> {
  "use cache";
  cacheLife("minutes");
  cacheTag(getLogsCacheTag());
  try {
    const totalLogs = await db.$count(logTable);
    const { currentPage, totalPages, offset } = getPaginationState(
      totalLogs,
      input.page,
    );

    const logs = await db
      .select(logWithAuthorSelect)
      .from(logTable)
      .innerJoin(user, eq(logTable.authorId, user.id))
      .orderBy(...getSortOrder(input.sort))
      .limit(LOGS_PER_PAGE)
      .offset(offset);

    const payload: LogsPage = {
      logs,
      currentPage,
      totalPages,
      totalLogs,
      sort: input.sort,
    };

    return Ok({ data: payload });
  } catch (err) {
    console.error(err);
    return Err({ message: "Couldn't fetch the logs" });
  }
}

export async function searchLogs(
  input: LogsSearchParams,
): Promise<Result<LogsPage>> {
  const query = input.query.trim();

  if (!query) {
    return Ok({
      data: {
        logs: [],
        currentPage: 1,
        totalPages: 1,
        totalLogs: 0,
        sort: input.sort,
      },
    });
  }

  try {
    const tsQuery = sql`websearch_to_tsquery('english', ${query})`;
    const matchesSearch = sql`${logTable.searchVector} @@ ${tsQuery}`;
    const rank = sql<number>`ts_rank(${logTable.searchVector}, ${tsQuery})`;
    const totalLogs = await db.$count(logTable, matchesSearch);
    const { currentPage, totalPages, offset } = getPaginationState(
      totalLogs,
      input.page,
    );

    const logs = await db
      .select(logWithAuthorSelect)
      .from(logTable)
      .innerJoin(user, eq(logTable.authorId, user.id))
      .where(matchesSearch)
      .orderBy(desc(rank), ...getSortOrder(input.sort))
      .limit(LOGS_PER_PAGE)
      .offset(offset);

    return Ok({
      data: {
        logs,
        currentPage,
        totalPages,
        totalLogs,
        sort: input.sort,
      },
    });
  } catch (err) {
    console.error(err);
    return Err({ message: "Couldn't search the logs" });
  }
}

export async function getLogBySlug(
  slug: Log["slug"],
): Promise<Result<LogWithAuthor>> {
  "use cache";
  cacheLife("minutes");
  cacheTag(getLogBySlugCacheTag(slug));
  try {
    const [row] = await db
      .select(logWithAuthorSelect)
      .from(logTable)
      .innerJoin(user, eq(logTable.authorId, user.id))
      .where(eq(logTable.slug, slug));

    if (!row) {
      return Err({ message: "Log not found" });
    }

    return Ok({ data: row });
  } catch (err) {
    console.error(err);
    return Err({ message: "Couldn't fetch the log" });
  }
}

export async function getOwnershipBySlug(
  incomingUserId: User["id"],
  slug: Log["slug"],
): Promise<Result<{ isOwner: boolean }>> {
  try {
    const [row] = await db
      .select({ authorId: logTable.authorId })
      .from(logTable)
      .where(eq(logTable.slug, slug));

    if (!row) {
      return Err({ message: "Log not found" });
    }

    return Ok({ data: { isOwner: row.authorId === incomingUserId } });
  } catch (err) {
    console.error(err);
    return Err({ message: "Couldn't fetch log details" });
  }
}

export async function getLogsByUsername(
  username: string,
  input: LogsListInput,
): Promise<Result<LogsPage>> {
  "use cache";
  cacheLife("minutes");
  cacheTag(getLogsByUsernameCacheTag(username));
  const userFilter = eq(user.username, username);

  try {
    const [profile] = await db
      .select({
        totalLogs: db.$count(logTable, eq(logTable.authorId, user.id)),
      })
      .from(user)
      .where(userFilter);

    if (!profile) {
      return Err({ message: "User not found" });
    }

    const totalLogs = profile.totalLogs;
    const { currentPage, totalPages, offset } = getPaginationState(
      totalLogs,
      input.page,
    );

    const logs = await db
      .select(logWithAuthorSelect)
      .from(logTable)
      .innerJoin(user, eq(logTable.authorId, user.id))
      .where(userFilter)
      .orderBy(...getSortOrder(input.sort))
      .limit(LOGS_PER_PAGE)
      .offset(offset);

    const payload: LogsPage = {
      logs,
      currentPage,
      totalPages,
      totalLogs,
      sort: input.sort,
    };

    return Ok({ data: payload });
  } catch (err) {
    console.error(err);
    return Err({ message: "Couldn't fetch the logs" });
  }
}
