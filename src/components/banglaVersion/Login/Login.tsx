import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router";
import axiosPublic from "../../../hooks/axiosPublic";
import axios from "axios";
import { setSessionToken } from "../../../lib/authSession";
import {
  normalizeEmail,
  validateEmail,
  validateLoginPassword,
} from "../../../utils/userValidation";
import { getLocalizedPath, getStoredLocale } from "../../../utils/language";
import {
  getExternalRedirect,
  redirectSearch,
} from "../../../utils/gameRedirect";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function Login({ embedded = false }: { embedded?: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const axiosInstance = axiosPublic();
  const isEnglish = getStoredLocale() === "en";
  // Set when the game sent the player here: return there after signing in.
  const externalRedirect = getExternalRedirect(location.search);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await axiosInstance.post("/auth/login", data);
      setSessionToken(res.data.data.accessToken);
      toast.success(
        res.data.message ||
          (isEnglish
            ? "Login successful! Welcome back."
            : "লগইন সফল! এখন যাত্রা শুরু করুন।"),
        {
        id: "error",
        },
      );
      if (externalRedirect) {
        window.location.assign(externalRedirect);
        return;
      }
      const requestedPage = (
        location.state as {
          from?: { pathname?: string; search?: string; hash?: string };
        } | null
      )?.from;
      if (
        requestedPage?.pathname === "/blogs/write" ||
        requestedPage?.pathname === "/en/blogs/write" ||
        requestedPage?.pathname === "/anticipatory-action" ||
        requestedPage?.pathname === "/en/anticipatory-action"
      ) {
        navigate(
          `${requestedPage.pathname}${requestedPage.search || ""}${requestedPage.hash || ""}`,
          { replace: true },
        );
        return;
      }
      if (res.data.data.user.role === "admin") {
        // Back to the admin page that sent them to login, else the overview.
        const adminPage = requestedPage?.pathname?.startsWith("/admin")
          ? `${requestedPage.pathname}${requestedPage.search || ""}${requestedPage.hash || ""}`
          : "/admin/overview";
        navigate(adminPage, { replace: true });
        return;
      }
        navigate(getLocalizedPath("/", isEnglish ? "en" : "bn"));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const fieldErrors = error.response?.data.errors;
        for (const field of ["email", "password"] as const) {
          if (typeof fieldErrors?.[field] === "string")
            setError(field, { type: "server", message: fieldErrors[field] });
        }
        toast.error(
          error.response?.data.errorMessage ||
            isEnglish
              ? "Unable to log in. Please try again."
              : "লগইন করা যায়নি। আবার চেষ্টা করুন।",
          { id: "error" },
        );
      } else {
        toast.error(isEnglish ? "Login failed." : "লগইন ব্যর্থ হয়েছে।", {
          id: "error",
        });
      }
    }
  };

  return (
    <div
      className={
        embedded
          ? "relative w-full space-y-5"
          : "relative mx-auto w-full max-w-md space-y-4 overflow-hidden rounded-3xl border border-white/50 bg-[linear-gradient(140deg,rgba(255,255,255,0.52),rgba(255,255,255,0.34))] p-6 shadow-[0_12px_34px_rgba(15,23,42,0.28)] sm:space-y-6 sm:p-8"
      }
    >
      {!embedded && (
        <>
          <div className="pointer-events-none absolute -top-16 -right-12 h-36 w-36 rounded-full bg-red-300/16 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-12 h-36 w-36 rounded-full bg-rose-200/14 blur-3xl" />
        </>
      )}

      <div className="relative z-10">
        <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-slate-900 drop-shadow-sm md:text-2xl">
          {isEnglish ? "Log in to your account" : "লগইন করুন"}
        </h1>

        <form
          noValidate
          className="space-y-4 md:space-y-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-slate-800"
            >
              {isEnglish ? "Email" : "ইমেইল"}
            </label>
            <input
              type="email"
              id="email"
              autoComplete="email"
              placeholder={isEnglish ? "Enter your email" : "আপনার ইমেইল লিখুন"}
              {...register("email", {
                setValueAs: normalizeEmail,
                validate: validateEmail,
              })}
              className={`bg-white/40 border border-slate-300/70 text-slate-900 rounded-xl block w-full p-3 focus:ring-2 focus:ring-red-300 focus:border-red-300 focus:outline-none placeholder:text-slate-500 ${errors.email ? "border-red-500" : "border-slate-300/70"}`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-slate-800"
            >
              {isEnglish ? "Password" : "পাসওয়ার্ড"}
            </label>
            <input
              type="password"
              id="password"
              autoComplete="current-password"
              placeholder="••••••••"
              {...register("password", {
                validate: validateLoginPassword,
              })}
              className={`bg-white/40 border border-slate-300/70 text-slate-900 rounded-xl block w-full p-3 focus:ring-2 focus:ring-red-300 focus:border-red-300 focus:outline-none placeholder:text-slate-500 ${errors.password ? "border-red-500" : "border-slate-300/70"}`}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end">
            <p className="text-sm font-semibold text-red-700 hover:text-red-800 hover:underline cursor-pointer">
              {isEnglish ? "Forgot password?" : "পাসওয়ার্ড ভুলে গেছেন?"}
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full text-white cursor-pointer bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-semibold rounded-xl text-sm px-5 py-3 text-center disabled:cursor-not-allowed disabled:opacity-60 shadow-[0_4px_12px_0_rgba(0,0,0,0.1)] transition-all duration-200 active:scale-95"
          >
            {isSubmitting
              ? isEnglish
                ? "Please wait..."
                : "অপেক্ষা করুন..."
              : isEnglish
                ? "Log in"
                : "লগইন"}
          </button>

          <p className="text-sm font-normal text-slate-700 text-center mt-6">
            {isEnglish ? "Don’t have an account?" : "অ্যাকাউন্ট নেই?"}{" "}
            <Link
              to={`${getLocalizedPath("/registration", isEnglish ? "en" : "bn")}${redirectSearch(externalRedirect)}`}
              className="font-semibold text-red-700 hover:text-red-800 hover:underline"
            >
              {isEnglish ? "Create an account" : "নিবন্ধন করুন"}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
