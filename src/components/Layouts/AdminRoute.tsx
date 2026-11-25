import type { ReactNode } from "react";
import { Link, useLocation } from "react-router";
import {
  FiHome,
  FiLock,
  FiLogIn,
  FiRefreshCw,
  FiShieldOff,
} from "react-icons/fi";
import useAuth from "../../hooks/useAuth";

// Guards every /admin page: only a signed-in admin sees the admin panel.
// This is only for the UI — the backend checks the admin role on every
// admin API call (auth(Role.admin)), so it is the real protection.
export default function AdminRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { isAuthenticated, user, isLoading, error, reloadUser } = useAuth();

  if (!isAuthenticated)
    return (
      <AccessMessage
        icon={FiLock}
        title="লগইন করা নেই"
        message="অ্যাডমিন প্যানেলে ঢুকতে অ্যাডমিন অ্যাকাউন্ট দিয়ে লগইন করুন।"
      >
        <Link
          to="/login"
          // Login sends an admin back to the page they asked for.
          state={{ from: location }}
          replace
          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 font-bold text-white shadow-md shadow-red-600/25 transition-colors hover:bg-red-700"
        >
          <FiLogIn aria-hidden="true" /> লগইন করুন
        </Link>
        <HomeLink />
      </AccessMessage>
    );

  if (!user && error)
    return (
      <AccessMessage
        icon={FiShieldOff}
        title="অ্যাকাউন্ট যাচাই করা যায়নি"
        message={error}
      >
        <button
          type="button"
          onClick={() => void reloadUser()}
          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 font-bold text-white shadow-md shadow-red-600/25 transition-colors hover:bg-red-700"
        >
          <FiRefreshCw aria-hidden="true" /> আবার চেষ্টা করুন
        </button>
        <HomeLink />
      </AccessMessage>
    );

  if (!user || isLoading)
    return (
      <div
        className="admin-shell grid min-h-screen place-items-center"
        role="status"
        aria-live="polite"
      >
        <div className="flex flex-col items-center gap-3 text-red-950/70">
          <span className="h-10 w-10 animate-spin rounded-full border-4 border-red-200 border-t-red-600 motion-reduce:animate-none" />
          <p className="text-sm font-semibold">অ্যাকাউন্ট যাচাই করা হচ্ছে…</p>
        </div>
      </div>
    );

  if (user.role !== "admin")
    return (
      <AccessMessage
        icon={FiShieldOff}
        title="প্রবেশের অনুমতি নেই"
        message="এই পেজটি শুধু অ্যাডমিনদের জন্য। আপনার অ্যাকাউন্ট দিয়ে অ্যাডমিন প্যানেলে ঢোকা যাবে না।"
        code="৪০৩"
      >
        <HomeLink primary />
      </AccessMessage>
    );

  return children;
}

function HomeLink({ primary = false }: { primary?: boolean }) {
  return (
    <Link
      to="/"
      className={
        primary
          ? "inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 font-bold text-white shadow-md shadow-red-600/25 transition-colors hover:bg-red-700"
          : "inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 font-bold text-red-950 ring-1 ring-red-200 transition-colors hover:bg-red-50"
      }
    >
      <FiHome aria-hidden="true" /> হোমে ফিরে যান
    </Link>
  );
}

function AccessMessage({
  icon: Icon,
  title,
  message,
  code,
  children,
}: {
  icon: typeof FiLock;
  title: string;
  message: string;
  code?: string;
  children: ReactNode;
}) {
  return (
    <main className="admin-shell grid min-h-screen place-items-center px-4 py-10">
      <section
        role="alert"
        className="w-full max-w-md rounded-3xl bg-white/70 p-8 text-center shadow-[0_24px_60px_rgba(154,51,36,0.16)] ring-1 ring-white/70 backdrop-blur-xl"
      >
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white shadow-lg shadow-red-700/25">
          <Icon className="h-8 w-8" aria-hidden="true" />
        </span>
        {code && (
          <p className="mt-5 text-sm font-black tracking-[.2em] text-red-600">
            {code}
          </p>
        )}
        <h1
          className={`${code ? "mt-1" : "mt-5"} text-2xl font-black text-red-950`}
        >
          {title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{message}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {children}
        </div>
      </section>
    </main>
  );
}
