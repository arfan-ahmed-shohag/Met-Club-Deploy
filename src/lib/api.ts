import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { clearSession, getAccessToken, getSessionVersion, updateSessionToken } from "./authSession";

const defaultApiUrl = import.meta.env.DEV
    ? "http://localhost:5000/api/v1"
    : "https://api.meteorologyclub.com/api/v1";
const baseURL = (import.meta.env.VITE_API_URL || defaultApiUrl).replace(/\/$/, "");
export const publicApi = axios.create({ baseURL, withCredentials: true });
export const protectedApi = axios.create({ baseURL, withCredentials: true });

type AuthRequest = InternalAxiosRequestConfig & { _retry?: boolean; _sessionVersion?: number };
let refreshRequest: { version: number; promise: Promise<string> } | null = null;

protectedApi.interceptors.request.use((config: AuthRequest) => {
    const token = getAccessToken();
    config._sessionVersion = getSessionVersion();
    if (token) config.headers.set("Authorization", `Bearer ${token}`);
    else config.headers.delete("Authorization");
    if (typeof FormData !== "undefined" && config.data instanceof FormData) config.headers.delete("Content-Type");
    return config;
});

function refreshAccessToken(version: number) {
    if (refreshRequest?.version === version) return refreshRequest.promise;
    const promise = publicApi.get("/auth/refresh-token").then(({ data }) => {
        const token = data.data?.accessToken;
        if (!data.success || typeof token !== "string" || !token) throw new Error("Invalid refresh response");
        if (!updateSessionToken(token, version)) throw new Error("Session changed");
        return token;
    }).finally(() => {
        if (refreshRequest?.promise === promise) refreshRequest = null;
    });
    refreshRequest = { version, promise };
    return promise;
}

protectedApi.interceptors.response.use((response) => response, async (error: unknown) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401 || !error.config) return Promise.reject(error);
    const originalRequest = error.config as AuthRequest;
    const version = originalRequest._sessionVersion;
    if (version === undefined || version !== getSessionVersion() || !getAccessToken()) return Promise.reject(error);
    if (originalRequest._retry) {
        clearSession(version);
        return Promise.reject(error);
    }
    originalRequest._retry = true;
    const currentToken = getAccessToken();
    if (originalRequest.headers.get("Authorization") !== `Bearer ${currentToken}`) {
        originalRequest.headers.set("Authorization", `Bearer ${currentToken}`);
        return protectedApi(originalRequest);
    }
    try {
        const token = await refreshAccessToken(version);
        originalRequest.headers.set("Authorization", `Bearer ${token}`);
        return protectedApi(originalRequest);
    } catch (refreshError) {
        if (!axios.isAxiosError(refreshError) || [401, 403, 404].includes(refreshError.response?.status ?? 0)) clearSession(version);
        return Promise.reject(refreshError);
    }
});
