import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { FiChevronRight, FiExternalLink, FiMenu } from "react-icons/fi";
import Sidebar from "./Sidebar";
import { getAdminPageTitle } from "./adminLinks";

const COLLAPSED_KEY = "met-club-admin-sidebar-collapsed";

function readCollapsed() {
  try {
    return localStorage.getItem(COLLAPSED_KEY) === "1";
  } catch {
    return false;
  }
}

export default function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const location = useLocation();
  const pageTitle = getAdminPageTitle(location.pathname);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);

  const toggleCollapsed = () => {
    setCollapsed((value) => {
      const next = !value;
      try {
        localStorage.setItem(COLLAPSED_KEY, next ? "1" : "0");
      } catch {
        // Storage can be unavailable; the toggle still works for this visit.
      }
      return next;
    });
  };

  return (
    <div className="admin-shell relative min-h-screen">
      {/* Desktop sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-20 hidden shadow-[8px_0_32px_rgba(34,34,33,0.18)] transition-[width] duration-300 ease-out motion-reduce:transition-none lg:block ${
          collapsed ? "w-20" : "w-72"
        }`}
      >
        <Sidebar collapsed={collapsed} onToggleCollapse={toggleCollapsed} />
      </aside>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="absolute inset-0 bg-red-950/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="অ্যাডমিন মেনু"
            className="relative z-50 h-full w-72 max-w-[85vw] shadow-2xl animate-in slide-in-from-left duration-300"
          >
            <Sidebar onClose={() => setMobileMenuOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main column */}
      <div
        className={`relative z-10 flex min-h-screen flex-col transition-[margin] duration-300 ease-out motion-reduce:transition-none ${
          collapsed ? "lg:ml-20" : "lg:ml-72"
        }`}
      >
        <header className="admin-topbar sticky top-0 z-30 flex h-17 shrink-0 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="rounded-xl border border-white/15 bg-white/[.06] p-2 text-white transition-colors hover:bg-white/10 lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="মেনু খুলুন"
              aria-expanded={mobileMenuOpen}
            >
              <FiMenu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <nav
                aria-label="ব্রেডক্রাম্ব"
                className="hidden items-center gap-1 text-xs font-semibold text-white/45 sm:flex"
              >
                <span>অ্যাডমিন</span>
                <FiChevronRight className="h-3 w-3" aria-hidden="true" />
                <span className="text-red-300">{pageTitle}</span>
              </nav>
              <h1 className="truncate text-lg font-black tracking-tight text-white sm:text-xl">
                {pageTitle}
              </h1>
            </div>
          </div>

          <Link
            to="/"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-red-600 px-3.5 py-2 text-sm font-bold text-white shadow-md shadow-black/30 transition-colors hover:bg-red-700 sm:px-4"
          >
            <FiExternalLink className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">সাইট দেখুন</span>
            <span className="sr-only sm:hidden">হোম</span>
          </Link>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
