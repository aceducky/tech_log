import { generateUploadDropzone } from "@uploadthing/react";

import type { coverImgFileRouter } from "@/app/api/uploadthing/core";
import { MAX_LOG_COVER_IMG_SIZE } from "@/config/constants";

export const UploadDropzone = generateUploadDropzone<coverImgFileRouter>();

export function getCoverUploadErrorMessage(error: Error) {
  if (error.message.includes("FileSizeMismatch")) {
    return `Cover image must be ${MAX_LOG_COVER_IMG_SIZE} or smaller.`;
  }
  if (error.message.includes("Invalid file type")) {
    return "Please upload a supported image file.";
  }
  return error.message || "Cover image upload failed. Please try again.";
}
