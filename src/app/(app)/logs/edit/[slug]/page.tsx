import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import EditLogForm, {
  EditLogFormSkeleton,
} from "@/components/log/edit_log_form";
import { db } from "@/db";
import { logSlugSchema, logTable } from "@/db/schemas/log-schema";
import { requireSessionServer } from "@/lib/auth/require_session_server";
import type { LogSlugParams } from "../../types";

async function EditLogContent({ params }: LogSlugParams) {
  const { user } = await requireSessionServer();
  const { slug } = await params;
  const res = logSlugSchema.safeParse(slug);
  if (!res.success) {
    return notFound();
  }

  const [log] = await db
    .select({
      slug: logTable.slug,
      title: logTable.title,
      content: logTable.content,
      coverImgUrl: logTable.coverImgUrl,
    })
    .from(logTable)
    .where(and(eq(logTable.slug, res.data), eq(logTable.authorId, user.id)));

  if (!log) {
    return notFound();
  }

  return (
    <EditLogForm
      slug={log.slug}
      title={log.title}
      content={log.content}
      coverImgUrl={log.coverImgUrl}
    />
  );
}

export default async function Page({ params }: LogSlugParams) {
  return (
    <Suspense fallback={<EditLogFormSkeleton />}>
      <EditLogContent params={params} />
    </Suspense>
  );
}
