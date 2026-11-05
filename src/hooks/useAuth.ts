import { useEffect, useSyncExternalStore } from "react";
import { getAuthSnapshot, subscribeAuth } from "../lib/authSession";
import { loadCurrentUser } from "../lib/currentUser";

export default function useAuth() {
    const state = useSyncExternalStore(subscribeAuth, getAuthSnapshot, getAuthSnapshot);
    useEffect(() => {
        if (state.accessToken && !state.user && !state.error) void loadCurrentUser();
    }, [state.accessToken, state.user, state.error]);
    return { ...state, isAuthenticated: Boolean(state.accessToken), reloadUser: loadCurrentUser };
}
