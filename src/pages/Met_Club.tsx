import React, { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useNavigate } from "react-router";
import TopNav from "../components/Shared/TopBar";
import BottomNav from "../components/Shared/BottomNav";

/* ============ REUSABLE PIECES ============ */

type EyebrowProps = {
  children: ReactNode;
  color: string;
};

const Eyebrow = ({ children, color }: EyebrowProps) => (
  <div
    style={{
      display: "inline-block",
      background: color,
      color: "#fff",
      borderRadius: 999,
      padding: "6px 18px",
      fontWeight: 700,
      fontSize: 14,
      marginBottom: 14,
    }}
  >
    {children}
  </div>
);

type SectionHeaderProps = {
  icon: ReactNode;
  title: ReactNode;
  color: string;
};

const SectionHeader = ({ icon, title, color }: SectionHeaderProps) => (
  <div
    className="px-4 py-3 sm:px-6 sm:py-4 gap-2.5 sm:gap-4 text-base sm:text-xl lg:text-2xl font-black mb-5 flex items-center"
    style={{
      background: color,
      color: "#fff",
      borderRadius: 16,
      boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
    }}
  >
    <span className="text-xl sm:text-2xl lg:text-3xl shrink-0">{icon}</span>
    <span>{title}</span>
  </div>
);

type BoxProps = {
  children: ReactNode;
  bg: string;
  border: string;
  style?: CSSProperties;
};

const Box = ({ children, bg, border, style }: BoxProps) => (
  <div
    className="p-4 sm:p-5"
    style={{
      background: bg,
      border: `2px solid ${border}`,
      borderRadius: 14,
      marginBottom: 18,
      ...style,
    }}
  >
    {children}
  </div>
);

type CheckListProps = {
  items: ReactNode[];
  color?: string;
};

const CheckList = ({ items, color = "#D93025" }: CheckListProps) => (
  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
    {items.map((it, i) => (
      <li
        key={i}
        style={{
          display: "flex",
          gap: 10,
          alignItems: "flex-start",
          marginBottom: 10,
          fontSize: 16,
          lineHeight: 1.5,
        }}
      >
        <span style={{ color, fontWeight: 900, marginTop: 2 }}>✔</span>
        <span>{it}</span>
      </li>
    ))}
  </ul>
);

type PageFooterProps = {
  chapter: ReactNode;
  page: ReactNode;
  style?: CSSProperties;
};

const PageFooter = ({ chapter, page, style }: PageFooterProps) => (
  <div
    className="flex justify-between text-[11px] sm:text-xs md:text-sm text-gray-500 border-t border-gray-200 mt-8 pt-3"
    style={style}
  >
    <span>MET ক্লাব • {chapter}</span>
    <span>পৃষ্ঠা {page}</span>
  </div>
);

/* Multiple choice question with click-to-reveal */
type MCQProps = {
  question: ReactNode;
  options: ReactNode[];
  correctIndex: number;
  color?: string;
};

