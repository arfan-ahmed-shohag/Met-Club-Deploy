import { publicApi } from "../lib/api";

// localStorage key holding the time (ms) this browser was last counted.
const VISIT_KEY = "met-club-visit-counted-at";
const COUNT_AGAIN_AFTER_MS = 30 * 24 * 60 * 60 * 1000;

let visitRequest: Promise<void> = Promise.resolve();

const countedRecently = () => {
  try {
    const countedAt = Number(localStorage.getItem(VISIT_KEY));
    return countedAt > 0 && Date.now() - countedAt < COUNT_AGAIN_AFTER_MS;
  } catch {
    return false;
  }
};

// Counts this browser as a visitor at most once per 30 days for the Home
// "community" stats. The time is saved only after the server counted the
// visit, so a failed request is retried on the next page load. Admin pages
// are not counted, and failures never break the site.
export const recordSiteVisit = () => {
  if (window.location.pathname.startsWith("/admin") || countedRecently()) return;
  visitRequest = publicApi
    .post("/stats/visit")
    .then(() => {
      try {
        localStorage.setItem(VISIT_KEY, String(Date.now()));
      } catch {
        // Storage blocked: the visit is still counted once per page load.
      }
    })
    .catch(() => undefined);
};

// Resolves once this page load's visit request has finished (or at once if
// none was sent), so the stats shown include the current visitor.
export const siteVisitRecorded = () => visitRequest;
