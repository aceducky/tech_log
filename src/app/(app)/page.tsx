import { LogCard } from "@/components/log/log_card";
import { getLogs } from "@/lib/dal";
import { logDateFormat } from "@/lib/utils";

export default async function Home() {
  const logs = await getLogs();

  if (logs.error) {
    return <div className="text-destructive">Error: {logs.message}</div>;
  }

  return (
    <div>
      <main className="max-w-2xl mx-auto mt-10 flex flex-col gap-6 mb-4">
        {logs.data?.map((log) => (
          <LogCard
            key={log.id}
            title={log.title}
            authorUsername={log.authorUsername}
            authorName={log.authorName}
            createdAt={logDateFormat(log.createdAt)}
            coverImgUrl={log.coverImgUrl}
            summary={log.content.substring(0, 200)}
            href={`/logs/${log.id}`}
          />
        ))}
      </main>
    </div>
  );
}
