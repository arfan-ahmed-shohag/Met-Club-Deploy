import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import metClubLogo from "../../assets/images/logo_original.png";
import { FiPlay } from "react-icons/fi";
import { LogIn, LogOut } from "lucide-react";
import useLogout from "../../hooks/useLogout";
import { getLocalizedPath, getStoredLocale, setStoredLocale } from "../../utils/language";
import useAuth from "../../hooks/useAuth";
import { profileImageUrl } from "../../lib/profile";
import HeaderNavigation from "./HeaderNavigation";

interface TopNavProps {
    title?: string;
    tone?: "default" | "red";
    brandName: string;
}

const menuItems = [
    {
        label: "প্রোফাইল দেখুন",
        englishLabel: "View profile",
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
        englishLabel: "Tutorials",
        href: "/tutorials",
        icon: <FiPlay />,
    },
    {
        label: "মেট ক্লাব সম্পর্কে জানুন",
        englishLabel: "About MET Club",
        href: "/about",
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
    const location = useLocation();
    const handleLogout = useLogout();
    const locale = getStoredLocale();
    const { user, isAuthenticated, isLoading, error, reloadUser } = useAuth();
    const avatar = user ? Array.from(new Intl.Segmenter(locale, { granularity: "grapheme" }).segment(user.fullName.trim()))[0]?.segment.toLocaleUpperCase(locale) : "";
    const roleLabel = user?.role === "admin" ? (locale === "en" ? "Admin" : "অ্যাডমিন") : (locale === "en" ? "Student" : "শিক্ষার্থী");
    const canSwitchLanguage = getLocalizedPath(location.pathname, locale === "en" ? "bn" : "en") !== location.pathname;

    const handleLanguageSwitch = (targetLocale: "bn" | "en") => {
        if (targetLocale === locale) return;
        const targetPath = getLocalizedPath(location.pathname, targetLocale);
        if (targetPath === location.pathname) return;
        setStoredLocale(targetLocale);
        navigate({ pathname: targetPath, search: location.search, hash: location.hash });
        setDropdownOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const mobileAccountLinkClass = "header-navigation-link flex w-full items-center gap-3 rounded px-3 py-2 text-left text-sm font-semibold";
    const renderMobileAccount = (closeMenu: () => void) => (
        <div className="space-y-1">
            {user && (
                <div className="mb-2 flex items-center gap-3 px-3 py-2">
                    <span className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-red-600 text-sm font-bold text-white" style={{}}>
                        {avatar}
                        {user.profileImg && <img src={profileImageUrl(user.profileImg)} alt="" className="absolute inset-0 h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} />}
                    </span>
                    <div className="min-w-0">
                        <p className="break-words text-sm font-semibold">{user.fullName}</p>
                        <p className="text-xs">{roleLabel}</p>
                    </div>
                </div>
            )}
            {isAuthenticated ? (
                <>
                    {user && menuItems.filter((item) => item.href !== "/").map((item) => {
                        const target = getLocalizedPath(item.href, locale);
                        return (
                            <Link key={item.href} to={target} onClick={closeMenu} aria-current={location.pathname === target ? "page" : undefined} data-active={location.pathname === target} className={mobileAccountLinkClass}>
                                {item.icon}{locale === "en" ? item.englishLabel : item.label}
                            </Link>
                        );
                    })}
                    {!user && isLoading && <div role="status" aria-label={locale === "en" ? "Loading your profile" : "Loading profile"} className="flex items-center gap-3 px-3 py-2"><span aria-hidden="true" className="profile-loading-shimmer h-9 w-9 rounded-full" /><span aria-hidden="true" className="flex-1 space-y-2"><span className="profile-loading-shimmer block h-3 w-28 rounded-full" /><span className="profile-loading-shimmer block h-2.5 w-16 rounded-full" /></span></div>}
                    {!user && error && <button type="button" onClick={() => void reloadUser()} className={mobileAccountLinkClass}>{locale === "en" ? "Retry profile" : "আবার চেষ্টা করুন"}</button>}
                    <button type="button" onClick={() => { closeMenu(); void handleLogout(); }} className={mobileAccountLinkClass}>
                        <LogOut size={17} aria-hidden="true" />{locale === "en" ? "Logout" : "লগআউট"}
                    </button>
                </>
            ) : (
                <Link to={getLocalizedPath("/login", locale)} onClick={closeMenu} className={mobileAccountLinkClass}>
                    <LogIn size={17} aria-hidden="true" />{locale === "en" ? "Login" : "লগইন"}
                </Link>
            )}
        </div>
    );

    return (
        <div className="h-18.5">
            <div
                className="fixed top-0 left-0 right-0 z-50 w-full flex items-center justify-between bg-white py-3" style={{ borderBottom: "1px solid #e5e7eb", overflow: "visible" }}
            >
                <div className="site-container relative z-10 flex items-center justify-between gap-2 xl:gap-4">
                    {/* LEFT LOGO */}
                    <Link to={getLocalizedPath("/", locale)} className="relative z-10 shrink-0">
                        <div className="flex items-center gap-2 group">

                            <img src={metClubLogo} alt={locale === "en" ? "Met Club logo" : "মেট ক্লাব লোগো"} className="h-12 w-12 object-contain" />


                            <span
                                className="hidden sm:block font-black text-lg"
                                style={{
                                    color: "rgba(127,29,29,0.9)",
                                    letterSpacing: "-0.5px",
                                }}
                            >
                                {brandName}
                            </span>
                        </div>
                    </Link>

                    {title && <span className="sr-only">{title}</span>}
                    <HeaderNavigation
                        key={`${location.pathname}:${locale}`}
                        locale={locale}
                        pathname={location.pathname}
                        onNavigate={() => setDropdownOpen(false)}
                        renderMobileAccount={renderMobileAccount}
                    />

                    {/* RIGHT USER */}
                    <div className="relative z-30 order-2 ml-auto flex shrink-0 items-center gap-2 sm:gap-3 xl:ml-0 xl:gap-4" ref={dropdownRef}>
                        {canSwitchLanguage && (
                            <div
                                role="group"
                                aria-label={locale === "en" ? "Select language" : "ভাষা নির্বাচন করুন"}
                                className="inline-flex items-center overflow-hidden rounded-lg border border-red-100 bg-red-50/70 shadow-sm"
                            >
                                <button
                                    type="button"
                                    onClick={() => handleLanguageSwitch("bn")}
                                    aria-pressed={locale === "bn"}
                                    className={`px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm cursor-pointer ${locale === "bn" ? "bg-red-600 text-white shadow-md" : "text-red-900 hover:bg-white/60"}`}
                                >
                                    BN
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleLanguageSwitch("en")}
                                    aria-pressed={locale === "en"}
                                    className={`px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm cursor-pointer ${locale === "en" ? "bg-red-600 text-white" : "text-red-900 hover:bg-white/60"}`}
                                >
                                    EN
                                </button>
                            </div>
                        )}
                        <div className="hidden items-center xl:flex">
                        {!isAuthenticated && (
                        <Link
                            to={getLocalizedPath("/login", locale)}
                            className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-red-600"
                        >
                            {locale === "en" ? "Login" : "লগইন"}
                        </Link>
                        )}
                        {isAuthenticated && !user && (
                            isLoading ? (
                                <div role="status" aria-label={locale === "en" ? "Loading your profile" : "Loading profile"} className="flex w-48 items-center gap-2 rounded-lg border border-slate-100 bg-white px-2 py-1.5"><span aria-hidden="true" className="profile-loading-shimmer h-8 w-8 shrink-0 rounded-full" /><span aria-hidden="true" className="flex-1 space-y-1.5"><span className="profile-loading-shimmer block h-3 w-24 rounded-full" /><span className="profile-loading-shimmer block h-2.5 w-14 rounded-full" /></span></div>
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
                            className="flex items-center gap-1.5 rounded p-1.5 transition-all duration-200 select-none"
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
                                style={{ color: "#7f1d1d", fontSize: "0.9rem",}}
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
                                        <div style={{ color: "#7f1d1d", fontWeight: 700, fontSize: "0.92rem",}}>
                                            {user.fullName}
                                        </div>
                                        <div style={{ color: "#b91c1c", fontSize: "0.78rem", fontWeight: 600 }}>{roleLabel}</div>
                                        <p className="truncate text-xs text-red-900/75" title={user.email}>{user.email}</p>
                                    </div>
                                </div>
                                <Link
                                    to={getLocalizedPath("/blogs", locale)}
                                    onClick={() => setDropdownOpen(false)}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-900 transition-colors hover:bg-red-100/60"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
                                    </svg>
                                    {locale === "en" ? "Blogs" : "ব্লগ"}
                                </Link>

                                <button
                                    onClick={() => {
                                        setDropdownOpen(false);
                                        navigate(getLocalizedPath("/learning-zone", locale));
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-150"
                                    style={{
                                        color: "#7f1d1d",
                                        fontSize: "0.9rem",
                                        fontWeight: 600,
                                        background: "transparent",
                                        border: "none",
                                        cursor: "pointer",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.10)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                        <path d="M15 18l-6-6 6-6" />
                                        <path d="M9 12h11" />
                                    </svg>
                                    {locale === "en" ? "Back to chapters" : "চ্যাপ্টার তালিকায় ফিরে যান"}
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
                                            }}
                                            onClick={() => setDropdownOpen(false)}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.10)")}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                        >
                                            <span style={{ color: "#ef4444" }}>{item.icon}</span>
                                            {locale === "en" ? item.englishLabel : item.label}
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
                                        {locale === "en" ? "Logout" : "লগআউট"}
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
        </div>
    );
}



