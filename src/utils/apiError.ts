import { isAxiosError } from "axios";

/** Message from an API error response (`errorMessage`, then `message`), else `fallback`. */
export function getApiErrorMessage(error: unknown, fallback: string) {
  if (!isAxiosError(error)) return fallback;
  const body = error.response?.data as
    | { errorMessage?: unknown; message?: unknown }
    | undefined;
  if (typeof body?.errorMessage === "string") return body.errorMessage;
  if (typeof body?.message === "string") return body.message;
  return fallback;
}
