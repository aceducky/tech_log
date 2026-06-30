import "server-only";

import { headers } from "next/headers";
import { auth } from ".";

export async function getCurrentSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
}
