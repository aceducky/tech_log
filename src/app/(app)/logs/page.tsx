import { Suspense } from "react";
import { LogCard } from "@/components/log/log_card";
import { LogFeedSkeleton } from "@/components/log/log_feed_skeleton";
import {
  LogPagination,
  LogSortControls,
} from "@/components/log/log_pagination";
import { getLogs, parseLogsSearchParams } from "@/lib/dal/logs_dal";
import { generateLogPreview, logDateFormat } from "@/lib/utils";

import type { SearchParamsProps } from "@/types/search_params";

async function LogsFeed({ searchParams }: SearchParamsProps) {
  const raw = await searchParams;
  const filters = parseLogsSearchParams(raw);
  const result = await getLogs({ page: filters.page, sort: filters.sort });

  if (result.error) {
    throw new Error(result.message);
  }

  const page = result.data;
  if (!page) {
    return <div>No logs</div>;
  }

  return (
    <>
      <LogSortControls sort={page.sort} basePath="/logs" />

      {page.logs.length === 0 ? (
        <p className="text-muted-foreground">No logs yet.</p>
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
        basePath="/logs"
      />
    </>
  );
}

export default async function Home(props: SearchParamsProps) {
  return (
    <main className="mx-auto mt-10 mb-4 flex w-full max-w-2xl flex-col gap-6">
      <Suspense fallback={<LogFeedSkeleton />}>
        <LogsFeed searchParams={props.searchParams} />
      </Suspense>
    </main>
  );
}