function MCQ({ question, options, correctIndex }: MCQProps) {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <Box bg="#0f0f0f0a" border="#ccc" style={{ background: "#FBFBFB" }}>
      <div style={{ fontWeight: 700, marginBottom: 10 }}>🧠 {question}</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
        {options.map((opt, i) => {
          const isSel = selected === i;
          const isCorrect = i === correctIndex;
          let bg = "#fff";
          let borderC = "#ccc";
          let textC = "#333";
          if (selected !== null) {
            if (isCorrect) {
              bg = "#E6F4EA";
              borderC = "#34A853";
              textC = "#1E7B34";
            } else if (isSel) {
              bg = "#FCE8E6";
              borderC = "#E53935";
              textC = "#C62828";
            }
          }
          return (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className="px-4 py-2.5 transition-colors duration-150"
              style={{
                borderRadius: 12,
                border: `2px solid ${borderC}`,
                background: bg,
                color: textC,
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 15,
                width: "100%",
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div
          style={{
            marginTop: 12,
            fontWeight: 700,
            color: selected === correctIndex ? "#1E7B34" : "#C62828",
          }}
        >
          {selected === correctIndex
            ? "✅ সঠিক উত্তর!"
            : `❌ আবার চেষ্টা করো। সঠিক উত্তর: ${options[correctIndex]}`}
        </div>
      )}
    </Box>
  );
}

/* True/False question */
type TrueFalseProps = {
  statement: ReactNode;
  answer: boolean;
  index: number;
};

function TrueFalse({ statement, answer, index }: TrueFalseProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const options = ["ঠিক", "ভুল"];
  const correctIndex = answer ? 0 : 1;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 0",
        borderBottom: "1px dashed #ddd",
        gap: 10,
        flexWrap: "wrap",
      }}
    >
      <span style={{ fontSize: 15 }}>
        {index}) {statement}
      </span>
      <div style={{ display: "flex", gap: 8 }}>
        {options.map((opt, i) => {
          const isSel = selected === i;
          const isCorrect = i === correctIndex;
          let bg = "#fff",
            borderC = "#ccc",
            textC = "#333";
          if (selected !== null) {
            if (isCorrect) {
              bg = "#E6F4EA";
              borderC = "#34A853";
              textC = "#1E7B34";
            } else if (isSel) {
              bg = "#FCE8E6";
              borderC = "#E53935";
              textC = "#C62828";
            }
          }
          return (
            <button
              key={i}
              onClick={() => setSelected(i)}
              style={{
                padding: "4px 14px",
                borderRadius: 999,
                border: `2px solid ${borderC}`,
                background: bg,
                color: textC,
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* Color matching mini-game (click to pick color for scenario) */
type ColorMatchProps = {
  scenario: ReactNode;
  correctColor: string;
};

function ColorMatch({ scenario, correctColor }: ColorMatchProps) {
  const [pick, setPick] = useState<string | null>(null);
  const colors = [
    { key: "green", emoji: "🟢", hex: "#34A853" },
    { key: "yellow", emoji: "🟡", hex: "#F4B400" },
    { key: "orange", emoji: "🟠", hex: "#F57C00" },
    { key: "red", emoji: "🔴", hex: "#E53935" },
  ];
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 0",
        borderBottom: "1px dashed #ddd",
        gap: 10,
        flexWrap: "wrap",
      }}
    >
      <span style={{ fontSize: 15, flex: 1, minWidth: 200 }}>{scenario}</span>
      <div style={{ display: "flex", gap: 6 }}>
        {colors.map((c) => {
          const isSel = pick === c.key;
          const isCorrect = c.key === correctColor;
          const showResult = pick !== null;
          return (
            <button
              key={c.key}
              onClick={() => setPick(c.key)}
              style={{
                fontSize: 20,
                padding: "4px 10px",
                borderRadius: 10,
                border:
                  showResult && isSel
                    ? isCorrect
                      ? "3px solid #34A853"
                      : "3px solid #E53935"
                    : "2px solid #ddd",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              {c.emoji}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* Ordering / sequence chain quiz */
function SequenceQuiz() {
  const correctOrder = ["ঝুঁকি বুঝি", "পূর্বাভাস তৈরি করি", "সতর্কবার্তা পাঠাই", "পদক্ষেপ নিই"];
  const items = [
    "সতর্কবার্তা পাঠাই",
    "পূর্বাভাস তৈরি করি",
    "ঝুঁকি বুঝি",
    "পদক্ষেপ নিই",
  ];
  const [picked, setPicked] = useState<string[]>([]);

  const handlePick = (item: string) => {
    if (picked.includes(item)) return;
    setPicked([...picked, item]);
  };
  const reset = () => setPicked([]);
  const isDone = picked.length === 4;
  const isCorrect = isDone && picked.every((p, i) => p === correctOrder[i]);

  return (
    <Box bg="#FBFBFB" border="#ccc">
      <div style={{ fontWeight: 700, marginBottom: 10 }}>
        শিকল সাজাও — নিচের ৪টি ধাপ এলোমেলো আছে। ক্রম অনুযায়ী ক্লিক করো (মনে রেখো "জানি →
        বুঝি → জানাই → করি")।
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
        {items.map((it) => (
          <button
            key={it}
            onClick={() => handlePick(it)}
            disabled={picked.includes(it)}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              border: "2px solid #999",
              background: picked.includes(it) ? "#eee" : "#fff",
              color: picked.includes(it) ? "#aaa" : "#333",
              fontWeight: 600,
              cursor: picked.includes(it) ? "default" : "pointer",
            }}
          >
            {it}
          </button>
        ))}
      </div>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>তোমার ক্রম:</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        {picked.map((p, i) => (
          <span
            key={i}
            style={{
              background: "#E3F2FD",
              padding: "6px 14px",
              borderRadius: 999,
              fontWeight: 600,
            }}
          >
            {i + 1}. {p}
          </span>
        ))}
      </div>
      {isDone && (
        <div style={{ fontWeight: 700, color: isCorrect ? "#1E7B34" : "#C62828" }}>
          {isCorrect
            ? "✅ ঠিক ক্রম! ঝুঁকি বুঝি → পূর্বাভাস তৈরি করি → সতর্কবার্তা পাঠাই → পদক্ষেপ নিই"
            : "❌ ক্রমটি ঠিক হয়নি। সঠিক ক্রম: ঝুঁকি বুঝি → পূর্বাভাস তৈরি করি → সতর্কবার্তা পাঠাই → পদক্ষেপ নিই"}
        </div>
      )}
      {picked.length > 0 && (
        <button
          onClick={reset}
          style={{
            marginTop: 10,
            padding: "6px 14px",
            borderRadius: 8,
            border: "1px solid #999",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          আবার শুরু করো
        </button>
      )}
    </Box>
  );
}

/* ============ ILLUSTRATIONS (SVG, cover-style) ============ */

const CoverArt = () => (
  <svg viewBox="0 0 900 500" style={{ width: "100%", height: "auto", display: "block" }}>
    <rect width="900" height="500" fill="url(#redgrad)" />
    <defs>
      <linearGradient id="redgrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#D32F2F" />
        <stop offset="100%" stopColor="#B71C1C" />
      </linearGradient>
    </defs>
    <circle cx="770" cy="110" r="70" fill="#FFD54F" />
    {[...Array(8)].map((_, i) => {
      const angle = (i * Math.PI) / 4;
      const x1 = 770 + Math.cos(angle) * 85;
      const y1 = 110 + Math.sin(angle) * 85;
      const x2 = 770 + Math.cos(angle) * 105;
      const y2 = 110 + Math.sin(angle) * 105;
      return (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FFD54F" strokeWidth="6" strokeLinecap="round" />
      );
    })}
    <ellipse cx="180" cy="90" rx="120" ry="45" fill="#E57373" opacity="0.7" />
    <ellipse cx="620" cy="180" rx="100" ry="38" fill="#E57373" opacity="0.6" />
    <path d="M0,340 C150,280 300,320 450,300 C600,280 750,320 900,290 L900,500 L0,500 Z" fill="#2E7D32" />
    <path d="M0,380 C150,340 300,370 450,355 C600,340 750,365 900,340 L900,500 L0,500 Z" fill="#388E3C" />
    <polygon points="150,340 190,290 230,340" fill="#1B2631" />
    <rect x="160" y="340" width="60" height="45" fill="#FDE9D9" />
    <polygon points="250,345 280,310 310,345" fill="#E67E22" />
    <rect x="255" y="345" width="50" height="38" fill="#FDE9D9" />
    <path d="M420,260 C440,330 440,380 420,430 C400,380 400,330 420,260 Z" fill="#81D4FA" />
    <circle cx="680" cy="400" r="14" fill="#F4C29A" />
    <rect x="668" y="414" width="24" height="45" rx="6" fill="#1565C0" />
    <polygon points="710,395 710,430 750,412" fill="#fff" />
    <rect x="708" y="395" width="4" height="65" fill="#5D4037" />
  </svg>
);

/* ============ NAV DATA ============ */

const NAV = [
  { key: "cover", label: "প্রচ্ছদ" },
  { key: "welcome", label: "স্বাগতম" },
  { key: "toc", label: "সূচিপত্র" },
  { key: "roadmap", label: "যাত্রাপথ" },
  { key: "ch1_1", label: "অধ্যায় ১: আগাম পদক্ষেপ • পৃষ্ঠা ৫" },
  { key: "ch1_2", label: "অধ্যায় ১: আগাম পদক্ষেপ • পৃষ্ঠা ৬" },
  { key: "ch1_3", label: "অধ্যায় ১: আগাম পদক্ষেপ • পৃষ্ঠা ৭" },
  { key: "ch1_4", label: "অধ্যায় ১: আগাম পদক্ষেপ • পৃষ্ঠা ৮" },
  { key: "ch2_1", label: "অধ্যায় ২: ঝুঁকি বোঝা • পৃষ্ঠা ৯" },
  { key: "ch2_2", label: "অধ্যায় ২: ঝুঁকি বোঝা • পৃষ্ঠা ১০" },
  { key: "ch2_3", label: "অধ্যায় ২: ঝুঁকি বোঝা • পৃষ্ঠা ১১" },
  { key: "ch2_4", label: "অধ্যায় ২: ঝুঁকি বোঝা • পৃষ্ঠা ১২" },
  { key: "ch3_1", label: "অধ্যায় ৩: প্রভাব-ভিত্তিক পূর্বাভাস • পৃষ্ঠা ১৩" },
  { key: "ch3_2", label: "অধ্যায় ৩: প্রভাব-ভিত্তিক পূর্বাভাস • পৃষ্ঠা ১৪" },
  { key: "ch3_3", label: "অধ্যায় ৩: প্রভাব-ভিত্তিক পূর্বাভাস • পৃষ্ঠা ১৫" },
  { key: "ch3_4", label: "অধ্যায় ৩: প্রভাব-ভিত্তিক পূর্বাভাস • পৃষ্ঠা ১৬" },
  { key: "ch4_1", label: "অধ্যায় ৪: সতর্কীকরণ ব্যবস্থা • পৃষ্ঠা ১৭" },
  { key: "ch4_2", label: "অধ্যায় ৪: সতর্কীকরণ ব্যবস্থা • পৃষ্ঠা ১৮" },
  { key: "ch4_3", label: "অধ্যায় ৪: সতর্কীকরণ ব্যবস্থা • পৃষ্ঠা ১৯" },
  { key: "ch4_4", label: "অধ্যায় ৪: সতর্কীকরণ ব্যবস্থা • পৃষ্ঠা ২০" },
  { key: "ch4_5", label: "অধ্যায় ৪: সতর্কীকরণ ব্যবস্থা • পৃষ্ঠা ২১" },
  { key: "ch5_1", label: "অধ্যায় ৫: Citizen Science • পৃষ্ঠা ২২" },
  { key: "ch5_2", label: "অধ্যায় ৫: Citizen Science • পৃষ্ঠা ২৩" },
  { key: "ch5_3", label: "অধ্যায় ৫: Citizen Science • পৃষ্ঠা ২৪" },
  { key: "quiz", label: "বড় কুইজ ও শব্দার্থ" },
  { key: "certificate", label: "সনদপত্র" },
];

/* ============ PAGE CONTENT COMPONENTS ============ */

function CoverPage() {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 54px)",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CoverArt />
      <div
        className="px-4 py-8 sm:px-10 sm:py-12 md:py-16 text-center flex flex-col justify-center flex-1"
        style={{
          background: "linear-gradient(180deg,#C62828,#B71C1C)",
          color: "#fff",
        }}
      >
        <div>
          <Eyebrow color="rgba(255,255,255,0.15)">MET ক্লাব • ই-লার্নিং</Eyebrow>
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black my-3 leading-tight">
          আগাম পদক্ষেপ
          <br /> ও <br />
          প্রভাব-ভিত্তিক পূর্বাভাস
        </h1>
        <p className="text-sm sm:text-base md:text-lg opacity-90">
          দুর্যোগের আগেই প্রস্তুত হই — নিজে শিখি, বন্ধুকে শেখাই
        </p>
        <div>
          <span
            className="inline-block bg-black/85 text-white rounded-full px-5 py-2 mt-4 font-bold text-xs sm:text-sm"
          >
            তরুণ শিক্ষার্থীদের জন্য (বয়স ১৩–১৮)
          </span>
        </div>
        <p className="mt-6 text-xs sm:text-sm opacity-70">
          একটি শিশু-বান্ধব রঙিন কোর্স মডিউল • চিত্র ও রং-সংকেতসহ
        </p>
      </div>
    </div>
  );
}

function WelcomePage() {
  return (
    <div>
      <SectionHeader icon="★" title="স্বাগতম, ছোট্ট আবহাওয়া-বিজ্ঞানী!" color="#C62828" />
      <p style={{ fontSize: 16, lineHeight: 1.8 }}>
        তুমি কি জানো — প্রতি ১–২ দিনে পৃথিবীতে একটি করে আবহাওয়া বা জলবায়ু-সম্পর্কিত দুর্যোগ ঘটে?
        কিন্তু সুখবর হলো, এখন আমরা <b>আগে থেকেই</b> অনেক দুর্যোগের কথা জানতে পারি। আর যা আগে
        জানা যায়, তার জন্য <b>আগেই প্রস্তুতি</b> নেওয়া যায়! এই মডিউলে তুমি শিখবে কীভাবে
        পূর্বাভাসকে কাজে লাগিয়ে নিজের পরিবার ও এলাকাকে নিরাপদ রাখা যায়।
      </p>

      <Box bg="#FFF8E1" border="#F4B400">
        <div style={{ fontWeight: 800, marginBottom: 10, fontSize: 17 }}>
          🎯 এই কোর্সে তুমি যা শিখবে
        </div>
        <CheckList
          color="#E65100"
          items={[
            "আগাম পদক্ষেপ (Anticipatory Action) আসলে কী, আর কেন এটি জাদুর মতো কাজ করে",
            "ঝুঁকি বোঝার (Risk) জন্য কোন তথ্যগুলো জানা দরকার",
            "প্রভাব-ভিত্তিক পূর্বাভাস (Impact-Based Forecasting) — সহজ ছবিতে",
            "আগাম সতর্কীকরণ ব্যবস্থা (Early Warning System) — সতর্কবার্তা কীভাবে মানুষের কাছে পৌঁছায়",
            "রং-সংকেত (লাল–হলুদ–সবুজ) ও বাংলাদেশের সংকেত দেখে কী করতে হবে",
            "তুমি নিজে কীভাবে তথ্য সংগ্রহ করে গোটা ব্যবস্থাকে নিখুঁত করতে পারো (Citizen Science)",
          ]}
        />
      </Box>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <Box bg="#E3F2FD" border="#64B5F6" style={{ flex: 1, minWidth: 260 }}>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>👀 ছবি দেখো</div>
          <div>প্রতিটি ধারণা একটি রঙিন ছবিতে দেখানো হয়েছে। আগে ছবি দেখো, তারপর পড়ো।</div>
        </Box>
        <Box bg="#E8F5E9" border="#66BB6A" style={{ flex: 1, minWidth: 260 }}>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>✏️ কাজ করো</div>
          <div>প্রতিটি অধ্যায়ের শেষে ছোট্ট কাজ আছে। বন্ধু বা পরিবারের সাথে করো।</div>
        </Box>
      </div>

      <Box bg="#FDEDED" border="#E57373" style={{ marginTop: 6 }}>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div
            style={{
              width: 46,
              height: 60,
              flexShrink: 0,
              background: "linear-gradient(180deg,#F4C29A,#1565C0)",
              borderRadius: "50% 50% 8px 8px / 60% 60% 8px 8px",
            }}
          />
          <div>
            <b>মিতু বলছে:</b> "আমি অষ্টম শ্রেণিতে পড়ি। গত বর্ষায় আমি এই নিয়মগুলো শিখে আমার
            দাদির হাঁস-মুরগি উঁচু জায়গায় সরিয়েছিলাম — বন্যায় একটিও মারা যায়নি! চলো, তুমিও শিখে
            নাও।"
          </div>
        </div>
      </Box>
      <PageFooter chapter="আগাম পদক্ষেপ ও প্রভাব-ভিত্তিক পূর্বাভাস" page="২" />
    </div>
  );
}

type TOCPageProps = {
  go: (page: string) => void;
};

function TOCPage({ go }: TOCPageProps) {
  const rows = [
    { icon: "🌟", title: "অধ্যায় ১ — আগাম পদক্ষেপের ভিত্তি", desc: '"অপেক্ষা" আর "প্রস্তুতি"-র পার্থক্য।', pages: "৫–৮", key: "ch1_1" },
    { icon: "🔎", title: "অধ্যায় ২ — ঝুঁকি বোঝা (EWS স্তম্ভ ১)", desc: "বিপদ, ঝুঁকিপূর্ণতা ও সম্মুখীনতা — ঝুঁকির সূত্র।", pages: "৯–১২", key: "ch2_1" },
    { icon: "🎨", title: "অধ্যায় ৩ — প্রভাব-ভিত্তিক পূর্বাভাস (EWS স্তম্ভ ২)", desc: '"আবহাওয়া কী করবে" — রং-সংকেতে বোঝা।', pages: "১৩–১৬", key: "ch3_1" },
    { icon: "📢", title: "অধ্যায় ৪ — আগাম সতর্কীকরণ ব্যবস্থা (EWS স্তম্ভ ৩+৪)", desc: "সতর্কবার্তা কীভাবে মানুষের কাছে পৌঁছায় ও কাজে রূপ নেয় (CPP, সংকেত, ৩৩৩)।", pages: "১৭–২১", key: "ch4_1" },
    { icon: "🙋", title: "অধ্যায় ৫ — তুমিই বিজ্ঞানী (Citizen Science)", desc: "নিজের তথ্য সংগ্রহ করে কীভাবে গোটা ব্যবস্থাকে নিখুঁত করা যায়।", pages: "২২–২৪", key: "ch5_1" },
    { icon: "🏅", title: "সবশেষে — বড় কুইজ, শব্দার্থ ও সনদ", desc: "নিজেকে যাচাই করো এবং MET ক্লাবের তরুণ দূত হয়ে ওঠো।", pages: "২৫–২৬", key: "quiz" },
  ];
  return (
    <div>
      <SectionHeader icon="≡" title="সূচিপত্র" color="#C62828" />
      {rows.map((r) => (
        <div
          key={r.key}
          onClick={() => go(r.key)}
          className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-gray-150 mb-2.5 cursor-pointer transition-colors duration-150"
          style={{
            background: "#fff",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#FFF3F1")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
        >
          <div className="text-2xl sm:text-3xl shrink-0">{r.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="font-extrabold text-sm sm:text-base text-gray-900 truncate sm:whitespace-normal">{r.title}</div>
            <div className="text-gray-600 text-xs sm:text-sm mt-0.5">{r.desc}</div>
          </div>
          <div className="text-red-700 font-bold text-xs sm:text-sm shrink-0 pl-1">{r.pages}</div>
        </div>
      ))}
      <Box bg="#EDE7F6" border="#9575CD" style={{ marginTop: 10 }}>
        🧭 <b>মনে রাখার মন্ত্র:</b> "আগে জানি → আগে বুঝি → আগে জানাই → আগে করি।" এই চারটি
        ধাপই দুর্যোগ থেকে বাঁচার চাবিকাঠি — আর এটাই একটি "আগাম সতর্কীকরণ ব্যবস্থা"।
      </Box>
      <PageFooter chapter="আগাম পদক্ষেপ ও প্রভাব-ভিত্তিক পূর্বাভাস" page="৩" />
    </div>
  );
}

function RoadmapPage() {
  const steps = [
    { c: "#2E86C1", icon: "🌟", title: "অধ্যায় ১ — আগাম পদক্ষেপ কেন দরকার?", desc: "আমরা ঠিক করি: দুর্যোগের আগেই কাজ করব। কিন্তু কাজটা শুরু করব কীসের ভিত্তিতে?" },
    { c: "#B8791F", icon: "🔎", title: "অধ্যায় ২ — আগে ঝুঁকিটা বুঝি", desc: "কে, কোথায়, কতটা বিপদে? এই জ্ঞানই হলো ব্যবস্থার প্রথম স্তম্ভ।" },
    { c: "#2E7D32", icon: "🎨", title: "অধ্যায় ৩ — পূর্বাভাস তৈরি করি", desc: "ঝুঁকির জ্ঞান + আবহাওয়া = প্রভাব-ভিত্তিক পূর্বাভাস। ব্যবস্থার দ্বিতীয় স্তম্ভ।" },
    { c: "#C62828", icon: "📢", title: "অধ্যায় ৪ — সতর্কবার্তা পৌঁছাই ও কাজ করি", desc: "পূর্বাভাসকে বার্তায় বদলে মানুষের কাছে পাঠাই। তৃতীয় ও চতুর্থ স্তম্ভ।" },
    { c: "#00695C", icon: "🙋", title: "অধ্যায় ৫ — তুমি তথ্য দিয়ে ব্যবস্থা উন্নত করো", desc: "তোমার তথ্য আবার অধ্যায় ২-এর ঝুঁকি-জ্ঞানকে আরও নিখুঁত করে — চক্রটি চলতে থাকে!" },
  ];
  return (
    <div>
      <SectionHeader icon="🗺" title="আমাদের যাত্রাপথ — সব একসূত্রে গাঁথা" color="#C62828" />
      <p style={{ marginBottom: 18, lineHeight: 1.7 }}>
        এই মডিউলের প্রতিটি অধ্যায় একটি শিকলের কড়ির মতো — একটি আরেকটির সাথে যুক্ত। এই পাঁচটি
        ধাপ একসাথে মিলে তৈরি করে একটি <b>আগাম সতর্কীকরণ ব্যবস্থা</b> (Early Warning System),
        যা মানুষকে দুর্যোগ থেকে বাঁচায়।
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: "50%",
                background: s.c,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                flexShrink: 0,
              }}
            >
              {s.icon}
            </div>
            <Box bg="#fafafa" border="#eee" style={{ flex: 1, marginBottom: 0 }}>
              <div style={{ fontWeight: 800 }}>{s.title}</div>
              <div style={{ color: "#555" }}>{s.desc}</div>
            </Box>
          </div>
        ))}
      </div>
      <Box bg="#E1F5FE" border="#4FC3F7" style={{ marginTop: 16 }}>
        🔄 লক্ষ্য করো — শেষ ধাপ আবার শুরুর দিকে ফিরে যায়! এটি একটি চক্র। যতবার আমরা তথ্য দিই,
        ততবার পুরো ব্যবস্থা আরও ভালো হয়। এটাই "শিখি → উন্নত করি → আবার শিখি"।
      </Box>
      <SequenceQuiz />
      <Box bg="#FFF3E0" border="#FFB74D">
        🧠 <b>চিন্তার খোরাক:</b> যদি "সতর্কবার্তা পাঠানো" ধাপটা বাদ পড়ে যায়, তাহলে কী হবে? দলে
        আলোচনা করো।
      </Box>
      <PageFooter chapter="যাত্রাপথ" page="৪" />
    </div>
  );
}

function Chapter1Page1() {
  return (
    <div>
      <SectionHeader icon="🌟" title="১ আগাম পদক্ষেপের ভিত্তি" color="#2E86C1" />
      <p style={{ lineHeight: 1.8, marginBottom: 16 }}>
        আগাম পদক্ষেপ মানে — দুর্যোগ ঘটার আগেই, পূর্বাভাস দেখে, মানুষ ও সম্পদকে রক্ষা করার
        জন্য পদক্ষেপ নেওয়া। ইংরেজিতে একে বলা হয় <b>Anticipatory Action</b> অথবা{" "}
        <b>Early Action</b>। বেশিরভাগ দুর্যোগ আসলে আগে থেকেই বোঝা যায় — তাই আমরা অপেক্ষা না
        করে আগেই কাজ শুরু করতে পারি।
      </p>

      <Box bg="#FFF3E0" border="#FFB74D">
        <div style={{ fontWeight: 800, marginBottom: 8 }}>
          ⏰ "সুযোগের জানালা" (Window of Opportunity)
        </div>
        <p style={{ marginBottom: 14 }}>
          পূর্বাভাস পাওয়ার মুহূর্ত থেকে দুর্যোগ আঘাত হানার আগ পর্যন্ত যে সময়টুকু থাকে, তাকে
          বলে সুযোগের জানালা। এই অল্প সময়ের মধ্যেই বুদ্ধিমানের মতো কাজ করলে অনেক ক্ষতি
          ঠেকানো যায়।
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-3 justify-between">
          <div className="text-center flex flex-row sm:flex-col items-center gap-2 sm:gap-1">
            <span className="text-2xl">📡</span>
            <span className="text-[11px] sm:text-xs font-bold text-amber-900">৫ দিন আগে</span>
          </div>
          <div
            className="flex-1 w-full bg-white border-2 border-amber-500 rounded-2xl sm:rounded-full text-center py-2 px-3 font-black text-amber-800 text-xs sm:text-sm"
          >
            <span className="sm:hidden">⬇ সুযোগের জানালা: এখনই কাজ করো! ⬇</span>
            <span className="hidden sm:inline">⬅ সুযোগের জানালা: এখনই কাজ করো! ➡</span>
          </div>
          <div className="text-center flex flex-row sm:flex-col items-center gap-2 sm:gap-1">
            <span className="text-2xl">🌀</span>
            <span className="text-[11px] sm:text-xs font-bold text-amber-900">আঘাত হানার দিন</span>
          </div>
        </div>
      </Box>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <Box bg="#FDEDED" border="#E57373" style={{ flex: 1, minWidth: 260 }}>
          <div style={{ fontWeight: 800 }}>😟 পুরোনো পদ্ধতি — শুধু "সাড়া দেওয়া"</div>
          <div>দুর্যোগ ঘটে যাওয়ার পরে ত্রাণ ও উদ্ধার। ততক্ষণে অনেক ক্ষতি হয়ে যায়, খরচও বেশি।</div>
        </Box>
        <Box bg="#E8F5E9" border="#66BB6A" style={{ flex: 1, minWidth: 260 }}>
          <div style={{ fontWeight: 800 }}>😀 নতুন পদ্ধতি — "আগাম পদক্ষেপ"</div>
          <div>দুর্যোগের আগেই প্রস্তুতি। জীবন ও সম্পদ বাঁচে, ক্ষতি কম, খরচও কম।</div>
        </Box>
      </div>

      <Box bg="#FFFDE7" border="#FDD835">
        💰 <b>জানা থাকা ভালো:</b> গবেষণায় দেখা গেছে, আগাম পদক্ষেপে ১ টাকা খরচ করলে পরবর্তী
        ক্ষতি এড়িয়ে প্রায় ২.৫ থেকে ৭ টাকা পর্যন্ত সাশ্রয় হয়! তাই আগে কাজ করা শুধু নিরাপদই নয়,
        বুদ্ধিমানের কাজও।
      </Box>

      <Box bg="#E1F5FE" border="#4FC3F7">
        <div style={{ fontWeight: 800, marginBottom: 6 }}>🤔 ভেবে দেখো</div>
        তুমি যদি জানতে আগামীকাল প্রবল ঝড় আসবে, আজ রাতে তুমি কী কী কাজ করতে? তিনটি কাজ মনে
        মনে ভাবো।
      </Box>
      <PageFooter chapter="অধ্যায় ১: আগাম পদক্ষেপের ভিত্তি" page="৫" />

    </div>
  );
}

function Chapter1Page2() {
  return (
    <div>
      <SectionHeader icon="🏛" title="১ আগাম পদক্ষেপের ৩টি স্তম্ভ" color="#2E86C1" />
      <p style={{ marginBottom: 16 }}>
        আগাম পদক্ষেপ ঠিকমতো কাজ করতে গেলে আগে থেকেই ৩টি জিনিস ঠিক করে রাখতে হয়। এগুলোকে
        বলা হয় আগাম পদক্ষেপের তিনটি স্তম্ভ।
      </p>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 18 }}>
        {[
          { icon: "📊", title: "নির্দিষ্ট সংকেত (Trigger)", desc: '"কখন কাজ শুরু করব?"' },
          { icon: "📋", title: "আগে থেকে পরিকল্পনা (Plan / EAP)", desc: '"কী কী কাজ করব?"' },
          { icon: "💵", title: "আগাম অর্থ ও সম্পদ (Finance)", desc: '"কী দিয়ে কাজ করব?"' },
        ].map((s, i) => (
          <Box key={i} bg="#F3F0FF" border="#B39DDB" style={{ flex: 1, minWidth: 200, textAlign: "center" }}>
            <div style={{ fontSize: 30 }}>{s.icon}</div>
            <div style={{ fontWeight: 800, margin: "6px 0" }}>{s.title}</div>
            <div style={{ color: "#555" }}>{s.desc}</div>
          </Box>
        ))}
      </div>
      <Box bg="#FFF3E0" border="#FFB74D">
        <div style={{ fontWeight: 800, marginBottom: 6 }}>🏠 ঘরে বসে সহজ উদাহরণ</div>
        ধরো, পরীক্ষার আগের রাত। তোমার একটি সংকেত হলো অ্যালার্ম বাজা (Trigger)। তোমার
        পরিকল্পনা হলো — কোন বই কখন পড়বে (Plan)। আর তোমার সম্পদ হলো — কলম, খাতা, আলো
        (Finance/Resources)। তিনটি আগে থেকে ঠিক থাকলে পরীক্ষা ভালো হয়। দুর্যোগের প্রস্তুতিও
        ঠিক এমনই!
      </Box>
      <Box bg="#E8F5E9" border="#66BB6A">
        <div style={{ fontWeight: 800, marginBottom: 8 }}>✅ ভালো আগাম পদক্ষেপের কিছু উদাহরণ</div>
        <CheckList
          color="#2E7D32"
          items={[
            "গবাদি পশু ও হাঁস-মুরগি উঁচু জায়গায় সরানো",
            "খাবার পানি ও শুকনো খাবার মজুত করা",
            "জরুরি কাগজপত্র পলিথিনে মুড়ে রাখা",
            "ঘরের চাল ও খুঁটি শক্ত করে বাঁধা",
            "ফসল আগেভাগে কেটে নেওয়া",
            "আশ্রয়কেন্দ্রের রাস্তা ও অবস্থান জেনে রাখা",
          ]}
        />
      </Box>
      <PageFooter chapter="অধ্যায় ১: আগাম পদক্ষেপের ভিত্তি" page="৬" />
    </div>
  );
}

function Chapter1Page3() {
  return (
    <div>
      <SectionHeader icon="📖" title="১ একটি সত্যি গল্প: বাংলাদেশের বন্যা" color="#2E86C1" />
      <p style={{ marginBottom: 16 }}>
        ২০২০ সালে, ভারী বর্ষার আগে বাংলাদেশে এক বিশেষ ঘটনা ঘটে। জাতিসংঘের সংস্থা ও রেড
        ক্রিসেন্ট মিলে বন্যা চূড়ান্ত রূপ নেওয়ার আগেই পূর্বাভাস দেখে ঝুঁকিপূর্ণ পরিবারগুলোর
        কাছে টাকা পৌঁছে দেয়। এটাই ছিল বড় পরিসরে আগাম পদক্ষেপের একটি সফল উদাহরণ।
      </p>
      <div className="flex flex-col sm:flex-row gap-3 mb-4.5">
        {[
          { n: 1, icon: "📡", t: "পূর্বাভাস! ৫ দিন পরে বন্যা", c: "#E3F2FD" },
          { n: 2, icon: "🐄", t: "পশু উঁচুতে সরানো", c: "#FFF3E0" },
          { n: 3, icon: "😀", t: "সবাই নিরাপদ!", c: "#E8F5E9" },
        ].map((s) => (
          <Box key={s.n} bg={s.c} border="#ccc" style={{ flex: 1, textAlign: "center", marginBottom: 0 }}>
            <div className="text-2xl sm:text-3xl">{s.icon}</div>
            <div className="font-bold text-sm sm:text-base mt-1.5">{s.t}</div>
          </Box>
        ))}
      </div>
      <Box bg="#FFFDE7" border="#FDD835">
        <div style={{ fontWeight: 800, marginBottom: 8 }}>🌍 সারা পৃথিবীতে আগাম পদক্ষেপ</div>
        <CheckList
          color="#F57F17"
          items={[
            "ফিলিপাইন: টাইফুনের আগে কৃষকেরা ঘরের চাল শক্ত করে বাঁধেন",
            "পেরু: শীতের ঢেউয়ের (cold wave) আগে আলপাকা পশুর জন্য পশু-চিকিৎসা কিট বিতরণ",
            'মঙ্গোলিয়া: তীব্র শীত "জুদ"-এর আগে পশুখাদ্য ও যত্ন-সামগ্রী পাঠানো — পশুমৃত্যু ৫০% পর্যন্ত কমে গিয়েছিল',
          ]}
        />
      </Box>
      <Box bg="#F3E5F5" border="#BA68C8">
        🤝 <b>মনে রাখো:</b> আগাম পদক্ষেপ একা কারো কাজ নয়। আবহাওয়া অফিস, সরকার, রেড
        ক্রিসেন্ট, স্বেচ্ছাসেবক, শিক্ষক, পরিবার — সবাই মিলে দল হয়ে কাজ করলেই এটি সফল হয়।
        তুমিও এই দলের একজন গুরুত্বপূর্ণ সদস্য!
      </Box>
      <Box bg="#FDEDED" border="#E57373">
        <div style={{ fontWeight: 800, marginBottom: 6 }}>"যদি আমি দলনেতা হতাম..."</div>
        কল্পনা করো, তোমার গ্রামে ৩ দিন পরে বন্যা আসবে — আর তুমি যুব-দলের নেতা। কাকে কোন কাজ
        দেবে? একটি ছোট তালিকা বানাও: কে খবর ছড়াবে, কে পশু সরাবে, কে বয়স্ক-অসুস্থদের সাহায্য
        করবে।
      </Box>
      <MCQ
        question="মঙ্গোলিয়ায় আগাম পদক্ষেপে পশুমৃত্যু কতটা কমেছিল?"
        options={["১০%", "৫০%", "৯০%"]}
        correctIndex={1}
      />
      <PageFooter chapter="অধ্যায় ১: আগাম পদক্ষেপের ভিত্তি" page="৭" />
    </div>
  );
}

function Chapter1Page4() {
  return (
    <div>
      <SectionHeader icon="✏️" title="১ চলো করি! (কাজ ও কুইজ)" color="#2E86C1" />
      <Box bg="#E1F5FE" border="#4FC3F7">
        <div style={{ fontWeight: 800, marginBottom: 8 }}>
          ✏️ কাজ ১ — আমার "সুযোগের জানালা"
        </div>
        নিচের সময়রেখায় তোমার এলাকার একটি দুর্যোগ (যেমন: বন্যা, ঘূর্ণিঝড়, তাপপ্রবাহ) ভেবে
        লেখো — পূর্বাভাস পাওয়ার পর কী কী কাজ করবে?
        <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
          <span style={{ background: "#fff", padding: "6px 14px", borderRadius: 999, border: "1px solid #ccc" }}>
            পূর্বাভাস
          </span>
          <span>➡</span>
          <span style={{ background: "#fff", padding: "6px 14px", borderRadius: 999, border: "1px solid #ccc" }}>
            কাজ ১: ____
          </span>
          <span style={{ background: "#fff", padding: "6px 14px", borderRadius: 999, border: "1px solid #ccc" }}>
            কাজ ২: ____
          </span>
          <span style={{ background: "#fff", padding: "6px 14px", borderRadius: 999, border: "1px solid #ccc" }}>
            কাজ ৩: ____
          </span>
          <span>➡</span>
          <span style={{ background: "#fff", padding: "6px 14px", borderRadius: 999, border: "1px solid #ccc" }}>
            দুর্যোগ
          </span>
        </div>
      </Box>

      <Box bg="#FBFBFB" border="#ccc">
        <div style={{ fontWeight: 800, marginBottom: 8 }}>🧠 মিনি কুইজ — ঠিক না ভুল?</div>
        <TrueFalse index={1} statement="আগাম পদক্ষেপ মানে দুর্যোগের পরে ত্রাণ দেওয়া।" answer={false} />
        <TrueFalse index={2} statement='Trigger মানে "কখন কাজ শুরু করব" তা ঠিক করা।' answer={true} />
        <TrueFalse index={3} statement="আগাম পদক্ষেপে খরচ বাঁচে।" answer={true} />
      </Box>

      <Box bg="#E8F5E9" border="#66BB6A">
        <div style={{ fontWeight: 800, marginBottom: 6 }}>👨‍👩‍👧 পরিবারের সাথে কাজ</div>
        বাড়ির বড়দের জিজ্ঞেস করো — "গত কোনো বন্যা বা ঝড়ের সময় আমরা কী কী করেছিলাম? আগে
        থেকে জানলে আরও কী করা যেত?" তাদের উত্তর একটি খাতায় টুকে রাখো। এই তথ্য পরের
        অধ্যায়ে কাজে লাগবে!
      </Box>
      <div style={{ textAlign: "center", fontWeight: 800, color: "#2E86C1", fontSize: 18, margin: "20px 0" }}>
        🎉 অধ্যায় ১ শেষ — তুমি এখন "আগাম পদক্ষেপ" বোঝো!
      </div>
      <PageFooter chapter="অধ্যায় ১: আগাম পদক্ষেপের ভিত্তি" page="৮" />
    </div>
  );
}

function Chapter2Page1() {
  return (
    <div>
      <SectionHeader icon="🔎" title="২ ঝুঁকি বোঝা (EWS স্তম্ভ ১)" color="#B8791F" />
      <Box bg="#FFF3E0" border="#FFB74D">
        🔗 <b>আগের অধ্যায়ে কী শিখলাম?</b> অধ্যায় ১-এ ঠিক করলাম দুর্যোগের আগেই কাজ করব। কিন্তু
        কাজ শুরু করব কীসের ভিত্তিতে? প্রথমেই বুঝতে হবে — ঝুঁকিটা ঠিক কোথায় ও কতটা। এটাই
        সতর্কীকরণ ব্যবস্থার প্রথম স্তম্ভ।
      </Box>
      <p style={{ lineHeight: 1.8, marginBottom: 16 }}>
        নিখুঁত পূর্বাভাস বানাতে হলে শুধু "ঝড় আসছে" জানলেই হয় না। জানতে হয় — ঝড়টা কাদের ক্ষতি
        করবে এবং কতটা করবে। এর জন্য আমরা ঝুঁকি (Risk) মাপি। ঝুঁকির একটি সহজ সূত্র আছে:
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        {[
          { icon: "🌀", t: "বিপদ", e: "Hazard", c: "#FDEDED", b: "#E57373" },
          { icon: "🏚", t: "ঝুঁকিপূর্ণতা", e: "Vulnerability", c: "#FFF8E1", b: "#F4B400" },
          { icon: "👨‍👩‍👧", t: "সম্মুখীনতা", e: "Exposure", c: "#E3F2FD", b: "#64B5F6" },
        ].map((s, i) => (
          <React.Fragment key={i}>
            <Box bg={s.c} border={s.b} style={{ textAlign: "center", minWidth: 130, marginBottom: 0 }}>
              <div style={{ fontSize: 26 }}>{s.icon}</div>
              <div style={{ fontWeight: 800 }}>{s.t}</div>
              <div style={{ fontSize: 12, color: "#666" }}>{s.e}</div>
            </Box>
            {i < 2 && <div style={{ fontSize: 22, fontWeight: 900 }}>×</div>}
          </React.Fragment>
        ))}
        <div style={{ fontSize: 22, fontWeight: 900 }}>=</div>
        <Box bg="#E8F5E9" border="#66BB6A" style={{ textAlign: "center", minWidth: 100, marginBottom: 0 }}>
          <div style={{ fontWeight: 800 }}>ঝুঁকি</div>
        </Box>
      </div>

      <Box bg="#FDEDED" border="#E57373">
        <div style={{ fontWeight: 800 }}>🌀 বিপদ (Hazard) — কী ঘটতে পারে?</div>
        প্রাকৃতিক ঘটনা যা ক্ষতি করতে পারে — যেমন বন্যা, ঘূর্ণিঝড়, তাপপ্রবাহ, খরা, বজ্রপাত,
        ভূমিধস। শুধু বিপদ থাকলেই কিন্তু দুর্যোগ হয় না!
      </Box>
      <Box bg="#FFF8E1" border="#F4B400">
        <div style={{ fontWeight: 800 }}>🏚 ঝুঁকিপূর্ণতা (Vulnerability) — কতটা সহজে ক্ষতি হবে?</div>
        কাঁচা ঘর, দুর্বল চাল, গরিব পরিবার, অসুস্থ বা বয়স্ক মানুষ — এরা বিপদে বেশি সহজে
        ক্ষতিগ্রস্ত হয়। যাদের সামলে নেওয়ার ক্ষমতা বেশি, তাদের ঝুঁকিপূর্ণতা কম।
      </Box>
      <Box bg="#E3F2FD" border="#64B5F6">
        <div style={{ fontWeight: 800 }}>👨‍👩‍👧 সম্মুখীনতা (Exposure) — কে বা কী বিপদের মুখে আছে?</div>
        নদীর ধারে বা বাঁধের ভুল পাশে থাকা ঘরবাড়ি, মানুষ, ফসল, পশু — এরা বিপদের সামনে আছে।
        বিপদ এলাকায় কেউ না থাকলে ঝুঁকিও থাকে না।
      </Box>
      <Box bg="#F3E5F5" border="#BA68C8">
        💡 <b>সহজ কথায়:</b> একটি প্রবল ঝড় (বিপদ) যদি জনমানবহীন মরুভূমিতে যায়, তাহলে কেউ
        ক্ষতিগ্রস্ত হয় না। কিন্তু সেই একই ঝড় যদি নদীর ধারের কাঁচা ঘরের গ্রামে আসে — তখনই
        সেটা দুর্যোগ হয়ে ওঠে।
      </Box>
      <Box bg="#FBFBFB" border="#ccc">
        <div style={{ fontWeight: 800, marginBottom: 8 }}>ঝুঁকি কমানোর তিন পথ</div>
        ঝুঁকির সূত্রে ৩টি উপাদান। দলে আলোচনা করো — আমরা মানুষ হিসেবে কোন উপাদান কমাতে পারি?
        (ইঙ্গিত: বিপদ থামানো কঠিন, কিন্তু ঘর শক্ত করে ঝুঁকিপূর্ণতা আর নিরাপদ জায়গায় গিয়ে
        সম্মুখীনতা কমানো যায়।)
      </Box>
      <MCQ
        question="একটি ঝড় জনশূন্য মাঠে গেলে সেটা কি দুর্যোগ?"
        options={["হ্যাঁ", "না"]}
        correctIndex={1}
      />
      <PageFooter chapter="অধ্যায় ২: ঝুঁকি পর্যবেক্ষণ" page="৯" />

    </div>
  );
}

function Chapter2Page2() {
  return (
    <div>
      <SectionHeader icon="📋" title="২ কোন তথ্যগুলো দরকার?" color="#B8791F" />
      <p style={{ marginBottom: 16 }}>
        ঝুঁকি ঠিকভাবে মাপতে হলে আমাদের তিন ধরনের তথ্য সংগ্রহ করতে হয়। এই তথ্য যত ভালো ও
        হালনাগাদ হবে, পূর্বাভাস তত নিখুঁত হবে।
      </p>
      <Box bg="#FDEDED" border="#E57373">
        <div style={{ fontWeight: 800, marginBottom: 8 }}>🌀 বিপদের তথ্য</div>
        <CheckList
          color="#C62828"
          items={[
            "আগের বছরগুলোতে কখন, কোথায় বন্যা/ঝড় হয়েছিল?",
            "পানি কতটা উঁচু হয়েছিল? বাতাসের গতি কত ছিল?",
            "আবহাওয়া অফিস (BMD) এখন কী পূর্বাভাস দিচ্ছে?",
          ]}
        />
      </Box>
      <Box bg="#FFF8E1" border="#F4B400">
        <div style={{ fontWeight: 800, marginBottom: 8 }}>🏚 ঝুঁকিপূর্ণতার তথ্য</div>
        <CheckList
          color="#F57F17"
          items={[
            "ঘরগুলো কী দিয়ে তৈরি — পাকা, আধা-পাকা না কাঁচা?",
            "পরিবারে কি বয়স্ক, শিশু, প্রতিবন্ধী বা অসুস্থ কেউ আছে?",
            "মানুষ লেখাপড়া জানে কি? আয়ের উৎস কী?",
          ]}
        />
      </Box>
      <Box bg="#E3F2FD" border="#64B5F6">
        <div style={{ fontWeight: 800, marginBottom: 8 }}>👨‍👩‍👧 সম্মুখীনতার তথ্য</div>
        <CheckList
          color="#1565C0"
          items={[
            "কোন কোন ঘর, স্কুল, হাসপাতাল নদীর কাছে বা নিচু জায়গায়?",
            "কতগুলো গবাদিপশু, কতটুকু ফসলের জমি ঝুঁকিতে?",
            "রাস্তা, পুল, বিদ্যুতের লাইন কোথায়?",
          ]}
        />
      </Box>
      <Box bg="#E8F5E9" border="#66BB6A">
        <div style={{ fontWeight: 800, marginBottom: 8 }}>🗺 তথ্য কোথা থেকে পাওয়া যায়?</div>
        <CheckList
          color="#2E7D32"
          items={[
            "আবহাওয়া অধিদপ্তর (BMD) ও পানি উন্নয়ন বোর্ড",
            "দুর্যোগ ব্যবস্থাপনা অধিদপ্তর (DDM)",
            "রেড ক্রিসেন্ট ও স্থানীয় স্বেচ্ছাসেবক",
            "তুমি ও তোমার এলাকার মানুষ! (পরের অধ্যায়)",
          ]}
        />
      </Box>
      <Box bg="#FFEBEE" border="#EF5350">
        ⚠️ <b>সাবধান:</b> ঝুঁকিপূর্ণতা ও সম্মুখীনতা সময়ের সাথে বদলায় — বিশেষ করে একটি
        দুর্যোগের পরে। তাই তথ্য নিয়মিত হালনাগাদ করতে হয়। পুরোনো তথ্য দিয়ে নতুন পূর্বাভাস
        ভুল হতে পারে।
      </Box>
      <Box bg="#FBFBFB" border="#ccc">
        <div style={{ fontWeight: 800, marginBottom: 6 }}>গোয়েন্দা হয়ে তথ্য খুঁজি</div>
        তোমার এলাকার ঝুঁকির তথ্য কোথায় পাওয়া যাবে — ভেবে ৩টি উৎসের নাম লেখো (যেমন:
        স্কুলশিক্ষক, ইউনিয়ন পরিষদ, বয়স্ক প্রতিবেশী যিনি পুরোনো বন্যার কথা জানেন)। কোন
        তথ্যটি সবচেয়ে পুরোনো হলে সমস্যা হতে পারে?
      </Box>
      <MCQ
        question="জাতীয় আদমশুমারির মতো সরকারি তথ্য সাধারণত কত বছর পরপর হালনাগাদ হয়?"
        options={["প্রতি বছর", "৫–১০ বছর"]}
        correctIndex={1}
      />
      <PageFooter chapter="অধ্যায় ২: ঝুঁকি পর্যবেক্ষণ" page="১০" />
    </div>
  );
}

function Chapter2Page3() {
  return (
    <div>
      <SectionHeader icon="🔗" title="২ একটি বিপদ → অনেক ক্ষতি" color="#B8791F" />
      <p style={{ marginBottom: 14 }}>
        একটি বিপদ থেকে কীভাবে একের পর এক ক্ষতি ছড়িয়ে পড়ে, সেটা বোঝা খুব দরকার। একে বলে
        ধাপে ধাপে ক্ষতি (Cascading Impacts)। চলো ভারী বৃষ্টির উদাহরণ দেখি:
      </p>
      <Box bg="#E3F2FD" border="#64B5F6">
        <div style={{ textAlign: "center", fontWeight: 800, marginBottom: 12 }}>
          ☔ ভারী বৃষ্টি (মূল বিপদ)
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
          {["🌊 বন্যা", "⛰️ ভূমিধস", "🛣 রাস্তা ডুবে যাওয়া"].map((x) => (
            <span key={x} style={{ background: "#fff", border: "1px solid #90CAF9", borderRadius: 999, padding: "6px 14px" }}>
              {x}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
          {["🏠 ঘর ডোবে", "🌾 ফসল নষ্ট", "🦠 পানিবাহিত রোগ", "🏚 ঘরচাপা", "🐄 পশু হারানো", "⚡ বিদ্যুৎ বন্ধ", "🚑 সাহায্য পৌঁছায় না", "🏫 স্কুল বন্ধ", "💧 বিশুদ্ধ পানির অভাব"].map(
            (x) => (
              <span key={x} style={{ background: "#F5F5F5", borderRadius: 999, padding: "5px 12px", fontSize: 13 }}>
                {x}
              </span>
            )
          )}
        </div>
      </Box>
      <Box bg="#FFF8E1" border="#F4B400">
        🔑 <b>কেন এটা জরুরি?</b> যদি আমরা জানি একটি বিপদ থেকে কোন কোন ক্ষতি হতে পারে, তাহলে
        প্রতিটি ক্ষতি ঠেকানোর জন্য আলাদা আগাম পদক্ষেপ ঠিক করে রাখতে পারি। যেমন — পানিবাহিত
        রোগ ঠেকাতে আগেই পানি-বিশুদ্ধকরণ ট্যাবলেট বিতরণ।
      </Box>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        {[
          { icon: "🌀", t: "ঘূর্ণিঝড়", d: "ঘর উড়ে যাওয়া, গাছ পড়া, জলোচ্ছ্বাস" },
          { icon: "🔥", t: "তাপপ্রবাহ", d: "হিটস্ট্রোক, পানিশূন্যতা, ফসল শুকিয়ে যাওয়া" },
          { icon: "🏜", t: "খরা", d: "পানির অভাব, ফসলহানি, খাদ্য সংকট" },
          { icon: "⚡", t: "বজ্রপাত", d: "প্রাণহানি, আগুন, বিদ্যুৎ বিভ্রাট" },
        ].map((s, i) => (
          <Box key={i} bg="#FBFBFB" border="#ddd" style={{ flex: 1, minWidth: 180 }}>
            <div style={{ fontSize: 24 }}>{s.icon}</div>
            <div style={{ fontWeight: 800 }}>{s.t}</div>
            <div style={{ fontSize: 13, color: "#666" }}>{s.d}</div>
          </Box>
        ))}
      </div>
      <PageFooter chapter="অধ্যায় ২: ঝুঁকি পর্যবেক্ষণ" page="১১" />
    </div>
  );
}

function Chapter2Page4() {
  return (
    <div>
      <SectionHeader icon="🎲" title="২ চলো করি! (কাজ ও খেলা)" color="#B8791F" />
      <Box bg="#FBFBFB" border="#ccc">
        <div style={{ fontWeight: 800, marginBottom: 8 }}>খেলা — "ঝুঁকি কোথায় বেশি?"</div>
        নিচের দুটি ঘরের ছবি দেখো। একই ঝড় এলে কোন ঘরের ঝুঁকি বেশি? কেন? পাশে লেখো।
        <div style={{ display: "flex", gap: 14, marginTop: 12, flexWrap: "wrap" }}>
          <Box bg="#FDEDED" border="#E57373" style={{ flex: 1, minWidth: 200, marginBottom: 0 }}>
            ক) কাঁচা ঘর, নদীর ধারে
          </Box>
          <Box bg="#E8F5E9" border="#66BB6A" style={{ flex: 1, minWidth: 200, marginBottom: 0 }}>
            খ) পাকা ঘর, উঁচু জায়গায়
          </Box>
        </div>
        <div style={{ marginTop: 10, fontStyle: "italic", color: "#666" }}>
          উত্তর: "ক" ঘরের ঝুঁকি বেশি — কাঁচা ঘর (ঝুঁকিপূর্ণতা বেশি) এবং নদীর ধারে নিচু জায়গায়
          (সম্মুখীনতা বেশি)।
        </div>
      </Box>
      <Box bg="#E1F5FE" border="#4FC3F7">
        <div style={{ fontWeight: 800, marginBottom: 8 }}>✏️ কাজ — আমার এলাকার ঝুঁকি-সূত্র</div>
        তোমার এলাকার একটি বিপদ বেছে নাও এবং সূত্রটি পূরণ করো: বিপদ: ____ × ঝুঁকিপূর্ণতা: ____
        × সম্মুখীনতা: ____ = ঝুঁকি
      </Box>
      <Box bg="#FBFBFB" border="#ccc">
        <div style={{ fontWeight: 800, marginBottom: 8 }}>🧠 মিনি কুইজ</div>
        <MCQ question="ঝুঁকির সূত্রে কয়টি উপাদান আছে?" options={["২টি", "৩টি", "৪টি"]} correctIndex={1} />
        <MCQ question="কাঁচা ঘর কোন উপাদান বাড়ায়?" options={["বিপদ", "ঝুঁকিপূর্ণতা", "কোনোটিই নয়"]} correctIndex={1} />
      </Box>
      <div style={{ textAlign: "center", fontWeight: 800, color: "#B8791F", fontSize: 18, margin: "20px 0" }}>
        🎉 অধ্যায় ২ শেষ — তুমি এখন "ঝুঁকি" মাপতে পারো!
      </div>
      <PageFooter chapter="অধ্যায় ২: ঝুঁকি পর্যবেক্ষণ" page="১২" />
    </div>
  );
}

function Chapter3Page1() {
  return (
    <div>
      <SectionHeader icon="🎨" title="৩ প্রভাব-ভিত্তিক পূর্বাভাস (EWS স্তম্ভ ২)" color="#C62828" />
      <Box bg="#FFF3E0" border="#FFB74D">
        🔗 <b>আগের অধ্যায়ে কী শিখলাম?</b> অধ্যায় ২-এ ঝুঁকি মাপতে শিখলাম (বিপদ × ঝুঁকিপূর্ণতা ×
        সম্মুখীনতা)। এবার সেই ঝুঁকির জ্ঞান আর আবহাওয়ার পূর্বাভাস মিলিয়ে আমরা তৈরি করব
        প্রভাব-ভিত্তিক পূর্বাভাস — সতর্কীকরণ ব্যবস্থার দ্বিতীয় স্তম্ভ।
      </Box>
      <p style={{ lineHeight: 1.8, marginBottom: 16 }}>
        এতদিন পূর্বাভাস শুধু বলত — "আবহাওয়া কেমন হবে।" কিন্তু প্রভাব-ভিত্তিক পূর্বাভাস বলে —
        "আবহাওয়া কী করবে।" অর্থাৎ এই আবহাওয়ায় তোমার ঘর, ফসল, পশু বা স্কুলের কী হতে পারে। এই
        ছোট্ট পার্থক্যটাই জীবন বাঁচায়!
      </p>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <Box bg="#E3F2FD" border="#64B5F6" style={{ flex: 1, minWidth: 260 }}>
          <div style={{ fontWeight: 800 }}>🌧 পুরোনো পূর্বাভাস</div>
          <div>"আগামী ৩ ঘণ্টায় ১০০–১৫০ মিমি বৃষ্টি হবে।"</div>
          <div style={{ color: "#666", marginTop: 6 }}>👉 সংখ্যাটা বুঝলেও, কী করব তা স্পষ্ট নয়।</div>
        </Box>
        <Box bg="#E8F5E9" border="#66BB6A" style={{ flex: 1, minWidth: 260 }}>
          <div style={{ fontWeight: 800 }}>🏠➡️🌊 প্রভাব-ভিত্তিক পূর্বাভাস</div>
          <div>"নদীর ধারের ঘরগুলো ডুবে যেতে পারে। পশু ও জিনিসপত্র এখনই উঁচুতে সরাও।"</div>
          <div style={{ color: "#666", marginTop: 6 }}>👉 কী করতে হবে, একদম পরিষ্কার!</div>
        </Box>
      </div>
      <Box bg="#FBFBFB" border="#ccc">
        <div style={{ fontWeight: 800, marginBottom: 10 }}>🧪 কীভাবে এটা তৈরি হয়?</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <Box bg="#E3F2FD" border="#64B5F6" style={{ marginBottom: 0, textAlign: "center" }}>
            🌧 আবহাওয়ার পূর্বাভাস
            <div style={{ fontSize: 12, color: "#666" }}>(ঝড় কত বড়?)</div>
          </Box>
          <div style={{ fontSize: 22, fontWeight: 900 }}>+</div>
          <Box bg="#FDEDED" border="#E57373" style={{ marginBottom: 0, textAlign: "center" }}>
            📊 ঝুঁকির তথ্য
            <div style={{ fontSize: 12, color: "#666" }}>(কে ক্ষতিগ্রস্ত হবে?)</div>
          </Box>
          <div style={{ fontSize: 22, fontWeight: 900 }}>=</div>
          <Box bg="#E8F5E9" border="#66BB6A" style={{ marginBottom: 0, textAlign: "center" }}>
            🎯 প্রভাব-ভিত্তিক পূর্বাভাস
          </Box>
        </div>
      </Box>
      <Box bg="#FFFDE7" border="#FDD835">
        ⏳ <b>মজার ব্যাপার:</b> প্রভাব-ভিত্তিক পূর্বাভাস আগে থেকেই সতর্ক করতে পারে। যেমন — ৫
        দিন আগে বড় এলাকা জুড়ে "কম সম্ভাবনা" দেখিয়ে, পরে ২৪ ঘণ্টা আগে ছোট এলাকায় "বেশি
        সম্ভাবনা ও বেশি ক্ষতি" দেখানো যায়। যত সময় এগোয়, পূর্বাভাস তত নিখুঁত হয়।
      </Box>
      <Box bg="#F3E5F5" border="#BA68C8">
        <div style={{ fontWeight: 800, marginBottom: 6 }}>দলে ভাগ হয়ে আলোচনা করো</div>
        তোমার এলাকার একটি আবহাওয়া-খবর বেছে নাও (যেমন "আগামীকাল ভারী বৃষ্টি")। এখন দল বেঁধে
        এটিকে একটি প্রভাব-ভিত্তিক বার্তায় বদলে ফেলো — "এই বৃষ্টি আমাদের স্কুল, মাঠ বা বাড়ির কী
        করবে?" সবচেয়ে স্পষ্ট বার্তাটি ক্লাসে পড়ে শোনাও।
      </Box>
      <MCQ
        question='"১০০ মিমি বৃষ্টি হবে" — এটা কোন ধরনের পূর্বাভাস?'
        options={["পুরোনো (আবহাওয়া কেমন)", "প্রভাব-ভিত্তিক (আবহাওয়া কী করবে)"]}
        correctIndex={0}
      />
      <PageFooter chapter="অধ্যায় ৩: প্রভাব-ভিত্তিক পূর্বাভাস" page="১৩" />

    </div>
  );
}

function Chapter3Page2() {
  return (
    <div>
      <SectionHeader icon="🚦" title="৩ রং-সংকেত: এক নজরে বিপদ বোঝা" color="#C62828" />
      <p style={{ marginBottom: 16 }}>
        প্রভাব-ভিত্তিক পূর্বাভাসকে সহজে বোঝাতে ব্যবহার করা হয় একটি রঙিন ছক (Risk Matrix)।
        এক পাশে থাকে সম্ভাবনা (কতটা নিশ্চিত), অন্য পাশে প্রভাব (কতটা ক্ষতি)। দুটো মিলিয়ে রং
        ঠিক হয় — সবুজ, হলুদ, কমলা বা লাল।
      </p>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {[
          { c: "#66BB6A", e: "🟢", t: "সবুজ", d: "তেমন বিপদ নেই। স্বাভাবিক থাকো, খবর শোনো।" },
          { c: "#FDD835", e: "🟡", t: "হলুদ", d: "সতর্ক হও। প্রস্তুতি নেওয়া শুরু করো।" },
          { c: "#FFA726", e: "🟠", t: "কমলা", d: "তৈরি হও! আগাম পদক্ষেপ এখনই করো।" },
          { c: "#EF5350", e: "🔴", t: "লাল", d: "বিপদ! নিরাপদ আশ্রয়ে যাও, নির্দেশ মানো।" },
        ].map((s, i) => (
          <Box key={i} bg="#fff" border={s.c} style={{ flex: 1, minWidth: 180, textAlign: "center" }}>
            <div style={{ fontSize: 24 }}>{s.e}</div>
            <div style={{ fontWeight: 800, color: s.c }}>{s.t}</div>
            <div style={{ fontSize: 13, color: "#555" }}>{s.d}</div>
          </Box>
        ))}
      </div>
      <Box bg="#FBFBFB" border="#ccc" style={{ marginTop: 16 }}>
        <div style={{ fontWeight: 800, marginBottom: 6 }}>🧐 ছকটি কীভাবে পড়বো?</div>
        ধরো, পূর্বাভাস বলছে ক্ষতির সম্ভাবনা "বেশি" এবং সম্ভাব্য প্রভাব "খুব বেশি"। ছকে এই দুটি
        লাইন যেখানে মিলবে, সেই ঘরের রং লাল 🔴 — অর্থাৎ সবচেয়ে জরুরি অবস্থা! আবার সম্ভাবনা
        "খুব কম" আর প্রভাব "খুব কম" হলে রং সবুজ 🟢।
      </Box>
      <Box bg="#E1F5FE" border="#4FC3F7">
        🌍 <b>সারা বিশ্বে একই ভাষা:</b> যুক্তরাজ্য, অস্ট্রেলিয়া, ইন্দোনেশিয়াসহ অনেক দেশের
        আবহাওয়া অফিস এই রঙিন ছক ব্যবহার করে। রং সবার কাছে এক — তাই ভাষা না বুঝলেও বিপদ
        বোঝা যায়!
      </Box>
      <PageFooter chapter="অধ্যায় ৩: প্রভাব-ভিত্তিক পূর্বাভাস" page="১৪" />
    </div>
  );
}

function Chapter3Page3() {
  return (
    <div>
      <SectionHeader icon="🚩" title="৩ বাংলাদেশের বিপদ সংকেত" color="#C62828" />
      <p style={{ marginBottom: 16 }}>
        বাংলাদেশ আবহাওয়া অধিদপ্তর (BMD) ঘূর্ণিঝড়ের সময় সমুদ্রবন্দরের জন্য ১ থেকে ১১ পর্যন্ত
        সংকেত দেয়। সংখ্যা যত বড়, বিপদও তত বেশি। চলো সহজ রঙে সাজিয়ে নিই:
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { n: "১–৩", t: "সতর্ক সংকেত (সবুজ)", c: "#E8F5E9", b: "#66BB6A", d: "দূরে ঝড় তৈরি হতে পারে। ভয়ের কিছু নেই, তবে খবর শুনতে থাকো।" },
          { n: "৪", t: "সতর্কতা (হলুদ)", c: "#FFFDE7", b: "#FDD835", d: "বন্দর ঝড়ের মুখে, তবে এখনই চরম পদক্ষেপের দরকার নেই। প্রস্তুতি নাও।" },
          { n: "৫–৭", t: "বিপদ সংকেত (কমলা)", c: "#FFF3E0", b: "#FFA726", d: "মাঝারি শক্তির ঝড় উপকূলে আঘাত হানতে পারে। আগাম পদক্ষেপ এখনই করো।" },
          { n: "৮–১০", t: "মহাবিপদ সংকেত (লাল)", c: "#FDEDED", b: "#EF5350", d: "প্রবল ঘূর্ণিঝড় আঘাত হানবে। দ্রুত নিরাপদ আশ্রয়কেন্দ্রে যাও।" },
          { n: "১১", t: "যোগাযোগ বিচ্ছিন্ন", c: "#ECEFF1", b: "#78909C", d: "আবহাওয়া কেন্দ্রের সাথে যোগাযোগ বন্ধ — সবচেয়ে জরুরি অবস্থা।" },
        ].map((row, i) => (
          <Box key={i} bg={row.c} border={row.b} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 0 }}>
            <div style={{ fontWeight: 900, fontSize: 20, minWidth: 60 }}>{row.n}</div>
            <div>
              <div style={{ fontWeight: 800 }}>{row.t}</div>
              <div style={{ color: "#555", fontSize: 14 }}>{row.d}</div>
            </div>
          </Box>
        ))}
      </div>
      <Box bg="#FFFDE7" border="#FDD835" style={{ marginTop: 12 }}>
        🚩 <b>লাল-কালো পতাকা:</b> উপকূলে স্বেচ্ছাসেবকরা (CPP) লাল রঙের মাঝে কালো চারকোণা
        আঁকা পতাকা তোলেন। ১টি পতাকা = সতর্ক, ২টি = বিপদ, ৩টি = মহাবিপদ। রাতে মাইক ও সাইরেন
        ব্যবহার করা হয়।
      </Box>
      <PageFooter chapter="অধ্যায় ৩: প্রভাব-ভিত্তিক পূর্বাভাস" page="১৫" />
    </div>
  );
}

function Chapter3Page4() {
  return (
    <div>
      <SectionHeader icon="✅" title="৩ রং দেখে কী করব?" color="#C62828" />
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 16 }}>
        <Box bg="#E8F5E9" border="#66BB6A" style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontWeight: 800 }}>🟢 সবুজ — স্বাভাবিক</div>
        </Box>
        <Box bg="#FFFDE7" border="#FDD835" style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontWeight: 800 }}>🟡 হলুদ — প্রস্তুতি</div>
        </Box>
        <Box bg="#FFF3E0" border="#FFA726" style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontWeight: 800 }}>🟠 কমলা — পদক্ষেপ নাও</div>
        </Box>
        <Box bg="#FDEDED" border="#EF5350" style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontWeight: 800 }}>🔴 লাল — সরে যাও</div>
        </Box>
      </div>
      <Box bg="#FBFBFB" border="#ccc">
        <div style={{ fontWeight: 800, marginBottom: 8 }}>🎮 খেলা — "রং মেলাও"</div>
        নিচের পরিস্থিতির সাথে সঠিক রং মিলিয়ে দাও:
        <ColorMatch scenario="ক) ঝড় এখনো বহু দূরে, খবর আসছে" correctColor="green" />
        <ColorMatch scenario="খ) ১০ নম্বর মহাবিপদ সংকেত" correctColor="red" />
        <ColorMatch scenario="গ) পশু উঁচুতে সরানোর সময় এখন" correctColor="orange" />
      </Box>
      <Box bg="#E8F5E9" border="#66BB6A">
        <CheckList
          color="#2E7D32"
          items={[
            "রেডিও/টিভি/মোবাইলে খবর শোনো",
            "জরুরি জিনিসের তালিকা ঠিক রাখো",
            "শুকনো খাবার ও পানি জোগাড় করো",
            "আশ্রয়কেন্দ্রের পথ ঠিক করো",
            "পশু ও জিনিসপত্র উঁচুতে সরাও",
            "কাগজপত্র পলিথিনে মোড়াও",
            "সবাইকে নিয়ে আশ্রয়কেন্দ্রে যাও",
            "স্বেচ্ছাসেবকের নির্দেশ মানো",
          ]}
        />
      </Box>
      <div style={{ textAlign: "center", fontWeight: 800, color: "#C62828", fontSize: 18, margin: "20px 0" }}>
        🎉 অধ্যায় ৩ শেষ — তুমি এখন রং-সংকেত পড়তে পারো!
      </div>
      <PageFooter chapter="অধ্যায় ৩: প্রভাব-ভিত্তিক পূর্বাভাস" page="১৬" />
    </div>
  );
}

