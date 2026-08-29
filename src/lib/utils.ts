import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { MAX_IMAGE_SIZE } from "@/config/constants";
import { logSlugSchema } from "@/db/schemas/log-schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function logDateFormat(dateString: string | Date): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function sessionDateFormat(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function getImgUploadErrorMessage(error: Error) {
  if (error.message.includes("FileSizeMismatch")) {
    return `Image must be ${MAX_IMAGE_SIZE} or smaller.`;
  }
  if (error.message.includes("Invalid file type")) {
    return "Please upload a supported image file.";
  }
  return error.message || "Image upload failed. Please try again.";
}
/**
 * **IMPORTANT**: this does not throw or return error result, it just returns null when slug is invalid/absent
 * @param pathname string
 * @returns log slug if pathname is /logs/{slug} and slug is valid else null
 */
export function getSlugFromPathname(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 2 && segments[0] === "logs") {
    return logSlugSchema.safeParse(segments[1]).success ? segments[1] : null;
  }

  return null;
}
