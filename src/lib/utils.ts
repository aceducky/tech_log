import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { MAX_IMAGE_SIZE } from "@/config/constants";

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

export function generateLogPreview(content: string, maxLength = 250): string {
  if (!content) return "";
  if (content.length <= maxLength) return content;

  let truncated = content.substring(0, maxLength);

  // Find the last space to avoid cutting words in half
  const lastSpaceIndex = truncated.lastIndexOf(" ");

  if (lastSpaceIndex > 0) {
    truncated = truncated.substring(0, lastSpaceIndex);
  }

  return truncated;
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
