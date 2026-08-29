import { generateUploadDropzone } from "@uploadthing/react";

import type { imgFileRouter } from "@/app/api/uploadthing/core";

export const UploadDropzone = generateUploadDropzone<imgFileRouter>();
