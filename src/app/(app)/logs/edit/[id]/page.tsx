import { and, eq, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import EditLogForm from "@/components/log/edit_log_form";
import { db } from "@/db";
import { logIdSchema, logTable } from "@/db/schemas/log-schema";
import { requireSessionServer } from "@/lib/auth/require_session_server";
import type { LogIdParams } from "../../types";

export default async function Page({ params }: LogIdParams) {
  const { user } = await requireSessionServer();
  const { id } = await params;
  const res = logIdSchema.safeParse(id);
  if (!res.success) {
    return notFound();
  }

  const [row] = await db
    .select({ dummy: sql<number>`1` })
    .from(logTable)
    .where(and(eq(logTable.id, res.data), eq(logTable.authorId, user.id)));

  if (!row) {
    return notFound();
  }

  const [log] = await db
    .select({
      title: logTable.title,
      content: logTable.content,
      coverImgUrl: logTable.coverImgUrl,
    })
    .from(logTable)
    .where(and(eq(logTable.id, res.data), eq(logTable.authorId, user.id)));

  if (!log) {
    return notFound();
  }

  return (
    <EditLogForm
      id={res.data}
      title={log.title}
      content={log.content}
      coverImgUrl={log.coverImgUrl}
    />
  );
}
