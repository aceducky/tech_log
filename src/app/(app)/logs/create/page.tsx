import { Suspense } from "react";
import CreateLogForm from "@/components/log/create_log_form";
import { EditLogFormSkeleton } from "@/components/log/edit_log_form";
import { requireSessionServer } from "@/lib/auth/require_session_server";

async function ProtectedCreateLogForm() {
  await requireSessionServer();
  return <CreateLogForm />;
}

export default function Page() {
  return (
    <div className="p-4">
      <Suspense fallback={<EditLogFormSkeleton />}>
        <ProtectedCreateLogForm />
      </Suspense>
    </div>
  );
}
