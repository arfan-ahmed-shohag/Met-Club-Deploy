import { useEffect, useId, useRef, useState } from "react";
import { Link, NavLink } from "react-router";
import { FiX } from "react-icons/fi";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  LogOut,
  UserRound,
} from "lucide-react";
import metClubLogo from "../../../assets/images/logo_original.png";
import useLogout from "../../../hooks/useLogout";
import useAuth from "../../../hooks/useAuth";
import { profileImageUrl } from "../../../lib/profile";
import { adminLinkGroups } from "./adminLinks";
import { getLocalizedPath, getStoredLocale } from "../../../utils/language";

interface SidebarProps {
  /** Shown in the mobile drawer to close it. */
  onClose?: () => void;
  /** Desktop only: show icons without labels. */
  collapsed?: boolean;
  /** Desktop only: renders the collapse toggle on the sidebar edge. */
  onToggleCollapse?: () => void;
}

/** Fades labels out quickly on collapse and back in once the sidebar has widened. */
function fadeClass(collapsed: boolean) {
  return collapsed
    ? "opacity-0 transition-opacity duration-100 motion-reduce:transition-none"
    : "opacity-100 transition-opacity duration-200 delay-100 motion-reduce:transition-none";
}

/**
 * Admin navigation: brand, grouped links and the signed-in admin card.
 * Uses the Home page's dark brown card gradient with the site's red accents.
 *
 * Collapsing only narrows the sidebar: every row keeps its padding, so icons
 * stay put while labels fade and get clipped, and the width change is smooth.
 */
