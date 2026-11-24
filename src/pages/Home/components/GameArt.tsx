import { useId, type JSX } from "react";

// Hand-drawn cover illustrations for the Home Games cards (viewBox 320×180).
// Decorative only: the card title already names the game.

export type GameArtKind = "weather" | "flood" | "gobag";

const svgProps = {
  viewBox: "0 0 320 180",
  preserveAspectRatio: "xMidYMid slice",
  "aria-hidden": true,
  className: "h-full w-full",
} as const;

function WeatherArt(): JSX.Element {
  const id = useId();
  return (
    <svg {...svgProps}>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#bae6fd" />
        </linearGradient>
        <radialGradient id={`${id}sun`}>
          <stop offset="0" stopColor="#fef08a" />
          <stop offset="1" stopColor="#f59e0b" />
        </radialGradient>
      </defs>
      <rect width="320" height="180" fill={`url(#${id}sky)`} />
      {/* rainbow */}
      <g fill="none" strokeWidth="7" opacity=".55">
        <path d="M150 150a90 90 0 0 1 180 0" stroke="#f87171" />
        <path d="M157 150a83 83 0 0 1 166 0" stroke="#fbbf24" />
        <path d="M164 150a76 76 0 0 1 152 0" stroke="#4ade80" />
        <path d="M171 150a69 69 0 0 1 138 0" stroke="#60a5fa" />
      </g>
      {/* sun */}
      <g className="game-art-spin" style={{ transformOrigin: "70px 52px" }}>
        {Array.from({ length: 12 }, (_, i) => (
          <rect
            key={i}
            x="68"
            y="14"
            width="4"
            height="12"
            rx="2"
            fill="#fde047"
            transform={`rotate(${i * 30} 70 52)`}
          />
        ))}
      </g>
      <circle cx="70" cy="52" r="22" fill={`url(#${id}sun)`} />
      <circle cx="63" cy="48" r="2.4" fill="#78350f" />
      <circle cx="77" cy="48" r="2.4" fill="#78350f" />
      <path d="M62 57q8 7 16 0" stroke="#78350f" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      {/* rain cloud */}
      <g className="game-art-float">
        <g fill="#fff">
          <circle cx="210" cy="50" r="20" />
          <circle cx="232" cy="42" r="24" />
          <circle cx="256" cy="52" r="18" />
          <rect x="196" y="50" width="74" height="20" rx="10" />
        </g>
        <g stroke="#2563eb" strokeWidth="3" strokeLinecap="round">
          <path d="M212 80l-4 9" />
          <path d="M230 82l-4 9" />
          <path d="M248 80l-4 9" />
        </g>
      </g>
      <g fill="#fff" opacity=".85">
        <circle cx="128" cy="30" r="9" />
        <circle cx="140" cy="26" r="11" />
        <rect x="120" y="28" width="32" height="10" rx="5" />
      </g>
      {/* hills */}
      <path d="M0 140q60-34 130-8t190-14v62H0z" fill="#4ade80" />
      <path d="M0 158q90-24 170 0t150-6v28H0z" fill="#16a34a" />
      {/* weather station */}
      <rect x="110" y="96" width="4" height="50" fill="#475569" />
      <path d="M114 98l22 6-22 6z" fill="#ef4444" />
      <g stroke="#475569" strokeWidth="2.5" strokeLinecap="round">
        <path d="M112 96v-10" />
        <path d="M100 86h24" />
      </g>
      <circle cx="100" cy="86" r="4" fill="#f59e0b" />
      <circle cx="124" cy="86" r="4" fill="#f59e0b" />
      {/* thermometer box */}
      <rect x="60" y="116" width="26" height="30" rx="3" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
      <path d="M60 116l13-9 13 9" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" strokeLinejoin="round" />
      <rect x="71" y="122" width="4" height="16" rx="2" fill="#ef4444" />
    </svg>
  );
}

