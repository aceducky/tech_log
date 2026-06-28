"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from ".";

export async function requireUserServer() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in", "replace");
  }
  return session;
}
