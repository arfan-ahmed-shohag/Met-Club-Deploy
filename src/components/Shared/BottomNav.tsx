interface BottomNavProps {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  answered?: boolean;
  variant?: "section" | "quiz";
  isPending?: boolean;
}

export default function BottomNav({
  current,
  total,
  onPrev,
  onNext,
  answered = true,     // section mode default: always enabled
  variant = "section",
  isPending = false,
}: BottomNavProps) {

  const isLast = current === total - 1;
  const isSectionTone = variant === "section";
  // Use section's button colors for quiz as well per UX request
  const useSectionToneForButtons = variant === "section" || variant === "quiz";

  /* ── Label sets per variant ───────────────────────────────── */
  const labels = {
    section: {
      prevShort: "← পূর্ববর্তী",
      prevFull: "← পূর্ববর্তী",
      nextShort: isLast ? "শেষ করো ✓" : "পরবর্তী →",
      nextFull: isLast ? "শেষ করো ✓" : "পরবর্তী →",
    },
    quiz: {
      prevShort: "←",
      prevFull: "← আগের প্রশ্ন",
      nextShort: isLast ? "শেষ ✓" : "পরের →",
      nextFull: isLast ? "শেষ করো ✓" : "পরের প্রশ্ন →",
    },
  }[variant];

  /* ── Button styles ────────────────────────────────────────── */
  const prevStyle: React.CSSProperties = {
    background: current === 0
      ? (useSectionToneForButtons ? "rgba(254,226,226,0.7)" : "rgba(209,250,229,0.5)")
      : (useSectionToneForButtons ? "linear-gradient(135deg,#fee2e2,#fecaca)" : "linear-gradient(135deg,#d1fae5,#a7f3d0)"),
    border: useSectionToneForButtons ? "2.5px solid #D1CCBD" : "2.5px solid #6ee7b7",
    color: useSectionToneForButtons ? "#991b1b" : "#065f46",
    boxShadow: current > 0 ? (useSectionToneForButtons ? "0 4px 16px rgba(239,68,68,0.23)" : "0 4px 16px rgba(110,231,183,0.30)") : "none",
  };

  const nextStyle: React.CSSProperties = {
    background: answered
      ? (useSectionToneForButtons ? "linear-gradient(135deg,#DA291C,#DA291C)" : "linear-gradient(135deg,#0ea5e9,#0284c7)")
      : (useSectionToneForButtons ? "linear-gradient(135deg,#fee2e2,#fecaca)" : "linear-gradient(135deg,#e0f2fe,#bae6fd)"),
    border: useSectionToneForButtons ? "2.5px solid #FC4C02" : "2.5px solid #38bdf8",
    color: answered ? "#fff" : (useSectionToneForButtons ? "#D1CCBD" : "#7dd3fc"),
    boxShadow: answered ? (useSectionToneForButtons ? "0 4px 16px rgba(239,68,68,0.33)" : "0 4px 16px rgba(14,165,233,0.35)") : "none",
  };

  /* ── Shared button classes ────────────────────────────────── */
  const btnBase =
    "flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap rounded-full font-bold " +
    "px-3 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm tracking-wide sm:tracking-widest " +
    "transition-all hover:scale-105 active:scale-95 " +
    "disabled:opacity-35 disabled:cursor-not-allowed";

  return (
    <div
      className="flex items-center justify-between gap-2 px-3 sm:px-6 py-3 sm:py-4 relative z-20"
      style={{
        background: "rgba(255,255,255,0.14)",
        backdropFilter: "blur(26px) saturate(180%)",
        WebkitBackdropFilter: "blur(26px) saturate(180%)",

        borderTop: "1px solid rgba(255,255,255,0.25)",

        boxShadow:
          "0 -10px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.35)",

        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 🌟 Apple glass shine layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(120deg, rgba(255,255,255,0.35), rgba(255,255,255,0.08), transparent 70%)",
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
          opacity: 0.03,
          pointerEvents: "none",
          mixBlendMode: "overlay",
        }}
      />

      <div className="site-container relative z-10 flex items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        {/* ── Previous ── */}
        <button
          onClick={onPrev}
          disabled={current === 0}
          className={btnBase}
          style={{
            ...prevStyle,
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            boxShadow:
              current > 0
                ? "0 6px 18px rgba(0,0,0,0.12)"
                : "none",
          }}
        >
          <span className="sm:hidden">{labels.prevShort}</span>
          <span className="hidden sm:inline">{labels.prevFull}</span>
        </button>

        {/* ── Progress ── */}
        <div className="flex flex-col items-center gap-1 shrink min-w-0 relative z-10">
          <span
            className="text-xs font-semibold"
            style={{ color: isSectionTone ? "#222221" : "#1e3a8a" }}
          >
            {current + 1} / {total}
          </span>

          <div className={`gap-1 sm:gap-1.5 ${total > 8 ? "hidden md:flex" : "flex"}`}>
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? 18 : 6,
                  height: 6,

                  background:
                    i < current
                      ? isSectionTone
                        ? "linear-gradient(135deg,#FC4C02,#DA291C)"
                        : "linear-gradient(135deg,#FC4C02,#DA291C)"
                      : i === current
                        ? isSectionTone
                          ? "linear-gradient(135deg,#DA291C,#9A3324)"
                          : "linear-gradient(135deg,#DA291C,#9A3324)"
                        : isSectionTone
                          ? "rgba(248,113,113,0.35)"
                          : "rgba(248,113,113,0.35)",

                  boxShadow:
                    i === current
                      ? isSectionTone
                        ? "0 2px 10px rgba(220,38,38,0.38)"
                        : "0 2px 10px rgba(220,38,38,0.38)"
                      : "none",
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Next ── */}
        <button
          onClick={onNext}
          disabled={!answered || isPending}
          className={btnBase}
          style={{
            ...nextStyle,
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",

            boxShadow: answered
              ? "0 8px 24px rgba(0,0,0,0.18)"
              : "none",
          }}
        >
          {isPending ? (
            <>
              <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              <span className="hidden sm:inline">লোড হচ্ছে...</span>
            </>
          ) : (
            <>
              <span className="sm:hidden">{labels.nextShort}</span>
              <span className="hidden sm:inline">{labels.nextFull}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
