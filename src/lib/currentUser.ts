import { protectedApi } from "./api";
import { getAccessToken, getSessionVersion, setCurrentUser, setProfileError, setProfileLoading } from "./authSession";
import type { CurrentUser } from "../types/auth";

let profileRequest: { version: number; token: string; promise: Promise<void> } | null = null;
let profileRevision = 0;

export function applyCurrentUserUpdate(user: CurrentUser, version: number) {
    if (version !== getSessionVersion()) return;
    profileRevision += 1;
    setCurrentUser(user, version);
}

export function loadCurrentUser(): Promise<void> {
    const token = getAccessToken();
    if (!token) return Promise.resolve();
    const version = getSessionVersion();
    const revision = profileRevision;
    if (profileRequest?.version === version && profileRequest.token === token) return profileRequest.promise;
    setProfileLoading(version);
    const promise = protectedApi.get<{ success: boolean; data: CurrentUser }>("/auth/me").then(({ data, config }) => {
        if (revision !== profileRevision || config.headers.get("Authorization") !== `Bearer ${getAccessToken()}`) return;
        if (!data.success || !data.data || typeof data.data.fullName !== "string") throw new Error("Invalid user profile");
        setCurrentUser(data.data, version);
    }).catch(() => {
        if (revision === profileRevision && getAccessToken() === token) setProfileError("প্রোফাইল লোড করা যায়নি। আবার চেষ্টা করুন।", version);
    }).finally(() => {
        if (profileRequest?.promise === promise) profileRequest = null;
    });
    profileRequest = { version, token, promise };
    return promise;
}
