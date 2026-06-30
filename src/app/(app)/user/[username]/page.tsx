import { LogCard } from "@/components/log/log_card";
import { getLogsByUsername } from "@/lib/dal";
import { logDateFormat } from "@/lib/utils";

export default async function UserLogsPage(props: {
  params: Promise<{ username: string }>;
}) {
  const params = await props.params;
  const logs = await getLogsByUsername(params.username);

  if (logs.error) {
    return (
      <div className="text-destructive mt-10 text-center">
        Error: {logs.message}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mt-10">
        Logs by @{params.username} {logs.data?.[0]?.authorName}
      </h1>
      <main className="max-w-2xl mx-auto mt-10 flex flex-col gap-6 mb-4">
        {logs.data?.length === 0 && (
          <p className="text-center text-muted-foreground mt-4">
            The user hasn't written any logs yet.
          </p>
        )}
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