function Chapter4Page1() {
  return (
    <div>
      <SectionHeader icon="📢" title="৪ আগাম সতর্কীকরণ ব্যবস্থা" color="#C62828" />
      <Box bg="#FFF3E0" border="#FFB74D">
        🔗 <b>আগের অধ্যায়ে কী শিখলাম?</b> অধ্যায় ৩-এ আমরা একটি দারুণ প্রভাব-ভিত্তিক পূর্বাভাস
        তৈরি করেছি — কে, কোথায়, কতটা ক্ষতিগ্রস্ত হতে পারে তা জেনেছি। কিন্তু এই পূর্বাভাস যদি
        কম্পিউটারেই পড়ে থাকে, মানুষ যদি না জানে — তাহলে কোনো লাভ নেই! তাই এবার শিখব কীভাবে এই
        বার্তা মানুষের কাছে পৌঁছায়।
      </Box>
      <p style={{ lineHeight: 1.8, marginBottom: 16 }}>
        আগাম সতর্কীকরণ ব্যবস্থা (Early Warning System বা সংক্ষেপে EWS) হলো এমন একটি সম্পূর্ণ
        ব্যবস্থা যা — বিপদ আসার আগেই মানুষকে সঠিক সময়ে, সহজ ভাষায় সতর্ক করে, যাতে তারা
        নিরাপদে সরে যেতে বা প্রস্তুতি নিতে পারে। এটি শুধু একটি সাইরেন বা একটি বার্তা নয় — এটি
        অনেকগুলো ধাপের একটি শৃঙ্খল।
      </p>
      <Box bg="#F3E5F5" border="#BA68C8">
        <div style={{ fontWeight: 800, marginBottom: 8 }}>🔌 "এন্ড-টু-এন্ড" মানে কী?</div>
        একটি ভালো সতর্কীকরণ ব্যবস্থা "এক প্রান্ত থেকে অন্য প্রান্ত" পর্যন্ত কাজ করে — অর্থাৎ
        আকাশের মেঘ পর্যবেক্ষণ থেকে শুরু করে একদম প্রত্যন্ত গ্রামের শেষ মানুষটির কাছে বার্তা
        পৌঁছানো এবং তার পদক্ষেপ নেওয়া পর্যন্ত। যেকোনো একটি ধাপ দুর্বল হলে পুরো শৃঙ্খল ভেঙে
        পড়ে।
        <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
          {["🛰 পর্যবেক্ষণ", "🧮 পূর্বাভাস", "📢 বার্তা পাঠানো", "👂 মানুষ বোঝে", "🏃 পদক্ষেপ"].map((s, i) => (
            <span key={i} style={{ background: "#fff", border: "1px solid #ccc", borderRadius: 999, padding: "6px 14px", fontWeight: 600 }}>
              {s}
            </span>
          ))}
        </div>
      </Box>
      <Box bg="#FDEDED" border="#E57373">
        💔 <b>ভেঙে পড়া শৃঙ্খলের গল্প:</b> অতীতে যুক্তরাষ্ট্রের হারিকেন ক্যাটরিনা (২০০৫) ও
        পাকিস্তানে বন্যায় (২০১০) দেখা গেছে — পূর্বাভাস ঠিক ছিল, কিন্তু বার্তা স্পষ্ট ছিল না,
        মানুষ বিশ্বাস করেনি বা সময়মতো পায়নি। ফলে অনেক ক্ষতি হয়েছিল। শুধু ভালো পূর্বাভাসই
        যথেষ্ট নয় — পুরো শৃঙ্খল মজবুত হতে হবে।
      </Box>
      <p>
        👉 এই অধ্যায়ে আমরা শিখব: সতর্কীকরণ ব্যবস্থার ৪টি স্তম্ভ, কীভাবে পূর্বাভাস বার্তায়
        বদলায়, বাংলাদেশের বিখ্যাত CPP ও ৩৩৩ সেবা, এবং কীভাবে সতর্কবার্তা শেষমেশ পদক্ষেপে রূপ
        নেয়।
      </p>
      <PageFooter chapter="অধ্যায় ৪: আগাম সতর্কীকরণ ব্যবস্থা" page="১৭" />

    </div>
  );
}

