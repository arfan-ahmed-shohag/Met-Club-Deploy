import { useEffect, type JSX } from "react";
import { X } from "lucide-react";
import metClubLogo from "../../assets/images/logo_original.png";
import Login from "../banglaVersion/Login/Login";
import { getStoredLocale } from "../../utils/language";

type LoginModalProps = {
  onClose: () => void;
};

export default function LoginModal({ onClose }: LoginModalProps): JSX.Element {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const isEnglish = getStoredLocale() === "en";

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-start justify-center overflow-y-auto bg-slate-950/55 p-3 backdrop-blur-sm sm:p-6 motion-safe:animate-[videoModalFadeIn_.2s_ease-out_both]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="presentation"
    >
      <section
        aria-modal="true"
        aria-label={isEnglish ? "Log in to your account" : "লগইন করুন"}
        className="relative my-auto grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-2xl sm:grid-cols-[0.82fr_1.18fr] sm:rounded-[28px] motion-safe:animate-[videoModalScaleIn_.25s_cubic-bezier(0.2,0.8,0.2,1)_both]"
        role="dialog"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={isEnglish ? "Close login" : "লগইন বন্ধ করুন"}
          className="absolute right-4 top-4 z-20 grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-red-50 hover:text-red-700"
        >
          <X size={19} aria-hidden="true" />
        </button>

        <aside className="relative hidden flex-col justify-between bg-gradient-to-br from-red-50 via-orange-50 to-rose-100 p-7 sm:flex lg:p-10">
          <div className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full border border-red-200/70" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-red-200/30 blur-2xl" />
          <img
            src={metClubLogo}
            alt={isEnglish ? "MET Club" : "মেট ক্লাব"}
            className="relative z-10 h-16 w-16 object-contain"
          />

          <div className="relative z-10">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-red-700">
              {isEnglish ? "MET CLUB LEARNING" : "মেট ক্লাব লার্নিং"}
            </p>
            <h2
              className="mt-3 max-w-sm text-3xl font-black leading-tight text-red-950"
            >
              {isEnglish
                ? "Learn about weather. Be ready."
                : "আবহাওয়া জানো, নিরাপদে থাকো"}
            </h2>
            <p className="mt-4 max-w-sm leading-relaxed text-slate-700">
              {isEnglish
                ? "Sign in to keep learning, explore stories, and help build safer communities."
                : "শেখা চালিয়ে যেতে, গল্প দেখতে এবং নিরাপদ কমিউনিটি গড়তে লগইন করুন।"}
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-sm font-semibold text-red-800">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-600" />
            {isEnglish
              ? "Curiosity grows into confidence"
              : "কৌতূহল থেকেই আত্মবিশ্বাস"}
          </div>
        </aside>

        <div className="flex items-center justify-center px-6 py-14 sm:px-8 sm:py-10 lg:px-14">
          <div className="w-full max-w-md">
            <div className="mb-7 sm:hidden">
              <img
                src={metClubLogo}
                alt={isEnglish ? "MET Club" : "মেট ক্লাব"}
                className="mb-5 h-12 w-12 object-contain"
              />
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-700">
                {isEnglish ? "MET CLUB LEARNING" : "মেট ক্লাব লার্নিং"}
              </p>
            </div>
            <Login embedded />
          </div>
        </div>
      </section>
    </div>
  );
}
