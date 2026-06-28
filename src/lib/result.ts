import z from "zod";

export type Result<T = never> =
  | { error: false; data?: T; message?: string }
  | {
      error: true;
      message?: string;
      errors?: Record<string, string[] | undefined>;
    };

export function Ok<T>({
  message,
  data,
}: {
  message?: string;
  data?: T;
}): Result<T> {
  return {
    error: false,
    message,
    data,
  } as const;
}

export function Err({ message }: { message: string }): Result {
  return {
    error: true,
    message,
  } as const;
}

export function ValidationErr<T>({
  zodErr,
  message = "Invalid input(s)",
}: {
  zodErr?: z.ZodError<T>;
  message?: string;
}): Result {
  return {
    error: true,
    message,
    ...(zodErr ? { errors: z.flattenError(zodErr).fieldErrors } : {}),
  } as const;
}
