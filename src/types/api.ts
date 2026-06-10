export interface Log {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  imageUrl?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface FileUploadResponse {
  success: boolean;
  url?: string;
  filename?: string;
  message?: string;
}