export default function Sidebar({
  onClose,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const fade = fadeClass(collapsed);
  return (
    <div className="relative flex h-full flex-col bg-[linear-gradient(322deg,#222221_2%,#40302d_97%)] text-white shadow-[inset_-1px_0_0_rgba(255,255,255,.06)]">
      {/* Soft red and orange glows, clipped to the sidebar */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <span className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-red-600/25 blur-3xl" />
        <span className="absolute -bottom-24 -right-16 h-56 w-56 rounded-full bg-orange-500/10 blur-3xl" />
      </div>

      {onToggleCollapse && (
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "সাইডবার বড় করুন" : "সাইডবার ছোট করুন"}
          aria-expanded={!collapsed}
          title={collapsed ? "সাইডবার বড় করুন" : "সাইডবার ছোট করুন"}
          className="absolute -right-3.5 top-[22px] z-30 grid h-7 w-7 place-items-center rounded-full border border-white/20 bg-[#3a2c29] text-white/80 shadow-lg shadow-black/30 transition-colors hover:border-red-400/60 hover:bg-red-600 hover:text-white"
        >
          <ChevronLeft
            aria-hidden="true"
            className={`h-4 w-4 transition-transform duration-300 motion-reduce:transition-none ${collapsed ? "rotate-180" : ""}`}
          />
        </button>
      )}

      {/* Brand */}
      <div className="relative flex h-17 shrink-0 items-center justify-between gap-2 overflow-hidden border-b border-white/10 px-[18px]">
        <Link
          to="/"
          title={collapsed ? "মেট ক্লাব" : undefined}
          className="group flex min-w-0 items-center gap-3"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white shadow-lg shadow-black/20 transition-transform duration-200 group-hover:scale-105">
            <img
              src={metClubLogo}
              alt="মেট ক্লাব লোগো"
              className="h-9 w-9 object-contain"
            />
          </span>
          <span
            className={`min-w-0 whitespace-nowrap leading-tight ${fade}`}
            aria-hidden={collapsed || undefined}
          >
            <span className="block truncate text-lg font-black tracking-tight text-white">
              মেট ক্লাব
            </span>
            <span className="block text-xs font-semibold text-red-300">
              অ্যাডমিন প্যানেল
            </span>
          </span>
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="মেনু বন্ধ করুন"
            className="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <FiX className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav
        aria-label="অ্যাডমিন মেনু"
        className="custom-scrollbar relative flex-1 space-y-6 overflow-y-auto overflow-x-hidden px-3 py-5"
      >
        {adminLinkGroups.map((group) => (
          <div key={group.label}>
            <div className="relative mb-2 h-4">
              <p
                className={`whitespace-nowrap px-3 text-[11px] font-bold uppercase leading-4 tracking-wider text-white/40 ${fade}`}
              >
                {group.label}
              </p>
              <span
                aria-hidden="true"
                className={`absolute inset-x-2 top-1/2 h-px bg-white/10 transition-opacity duration-200 motion-reduce:transition-none ${
                  collapsed ? "opacity-100 delay-100" : "opacity-0"
                }`}
              />
            </div>
            <ul className="space-y-1">
              {group.links.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.path}>
                    <NavLink
                      to={link.path}
                      onClick={onClose}
                      title={collapsed ? link.name : undefined}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-[15px] font-semibold transition-colors duration-150 ${
                          isActive
                            ? "bg-red-600 text-white shadow-lg shadow-red-950/40"
                            : "text-white/70 hover:bg-white/[.07] hover:text-white"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-white/[.06] text-red-300 group-hover:bg-white/10 group-hover:text-white"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className={`whitespace-nowrap ${fade}`}>
                            {link.name}
                          </span>
                        </>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <AccountMenu onNavigate={onClose} collapsed={collapsed} />
    </div>
  );
}

/** Signed-in admin card; clicking it opens a menu with profile and logout. */
function AccountMenu({
  onNavigate,
  collapsed,
}: {
  onNavigate?: () => void;
  collapsed: boolean;
}) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const logOut = useLogout();
  const { user } = useAuth();
  const initial = user?.fullName.trim().charAt(0).toLocaleUpperCase() ?? "A";
  const profilePath = getLocalizedPath("/profile", getStoredLocale());
  const name = user?.fullName ?? "অ্যাডমিন";

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const avatar = (size: string) => (
    <span
      className={`relative flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-red-600 to-orange-500 font-bold text-white`}
    >
      {initial}
      {user?.profileImg && (
        <img
          src={profileImageUrl(user.profileImg)}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      )}
    </span>
  );

  return (
    <div
      ref={menuRef}
      className="relative shrink-0 border-t border-white/10 p-2"
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={collapsed ? name : undefined}
        title={collapsed ? name : undefined}
        className={`flex w-full items-center gap-3 overflow-hidden rounded-xl border p-2.5 text-left transition-colors ${
          open
            ? "border-red-400/40 bg-white/[.12]"
            : "border-white/10 bg-white/[.06] hover:bg-white/[.1]"
        }`}
      >
        <span className="shrink-0 rounded-full ring-2 ring-white/15">
          {avatar("h-10 w-10")}
        </span>
        <span
          className={`flex min-w-0 flex-1 items-center gap-3 ${fadeClass(collapsed)}`}
          aria-hidden={collapsed || undefined}
        >
          <span className="min-w-0 flex-1 whitespace-nowrap leading-tight">
            <span className="block truncate text-sm font-bold text-white">
              {name}
            </span>
            <span className="block truncate text-xs text-white/50">
              {user?.email ?? "অ্যাডমিন"}
            </span>
          </span>
          <ChevronUp
            aria-hidden="true"
            className={`h-4 w-4 shrink-0 text-white/60 transition-transform lg:hidden ${open ? "" : "rotate-180"}`}
          />
          <ChevronRight
            aria-hidden="true"
            className={`hidden h-4 w-4 shrink-0 text-white/60 transition-transform lg:block ${open ? "translate-x-0.5 text-white" : ""}`}
          />
        </span>
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label="অ্যাকাউন্ট মেনু"
          className="admin-account-menu absolute bottom-full left-3 right-3 z-50 mb-2 overflow-hidden rounded-2xl border border-red-100 bg-white text-red-950 shadow-[0_18px_48px_rgba(34,34,33,0.28)] lg:bottom-3 lg:left-full lg:right-auto lg:mb-0 lg:ml-2 lg:w-64"
        >
          <div className="flex items-center gap-3 border-b border-red-100 bg-red-50 px-4 py-3">
            {avatar("h-9 w-9 text-sm")}
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-sm font-bold">{name}</span>
              <span className="block text-xs font-semibold text-red-600">
                অ্যাডমিন
              </span>
            </span>
          </div>
          <div className="p-1.5">
            <Link
              to={profilePath}
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-900 transition-colors hover:bg-red-50 hover:text-red-700"
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-red-50 text-red-600">
                <UserRound className="h-4 w-4" />
              </span>
              প্রোফাইল দেখুন
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                void logOut();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-900 transition-colors hover:bg-red-50 hover:text-red-700"
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-red-50 text-red-600">
                <LogOut className="h-4 w-4" />
              </span>
              লগ আউট
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
