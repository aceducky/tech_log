"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { RedirectType, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Err, type Result } from "@/lib/result";

export async function logoutAction(): Promise<Result> {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });

    revalidatePath("/", "layout");
  } catch (error) {
    console.error(error);
    return Err({ message: "Logout failed" });
  }

  redirect("/", RedirectType.replace);
}
