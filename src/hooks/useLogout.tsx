import { useNavigate } from "react-router";
import axiosPublic from "./axiosPublic";
import toast from "react-hot-toast";
import { getLocalizedPath, getStoredLocale } from "../utils/language";
import { useCallback } from "react";
import { clearSession, getSessionVersion } from "../lib/authSession";

export default function useLogout() {
    const axios = axiosPublic();
    const navigate = useNavigate();

    const logout = useCallback(async () => {
        const version = getSessionVersion();
        try {
            const res = await axios("/auth/logout");
            if (version !== getSessionVersion()) return;
            if (res.data.success) {
                toast.success("সফলভাবে লগআউট হয়েছে!", { id: "logout" });
                clearSession(version);
                navigate(getLocalizedPath("/", getStoredLocale()));
            } else {
                toast.error("লগআউট করতে সমস্যা হয়েছে, আবার চেষ্টা করুন!", { id: "logout" });
            }
        } catch (error) {
            toast.error("লগআউট করতে সমস্যা হয়েছে!", { id: "logout" });
            console.error("Logout error:", error);
        }
    }, [axios, navigate]);

    return logout
}
