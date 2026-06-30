import CreateLogForm from "@/components/log/create_log_form";
import { requireSessionServer } from "@/lib/auth/require_session_server";

export default async function Page() {
  await requireSessionServer();
  return (
    <div className="p-4">
      <CreateLogForm />
    </div>
  );
}
