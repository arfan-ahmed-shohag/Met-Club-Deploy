import type { CurrentUser } from "../types/auth";

interface AuthSnapshot {
    accessToken: string | null;
    user: CurrentUser | null;
    isLoading: boolean;
    error: string | null;
}

const readToken = () => typeof window === "undefined" ? null : window.localStorage.getItem("token");
const listeners = new Set<() => void>();
let sessionVersion = 0;
let snapshot: AuthSnapshot = { accessToken: readToken(), user: null, isLoading: Boolean(readToken()), error: null };

function publish(next: AuthSnapshot) {
    snapshot = next;
    listeners.forEach((listener) => listener());
}

export const getAuthSnapshot = () => snapshot;
export const getAccessToken = () => snapshot.accessToken;
export const getSessionVersion = () => sessionVersion;
export function subscribeAuth(listener: () => void) {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
}

export function setSessionToken(token: string) {
    window.localStorage.setItem("token", token);
    sessionVersion += 1;
    publish({ accessToken: token, user: null, isLoading: true, error: null });
}

export function clearSession(expectedVersion = sessionVersion) {
    if (expectedVersion !== sessionVersion) return;
    window.localStorage.removeItem("token");
    sessionVersion += 1;
    publish({ accessToken: null, user: null, isLoading: false, error: null });
}

export function updateSessionToken(token: string, expectedVersion: number) {
    if (expectedVersion !== sessionVersion || !snapshot.accessToken) return false;
    window.localStorage.setItem("token", token);
    // Refresh belongs to this same session; keep an open profile editor mounted.
    publish({ ...snapshot, accessToken: token, error: null });
    return true;
}

export function setCurrentUser(user: CurrentUser, expectedVersion: number) {
    if (expectedVersion !== sessionVersion || !snapshot.accessToken) return;
    publish({ ...snapshot, user, isLoading: false, error: null });
}

export function setProfileLoading(expectedVersion: number) {
    if (expectedVersion === sessionVersion) publish({ ...snapshot, isLoading: true, error: null });
}

export function setProfileError(message: string, expectedVersion: number) {
    if (expectedVersion === sessionVersion) publish({ ...snapshot, isLoading: false, error: message });
}

if (typeof window !== "undefined") {
    window.addEventListener("storage", (event) => {
        if (event.key !== "token" && event.key !== null) return;
        const token = readToken();
        if (token === snapshot.accessToken) return;
        sessionVersion += 1;
        publish({ accessToken: token, user: null, isLoading: Boolean(token), error: null });
    });
}
