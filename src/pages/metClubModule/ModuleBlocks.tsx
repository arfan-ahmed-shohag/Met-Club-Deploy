import React, { useState } from "react";

/* Building blocks shared by the MET Club e-learning module pages. */

type BoxProps = {
  children: React.ReactNode;
  bg: string;
  border: string;
  style?: React.CSSProperties;
};

type EyebrowProps = {
  children: React.ReactNode;
  color: string;
};

type SectionHeaderProps = {
  icon: React.ReactNode;
  title: string;
  color: string;
};

type CheckListProps = {
  items: string[];
  color?: string;
};

type PageFooterProps = {
  chapter: string;
  page: string;
  style?: React.CSSProperties;
};

type MCQProps = {
  question: string;
  options: string[];
  correctIndex: number;
};

type TrueFalseProps = {
  statement: string;
  answer: boolean;
  index: number;
};

type ColorMatchProps = {
  scenario: string;
  correctColor: string;
};

export const Eyebrow = ({ children, color }: EyebrowProps) => (
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

export const SectionHeader = ({ icon, title, color }: SectionHeaderProps) => (
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

export const Box = ({ children, bg, border, style }: BoxProps) => (
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

export const CheckList = ({ items, color = "#D93025" }: CheckListProps) => (
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

export const PageFooter = ({ chapter, page, style }: PageFooterProps) => (
  <div
    className="flex justify-between text-[11px] sm:text-xs md:text-sm text-gray-500 border-t border-gray-200 mt-8 pt-3"
    style={style}
  >
    <span>MET ক্লাব • {chapter}</span>
    <span>পৃষ্ঠা {page}</span>
  </div>
);

/* Multiple choice question with click-to-reveal */
export function MCQ({ question, options, correctIndex }: MCQProps) {
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
export function TrueFalse({ statement, answer, index }: TrueFalseProps) {
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
export function ColorMatch({ scenario, correctColor }: ColorMatchProps) {
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

/* ============ ILLUSTRATIONS (SVG, cover-style) ============ */
export const CoverArt = () => (
  <svg
    viewBox="0 0 900 500"
    style={{ width: "100%", height: "auto", display: "block" }}
  >
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
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#FFD54F"
          strokeWidth="6"
          strokeLinecap="round"
        />
      );
    })}
    <ellipse cx="180" cy="90" rx="120" ry="45" fill="#E57373" opacity="0.7" />
    <ellipse cx="620" cy="180" rx="100" ry="38" fill="#E57373" opacity="0.6" />
    <path
      d="M0,340 C150,280 300,320 450,300 C600,280 750,320 900,290 L900,500 L0,500 Z"
      fill="#2E7D32"
    />
    <path
      d="M0,380 C150,340 300,370 450,355 C600,340 750,365 900,340 L900,500 L0,500 Z"
      fill="#388E3C"
    />
    <polygon points="150,340 190,290 230,340" fill="#1B2631" />
    <rect x="160" y="340" width="60" height="45" fill="#FDE9D9" />
    <polygon points="250,345 280,310 310,345" fill="#E67E22" />
    <rect x="255" y="345" width="50" height="38" fill="#FDE9D9" />
    <path
      d="M420,260 C440,330 440,380 420,430 C400,380 400,330 420,260 Z"
      fill="#81D4FA"
    />
    <circle cx="680" cy="400" r="14" fill="#F4C29A" />
    <rect x="668" y="414" width="24" height="45" rx="6" fill="#1565C0" />
    <polygon points="710,395 710,430 750,412" fill="#fff" />
    <rect x="708" y="395" width="4" height="65" fill="#5D4037" />
  </svg>
);

/* ============ PAGE CONTENT COMPONENTS ============ */
export function CoverPage() {
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
          <span className="inline-block bg-black/85 text-white rounded-full px-5 py-2 mt-4 font-bold text-xs sm:text-sm">
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

export function WelcomePage() {
  return (
    <div>
      <SectionHeader
        icon="★"
        title="স্বাগতম, ছোট্ট আবহাওয়া-বিজ্ঞানী!"
        color="#C62828"
      />
      <p style={{ fontSize: 16, lineHeight: 1.8 }}>
        তুমি কি জানো — প্রতি ১–২ দিনে পৃথিবীতে একটি করে আবহাওয়া বা জলবায়ু-সম্পর্কিত
        দুর্যোগ ঘটে? কিন্তু সুখবর হলো, এখন আমরা <b>আগে থেকেই</b> অনেক দুর্যোগের কথা
        জানতে পারি। আর যা আগে জানা যায়, তার জন্য <b>আগেই প্রস্তুতি</b> নেওয়া যায়! এই
        মডিউলে তুমি শিখবে কীভাবে পূর্বাভাসকে কাজে লাগিয়ে নিজের পরিবার ও এলাকাকে
        নিরাপদ রাখা যায়।
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
          <div>
            প্রতিটি ধারণা একটি রঙিন ছবিতে দেখানো হয়েছে। আগে ছবি দেখো, তারপর পড়ো।
          </div>
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
            <b>মিতু বলছে:</b> "আমি অষ্টম শ্রেণিতে পড়ি। গত বর্ষায় আমি এই নিয়মগুলো শিখে
            আমার দাদির হাঁস-মুরগি উঁচু জায়গায় সরিয়েছিলাম — বন্যায় একটিও মারা যায়নি!
            চলো, তুমিও শিখে নাও।"
          </div>
        </div>
      </Box>
      <PageFooter chapter="আগাম পদক্ষেপ ও প্রভাব-ভিত্তিক পূর্বাভাস" page="২" />
    </div>
  );
}

/* Ordering / sequence chain quiz */
function SequenceQuiz() {
  const correctOrder = [
    "ঝুঁকি বুঝি",
    "পূর্বাভাস তৈরি করি",
    "সতর্কবার্তা পাঠাই",
    "পদক্ষেপ নিই",
  ];
  const [items] = useState([
    "সতর্কবার্তা পাঠাই",
    "পূর্বাভাস তৈরি করি",
    "ঝুঁকি বুঝি",
    "পদক্ষেপ নিই",
  ]);
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
        শিকল সাজাও — নিচের ৪টি ধাপ এলোমেলো আছে। ক্রম অনুযায়ী ক্লিক করো (মনে রেখো
        "জানি → বুঝি → জানাই → করি")।
      </div>
      <div
        style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}
      >
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
      <div
        style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}
      >
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
        <div
          style={{ fontWeight: 700, color: isCorrect ? "#1E7B34" : "#C62828" }}
        >
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

export function RoadmapPage() {
  const steps = [
    {
      c: "#2E86C1",
      icon: "🌟",
      title: "অধ্যায় ১ — আগাম পদক্ষেপ কেন দরকার?",
      desc: "আমরা ঠিক করি: দুর্যোগের আগেই কাজ করব। কিন্তু কাজটা শুরু করব কীসের ভিত্তিতে?",
    },
    {
      c: "#B8791F",
      icon: "🔎",
      title: "অধ্যায় ২ — আগে ঝুঁকিটা বুঝি",
      desc: "কে, কোথায়, কতটা বিপদে? এই জ্ঞানই হলো ব্যবস্থার প্রথম স্তম্ভ।",
    },
    {
      c: "#2E7D32",
      icon: "🎨",
      title: "অধ্যায় ৩ — পূর্বাভাস তৈরি করি",
      desc: "ঝুঁকির জ্ঞান + আবহাওয়া = প্রভাব-ভিত্তিক পূর্বাভাস। ব্যবস্থার দ্বিতীয় স্তম্ভ।",
    },
    {
      c: "#C62828",
      icon: "📢",
      title: "অধ্যায় ৪ — সতর্কবার্তা পৌঁছাই ও কাজ করি",
      desc: "পূর্বাভাসকে বার্তায় বদলে মানুষের কাছে পাঠাই। তৃতীয় ও চতুর্থ স্তম্ভ।",
    },
    {
      c: "#00695C",
      icon: "🙋",
      title: "অধ্যায় ৫ — তুমি তথ্য দিয়ে ব্যবস্থা উন্নত করো",
      desc: "তোমার তথ্য আবার অধ্যায় ২-এর ঝুঁকি-জ্ঞানকে আরও নিখুঁত করে — চক্রটি চলতে থাকে!",
    },
  ];
  return (
    <div>
      <SectionHeader
        icon="🗺"
        title="আমাদের যাত্রাপথ — সব একসূত্রে গাঁথা"
        color="#C62828"
      />
      <p style={{ marginBottom: 18, lineHeight: 1.7 }}>
        এই মডিউলের প্রতিটি অধ্যায় একটি শিকলের কড়ির মতো — একটি আরেকটির সাথে যুক্ত। এই
        পাঁচটি ধাপ একসাথে মিলে তৈরি করে একটি <b>আগাম সতর্কীকরণ ব্যবস্থা</b> (Early
        Warning System), যা মানুষকে দুর্যোগ থেকে বাঁচায়।
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {steps.map((s, i) => (
          <div
            key={i}
            style={{ display: "flex", alignItems: "center", gap: 14 }}
          >
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
            <Box
              bg="#fafafa"
              border="#eee"
              style={{ flex: 1, marginBottom: 0 }}
            >
              <div style={{ fontWeight: 800 }}>{s.title}</div>
              <div style={{ color: "#555" }}>{s.desc}</div>
            </Box>
          </div>
        ))}
      </div>
      <Box bg="#E1F5FE" border="#4FC3F7" style={{ marginTop: 16 }}>
        🔄 লক্ষ্য করো — শেষ ধাপ আবার শুরুর দিকে ফিরে যায়! এটি একটি চক্র। যতবার আমরা
        তথ্য দিই, ততবার পুরো ব্যবস্থা আরও ভালো হয়। এটাই "শিখি → উন্নত করি → আবার
        শিখি"।
      </Box>
      <SequenceQuiz />
      <Box bg="#FFF3E0" border="#FFB74D">
        🧠 <b>চিন্তার খোরাক:</b> যদি "সতর্কবার্তা পাঠানো" ধাপটা বাদ পড়ে যায়, তাহলে
        কী হবে? দলে আলোচনা করো।
      </Box>
      <PageFooter chapter="যাত্রাপথ" page="৪" />
    </div>
  );
}

/* ---------- Final Quiz + Glossary ---------- */
export function FinalQuiz() {
  const glossary = [
    ["আগাম পদক্ষেপ", "Anticipatory Action — দুর্যোগের আগে প্রস্তুতিমূলক কাজ"],
    [
      "আগাম সতর্কীকরণ ব্যবস্থা",
      "Early Warning System (EWS) — বিপদের আগে সতর্ক করার সম্পূর্ণ শৃঙ্খল",
    ],
    [
      "প্রভাব-ভিত্তিক পূর্বাভাস",
      'Impact-Based Forecast — "আবহাওয়া কী করবে" তা জানানো',
    ],
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
        <div style={{ fontWeight: 800, marginBottom: 10 }}>
          🏆 চূড়ান্ত কুইজ — তুমি কতটা শিখলে?
        </div>
        <MCQ
          question="আগাম পদক্ষেপ কখন নেওয়া হয়?"
          options={["দুর্যোগের আগে", "দুর্যোগের পরে"]}
          correctIndex={0}
        />
        <MCQ
          question="কোন রং সবচেয়ে বেশি বিপদ বোঝায়?"
          options={["🟢", "🟡", "🔴"]}
          correctIndex={2}
        />
        <MCQ
          question="বাংলাদেশে মহাবিপদ সংকেত কোন নম্বর?"
          options={["৪", "৭", "১০"]}
          correctIndex={2}
        />
        <MCQ
          question="সতর্কবার্তা পৌঁছানোর জন্য বাংলাদেশের স্বেচ্ছাসেবক দলের নাম কী?"
          options={["CPP", "BMD"]}
          correctIndex={0}
        />
        <MCQ
          question="দুর্যোগের সরকারি তথ্য হেল্পলাইন নম্বর কত?"
          options={["৩৩৩", "১২৩"]}
          correctIndex={0}
        />
        <Box bg="#fff" border="#ddd">
          <div>২. ঝুঁকির সূত্রটি লেখো: বিপদ × ________ × ________</div>
          <div style={{ color: "#666", fontStyle: "italic", marginTop: 4 }}>
            উত্তর: ঝুঁকিপূর্ণতা × সম্মুখীনতা
          </div>
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
                <td
                  className="font-bold py-2 pr-3 align-top text-xs sm:text-sm md:text-base whitespace-normal sm:whitespace-nowrap"
                  style={{ color: "#065f46" }}
                >
                  {term}
                </td>
                <td
                  className="py-2 text-xs sm:text-sm md:text-base text-gray-700"
                  style={{ verticalAlign: "top" }}
                >
                  {def}
                </td>
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
export function Certificate() {
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
        <div style={{ fontWeight: 700, letterSpacing: 2 }}>
          MET ক্লাব • তরুণ দূত
        </div>
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
          সফলভাবে "আগাম পদক্ষেপ, প্রভাব-ভিত্তিক পূর্বাভাস ও আগাম সতর্কীকরণ ব্যবস্থা"
          কোর্সটি সম্পন্ন করেছে এবং এখন একজন গর্বিত তরুণ আবহাওয়া-বিজ্ঞানী ও দুর্যোগ-দূত।
        </p>
        <div
          style={{
            marginTop: 26,
            display: "flex",
            justifyContent: "space-between",
            padding: "0 40px",
          }}
        >
          <div>
            <div
              style={{
                borderTop: "1px solid #fff",
                paddingTop: 6,
                minWidth: 120,
              }}
            >
              তারিখ
            </div>
          </div>
          <div>
            <div
              style={{
                borderTop: "1px solid #fff",
                paddingTop: 6,
                minWidth: 120,
              }}
            >
              ক্লাব সমন্বয়ক
            </div>
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
