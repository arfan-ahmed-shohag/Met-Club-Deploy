import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import metClubLogo from "../../assets/images/logo_original.png";
import { FiPlay } from "react-icons/fi";
import useLogout from "../../hooks/useLogout";
import { getLocalizedPath, getStoredLocale } from "../../utils/language";
import useAuth from "../../hooks/useAuth";
import { profileImageUrl } from "../../lib/profile";

interface TopNavProps {
    title?: string;
    tone?: "default" | "red";
    brandName: string;
}

const menuItems = [
    {
        label: "প্রোফাইল দেখুন",
        href: "/profile",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        ),
    },
    {
        label: "টিউটোরিয়াল",
        href: "/tutorials",
        icon: <FiPlay />,
    },
    {
        label: "মেট ক্লাব সম্পর্কে জানুন",
        href: "/",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
            </svg>
        ),
    },
    // {
    //     label: "আমার অগ্রগতি",
    //     href: "/progress",
    //     icon: (
    //         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    //             <polyline points="9 11 12 14 22 4" />
    //             <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    //         </svg>
    //     ),
    // },
];

export default function TopNav({ title, tone = "default", brandName }: TopNavProps) {
    void tone;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const handleLogout = useLogout();
    const locale = getStoredLocale();
    const { user, isAuthenticated, isLoading, error, reloadUser } = useAuth();
    const avatar = user ? Array.from(new Intl.Segmenter(locale, { granularity: "grapheme" }).segment(user.fullName.trim()))[0]?.segment.toLocaleUpperCase(locale) : "";
    const roleLabel = user?.role === "admin" ? (locale === "en" ? "Admin" : "অ্যাডমিন") : (locale === "en" ? "Student" : "শিক্ষার্থী");

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="h-18.5">
            <div
                className="fixed top-0 left-0 right-0 z-50 w-full flex items-center justify-between px-6 py-3"
                style={{
                    background: "rgba(255,255,255,0.12)",
                    backdropFilter: "blur(28px) saturate(180%)",
                    WebkitBackdropFilter: "blur(28px) saturate(180%)",

                    borderBottom: "1px solid rgba(255,255,255,0.25)",

                    boxShadow:
                        "0 10px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.35)",
                    overflow: "visible",
                }}
            >
                {/* 🌟 Glass highlight layer (Apple shine) */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "linear-gradient(120deg, rgba(255,255,255,0.35), rgba(255,255,255,0.05), rgba(255,255,255,0))",
                        pointerEvents: "none",
                    }}
                />

                {/* optional subtle noise */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage:
                            "url('https://www.transparenttextures.com/patterns/noise.png')",
                        opacity: 0.04,
                        pointerEvents: "none",
                        mixBlendMode: "overlay",
                    }}
                />

                <div className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-0">
                    {/* LEFT LOGO */}
                    <Link to={getLocalizedPath("/", locale)} className="relative z-10 shrink-0">
                        <div className="flex items-center gap-2 group">

                            <img src={metClubLogo} alt="মেট ক্লাব লোগো" className="h-12 w-12 object-contain" />


                            <span
                                className="hidden sm:block font-black text-lg"
                                style={{
                                    color: "rgba(127,29,29,0.9)",
                                    letterSpacing: "-0.5px",
                                    textShadow:
                                        "-0.6px -0.6px 0 rgba(255,255,255,0.95), 0.6px -0.6px 0 rgba(255,255,255,0.95), -0.6px 0.6px 0 rgba(255,255,255,0.95), 0.6px 0.6px 0 rgba(255,255,255,0.95), 0 2px 8px rgba(127,29,29,0.18)",
                                }}
                            >
                                {brandName}
                            </span>
                        </div>
                    </Link>

                    {/* TITLE */}
                    <span
                        className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-[12px] sm:text-sm md:text-base lg:text-lg font-semibold truncate max-w-[44vw] sm:max-w-[50vw] md:max-w-[56vw]"
                        style={{
                            color: "rgba(127,29,29,0.85)",
                            textShadow:
                                "-0.6px -0.6px 0 rgba(255,255,255,0.95), 0.6px -0.6px 0 rgba(255,255,255,0.95), -0.6px 0.6px 0 rgba(255,255,255,0.95), 0.6px 0.6px 0 rgba(255,255,255,0.95), 0 2px 8px rgba(127,29,29,0.18)",
                        }}
                    >
                        {title}
                    </span>

                    {/* RIGHT USER */}
                    <div className="relative z-30 shrink-0 flex items-center gap-2" ref={dropdownRef}>
                        {!isAuthenticated && (
                        <Link
                            to={getLocalizedPath("/login", locale)}
                            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-red-700"
                        >
                            {locale === "en" ? "Login" : "লগইন"}
                        </Link>
                        )}
                        {isAuthenticated && !user && (
                            isLoading ? (
                                <span role="status" aria-label={locale === "en" ? "Loading your profile" : "প্রোফাইল লোড হচ্ছে"} className="h-8 w-8 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
                            ) : error ? (
                                <button type="button" onClick={() => void reloadUser()} className="rounded-xl bg-white/70 px-3 py-2 text-sm text-red-700">
                                    {locale === "en" ? "Retry profile" : "আবার চেষ্টা করুন"}
                                </button>
                            ) : null
                        )}
                        {user && (
                        <>
                        <button
                            type="button"
                            onClick={() => setDropdownOpen((prev) => !prev)}
                            aria-expanded={dropdownOpen}
                            aria-controls="user-menu"
                            aria-label={user.fullName}
                            className="flex items-center gap-2 rounded-2xl px-3 py-1.5 transition-all duration-200 select-none"
                            style={{
                                background: dropdownOpen ? "rgba(255,255,255,0.42)" : "rgba(255,255,255,0.30)",
                                border: "1.5px solid rgba(255,255,255,0.45)",
                                boxShadow: dropdownOpen
                                    ? "0 0 0 2.5px rgba(239,68,68,0.18), 0 8px 22px rgba(185,28,28,0.18)"
                                    : "0 4px 14px rgba(185,28,28,0.12)",
                                backdropFilter: "blur(14px)",
                                WebkitBackdropFilter: "blur(14px)",
                                cursor: "pointer",
                            }}
                        >
                            <span
                                className="relative flex items-center justify-center overflow-hidden rounded-full text-white font-bold text-sm"
                                style={{
                                    width: 32,
                                    height: 32,
                                    background: "linear-gradient(135deg, #ef4444, #f97316)",
                                    boxShadow: "0 2px 8px rgba(220,38,38,0.28)",
                                    flexShrink: 0,
                                }}
                            >
                                {avatar}
                                {user.profileImg && <img key={user.profileImg} src={profileImageUrl(user.profileImg)} alt="" className="absolute inset-0 h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} />}
                            </span>
                            <span
                                className="hidden max-w-40 truncate font-semibold sm:block"
                                style={{ color: "#7f1d1d", fontSize: "0.9rem", textShadow: "0 1px 4px rgba(255,255,255,0.28)" }}
                            >
                                {user.fullName}
                            </span>
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#ef4444"
                                strokeWidth="2.5"
                                className="w-4 h-4 transition-transform duration-200"
                                style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                            >
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>

                        {dropdownOpen && (
                            <div
                                id="user-menu"
                                className="absolute right-0 top-full mt-3 rounded-2xl overflow-hidden z-50"
                                style={{
                                    width: 230,
                                    background: "linear-gradient(120deg, rgba(255,237,234,0.88), rgba(255,223,215,0.78))",
                                    boxShadow: "0 12px 42px rgba(185,28,28,0.18), 0 2px 8px rgba(0,0,0,0.08)",
                                    border: "1.5px solid rgba(255,255,255,0.44)",
                                    backdropFilter: "blur(20px) saturate(140%)",
                                    WebkitBackdropFilter: "blur(20px) saturate(140%)",
                                    animation: "dropIn 0.18s cubic-bezier(.34,1.56,.64,1) both",
                                }}
                            >
                                <div
                                    className="flex items-center gap-3 px-4 py-3"
                                    style={{
                                        borderBottom: "1.5px solid rgba(239,68,68,0.15)",
                                        background: "linear-gradient(120deg, rgba(255,237,234,0.88), rgba(255,223,215,0.78))",
                                    }}
                                >
                                    <span
                                        className="relative flex items-center justify-center overflow-hidden rounded-full text-white font-bold"
                                        style={{
                                            width: 40,
                                            height: 40,
                                            background: "linear-gradient(135deg, #ef4444, #f97316)",
                                            fontSize: "1.05rem",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {avatar}
                                        {user.profileImg && <img key={user.profileImg} src={profileImageUrl(user.profileImg)} alt="" className="absolute inset-0 h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} />}
                                    </span>
                                    <div className="min-w-0">
                                        <div style={{ color: "#7f1d1d", fontWeight: 700, fontSize: "0.92rem", textShadow: "0 1px 3px rgba(255,255,255,0.25)" }}>
                                            {user.fullName}
                                        </div>
                                        <div style={{ color: "#b91c1c", fontSize: "0.78rem", fontWeight: 600 }}>{roleLabel}</div>
                                        <p className="truncate text-xs text-red-900/75" title={user.email}>{user.email}</p>
                                    </div>
                                </div>

                                

                                <button
                                    onClick={() => {
                                        setDropdownOpen(false);
                                        navigate("/learning-zone");
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-150"
                                    style={{
                                        color: "#7f1d1d",
                                        fontSize: "0.9rem",
                                        fontWeight: 600,
                                        background: "transparent",
                                        border: "none",
                                        cursor: "pointer",
                                        textShadow: "0 1px 3px rgba(255,255,255,0.2)",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.10)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                        <path d="M15 18l-6-6 6-6" />
                                        <path d="M9 12h11" />
                                    </svg>
                                    চ্যাপ্টার তালিকায় ফিরে যান
                                </button>

                                <div className="py-1.5">
                                    {menuItems.map((item) => (
                                        <Link
                                            key={item.label}
                                            to={getLocalizedPath(item.href, locale)}
                                            className="flex items-center gap-3 px-4 py-2.5 transition-colors duration-150"
                                            style={{
                                                color: "#7f1d1d",
                                                textDecoration: "none",
                                                fontSize: "0.9rem",
                                                fontWeight: 600,
                                                textShadow: "0 1px 3px rgba(255,255,255,0.2)",
                                            }}
                                            onClick={() => setDropdownOpen(false)}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.10)")}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                        >
                                            <span style={{ color: "#ef4444" }}>{item.icon}</span>
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>

                                <div style={{ borderTop: "1.5px solid rgba(239,68,68,0.15)" }}>
                                    <button
                                        onClick={() => {
                                            setDropdownOpen(false);
                                            handleLogout();
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors duration-150"
                                        style={{
                                            color: "#b45309",
                                            fontSize: "0.88rem",
                                            fontWeight: 600,
                                            background: "transparent",
                                            border: "none",
                                            cursor: "pointer",
                                            textAlign: "left",
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(245,158,11,0.12)")}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                            <polyline points="16 17 21 12 16 7" />
                                            <line x1="21" y1="12" x2="9" y2="12" />
                                        </svg>
                                        লগআউট
                                    </button>
                                </div>
                            </div>
                        )}
                        </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