function FloodArt(): JSX.Element {
  const id = useId();
  return (
    <svg {...svgProps}>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#64748b" />
          <stop offset="1" stopColor="#99f6e4" />
        </linearGradient>
        <linearGradient id={`${id}water`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#14b8a6" />
          <stop offset="1" stopColor="#0f766e" />
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill={`url(#${id}sky)`} />
      {/* storm clouds + rain */}
      <g fill="#cbd5e1">
        <circle cx="60" cy="30" r="18" />
        <circle cx="84" cy="24" r="22" />
        <circle cx="108" cy="32" r="16" />
        <rect x="46" y="30" width="74" height="16" rx="8" />
      </g>
      <g stroke="#e0f2fe" strokeWidth="2" strokeLinecap="round" opacity=".8">
        {[52, 68, 84, 100, 116, 150, 170, 190].map((x, i) => (
          <path key={x} d={`M${x} ${52 + (i % 2) * 8}l-5 12`} />
        ))}
      </g>
      {/* shelter on hill */}
      <path d="M210 120q40-46 110-40v40z" fill="#22c55e" />
      <rect x="252" y="66" width="44" height="30" fill="#fef3c7" stroke="#92400e" strokeWidth="2" />
      <path d="M246 68l28-22 28 22z" fill="#dc2626" />
      <rect x="268" y="78" width="12" height="18" fill="#92400e" />
      <rect x="274" y="30" width="2.5" height="20" fill="#334155" />
      <path d="M276.5 30h16l-4 5 4 5h-16z" fill="#16a34a" />
      <circle cx="283" cy="35" r="2.4" fill="#ef4444" />
      {/* house in water */}
      <rect x="30" y="92" width="44" height="34" fill="#fde68a" stroke="#92400e" strokeWidth="2" />
      <path d="M24 94l28-22 28 22z" fill="#b45309" />
      <rect x="44" y="102" width="14" height="12" fill="#7dd3fc" stroke="#92400e" strokeWidth="1.5" />
      {/* water */}
      <path
        className="game-art-wave"
        d="M-20 122q20-8 40 0t40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0v70h-440z"
        fill={`url(#${id}water)`}
      />
      <path
        d="M-20 146q20-6 40 0t40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0"
        stroke="#ccfbf1"
        strokeWidth="2"
        fill="none"
        opacity=".6"
      />
      {/* boat with family heading to shelter */}
      <g className="game-art-float">
        <path d="M128 122h74l-12 18h-50z" fill="#f97316" stroke="#9a3412" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="148" cy="108" r="6" fill="#fcd34d" />
        <rect x="142" y="113" width="12" height="10" rx="3" fill="#2563eb" />
        <circle cx="166" cy="111" r="5" fill="#fcd34d" />
        <rect x="161" y="115" width="10" height="8" rx="3" fill="#db2777" />
        <circle cx="182" cy="108" r="6" fill="#fcd34d" />
        <rect x="176" y="113" width="12" height="10" rx="3" fill="#16a34a" />
        <path d="M192 104l14 20" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
      </g>
      <path d="M212 112l12-6v12z" fill="#fff" opacity=".8" />
    </svg>
  );
}

function GoBagArt(): JSX.Element {
  const id = useId();
  return (
    <svg {...svgProps}>
      <defs>
        <linearGradient id={`${id}bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fdba74" />
          <stop offset="1" stopColor="#fb7185" />
        </linearGradient>
        <linearGradient id={`${id}bag`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ef4444" />
          <stop offset="1" stopColor="#b91c1c" />
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill={`url(#${id}bg)`} />
      <circle cx="160" cy="96" r="70" fill="#fff" opacity=".22" />
      <circle cx="160" cy="96" r="50" fill="#fff" opacity=".2" />
      <ellipse cx="160" cy="160" rx="54" ry="7" fill="#7f1d1d" opacity=".2" />
      {/* backpack */}
      <path d="M140 52q20-22 40 0" stroke="#7f1d1d" strokeWidth="6" fill="none" strokeLinecap="round" />
      <rect x="122" y="52" width="76" height="106" rx="22" fill={`url(#${id}bag)`} />
      <rect x="134" y="98" width="52" height="44" rx="10" fill="#f87171" stroke="#991b1b" strokeWidth="2" />
      <path d="M134 112h52" stroke="#991b1b" strokeWidth="2" />
      <rect x="155" y="107" width="10" height="8" rx="2" fill="#fde047" />
      <rect x="140" y="64" width="40" height="22" rx="8" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />
      <path d="M152 72h16M160 64v16" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      {/* floating supplies */}
      <g className="game-art-float">
        {/* water bottle */}
        <rect x="52" y="58" width="22" height="46" rx="7" fill="#38bdf8" stroke="#0369a1" strokeWidth="2" />
        <rect x="56" y="48" width="14" height="10" rx="3" fill="#0369a1" />
        <path d="M52 78h22" stroke="#e0f2fe" strokeWidth="3" />
      </g>
      <g className="game-art-float" style={{ animationDelay: "-1.2s" }}>
        {/* flashlight */}
        <rect x="236" y="44" width="40" height="14" rx="4" fill="#334155" transform="rotate(-20 256 51)" />
        <path d="M272 36l14-8v28l-14-4z" fill="#475569" transform="rotate(-20 256 51)" />
        <path d="M290 20l22-10M292 32l26 0M290 44l22 10" stroke="#fef9c3" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g className="game-art-float" style={{ animationDelay: "-2s" }}>
        {/* first aid box */}
        <rect x="40" y="118" width="40" height="30" rx="5" fill="#fff" stroke="#b91c1c" strokeWidth="2" />
        <path d="M60 124v18M51 133h18" stroke="#dc2626" strokeWidth="5" strokeLinecap="round" />
      </g>
      <g className="game-art-float" style={{ animationDelay: "-0.6s" }}>
        {/* radio */}
        <rect x="236" y="108" width="46" height="32" rx="6" fill="#facc15" stroke="#a16207" strokeWidth="2" />
        <circle cx="252" cy="124" r="9" fill="#a16207" />
        <rect x="266" y="116" width="10" height="4" rx="2" fill="#a16207" />
        <rect x="266" y="126" width="10" height="4" rx="2" fill="#a16207" />
        <path d="M244 108l-8-18" stroke="#a16207" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      {/* sparkles */}
      <g fill="#fff">
        <path d="M108 30l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
        <path d="M214 150l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
      </g>
    </svg>
  );
}

export default function GameArt({ kind }: { kind: GameArtKind }): JSX.Element {
  if (kind === "flood") return <FloodArt />;
  if (kind === "gobag") return <GoBagArt />;
  return <WeatherArt />;
}
