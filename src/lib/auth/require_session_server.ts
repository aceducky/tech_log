import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from ".";

export async function requireSessionServer() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in", "replace");
  }
  return session;
}
