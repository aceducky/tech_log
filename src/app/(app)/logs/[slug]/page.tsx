import { notFound } from "next/navigation";
import { Suspense } from "react";
import LogViewer, { LogViewerSkeleton } from "@/components/log/log_viewer";
import { logSlugSchema } from "@/db/schemas/log-schema";
import { getCurrentSession } from "@/lib/auth/get_current_session";
import { getLogBySlug } from "@/lib/dal/logs_dal";

async function LogDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const validationRes = logSlugSchema.safeParse(slug);
  if (!validationRes.success) {
    return notFound();
  }

  const res = await getLogBySlug(validationRes.data);

  if (res.error && res.message === "Log not found") {
    return notFound();
  }

  if (res.error) {
    throw new Error(res.message);
  }

  const session = await getCurrentSession();
  const isOwner = session?.user.id === res.data.authorId;

  return <LogViewer log={res.data} isOwner={isOwner} />;
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<LogViewerSkeleton />}>
      <LogDetail params={params} />
    </Suspense>
  );
}
