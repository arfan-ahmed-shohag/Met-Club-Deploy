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

const TOO_LARGE_MESSAGE =
  "This file is too large for the server to accept. Please choose a smaller file.";
const NO_RESPONSE_UPLOAD_MESSAGE =
  "The upload did not reach the server. The file may be too large for the server, or the connection dropped. Please try a smaller file or try again.";

/**
 * Like getApiErrorMessage, for requests that send files. The web server in
 * front of the API rejects large bodies with 413 before the API sees them,
 * and that reply has no CORS headers, so the browser often reports only a
 * network error with no response; both cases get a message about file size.
 */
export function getUploadErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError(error)) {
    if (error.response?.status === 413) return TOO_LARGE_MESSAGE;
    if (!error.response && error.code !== "ERR_CANCELED")
      return NO_RESPONSE_UPLOAD_MESSAGE;
  }
  return getApiErrorMessage(error, fallback);
}
