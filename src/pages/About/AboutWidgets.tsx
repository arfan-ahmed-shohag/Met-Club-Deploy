import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { prefersReducedMotion, useInView } from "./aboutMotion";

/** Puffy cartoon cloud. Size and colour come from the parent via className. */
export function Cloud({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 64"
      className={className}
      style={style}
      fill="currentColor"
    >
      <circle cx="34" cy="38" r="20" />
      <circle cx="60" cy="26" r="24" />
      <circle cx="86" cy="36" r="20" />
      <rect x="18" y="36" width="86" height="24" rx="12" />
    </svg>
  );
}

/** Cartoon sun whose rays spin slowly. */
export function Sun({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 120" className={className}>
      <g className="about-spin" style={{ transformOrigin: "60px 60px" }}>
        {Array.from({ length: 12 }, (_, i) => (
          <rect
            key={i}
            x="56"
            y="4"
            width="8"
            height="20"
            rx="4"
            fill="#f2a900"
            transform={`rotate(${i * 30} 60 60)`}
          />
        ))}
      </g>
      <circle cx="60" cy="60" r="30" fill="#ffc93c" />
      <circle cx="49" cy="56" r="3.5" fill="#9a3324" />
      <circle cx="71" cy="56" r="3.5" fill="#9a3324" />
      <path
        d="M48 67 Q60 78 72 67"
        stroke="#9a3324"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="42" cy="65" r="4" fill="#fc4c02" opacity="0.35" />
      <circle cx="78" cy="65" r="4" fill="#fc4c02" opacity="0.35" />
    </svg>
  );
}

/** Wavy edge that blends one section into the next. */
export function WaveDivider({
  color,
  flip = false,
}: {
  color: string;
  flip?: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-x-0 z-20 h-10 w-full md:h-16 ${flip ? "top-0 rotate-180" : "-bottom-px"}`}
    >
      <path
        d="M0 40 C 180 80 360 0 540 32 C 720 64 900 8 1080 36 C 1260 64 1350 30 1440 40 L1440 80 L0 80 Z"
        fill={color}
      />
    </svg>
  );
}

/** Counts from 0 to `to` the first time it scrolls into view. */
export function CountUp({
  to,
  isEnglish,
  suffix = "",
  duration = 1400,
}: {
  to: number;
  isEnglish: boolean;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, 0.6);
  const [value, setValue] = useState(() => (prefersReducedMotion() ? to : 0));

  useEffect(() => {
    if (!inView || prefersReducedMotion()) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * to));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, to, duration]);

  const shown = isEnglish ? String(value) : value.toLocaleString("bn-BD");
  return (
    <span ref={ref} className="tabular-nums">
      {shown}
      {suffix}
    </span>
  );
}

/** Thin rainbow bar at the very top that fills as the page scrolls. */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? window.scrollY / max : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${ratio})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-1.5"
    >
      <div ref={barRef} className="about-progress h-full origin-left" />
    </div>
  );
}

/** Card that flips over when tapped to show its back side. */
export function FlipCard({
  front,
  back,
  className = "",
}: {
  front: ReactNode;
  back: ReactNode;
  className?: string;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={flipped}
      onClick={() => setFlipped((value) => !value)}
      className={`about-flip group block w-full text-left focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-amber-500 rounded-[2rem] ${className}`}
    >
      <span className={`about-flip-inner ${flipped ? "is-flipped" : ""}`}>
        <span className="about-flip-face">{front}</span>
        <span className="about-flip-face about-flip-back">{back}</span>
      </span>
    </button>
  );
}
