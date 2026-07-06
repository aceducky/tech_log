import { notFound } from "next/navigation";
import { Suspense } from "react";
import LogViewer, { LogViewerSkeleton } from "@/components/log/log_viewer";
import { logIdSchema } from "@/db/schemas/log-schema";
import { getCurrentSession } from "@/lib/auth/get_current_session";
import { getLogById } from "@/lib/dal/logs_dal";

async function LogDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const validationRes = logIdSchema.safeParse(id);
  if (!validationRes.success) {
    return notFound();
  }

  const res = await getLogById(validationRes.data);

  if (res.error || !res.data) {
    return <div className="text-destructive">{res.message}</div>;
  }

  const session = await getCurrentSession();
  const isOwner = session?.user.id === res.data.authorId;

  return <LogViewer log={res.data} isOwner={isOwner} />;
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<LogViewerSkeleton />}>
      <LogDetail params={params} />
    </Suspense>
  );
}
