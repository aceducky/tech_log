import { Suspense } from "react";
import { LogCard } from "@/components/log/log_card";
import { LogFeedSkeleton } from "@/components/log/log_feed_skeleton";
import {
  LogPagination,
  LogSortControls,
} from "@/components/log/log_pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { getLogsByUsername, parseLogsSearchParams } from "@/lib/dal/logs_dal";
import { logDateFormat } from "@/lib/utils";

async function UserLogsFeed({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { username } = await params;
  const rawSearch = await searchParams;
  const filters = parseLogsSearchParams(rawSearch);
  const result = await getLogsByUsername(username, {
    page: filters.page,
    sort: filters.sort,
  });

  if (result.error) {
    return (
      <div className="mt-10 text-center text-destructive">
        Error: {result.message}
      </div>
    );
  }

  const page = result.data;
  if (!page) {
    return <div>No logs</div>;
  }

  const basePath = `/user/${username}`;

  return (
    <div>
      <h1 className="mt-10 text-center text-2xl font-bold">
        Logs by @{username} {page.logs[0]?.authorName}
      </h1>
      <main className="mx-auto mt-10 mb-4 flex w-full max-w-2xl flex-col gap-6">
        {page.logs.length === 0 ? (
          <p className="mt-4 text-center text-muted-foreground">
            The user hasn't written any logs yet.
          </p>
        ) : (
          <>
            <LogSortControls
              currentPage={page.currentPage}
              totalPages={page.totalPages}
              sort={page.sort}
              basePath={basePath}
            />
            {page.logs.map((log) => (
              <LogCard
                key={log.id}
                title={log.title}
                authorUsername={log.authorUsername}
                authorName={log.authorName}
                createdAt={logDateFormat(log.createdAt)}
                coverImgUrl={log.coverImgUrl}
                preview={log.content.substring(0, 200)}
                href={`/logs/${log.id}`}
              />
            ))}
            <LogPagination
              currentPage={page.currentPage}
              totalPages={page.totalPages}
              sort={page.sort}
              basePath={basePath}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default async function UserLogsPage(props: {
  params: Promise<{ username: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense
      fallback={
        <div>
          <div className="flex justify-center mt-10">
            <Skeleton className="h-8 w-64" />
          </div>
          <main className="mx-auto mt-10 mb-4 flex w-full max-w-2xl flex-col gap-6">
            <LogFeedSkeleton />
          </main>
        </div>
      }
    >
      <UserLogsFeed params={props.params} searchParams={props.searchParams} />
    </Suspense>
  );
}
