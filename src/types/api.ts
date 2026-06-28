export type ApiResponse<T> = Promise<{
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}>;

export interface FileUploadResponse {
  success: boolean;
  url?: string;
  filename?: string;
  message?: string;
}
