"use server";

import { ALLOWED_TYPE, MAX_FILE_SIZE } from "@/lib/constants";

export type UploadedFile = {
  url: string;
  size: number;
  type: string;
  filename?: string;
};

export async function uploadFile(formData: FormData): Promise<UploadedFile> {
  const files = formData.getAll("files").filter(Boolean) as File[];
  const file = files[0];

  console.log(
    "uploaded file:",
    files.map((f) => ({ name: f.name, size: f.size, type: f.type })),
  );

  if (!file) {
    throw new Error("No file provided");
  }

  if (!ALLOWED_TYPE.includes(file.type)) {
    throw new Error("Invalid file type");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File too large");
  }

  return {
    url: "/uploads/mock-image.jpg",
    size: file.size,
    type: file.type,
    filename: file.name,
  };
}
