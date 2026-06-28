import CreateLogForm from "@/components/log/create_log_form";
import { requireUserServer } from "@/lib/auth/require_user_server";

export default async function Page() {
  await requireUserServer();
  return (
    <div className="p-4">
      <CreateLogForm />
    </div>
  );
}