function Chapter4Page2() {
  return (
    <div>
      <SectionHeader icon="🏛" title="৪ সতর্কীকরণ ব্যবস্থার ৪টি স্তম্ভ" color="#C62828" />
      <p style={{ marginBottom: 16 }}>
        জাতিসংঘের মতে, একটি সফল "মানুষ-কেন্দ্রিক" সতর্কীকরণ ব্যবস্থা দাঁড়িয়ে থাকে ৪টি
        স্তম্ভের ওপর। মজার ব্যাপার — আমরা আগের অধ্যায়গুলোতে এর কয়েকটি ইতিমধ্যেই শিখে
        ফেলেছি! চলো মিলিয়ে দেখি:
      </p>
      <div style={{
        background: "linear-gradient(135deg, #1e293b, #0f172a)",
        color: "#fff",
        textAlign: "center",
        padding: "12px 16px",
        borderRadius: "14px 14px 0 0",
        fontWeight: 800,
        fontSize: "1.1rem",
        borderBottom: "4px solid #f59e0b",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px"
      }}>
        <span>নিরাপদ মানুষ ও সম্পদ</span>
        <span>🏠</span>
      </div>
      <div style={{ 
        display: "flex", 
        gap: "12px", 
        background: "rgba(255, 255, 255, 0.4)",
        padding: "12px",
        borderRadius: "0 0 14px 14px",
        border: "1.5px solid #e2e8f0",
        borderTop: "none",
        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)",
        marginBottom: 20
      }}>
        {[
          { n: 1, icon: "🔎", t: "ঝুঁকির জ্ঞান", d: "(অধ্যায় ২)", c: "linear-gradient(135deg, #d97706, #b45309)" },
          { n: 2, icon: "📡", t: "পর্যবেক্ষণ ও পূর্বাভাস", d: "(অধ্যায় ৩)", c: "linear-gradient(135deg, #16a34a, #15803d)" },
          { n: 3, icon: "📢", t: "বার্তা প্রচার ও যোগাযোগ", d: "(এই অধ্যায়)", c: "linear-gradient(135deg, #DA291C, #9A3324)" },
          { n: 4, icon: "🏃", t: "সাড়া দেওয়ার সক্ষমতা", d: "(অধ্যায় ১ ও ৫)", c: "linear-gradient(135deg, #2563eb, #1d4ed8)" },
        ].map((s) => (
          <div 
            key={s.n} 
            style={{ 
              flex: 1, 
              background: s.c, 
              color: "#fff", 
              padding: "16px 8px", 
              textAlign: "center", 
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px"
            }}
          >
            <div style={{ fontSize: "1.6rem", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}>{s.icon}</div>
            <div style={{ fontWeight: 800, fontSize: "0.9rem", lineHeight: 1.25, textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>{s.t}</div>
            <div style={{ fontSize: "0.75rem", opacity: 0.9, fontWeight: 500 }}>{s.d}</div>
          </div>
        ))}
      </div>
      <Box bg="#FDEDED" border="#E57373">
        🏛 <b>একটি স্তম্ভ দুর্বল হলে? ছাদ ভেঙে পড়ে!</b> যদি পূর্বাভাস (স্তম্ভ ২) দারুণ হয়,
        কিন্তু বার্তা মানুষের কাছে না পৌঁছায় (স্তম্ভ ৩ দুর্বল), তাহলে মানুষ সাড়া দিতে
        (স্তম্ভ ৪) পারবে না। তাই চারটি স্তম্ভকেই সমান মজবুত রাখতে হয়।
      </Box>
      <Box bg="#E1F5FE" border="#4FC3F7">
        🌐 <b>"সবার জন্য আগাম সতর্কবার্তা" (Early Warnings for All)</b>
        <br />
        জাতিসংঘ চায় — ২০২৭ সালের মধ্যে পৃথিবীর প্রতিটি মানুষ যেন একটি আগাম সতর্কীকরণ
        ব্যবস্থার আওতায় আসে। এই চারটি স্তম্ভ চালায় চারটি সংস্থা: ঝুঁকির জ্ঞান (UNDRR),
        পূর্বাভাস (WMO), বার্তা প্রচার (ITU), ও সাড়া দেওয়া (IFRC/রেড ক্রিসেন্ট)।
        তরুণ-নেতৃত্ব এই উদ্যোগের একটি বড় অংশ — অর্থাৎ তুমিও!
      </Box>
      <Box bg="#FBFBFB" border="#ccc">
        <div style={{ fontWeight: 800, marginBottom: 6 }}>কোন স্তম্ভ কোন অধ্যায়?</div>
        তোমরা ইতিমধ্যে ২টি স্তম্ভ শিখে ফেলেছ! দলে আলোচনা করো — অধ্যায় ২ ও ৩ কোন দুটি
        স্তম্ভের সাথে মেলে? আর কোন স্তম্ভটি এখনো বাকি?
      </Box>
      <MCQ
        question='"সাইরেন বাজানো ও পতাকা ওড়ানো" কোন স্তম্ভের কাজ?'
        options={["স্তম্ভ ১", "স্তম্ভ ৩", "স্তম্ভ ৪"]}
        correctIndex={1}
      />
      <PageFooter chapter="অধ্যায় ৪: আগাম সতর্কীকরণ ব্যবস্থা" page="১৮" />
    </div>
  );
}

function Chapter4Page3() {
  return (
    <div>
      <SectionHeader icon="🔄" title="৪ পূর্বাভাস যেভাবে সতর্কবার্তা হয়" color="#C62828" />
      <p style={{ marginBottom: 16 }}>
        এটাই এই মডিউলের সবচেয়ে গুরুত্বপূর্ণ সংযোগ — প্রভাব-ভিত্তিক পূর্বাভাস (IBF) আর
        সতর্কীকরণ ব্যবস্থা (EWS) কীভাবে হাত ধরাধরি করে কাজ করে। পূর্বাভাস হলো "মস্তিষ্ক" 🧠
        আর সতর্কীকরণ ব্যবস্থা হলো "কণ্ঠস্বর" 🗣। মস্তিষ্ক যা বোঝে, কণ্ঠস্বর তা মানুষকে বলে।
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
          <Box bg="#E8F5E9" border="#66BB6A" style={{ marginBottom: 0, textAlign: "center" }}>
            🎨🧮 প্রভাব-ভিত্তিক পূর্বাভাস (IBF)
          </Box>
          <div style={{ fontSize: 22 }}>➜</div>
          <Box bg="#FFFDE7" border="#FDD835" style={{ marginBottom: 0, textAlign: "center" }}>
            🟢🟡🔴 রং ও স্তর ঠিক হয়
          </Box>
          <div style={{ fontSize: 22 }}>➜</div>
          <Box bg="#FDEDED" border="#E57373" style={{ marginBottom: 0, textAlign: "center" }}>
            ✍️ সহজ বার্তা লেখা হয়
          </Box>
        </div>
        <div style={{ fontSize: 22 }}>⬇</div>
        <Box bg="#E3F2FD" border="#64B5F6" style={{ textAlign: "center", width: "100%" }}>
          নানা মাধ্যমে ছড়িয়ে পড়ে 📺📻📱🚩📢
          <div style={{ fontSize: 13, color: "#555" }}>টিভি • রেডিও • মোবাইল SMS • পতাকা • মসজিদের মাইক • স্বেচ্ছাসেবক</div>
        </Box>
        <div style={{ fontSize: 22 }}>⬇</div>
        <div style={{ background: "#2E7D32", color: "#fff", padding: "10px 22px", borderRadius: 999, fontWeight: 800 }}>
          👨‍👩‍👧 মানুষ বোঝে ও পদক্ষেপ নেয়! 🏃
        </div>
      </div>
      <Box bg="#FFFDE7" border="#FDD835" style={{ marginTop: 16 }}>
        🔑 <b>মূল কথা:</b> পূর্বাভাস ছাড়া সতর্কীকরণ ব্যবস্থার কিছু বলার থাকে না, আর
        সতর্কীকরণ ব্যবস্থা ছাড়া পূর্বাভাস কারো কানে পৌঁছায় না। দুটি একসাথে কাজ করলেই জীবন
        বাঁচে।
      </Box>
      <Box bg="#F3E5F5" border="#BA68C8">
        <div style={{ fontWeight: 800, marginBottom: 6 }}>বার্তা লেখো নিজে</div>
        ধরো IBF বলছে: "নদীর ধারের নিচু এলাকায় লাল 🔴 মাত্রার বন্যা, ৪৮ ঘণ্টার মধ্যে।" এই
        পূর্বাভাসটিকে গ্রামের মানুষের জন্য একটি ১-বাক্যের সহজ সতর্কবার্তায় লেখো (জটিল শব্দ
        ছাড়া)।
        <div style={{ marginTop: 8, fontStyle: "italic", color: "#666" }}>
          🧠 চিন্তার খোরাক: তোমার বার্তায় কি "কী করতে হবে" সেটাও আছে? শুধু ভয় না দেখিয়ে পথ
          দেখানো জরুরি!
        </div>
      </Box>
      <PageFooter chapter="অধ্যায় ৪: আগাম সতর্কীকরণ ব্যবস্থা" page="১৯" />
    </div>
  );
}

function Chapter4Page4() {
  return (
    <div>
      <SectionHeader icon="🇧🇩" title="৪ বাংলাদেশের গর্ব: CPP ও সতর্কীকরণ" color="#C62828" />
      <p style={{ marginBottom: 16 }}>
        বাংলাদেশের সতর্কীকরণ ব্যবস্থা পৃথিবীতে অন্যতম সেরা! ১৯৭০ সালের ভয়াবহ ঘূর্ণিঝড়ে
        প্রায় ৩ লক্ষ মানুষ মারা গিয়েছিল। সেই শোক থেকে শিক্ষা নিয়ে ১৯৭২ সালে গড়ে ওঠে
        ঘূর্ণিঝড় প্রস্তুতি কর্মসূচি (Cyclone Preparedness Programme — CPP)। আজ এর ফলে
        দুর্যোগে মৃত্যু অনেক, অনেক কমে গেছে।
      </p>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <Box bg="#FDEDED" border="#E57373" style={{ flex: 1, minWidth: 240, textAlign: "center" }}>
          <div style={{ fontSize: 26 }}>🧑‍🚒</div>
          <div style={{ fontWeight: 900, fontSize: 22 }}>৭৬,০০০+</div>
          <div>প্রশিক্ষিত CPP স্বেচ্ছাসেবক (অর্ধেক নারী!), ১৩টি উপকূলীয় জেলায় কাজ করেন</div>
        </Box>
        <Box bg="#E3F2FD" border="#64B5F6" style={{ flex: 1, minWidth: 240, textAlign: "center" }}>
          <div style={{ fontSize: 26 }}>📻</div>
          <div style={{ fontWeight: 800 }}>BMD → CPP → মানুষ</div>
          <div>আবহাওয়া অধিদপ্তর (BMD) সংকেত দেয় → CPP স্বেচ্ছাসেবক হ্যান্ড-রেডিওতে পান → গ্রামে পৌঁছে দেন</div>
        </Box>
      </div>
      <Box bg="#FBFBFB" border="#ccc">
        <div style={{ fontWeight: 800, marginBottom: 10 }}>📢 স্বেচ্ছাসেবকরা যেভাবে বার্তা পৌঁছান</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
          {["🚩 লাল-কালো পতাকা ওড়ানো", "📣 হ্যান্ড-মাইকে ঘোষণা", "🕌 মসজিদের মাইক", "🏃 ঘরে ঘরে গিয়ে খবর"].map((s, i) => (
            <React.Fragment key={i}>
              <span style={{ background: "#fff", border: "1px solid #ccc", borderRadius: 8, padding: "8px 14px" }}>{s}</span>
              {i < 3 && <span style={{ alignSelf: "center" }}>→</span>}
            </React.Fragment>
          ))}
        </div>
      </Box>
      <Box bg="#FFFDE7" border="#FDD835">
        <div style={{ fontWeight: 800, marginBottom: 8 }}>📞 জরুরি নম্বর — মুখস্থ রাখো!</div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {[
            { n: "৩৩৩", d: "সরকারি তথ্য ও দুর্যোগ সহায়তা হেল্পলাইন" },
            { n: "১০৯০", d: "আবহাওয়া ও দুর্যোগ বার্তা (টোল-ফ্রি)" },
            { n: "৯৯৯", d: "জাতীয় জরুরি সেবা (পুলিশ/ফায়ার/অ্যাম্বুলেন্স)" },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, minWidth: 160, textAlign: "center", background: "#fff", borderRadius: 10, padding: 12, border: "1px solid #eee" }}>
              <div style={{ fontWeight: 900, fontSize: 22, color: "#C62828" }}>{s.n}</div>
              <div style={{ fontSize: 13 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </Box>
      <Box bg="#E8F5E9" border="#66BB6A">
        📉 <b>সাফল্যের প্রমাণ:</b> ১৯৭০ সালের ঘূর্ণিঝড়ে মৃত্যু হয়েছিল প্রায় ৩,০০,০০০ জন।
        কিন্তু শক্তিশালী সতর্কীকরণ ব্যবস্থা ও আশ্রয়কেন্দ্রের কারণে সাম্প্রতিক বড়
        ঘূর্ণিঝড়গুলোতে মৃত্যু নেমে এসেছে কয়েকশো বা তারও কমে। আগাম সতর্কবার্তা সত্যিই লক্ষ
        লক্ষ জীবন বাঁচায় — এটি কোনো কল্পনা নয়, বাংলাদেশের বাস্তব অর্জন!
      </Box>
      <Box bg="#FBFBFB" border="#ccc">
        <div style={{ fontWeight: 800, marginBottom: 6 }}>তোমার এলাকার বার্তা-পথ</div>
        তোমার এলাকায় দুর্যোগের খবর কীভাবে আসে? (মাইক, মোবাইল, মেম্বার, রেডিও?) যদি বিদ্যুৎ ও
        মোবাইল নেটওয়ার্ক বন্ধ থাকে, তখন কোন উপায়টি কাজ করবে? দলে আলোচনা করো।
      </Box>
      <MCQ question="CPP কোন সালে শুরু হয়?" options={["১৯৭০", "১৯৭২", "২০০০"]} correctIndex={1} />
      <PageFooter chapter="অধ্যায় ৪: আগাম সতর্কীকরণ ব্যবস্থা" page="২০" />
    </div>
  );
}

function Chapter4Page5() {
  return (
    <div>
      <SectionHeader icon="🏃" title="৪ সতর্কবার্তা → পদক্ষেপ (স্তম্ভ ৪)" color="#C62828" />
      <p style={{ marginBottom: 16 }}>
        সবচেয়ে ভালো বার্তাও বৃথা যায় যদি মানুষ সাড়া না দেয়। তাই চতুর্থ স্তম্ভ — "সাড়া
        দেওয়ার সক্ষমতা" — খুবই জরুরি। মানুষকে আগে থেকে জানতে হবে: সংকেত শুনলে কোথায় যাব, কী
        নেব, কীভাবে যাব। এখানেই অধ্যায় ১-এর আগাম পদক্ষেপ আবার ফিরে আসে!
      </p>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <Box bg="#E8F5E9" border="#66BB6A" style={{ flex: 1, minWidth: 260 }}>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>✅ প্রস্তুত সমাজের লক্ষণ</div>
          <CheckList
            color="#2E7D32"
            items={[
              "সবাই সংকেতের রং ও অর্থ জানে",
              "আশ্রয়কেন্দ্রের পথ চিহ্নিত ও জানা",
              "নিয়মিত মহড়া (drill) হয়",
              "বয়স্ক-প্রতিবন্ধীদের সরানোর পরিকল্পনা আছে",
            ]}
          />
        </Box>
        <Box bg="#FDEDED" border="#E57373" style={{ flex: 1, minWidth: 260 }}>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>⚠️ কেন মানুষ সাড়া দেয় না?</div>
          <CheckList
            color="#C62828"
            items={[
              "বার্তা বোঝেনি বা দেরিতে পেয়েছে",
              "আগের ভুল সতর্কতায় বিশ্বাস হারিয়েছে",
              "ঘরবাড়ি-পশু ফেলে যেতে চায় না",
              "কী করতে হবে জানে না",
            ]}
          />
        </Box>
      </div>
      <Box bg="#F3E5F5" border="#BA68C8">
        🧒 <b>তরুণদের বিশেষ ভূমিকা:</b> গবেষণায় দেখা গেছে — যেসব বার্তায় শুধু বিপদ নয়, "কী
        করতে হবে" তাও বলা থাকে, মানুষ সেগুলোতে বেশি সাড়া দেয়। তোমরা পরিবারের বয়স্ক বা
        পড়তে-না-জানা সদস্যদের সংকেতের অর্থ বুঝিয়ে দিতে পারো — এটাই চতুর্থ স্তম্ভকে মজবুত
        করা!
      </Box>
      <Box bg="#E1F5FE" border="#4FC3F7">
        📌 <b>অধ্যায় ৪ সারসংক্ষেপ:</b> সতর্কীকরণ ব্যবস্থা = ৪টি স্তম্ভ (ঝুঁকির জ্ঞান +
        পূর্বাভাস + বার্তা প্রচার + সাড়া দেওয়া)। পূর্বাভাস (অধ্যায় ৩) এখানে বার্তায় রূপ
        নেয়, আর পদক্ষেপ (অধ্যায় ১) এখানে বাস্তব হয়। বাংলাদেশের CPP এর এক উজ্জ্বল উদাহরণ।
      </Box>
      <Box bg="#FBFBFB" border="#ccc">
        <div style={{ fontWeight: 800, marginBottom: 6 }}>মিনি-মহড়া (Mock Drill) আয়োজন করো</div>
        ক্লাসে বা ক্লাবে একটি ছোট মহড়া করো: একজন "BMD" সংকেত দেবে → একজন "CPP স্বেচ্ছাসেবক"
        পতাকা তুলে/ঘোষণা করে বার্তা ছড়াবে → বাকিরা "আশ্রয়কেন্দ্রে" যাবে। ৪টি স্তম্ভের কোন
        ধাপ কে করছে, খেয়াল করো!
      </Box>
      <MCQ question='"কী করতে হবে" বলা বার্তায় মানুষ কি বেশি সাড়া দেয়?' options={["হ্যাঁ", "না"]} correctIndex={0} />
      <div style={{ textAlign: "center", fontWeight: 800, color: "#C62828", fontSize: 18, margin: "20px 0" }}>
        🎉 অধ্যায় ৪ শেষ — তুমি এখন সতর্কীকরণ ব্যবস্থা বোঝো!
      </div>
      <PageFooter chapter="অধ্যায় ৪: আগাম সতর্কীকরণ ব্যবস্থা" page="২১" />
    </div>
  );
}

function Chapter5Page1() {
  return (
    <div>
      <SectionHeader icon="🙋" title="৫ তুমিই বিজ্ঞানী! (Citizen Science)" color="#00695C" />
      <Box bg="#FFF3E0" border="#FFB74D">
        🔗 <b>আগের অধ্যায়ে কী শিখলাম?</b> অধ্যায় ৪-এ দেখলাম সতর্কীকরণ ব্যবস্থার স্তম্ভ ১ হলো
        "ঝুঁকির জ্ঞান"। কিন্তু এই জ্ঞান আসবে কোথা থেকে? এখানেই তুমি এসো — তোমার সংগ্রহ করা
        তথ্য পুরো ব্যবস্থার ভিত্তি মজবুত করে। চক্রটি এবার সম্পূর্ণ হয়!
      </Box>
      <p style={{ lineHeight: 1.8, marginBottom: 16 }}>
        আবহাওয়া অফিস স্যাটেলাইট ও যন্ত্র দিয়ে অনেক কিছু জানে। কিন্তু তোমার বাড়ি, তোমার পাড়ার
        ছোট ছোট তথ্য তারা সবসময় জানে না — যেমন কোন ঘর কাঁচা, কোথায় পানি আগে ওঠে। এই তথ্য তুমি
        সংগ্রহ করতে পারো! একে বলা হয় Citizen Science — অর্থাৎ সাধারণ মানুষের সংগ্রহ করা
        বিজ্ঞান।
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", marginBottom: 20, flexWrap: "wrap" }}>
        <Box bg="#E3F2FD" border="#64B5F6" style={{ marginBottom: 0, textAlign: "center" }}>
          🛰 বড় ছবি
          <div style={{ fontSize: 12 }}>(স্যাটেলাইট, যন্ত্র)</div>
        </Box>
        <div style={{ fontSize: 22, fontWeight: 900 }}>+</div>
        <Box bg="#E8F5E9" border="#66BB6A" style={{ marginBottom: 0, textAlign: "center" }}>
          🙋 ছোট তথ্য
          <div style={{ fontSize: 12 }}>(তুমি ও তোমার পাড়া)</div>
        </Box>
        <div style={{ fontSize: 22, fontWeight: 900 }}>=</div>
        <Box bg="#FFFDE7" border="#FDD835" style={{ marginBottom: 0, textAlign: "center" }}>
          নিখুঁত পূর্বাভাস
        </Box>
      </div>
      <Box bg="#FBFBFB" border="#ccc">
        <div style={{ fontWeight: 800, marginBottom: 8 }}>📒 তুমি কোন তথ্য সংগ্রহ করতে পারো?</div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>🏠 ঝুঁকিপূর্ণতার তথ্য</div>
            <CheckList
              color="#00695C"
              items={["ঘরের ধরন (পাকা/আধা-পাকা/কাঁচা)", "পরিবারে শিশু, বয়স্ক, প্রতিবন্ধী আছে কি", "পরিবারের আয়ের উৎস"]}
            />
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>📍 সম্মুখীনতার তথ্য</div>
            <CheckList
              color="#00695C"
              items={["ঘর নদী/খাল থেকে কত দূরে", "আগে কোন বছর কতটা পানি উঠেছিল", "গবাদি পশু ও ফসলের জমির পরিমাণ"]}
            />
          </div>
        </div>
      </Box>
      <Box bg="#E1F5FE" border="#4FC3F7">
        📱 <b>আধুনিক উপায়:</b> এখন মোবাইল অ্যাপ দিয়ে ছবি তুলে, বৃষ্টি মেপে বা পানির উচ্চতা
        লিখে তথ্য পাঠানো যায়। অনেক দেশে স্কুলশিক্ষার্থীরা এভাবে বন্যা পর্যবেক্ষণে সাহায্য
        করছে। তোমার সংগ্রহ করা তথ্য পুরোনো ডেটার ফাঁক পূরণ করে, বিশেষ করে যেখানে তথ্য কম।
      </Box>
      <Box bg="#FFFDE7" border="#FDD835">
        <div style={{ fontWeight: 800, marginBottom: 10 }}>🚀 MET ক্লাব যেভাবে কাজ করবে — ৩টি ধাপ</div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {[
            { n: 1, icon: "🏠", t: "নিজের ঘর দিয়ে শুরু", d: "প্রথমে MET ক্লাবের সদস্যরা নিজেদের বাড়ির তথ্য-কার্ড পূরণ করে অনুশীলন করবে।" },
            { n: 2, icon: "🧑‍🏫", t: "বন্ধুদের প্রশিক্ষণ", d: "তারপর ক্লাব সদস্যরা স্কুলের সব শিক্ষার্থীকে তথ্য সংগ্রহের নিয়ম শেখাবে।" },
            { n: 3, icon: "📲", t: "সংগ্রহ ও আপলোড", d: "সব শিক্ষার্থী মিলে এলাকার অনেক বাড়ির তথ্য সংগ্রহ করে প্ল্যাটফর্মে আপলোড করবে।" },
          ].map((s) => (
            <Box key={s.n} bg="#fff" border="#eee" style={{ flex: 1, minWidth: 200, textAlign: "center" }}>
              <div style={{ fontSize: 24 }}>{s.icon}</div>
              <div style={{ fontWeight: 800 }}>{s.t}</div>
              <div style={{ fontSize: 13, color: "#666" }}>{s.d}</div>
            </Box>
          ))}
        </div>
        <div style={{ marginTop: 10, fontStyle: "italic", color: "#555" }}>
          🌱 ছোট থেকে বড়: একজন সদস্য একটি বাড়ি দিয়ে শুরু করে → পুরো ক্লাব → পুরো স্কুল → পুরো
          এলাকা। এভাবে অল্প অল্প করে বিশাল ও নির্ভরযোগ্য তথ্যভাণ্ডার তৈরি হয়, যা নিখুঁত
          পূর্বাভাসের ভিত্তি।
        </div>
      </Box>
      <PageFooter chapter="অধ্যায় ৫: Citizen Science" page="২২" />

    </div>
  );
}

function Chapter5Page2() {
  return (
    <div>
      <SectionHeader icon="🏠" title="৫ আমার বাড়ির তথ্য-কার্ড" color="#00695C" />
      <p style={{ marginBottom: 16 }}>
        চলো একটি নমুনা তথ্য-কার্ড পূরণ করি। বড়দের সাহায্য নিয়ে নিজের বাড়ির তথ্য লেখো। মনে
        রেখো — সঠিক ও সৎ তথ্যই ভালো পূর্বাভাস তৈরি করে।
      </p>
      <Box bg="#FBFBFB" border="#ccc">
        <div style={{ fontWeight: 800, marginBottom: 12 }}>🏠 পরিবার ঝুঁকি তথ্য-কার্ড</div>
        {[
          { q: "১. ঘরের ধরন", opts: ["পাকা", "আধা-পাকা", "কাঁচা"] },
          { q: "২. ঘর নদী/খাল থেকে দূরত্ব", opts: ["খুব কাছে", "মাঝারি", "দূরে"] },
          { q: "৩. জায়গা উঁচু না নিচু", opts: ["উঁচু", "সমতল", "নিচু"] },
          { q: "৫. প্রতিবন্ধী/অসুস্থ সদস্য আছে?", opts: ["হ্যাঁ", "না"] },
          { q: "৭. আগের বন্যায় সর্বোচ্চ পানি", opts: ["হাঁটু", "কোমর", "এর বেশি"] },
        ].map((row, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>{row.q}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {row.opts.map((o) => (
                <span key={o} style={{ border: "1px solid #ccc", borderRadius: 999, padding: "5px 14px", background: "#fff" }}>
                  ◯ {o}
                </span>
              ))}
            </div>
          </div>
        ))}
        <div style={{ marginBottom: 6 }}>
          ৪. পরিবারের সদস্য সংখ্যা ____ জন (শিশু ____ , বয়স্ক ____ )
        </div>
        <div style={{ marginBottom: 6 }}>৬. গবাদি পশু/হাঁস-মুরগি ____ টি</div>
        <div>৮. নিকটতম আশ্রয়কেন্দ্রের দূরত্ব ____ মিনিট হাঁটা পথ</div>
      </Box>
      <Box bg="#FDEDED" border="#E57373">
        🔐 <b>নিয়ম মনে রাখো:</b> ১) কখনো একা অচেনা জায়গায় তথ্য সংগ্রহে যেও না — বড়দের সাথে
        যাও। ২) কারো ব্যক্তিগত তথ্য (নাম, ছবি) তার অনুমতি ছাড়া ব্যবহার কোরো না। ৩) সবার
        প্রতি সম্মান দেখাও।
      </Box>
      <Box bg="#E8F5E9" border="#66BB6A">
        <b>রাফি বলছে:</b> "আমাদের ক্লাবের সবাই মিলে পাড়ার ৩০টি বাড়ির তথ্য-কার্ড পূরণ
        করেছি। এখন আমরা জানি কোন বাড়িগুলোতে আগে সাহায্য পৌঁছাতে হবে!"
      </Box>
      <PageFooter chapter="অধ্যায় ৫: Citizen Science" page="২৩" />
    </div>
  );
}

function Chapter5Page3() {
  return (
    <div>
      <SectionHeader icon="📈" title="৫ তোমার তথ্য কীভাবে সাহায্য করে?" color="#00695C" />
      <p style={{ marginBottom: 16 }}>
        তোমার সংগ্রহ করা তথ্য একটি বড় যাত্রার অংশ। চলো দেখি কীভাবে ছোট্ট একটি তথ্য-কার্ড
        থেকে নিখুঁত পূর্বাভাস ও আগাম পদক্ষেপ তৈরি হয়:
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { n: 1, t: "তুমি তথ্য সংগ্রহ করো", d: "ঘরের ধরন, পানির উচ্চতা, পরিবারের তথ্য", c: "#2E7D32" },
          { n: 2, t: "তথ্য জমা হয় মানচিত্রে", d: "ঝুঁকিপূর্ণতার মানচিত্র (Vulnerability Map) তৈরি হয়", c: "#1565C0" },
          { n: 3, t: "পূর্বাভাসের সাথে মেলানো হয়", d: "আবহাওয়ার পূর্বাভাস + তোমার তথ্য = প্রভাব-ভিত্তিক পূর্বাভাস", c: "#C62828" },
          { n: 4, t: "রং-সংকেত ও পদক্ষেপ-মানচিত্র তৈরি", d: "কোথায় আগে সাহায্য দরকার, তা চিহ্নিত হয়", c: "#F57F17" },
          { n: 5, t: "আগাম পদক্ষেপ → জীবন ও সম্পদ রক্ষা! 🎉", d: "সঠিক জায়গায়, সঠিক সময়ে সাহায্য পৌঁছায়", c: "#00695C" },
        ].map((s) => (
          <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 14, background: s.c, color: "#fff", borderRadius: 10, padding: "10px 16px" }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
              {s.n}
            </div>
            <div>
              <div style={{ fontWeight: 800 }}>{s.t}</div>
              <div style={{ fontSize: 13, opacity: 0.9 }}>{s.d}</div>
            </div>
          </div>
        ))}
      </div>
      <Box bg="#FFFDE7" border="#FDD835" style={{ marginTop: 16 }}>
        🌟 <b>তুমি কত গুরুত্বপূর্ণ খেলে?</b> তোমার সঠিক তথ্য ছাড়া পূর্বাভাস অসম্পূর্ণ থেকে
        যায়। তুমি যত নিখুঁত তথ্য দেবে, পূর্বাভাস তত নির্ভুল হবে — আর তত বেশি জীবন বাঁচবে।
        তুমি সত্যিই একজন তরুণ আবহাওয়া-বিজ্ঞানী!
      </Box>
      <div style={{ textAlign: "center", fontWeight: 800, color: "#00695C", fontSize: 18, margin: "20px 0" }}>
        🎉 অধ্যায় ৫ শেষ — তুমি এখন একজন Citizen Scientist!
      </div>
      <Box bg="#E8F5E9" border="#66BB6A">
        <div style={{ fontWeight: 800, marginBottom: 6 }}>🤝 দল বেঁধে কাজ করো</div>
        একা একটি বাড়ির তথ্য নয় — বন্ধুদের সাথে দল বেঁধে পুরো পাড়ার তথ্য সংগ্রহ করো। যত
        বেশি বাড়ি, তত নিখুঁত মানচিত্র, তত নিরাপদ এলাকা। শিক্ষক ও স্বেচ্ছাসেবকদের সাথে ভাগ
        করে নাও।
      </Box>
      <PageFooter chapter="অধ্যায় ৫: Citizen Science" page="২৪" />
    </div>
  );
}

