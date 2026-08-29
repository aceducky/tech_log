import z from "zod";

export type Ok<T = undefined> = { error: false; data: T; message?: string };
export type Err = {
  error: true;
  message: string;
  errors?: Record<string, string[] | undefined>;
};

export type Result<T = undefined> = Ok<T> | Err;

export function Ok<T = undefined>({
  message,
  data,
}: {
  message?: string;
  data: T;
}): Ok<T> {
  return {
    error: false,
    message,
    data,
  } as const;
}

export function Err({ message }: { message: string }): Err {
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
}): Err {
  return {
    error: true,
    message,
    ...(zodErr ? { errors: z.flattenError(zodErr).fieldErrors } : {}),
  } as const;
}
