import { Suspense } from "react";
import { LogCard } from "@/components/log/log_card";
import { LogFeedSkeleton } from "@/components/log/log_feed_skeleton";
import {
  LogPagination,
  LogSortControls,
} from "@/components/log/log_pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { parseLogsSearchParams, searchLogs } from "@/lib/dal/logs_dal";
import { generateLogPreview, logDateFormat } from "@/lib/utils";
import type { SearchParamsProps } from "@/types/search_params";

async function SearchResults({ searchParams }: SearchParamsProps) {
  const raw = await searchParams;
  const filters = parseLogsSearchParams(raw);

  if (!filters.query.trim()) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Search logs</h1>
        <p className="text-sm text-muted-foreground">
          Search by title or content to find a log quickly.
        </p>
      </div>
    );
  }

  const result = await searchLogs(filters);

  if (result.error) {
    throw new Error(result.message);
  }

  const page = result.data;
  if (!page) {
    return <div>No logs</div>;
  }

  return (
    <>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Results for &quot;{filters.query}&quot;
        </h1>
        <p className="text-sm text-muted-foreground">
          {page.totalLogs} matching {page.totalLogs === 1 ? "log" : "logs"}
        </p>
      </div>

      <LogSortControls
        sort={page.sort}
        query={filters.query}
        basePath="/search"
      />

      {page.logs.length === 0 ? (
        <p className="text-muted-foreground">No logs matched your search.</p>
      ) : (
        page.logs.map((log) => (
          <LogCard
            key={log.id}
            title={log.title}
            authorUsername={log.authorUsername}
            authorName={log.authorName}
            createdAt={logDateFormat(log.createdAt)}
            coverImgUrl={log.coverImgUrl}
            preview={generateLogPreview(log.content)}
            href={`/logs/${log.slug}`}
          />
        ))
      )}

      <LogPagination
        currentPage={page.currentPage}
        totalPages={page.totalPages}
        sort={page.sort}
        query={filters.query}
        basePath="/search"
      />
    </>
  );
}

export default async function SearchPage(props: SearchParamsProps) {
  return (
    <main className="mx-auto mt-10 mb-4 flex w-full max-w-2xl flex-col gap-6">
      <Suspense
        fallback={
          <>
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <LogFeedSkeleton />
          </>
        }
      >
        <SearchResults searchParams={props.searchParams} />
      </Suspense>
    </main>
  );
}
