// Sites outside this app that the login and registration pages may send the
// user back to after signing in (`?redirect=<url>`). Anything else is ignored,
// so the parameter can't be used to send people to another website.
export const GAME_ORIGIN = "https://game.meteorologyclub.com";
const allowedOrigins = new Set([GAME_ORIGIN]);

/** The `?redirect=` target from a query string, or null if it isn't allowed. */
export function getExternalRedirect(search: string): string | null {
  const value = new URLSearchParams(search).get("redirect");
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && allowedOrigins.has(url.origin)
      ? url.href
      : null;
  } catch {
    return null;
  }
}

/** `?redirect=<target>` to carry the target over to another auth page. */
export function redirectSearch(target: string | null): string {
  return target ? `?redirect=${encodeURIComponent(target)}` : "";
}