/* ---------- Final Quiz + Glossary ---------- */
function FinalQuiz() {
  const glossary = [
    ["আগাম পদক্ষেপ", "Anticipatory Action — দুর্যোগের আগে প্রস্তুতিমূলক কাজ"],
    ["আগাম সতর্কীকরণ ব্যবস্থা", "Early Warning System (EWS) — বিপদের আগে সতর্ক করার সম্পূর্ণ শৃঙ্খল"],
    ["প্রভাব-ভিত্তিক পূর্বাভাস", 'Impact-Based Forecast — "আবহাওয়া কী করবে" তা জানানো'],
    ["বিপদ", "Hazard — ক্ষতিকর প্রাকৃতিক ঘটনা (ঝড়, বন্যা)"],
    ["ঝুঁকিপূর্ণতা", "Vulnerability — কতটা সহজে ক্ষতি হয়"],
    ["সম্মুখীনতা", "Exposure — কে/কী বিপদের সামনে আছে"],
    ["CPP", "ঘূর্ণিঝড় প্রস্তুতি কর্মসূচি — সতর্কবার্তা পৌঁছানো স্বেচ্ছাসেবক দল"],
    ["Citizen Science", "সাধারণ মানুষের সংগ্রহ করা বৈজ্ঞানিক তথ্য"],
  ];
  return (
    <div>
      <SectionHeader icon="🏆" title="বড় কুইজ ও শব্দার্থ" color="#C62828" />
      <Box bg="#FBFBFB" border="#ccc">
        <div style={{ fontWeight: 800, marginBottom: 10 }}>🏆 চূড়ান্ত কুইজ — তুমি কতটা শিখলে?</div>
        <MCQ question="আগাম পদক্ষেপ কখন নেওয়া হয়?" options={["দুর্যোগের আগে", "দুর্যোগের পরে"]} correctIndex={0} />
        <MCQ question="কোন রং সবচেয়ে বেশি বিপদ বোঝায়?" options={["🟢", "🟡", "🔴"]} correctIndex={2} />
        <MCQ question="বাংলাদেশে মহাবিপদ সংকেত কোন নম্বর?" options={["৪", "৭", "১০"]} correctIndex={2} />
        <MCQ
          question="সতর্কবার্তা পৌঁছানোর জন্য বাংলাদেশের স্বেচ্ছাসেবক দলের নাম কী?"
          options={["CPP", "BMD"]}
          correctIndex={0}
        />
        <MCQ question="দুর্যোগের সরকারি তথ্য হেল্পলাইন নম্বর কত?" options={["৩৩৩", "১২৩"]} correctIndex={0} />
        <Box bg="#fff" border="#ddd">
          <div>২. ঝুঁকির সূত্রটি লেখো: বিপদ × ________ × ________</div>
          <div style={{ color: "#666", fontStyle: "italic", marginTop: 4 }}>উত্তর: ঝুঁকিপূর্ণতা × সম্মুখীনতা</div>
        </Box>
        <Box bg="#fff" border="#ddd">
          <div>৫. সতর্কীকরণ ব্যবস্থার ৪টি স্তম্ভ কী কী?</div>
          <div style={{ color: "#666", fontStyle: "italic", marginTop: 4 }}>
            উত্তর: ঝুঁকির জ্ঞান, পূর্বাভাস, বার্তা প্রচার, সাড়া দেওয়া
          </div>
        </Box>
        <Box bg="#fff" border="#ddd">
          <div>৮. Citizen Science মানে কী? এক বাক্যে লেখো।</div>
          <div style={{ color: "#666", fontStyle: "italic", marginTop: 4 }}>
            উত্তর: সাধারণ মানুষের সংগ্রহ করা বৈজ্ঞানিক তথ্য
          </div>
        </Box>
      </Box>

      <Box bg="#E1F5FE" border="#4FC3F7">
        <div style={{ fontWeight: 800, marginBottom: 10 }}>📖 জরুরি শব্দার্থ</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {glossary.map(([term, def], i) => (
              <tr key={i} style={{ borderBottom: "1px solid #d0e8f7" }}>
                <td className="font-bold py-2 pr-3 align-top text-xs sm:text-sm md:text-base whitespace-normal sm:whitespace-nowrap" style={{ color: "#065f46" }}>{term}</td>
                <td className="py-2 text-xs sm:text-sm md:text-base text-gray-700" style={{ verticalAlign: "top" }}>{def}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
      <PageFooter chapter="কুইজ ও শব্দার্থ" page="২৫" />
    </div>
  );
}

/* ---------- Certificate ---------- */
function Certificate() {
  const [name, setName] = useState("");
  return (
    <div>
      <div
        style={{
          background: "linear-gradient(135deg,#C62828,#8E0000)",
          borderRadius: 20,
          padding: 40,
          color: "#fff",
          textAlign: "center",
          border: "6px solid #FFD54F",
        }}
      >
        <div style={{ fontSize: 40 }}>🏅</div>
        <div style={{ fontWeight: 700, letterSpacing: 2 }}>MET ক্লাব • তরুণ দূত</div>
        <h2 style={{ fontSize: 30, margin: "16px 0" }}>অভিনন্দন!</h2>
        <p>এই সনদপত্র প্রমাণ করে যে</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="(তোমার নাম লেখো)"
          style={{
            background: "transparent",
            border: "none",
            borderBottom: "2px solid #fff",
            color: "#fff",
            fontSize: 22,
            fontWeight: 800,
            textAlign: "center",
            padding: "6px 10px",
            margin: "10px 0 20px",
            width: 280,
          }}
        />
        <p style={{ lineHeight: 1.8, maxWidth: 500, margin: "0 auto" }}>
          সফলভাবে "আগাম পদক্ষেপ, প্রভাব-ভিত্তিক পূর্বাভাস ও আগাম সতর্কীকরণ ব্যবস্থা" কোর্সটি
          সম্পন্ন করেছে এবং এখন একজন গর্বিত তরুণ আবহাওয়া-বিজ্ঞানী ও দুর্যোগ-দূত।
        </p>
        <div style={{ marginTop: 26, display: "flex", justifyContent: "space-between", padding: "0 40px" }}>
          <div>
            <div style={{ borderTop: "1px solid #fff", paddingTop: 6, minWidth: 120 }}>তারিখ</div>
          </div>
          <div>
            <div style={{ borderTop: "1px solid #fff", paddingTop: 6, minWidth: 120 }}>ক্লাব সমন্বয়ক</div>
          </div>
        </div>
        <p style={{ marginTop: 30, fontStyle: "italic", opacity: 0.9 }}>
          "আগে জানি → আগে বুঝি → আগে জানাই → আগে করি।"
        </p>
        <p style={{ marginTop: 10, fontWeight: 700 }}>
          এখন তোমার পালা — যা শিখলে, তা পরিবার ও বন্ধুদের শেখাও! 🌟
        </p>
      </div>
      <PageFooter chapter="MET ক্লাব ই-লার্নিং প্ল্যাটফর্ম" page="২৬" />
    </div>
  );
}

/* ============ APP ROOT ============ */

export default function App() {
  const navigate = useNavigate();
  const [page, setPage] = useState("cover");
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo(0, 0);
    }
  }, [page]);

  const renderPage = () => {
    switch (page) {
      case "cover":
        return <CoverPage />;
      case "welcome":
        return <WelcomePage />;
      case "toc":
        return <TOCPage go={setPage} />;
      case "roadmap":
        return <RoadmapPage />;
      case "ch1_1":
        return <Chapter1Page1 />;
      case "ch1_2":
        return <Chapter1Page2 />;
      case "ch1_3":
        return <Chapter1Page3 />;
      case "ch1_4":
        return <Chapter1Page4 />;
      case "ch2_1":
        return <Chapter2Page1 />;
      case "ch2_2":
        return <Chapter2Page2 />;
      case "ch2_3":
        return <Chapter2Page3 />;
      case "ch2_4":
        return <Chapter2Page4 />;
      case "ch3_1":
        return <Chapter3Page1 />;
      case "ch3_2":
        return <Chapter3Page2 />;
      case "ch3_3":
        return <Chapter3Page3 />;
      case "ch3_4":
        return <Chapter3Page4 />;
      case "ch4_1":
        return <Chapter4Page1 />;
      case "ch4_2":
        return <Chapter4Page2 />;
      case "ch4_3":
        return <Chapter4Page3 />;
      case "ch4_4":
        return <Chapter4Page4 />;
      case "ch4_5":
        return <Chapter4Page5 />;
      case "ch5_1":
        return <Chapter5Page1 />;
      case "ch5_2":
        return <Chapter5Page2 />;
      case "ch5_3":
        return <Chapter5Page3 />;
      case "quiz":
        return <FinalQuiz />;
      case "certificate":
        return <Certificate />;
      default:
        return <CoverPage />;
    }
  };

  const idx = NAV.findIndex((n) => n.key === page);

  return (
    <div
      className="fixed inset-0 z-40 flex flex-col"
      style={{
        fontFamily: "'Noto Sans Bengali','Hind Siliguri',sans-serif",
        background: "#F3F1EC",
      }}
    >
      <TopNav brandName="মেট ক্লাব" title={NAV[idx]?.label} />

      {/* Scrollable Main content area */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        <div
          className="w-full max-w-5xl mx-auto px-2 py-3 sm:px-4 sm:py-6"
        >
          {/* Main content */}
          <div className="min-w-0" style={{ padding: "0 0 40px" }}>
            {page === "cover" ? (
              <div
                style={{
                  borderRadius: 20,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  overflow: "hidden",
                }}
              >
                {renderPage()}
              </div>
            ) : (
              <div
                className="p-4 sm:p-6 md:p-8"
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  overflow: "hidden",
                }}
              >
                {renderPage()}
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav
        current={idx}
        total={NAV.length}
        onPrev={() => setPage(NAV[idx - 1].key)}
        onNext={() => {
          if (idx >= NAV.length - 1) {
            navigate("/learning-selection");
          } else {
            setPage(NAV[idx + 1].key);
          }
        }}
        variant="section"
      />
    </div>
  );
}