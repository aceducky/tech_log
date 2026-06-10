"use server";

import { redirect } from "next/navigation";
import type { Log } from "@/types/api";

export type CreateLogInput = Omit<Log, "id" | "createdAt" | "authorId">;

export type UpdateLogInput = Omit<Partial<CreateLogInput>, "authorName">;

export async function createLog(data: CreateLogInput) {
  console.log("Created log", data);
  return { success: true };
}

export async function updateLog(id: string, data: UpdateLogInput) {
  console.log(`Update log with ${id}`, data);
  return {
    success: true,
    message: `Log with ${id} updated`,
  };
}

export async function deleteLog(id: string) {
  console.log("Deleted log", id);
  return {
    success: true,
    message: `Log with ${id} deleted`,
  };
}

export async function deleteLogForm(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (!id) {
    throw new Error("Missing log id");
  }

  await deleteLog(String(id));
  redirect("/");
}
