import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  Target,
  Eye,
  Users,
  Award,
  MapPin,
  Heart,
  Shield,
  Sparkles,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import logo from "../../assets/images/logo_original.png";
import SiteFooter from "../../components/Shared/SiteFooter";
import whatIsVideo from "../../assets/videos/What is MET Club_.mp4";
import whatIsPoster from "../../assets/images/what_is_poster.jpg";
import startJourneyBg from "../../assets/images/start-journey-page-bg.jpeg";
import aboutBg from "../../assets/images/about-page-bg.png";
import chapterBg from "../../assets/images/chapter-bg.png";
import TopNav from "../../components/Shared/TopBar";
import { useLocaleRouteSync } from "../../hooks/useLocaleRouteSync";
import jagoNariLogo from "../../assets/partners/partner3.png";
import sksLogo from "../../assets/partners/partner4.png";
import ypsaLogo from "../../assets/partners/partner5.jpg";
import { Link } from "react-router";
import { getStoredLocale } from "../../utils/language";
import AboutHeroSlider from "./AboutHeroSlider";
import {
  Cloud,
  CountUp,
  FlipCard,
  ScrollProgress,
  Sun,
  WaveDivider,
} from "./AboutWidgets";
import { prefersReducedMotion } from "./aboutMotion";
import "./about.css";

const titleShadow =
  "-1px -1px 0 rgba(255,255,255,0.96), 1px -1px 0 rgba(255,255,255,0.96), -1px 1px 0 rgba(255,255,255,0.96), 1px 1px 0 rgba(255,255,255,0.96), 0 2px 0 rgba(185,28,28,0.20), 0 8px 20px rgba(127,29,29,0.24)";
const subtitleShadow = "0 1px 6px rgba(255,255,255,0.28)";

const SECTION_BG = {
  cream: "#fff7f5",
  peach: "#fff4ea",
  sand: "#fffaf3",
};

const sparkleOffsets = [
  ["-60px", "-50px"],
  ["60px", "-50px"],
  ["-70px", "20px"],
  ["70px", "20px"],
  ["0px", "-75px"],
  ["0px", "60px"],
];

function SectionTitle({
  emoji,
  title,
  subtitle,
  subtitleColor = "#1f2937",
}: {
  emoji: string;
  title: string;
  subtitle?: string;
  subtitleColor?: string;
}) {
  return (
    <div className="mb-12 text-center md:mb-16">
      <div
        aria-hidden="true"
        className="about-bob mx-auto mb-3 grid size-16 place-items-center rounded-full bg-white text-4xl shadow-lg ring-4 ring-amber-300"
      >
        {emoji}
      </div>
      <h2
        className="mb-3 text-4xl font-black md:text-5xl"
        style={{ color: "#9A3324", textShadow: titleShadow }}
      >
        {title}
      </h2>
      <svg
        aria-hidden="true"
        viewBox="0 0 160 14"
        className="mx-auto mb-4 h-3.5 w-40"
      >
        <path
          d="M2 7 Q 22 -2 42 7 T 82 7 T 122 7 T 158 7"
          fill="none"
          stroke="#fc4c02"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      {subtitle && (
        <p
          className="text-lg font-semibold md:text-xl"
          style={{ color: subtitleColor, textShadow: subtitleShadow }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

function FloatingClouds({ tone = "text-white" }: { tone?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${tone}`}
    >
      <Cloud className="about-sway absolute top-8 left-[4%] w-28 opacity-70 md:w-40" />
      <Cloud
        className="about-sway absolute top-1/3 right-[3%] w-24 opacity-60 md:w-32"
        style={{ animationDelay: "-4s", animationDuration: "11s" }}
      />
      <Cloud
        className="about-sway absolute bottom-16 left-[12%] w-20 opacity-50 md:w-28"
        style={{ animationDelay: "-2s", animationDuration: "13s" }}
      />
    </div>
  );
}

function PopWords({ text, startDelay = 0 }: { text: string; startDelay?: number }) {
  return (
    <>
      {text.split(" ").map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="about-word inline-block"
          style={{ animationDelay: `${startDelay + index * 120}ms` }}
        >
          {word}
          {" "}
        </span>
      ))}
    </>
  );
}

function Bullet({ index, children }: { index: string; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3 rounded-2xl bg-red-50 p-3 transition-transform duration-300 hover:translate-x-1">
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-linear-to-br from-red-500 to-amber-500 text-sm font-black text-white shadow">
        {index}
      </span>
      <span className="pt-0.5">{children}</span>
    </li>
  );
}

export default function About() {
  useLocaleRouteSync("/about", "/en/about");
  const isEnglish = getStoredLocale() === "en";
  const t = (bangla: string, english: string) => (isEnglish ? english : bangla);
  const num = (n: number) => (isEnglish ? String(n) : n.toLocaleString("bn-BD"));

  const [collected, setCollected] = useState<number[]>([]);
  const [burst, setBurst] = useState<{ index: number; key: number } | null>(null);
  const [showDuties, setShowDuties] = useState(false);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-about-reveal]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      sections.forEach((section) => section.classList.add("about-is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("about-is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -36px 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const toggleStar = (index: number) => {
    setCollected((current) => {
      if (current.includes(index)) return current.filter((i) => i !== index);
      return [...current, index];
    });
    if (!collected.includes(index)) {
      setBurst((previous) => ({ index, key: (previous?.key ?? 0) + 1 }));
    }
  };

  const objectives = [
    {
      icon: "🌡️",
      title: t(
        "আবহাওয়া পর্যবেক্ষণের জ্ঞান প্রদান",
        "Providing knowledge about weather observation",
      ),
    },
    {
      icon: "⚠️",
      title: t(
        "আগাম সতর্কীকরণ ব্যবস্থার অনিশ্চয়তা সম্পর্কে জানানো",
        "Explaining uncertainty in early warning systems",
      ),
    },
    {
      icon: "🛡️",
      title: t(
        "নিজেকে এবং অন্যকে নিরাপদ রাখতে শেখানো",
        "Teaching children to keep themselves and others safe",
      ),
    },
    {
      icon: "💡",
      title: t(
        "শিশুদের মাঝে সচেতনতা গড়ে তোলা",
        "Building awareness among children",
      ),
    },
    {
      icon: "✍️",
      title: t("হাতে কলমে প্রশিক্ষণ দেওয়া", "Providing hands-on training"),
    },
    {
      icon: "🦸",
      title: t(
        "দুর্যোগ মোকাবেলায় শিশুদের সক্রিয় ভূমিকা রাখতে অনুপ্রাণিত করা",
        "Inspiring children to take an active role in disaster response",
      ),
    },
  ];

  const activities = [
    { icon: "👥", title: t("ক্লাব সভা", "Club meetings"), ring: "ring-teal-400" },
    { icon: "🌤️", title: t("আবহাওয়া পর্যবেক্ষণ", "Weather observation"), ring: "ring-sky-400" },
    { icon: "📚", title: t("ওয়ার্কশপ ও প্রশিক্ষণ", "Workshops and training"), ring: "ring-orange-400" },
    { icon: "📢", title: t("সচেতনতা ক্যাম্পেইন", "Awareness campaigns"), ring: "ring-pink-400" },
    { icon: "📅", title: t("ইভেন্ট উদযাপন", "Event celebrations"), ring: "ring-amber-400" },
  ];

  const locations = [
    {
      name: t("চট্টগ্রাম", "Chattogram"),
      org: t("বাস্তবায়নকারী সংস্থা: ইপসা (YPSA)", "Implementing partner: YPSA"),
      logo: ypsaLogo,
      id: "chattogram",
    },
    {
      name: t("পটুয়াখালী", "Patuakhali"),
      org: t(
        "বাস্তবায়নকারী সংস্থা: জাগোনারী (JAGO NARI)",
        "Implementing partner: JAGO NARI",
      ),
      logo: jagoNariLogo,
      id: "patuakhali",
    },
    {
      name: t("গাইবান্ধা", "Gaibandha"),
      org: t(
        "বাস্তবায়নকারী সংস্থা: এসকেএস ফাউন্ডেশন (SKS Foundation)",
        "Implementing partner: SKS Foundation",
      ),
      logo: sksLogo,
      id: "gaibandha",
    },
  ];

  const values = [
    {
      icon: "👥",
      title: t("ক্লাব সভা", "Club meetings"),
      color: "from-teal-400 to-cyan-500",
    },
    {
      icon: "🌤️",
      title: t("আবহাওয়া পর্যবেক্ষণ", "Weather observation"),
      color: "from-blue-400 to-indigo-500",
    },
    {
      icon: "📚",
      title: t("ওয়ার্কশপ ও প্রশিক্ষণ", "Workshops and training"),
      color: "from-orange-400 to-red-500",
    },
    {
      icon: "📢",
      title: t("সচেতনতা ক্যাম্পেইন", "Awareness campaigns"),
      color: "from-pink-400 to-purple-500",
    },
    {
      icon: "📅",
      title: t("ইভেন্ট/দিবস উদ্যাপন", "Event and day celebrations"),
      color: "from-yellow-400 to-orange-500",
    },
  ];

  const duties = [
    t(
      "আবহাওয়া ও দুর্যোগ সংক্রান্ত কারিগরি জ্ঞান ও তথ্য দিয়ে ক্লাবকে সহায়তা প্রদান করা",
      "Supporting the club with technical knowledge and information about weather and disasters",
    ),
    t(
      "শিশু ও তরুণ সদস্যদের সহজ ও বোধগম্যভাবে আবহাওয়া বিষয়ক শিক্ষা ও প্রশিক্ষণ দেওয়ার পদ্ধতি নির্ধারণে সহায়তা করা",
      "Helping develop clear, age-appropriate ways to teach weather topics and train children and young members",
    ),
    t(
      "ক্লাবের কার্যক্রম পরিকল্পনা, বাস্তবায়ন ও মূল্যায়নে পরামর্শ প্রদান করা",
      "Advising on the planning, delivery, and evaluation of club activities",
    ),
    t(
      "ক্লাব সদস্যদের আবহাওয়া পর্যবেক্ষণ, পূর্বাভাস ব্যাখ্যা, এবং আগাম সতর্কবার্তার ব্যবহার শেখাতে নির্দেশনা ও সহায়তা প্রদান করা",
      "Guiding and supporting members in weather observation, forecast interpretation, and the use of early warnings",
    ),
    t(
      "ক্লাবের যাবতীয় উপকরণ (পাঠ্য, ভিজ্যুয়াল, পোস্টার ইত্যাদি) প্রস্তুতকরণে কারিগরি দিকনির্দেশনা প্রদান করা",
      "Providing technical guidance for preparing club materials, including lessons, visuals, and posters",
    ),
    t(
      "শিশুদের জন্য নিরাপদ ও অংশগ্রহণমূলক শেখার পরিবেশ নিশ্চিত করতে দিকনির্দেশনা দেওয়া",
      "Helping ensure a safe and participatory learning environment for children",
    ),
    t(
      "প্রয়োজনে সংশ্লিষ্ট সংস্থা বা বিশেষজ্ঞদের সঙ্গে ক্লাবের যোগাযোগ স্থাপন এবং সমন্বয় সাধন করা",
      "Connecting and coordinating the club with relevant organizations or experts when needed",
    ),
  ];

  const chiefs = [
    { icon: Award, emoji: "🧢", title: t("ক্যাপ্টেন", "Captain"), color: "from-orange-600 to-orange-500" },
    { icon: Users, emoji: "🤝", title: t("ভাইস-ক্যাপ্টেন", "Vice-Captain"), color: "from-orange-500 to-red-500" },
    { icon: Target, emoji: "💰", title: t("অর্থ-বন্ধু", "Finance Lead"), color: "from-red-500 to-orange-500" },
    { icon: Heart, emoji: "📣", title: t("বার্তা-বন্ধু", "Communications Lead"), color: "from-orange-500 to-red-400" },
  ];

  const allCollected = collected.length === objectives.length;

  const flipHint = (
    <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-bold text-red-800">
      <span className="about-bob inline-block" aria-hidden="true">
        👆
      </span>
      {t("ছুঁয়ে ঘুরিয়ে দেখো", "Tap to flip")}
    </span>
  );
  const flipBackHint = (
    <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-bold text-white">
      <RotateCcw className="size-4" aria-hidden="true" />
      {t("আবার ঘোরাও", "Flip back")}
    </span>
  );

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-red-50">
      <ScrollProgress />
      <TopNav title={t("আমাদের সম্পর্কে", "About Us")} />

      {/* Hero */}
      <AboutHeroSlider isEnglish={isEnglish}>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[15]">
          <Sun className="about-bob absolute top-6 right-[4%] w-20 drop-shadow-lg sm:w-28 md:top-10 md:w-36" />
          <div className="about-sway absolute top-[14%] left-[3%] w-28 sm:w-40">
            <Cloud className="w-full text-white/90 drop-shadow-lg" />
            {[18, 38, 58, 78].map((left, i) => (
              <span
                key={left}
                className="about-rain-drop"
                style={{ left: `${left}%`, top: "85%", animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </div>
          <Cloud
            className="about-sway absolute bottom-[22%] right-[8%] hidden w-32 text-white/70 drop-shadow md:block"
            style={{ animationDelay: "-3s", animationDuration: "12s" }}
          />
        </div>

        <div className="site-container relative z-20 px-4 text-center sm:px-6 lg:px-8">
          <span className="about-word mb-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-1.5 text-sm font-bold text-red-800 shadow-lg md:text-base">
            <Sparkles className="size-4 text-amber-500" aria-hidden="true" />
            {t("আমাদের সম্পর্কে", "About Us")}
          </span>
          <h1
            className="mb-6 text-4xl font-black md:text-6xl"
            style={{ color: "#9A3324", textShadow: titleShadow }}
          >
            <PopWords text={t("আবহাওয়া ক্লাব", "Weather Club")} startDelay={150} />
          </h1>

          <p
            className="mb-8 text-xl font-semibold md:text-3xl"
            style={{ color: "#ffffff", textShadow: subtitleShadow }}
          >
            <PopWords
              text={t('"তরুণ মন, শক্তিশালী সতর্কতা"', '"Young Minds, Stronger Warnings"')}
              startDelay={500}
            />
          </p>

          <p
            className="about-word mx-auto max-w-3xl rounded-3xl bg-black/25 px-5 py-4 text-lg leading-relaxed font-semibold backdrop-blur-sm"
            style={{ color: "#ffffff", textShadow: subtitleShadow, animationDelay: "1s" }}
          >
            {t(
              "একটি শিশু-কিশোর চালিত প্ল্যাটফর্ম যেখানে শিশুরা আবহাওয়া পর্যবেক্ষণ এবং দুর্যোগ সতর্কতার মাধ্যমে তাদের সম্প্রদায়কে নিরাপদ রাখতে শিখে",
              "A youth-led platform where children learn weather observation and disaster warnings to help keep their communities safe.",
            )}
          </p>

          <a
            href="#mission-vision"
            onClick={(event) => {
              const target = document.getElementById("mission-vision");
              if (!target) return;
              event.preventDefault();
              target.scrollIntoView({
                behavior: prefersReducedMotion() ? "auto" : "smooth",
                block: "start",
              });
              window.history.replaceState(null, "", "#mission-vision");
            }}
            className="about-word mt-8 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-red-600 to-orange-500 px-6 py-3 text-base font-bold text-white shadow-xl transition-transform hover:scale-105 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-white"
            style={{ animationDelay: "1.2s" }}
          >
            {t("চলো ঘুরে দেখি", "Let's explore")}
            <ChevronDown className="about-bob size-5" aria-hidden="true" />
          </a>
        </div>
      </AboutHeroSlider>

      {/* Vision, Mission and What is MET Club */}
      <section
        id="mission-vision"
        data-about-reveal
        className="relative z-10 scroll-mt-24 py-14 md:py-20"
        style={{ background: SECTION_BG.cream }}
      >
        <FloatingClouds tone="text-red-100" />
        <div className="site-container relative px-4 sm:px-6 lg:px-8">
          <div className="mb-20 grid gap-8 md:grid-cols-2" data-about-stagger>
            {[
              {
                icon: Eye,
                title: t("ভিশন", "Vision"),
                body: t(
                  "একটি নিরাপদ ও সচেতন সমাজ গড়ে তুলতে শিশুদের আবহাওয়া পর্যবেক্ষণ, পূর্বাভাস এবং আগাম সতর্কতার শিক্ষা প্রদান করা।",
                  "To educate children about weather observation, forecasting, and early warnings so they can help build a safer, more aware society.",
                ),
                tagIcon: Sparkles,
                tag: t("একটি নিরাপদ ভবিষ্যৎ", "A Safer Future"),
                iconBg: "from-red-400 to-orange-500",
                back: "from-red-600 to-orange-500",
              },
              {
                icon: Target,
                title: t("মিশন", "Mission"),
                body: t(
                  "একটি প্ল্যাটফর্ম যেখানে শিশুরা দুর্যোগের পূর্বাভাস এবং আগাম সতর্কতা সম্পর্কে জেনে নিজের পরিবার, জীবন এবং সম্পদ রক্ষা করতে পারবে।",
                  "To create a platform where children learn about disaster forecasts and early warnings so they can protect their families, lives, and property.",
                ),
                tagIcon: Heart,
                tag: t("সম্প্রদায় সুরক্ষা", "Community Protection"),
                iconBg: "from-red-500 to-red-700",
                back: "from-orange-500 to-amber-500",
              },
            ].map((card) => (
              <FlipCard
                key={card.title}
                className="about-hover-wiggle"
                front={
                  <span className="flex h-full flex-col items-center justify-center rounded-[2rem] border-4 border-dashed border-red-200 bg-white p-10 text-center shadow-xl transition-shadow group-hover:shadow-2xl">
                    <span
                      className={`about-wiggle-target mb-5 grid size-24 place-items-center rounded-full bg-linear-to-br ${card.iconBg} shadow-lg`}
                    >
                      <card.icon className="size-12 text-white" aria-hidden="true" />
                    </span>
                    <span
                      className="block text-4xl font-black md:text-5xl"
                      style={{ color: "#9A3324", textShadow: titleShadow }}
                    >
                      {card.title}
                    </span>
                    <span className="mt-3 flex items-center gap-2 font-bold text-red-700">
                      <card.tagIcon className="size-5" aria-hidden="true" />
                      {card.tag}
                    </span>
                    {flipHint}
                  </span>
                }
                back={
                  <span
                    className={`flex h-full flex-col items-center justify-center rounded-[2rem] bg-linear-to-br ${card.back} p-10 text-center text-white shadow-xl`}
                  >
                    <span className="mb-3 block text-2xl font-black">{card.title}</span>
                    <span className="block text-lg leading-relaxed font-semibold md:text-xl">
                      {card.body}
                    </span>
                    {flipBackHint}
                  </span>
                }
              />
            ))}
          </div>

          <SectionTitle emoji="🌦️" title={t("মেট ক্লাব কী?", "What is Met Club?")} />
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="text-center md:text-left">
              <p className="mb-6 text-xl leading-relaxed font-semibold text-gray-800">
                {t(
                  "মেট ক্লাব একটি শিশুনেতৃত্বাধীন আবহাওয়া ও জলবায়ু ক্লাব, যা শিশু-কিশোরদের আবহাওয়া পর্যবেক্ষণ, পূর্বাভাস এবং আগাম সতর্কতা ব্যবস্থা সম্পর্কে জ্ঞান ও দক্ষতা অর্জনে সক্ষম করে।",
                  "MET Club is a child-led weather and climate club that equips children and youth with knowledge and skills in weather observation, forecasting, and early warning systems.",
                )}
              </p>
              <ul className="space-y-4">
                {[
                  ["📚", t("আবহাওয়া শিক্ষা ও প্রশিক্ষণ", "Weather education and training"), "bg-teal-50 border-teal-300"],
                  ["⚠️", t("আগাম সতর্কীকরণ ব্যবস্থা", "Early warning systems"), "bg-amber-50 border-amber-300"],
                  ["🦸", t("দুর্যোগ প্রস্তুতি", "Disaster preparedness"), "bg-red-100 border-red-200"],
                ].map(([icon, label, tone]) => (
                  <li
                    key={label}
                    className={`about-hover-wiggle flex items-center gap-4 rounded-2xl border-2 p-4 transition-transform duration-300 hover:scale-[1.03] ${tone}`}
                  >
                    <span
                      aria-hidden="true"
                      className="about-wiggle-target grid size-12 shrink-0 place-items-center rounded-xl bg-white text-3xl shadow"
                    >
                      {icon}
                    </span>
                    <span className="text-lg font-bold text-red-900">{label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Video in a cartoon TV */}
            <div className="flex w-full justify-center pt-10">
              <div className="relative w-full max-w-lg">
                <div aria-hidden="true" className="absolute -top-10 left-1/2 flex -translate-x-1/2 gap-10">
                  <span className="block h-12 w-1.5 origin-bottom -rotate-[25deg] rounded-full bg-red-800">
                    <span className="absolute -top-2 -left-1.5 size-4 rounded-full bg-amber-400" />
                  </span>
                  <span className="block h-12 w-1.5 origin-bottom rotate-[25deg] rounded-full bg-red-800">
                    <span className="absolute -top-2 -left-1.5 size-4 rounded-full bg-amber-400" />
                  </span>
                </div>
                <div className="relative z-10 rounded-[2rem] bg-linear-to-br from-red-600 to-orange-500 p-3 shadow-2xl transition-transform duration-300 hover:rotate-1 hover:scale-[1.02] sm:p-4">
                  <div className="relative overflow-hidden rounded-2xl bg-black">
                    <video
                      controls
                      controlsList="nodownload"
                      preload="metadata"
                      poster={whatIsPoster}
                      className="aspect-video w-full object-cover"
                    >
                      <source src={whatIsVideo} type="video/mp4" />
                      {t(
                        "আপনার ব্রাউজার ভিডিও সমর্থন করে না।",
                        "Your browser does not support the video tag.",
                      )}
                    </video>
                    <div className="pointer-events-none absolute top-3 right-3 z-10 animate-pulse rounded-full bg-red-600/90 px-3 py-1 text-xs font-bold text-white shadow-md">
                      {t("ভিডিও 🎥", "Video 🎥")}
                    </div>
                  </div>
                  <div aria-hidden="true" className="mt-2 flex items-center justify-end gap-2 px-2">
                    <span className="size-3 rounded-full bg-amber-300" />
                    <span className="size-3 rounded-full bg-white/80" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives: tap to collect stars */}
      <section
        id="objectives"
        data-about-reveal
        className="relative z-10 bg-cover bg-center pt-14 pb-24 md:pt-20 md:pb-28"
        style={{ backgroundImage: `url(${startJourneyBg})` }}
      >
        <div className="pointer-events-none absolute inset-0 bg-white/50 backdrop-blur-[1px]" />
        <WaveDivider color={SECTION_BG.cream} flip />
        <div className="site-container relative z-10 px-4 pt-6 sm:px-6 lg:px-8">
          <SectionTitle
            emoji="🎯"
            title={t("আমাদের উদ্দেশ্য", "Our Objectives")}
            subtitle={t(
              "শিশুদের জীবন রক্ষাকারী দক্ষতা প্রদান এবং দুর্যোগ প্রস্তুতিতে তাদের ক্ষমতায়ন",
              "Equipping children with life-saving skills and empowering them to prepare for disasters.",
            )}
          />

          <div className="-mt-6 mb-10 flex flex-col items-center gap-2">
            <p
              className="flex items-center gap-2 rounded-full bg-white px-5 py-2 text-base font-bold text-red-800 shadow-lg"
              aria-live="polite"
            >
              <span aria-hidden="true">⭐</span>
              {allCollected
                ? t("দারুণ! তুমি সব তারা পেয়েছ! 🎉", "Awesome! You found all the stars! 🎉")
                : t(
                    `কার্ড ছুঁয়ে তারা সংগ্রহ করো: ${num(collected.length)}/${num(objectives.length)}`,
                    `Tap the cards to collect stars: ${collected.length}/${objectives.length}`,
                  )}
            </p>
            <div className="h-3 w-56 overflow-hidden rounded-full bg-white/80 shadow-inner">
              <div
                className="h-full rounded-full bg-linear-to-r from-amber-400 to-orange-500 transition-[width] duration-500"
                style={{ width: `${(collected.length / objectives.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3" data-about-stagger>
            {objectives.map((objective, index) => {
              const isCollected = collected.includes(index);
              return (
                <button
                  key={objective.title}
                  type="button"
                  aria-pressed={isCollected}
                  onClick={() => toggleStar(index)}
                  className={`about-sticker about-hover-wiggle relative rounded-3xl border-4 p-8 text-center shadow-lg focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-amber-500 ${isCollected ? "border-amber-400 bg-amber-50" : "border-white bg-white/85"}`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute -top-4 -right-3 grid size-11 place-items-center rounded-full text-2xl shadow-md transition-transform duration-500 ${isCollected ? "rotate-[360deg] bg-amber-300" : "bg-white grayscale"}`}
                  >
                    {isCollected ? "⭐" : "☆"}
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute top-3 left-4 text-sm font-black text-red-300"
                  >
                    {num(index + 1)}
                  </span>
                  <span
                    aria-hidden="true"
                    className="about-wiggle-target mx-auto mb-5 grid size-20 place-items-center rounded-2xl bg-linear-to-br from-red-400 to-orange-500 text-4xl shadow-lg"
                  >
                    {objective.icon}
                  </span>
                  <span className="block text-lg leading-relaxed font-bold text-red-900">
                    {objective.title}
                  </span>
                  {burst?.index === index && (
                    <span key={burst.key} aria-hidden="true">
                      {sparkleOffsets.map(([dx, dy], i) => (
                        <span
                          key={i}
                          className="about-star-burst"
                          style={{ "--dx": dx, "--dy": dy } as CSSProperties}
                        >
                          {i % 2 ? "✨" : "⭐"}
                        </span>
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <WaveDivider color={SECTION_BG.peach} />
      </section>

      {/* Structure */}
      <section
        id="structure"
        data-about-reveal
        className="relative z-10 py-14 md:py-20"
        style={{ background: SECTION_BG.peach }}
      >
        <FloatingClouds tone="text-orange-100" />
        <div className="site-container relative px-4 sm:px-6 lg:px-8">
          <SectionTitle
            emoji="🏫"
            title={t("সংগঠন কাঠামো", "Organizational Structure")}
            subtitle={t(
              "যুব নেতৃত্ব এবং সহযোগিতার মাধ্যমে শক্তিশালী",
              "Strengthened through youth leadership and collaboration",
            )}
          />

          <div className="flex flex-col items-center">
            {/* Technical Advisor */}
            <div className="w-full max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-xl">
              <div className="about-hover-wiggle bg-linear-to-r from-red-700 to-red-600 p-8 text-center text-white">
                <span className="about-wiggle-target mx-auto mb-3 grid size-20 place-items-center rounded-full bg-white/20">
                  <Users className="size-11" aria-hidden="true" />
                </span>
                <h3 className="mb-2 text-3xl font-bold">
                  {t("কারিগরি উপদেষ্টা", "Technical Advisor")}
                </h3>
                <p className="text-sm font-semibold opacity-90">
                  {t(
                    "পেশাদার নির্দেশনা এবং কারিগরি সহায়তা প্রদান",
                    "Providing professional guidance and technical support",
                  )}
                </p>
                <button
                  type="button"
                  aria-expanded={showDuties}
                  aria-controls="advisor-duties"
                  onClick={() => setShowDuties((open) => !open)}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 font-bold text-red-700 shadow-lg transition-transform hover:scale-105 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                >
                  {t("দায়িত্বসমূহ:", "Responsibilities:").replace(/:$/, "")}
                  <ChevronDown
                    className={`size-5 transition-transform duration-300 ${showDuties ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
              </div>
              <div id="advisor-duties" className={`about-expand ${showDuties ? "is-open" : ""}`}>
                <div>
                  <ul className="space-y-3 p-6 font-semibold text-gray-800 md:p-8">
                    {duties.map((duty, index) => (
                      <Bullet key={duty} index={num(index + 1)}>
                        {duty}
                      </Bullet>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="about-trail my-4" aria-hidden="true" />

            {/* Chief Executives */}
            <h4
              className="mb-6 text-2xl font-bold"
              style={{ color: "#9A3324", textShadow: titleShadow }}
            >
              {t("প্রধান নির্বাহী (৪ জন)", "Chief Executives (4)")}
            </h4>
            <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {chiefs.map((chief) => (
                <div
                  key={chief.title}
                  className={`about-hover-wiggle group relative rounded-3xl bg-linear-to-br ${chief.color} p-6 pt-10 text-center text-white shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:rotate-1`}
                >
                  <span
                    aria-hidden="true"
                    className="about-wiggle-target absolute -top-6 left-1/2 grid size-12 -translate-x-1/2 place-items-center rounded-full bg-white text-2xl shadow-lg ring-4 ring-amber-300"
                  >
                    {chief.emoji}
                  </span>
                  <chief.icon className="mx-auto mb-3 size-10" aria-hidden="true" />
                  <h3 className="text-xl font-bold">{chief.title}</h3>
                </div>
              ))}
            </div>

            <div className="about-trail my-4" aria-hidden="true" />

            {/* Executive & General Members */}
            <div className="grid w-full gap-6 md:grid-cols-2">
              <div className="about-hover-wiggle rounded-3xl bg-linear-to-br from-orange-500 to-red-500 p-6 text-center text-white shadow-lg transition-transform duration-300 hover:scale-105">
                <Users className="about-wiggle-target mx-auto mb-3 size-10" aria-hidden="true" />
                <h3 className="text-xl font-bold">
                  {t("কার্যনির্বাহী সদস্য", "Executive Members")}
                </h3>
                <p className="mt-2 text-4xl font-black text-white">
                  <CountUp to={7} isEnglish={isEnglish} suffix={t(" জন", " people")} />
                </p>
              </div>
              <div className="about-hover-wiggle rounded-3xl bg-linear-to-r from-red-600 to-red-700 p-6 text-center text-white shadow-lg transition-transform duration-300 hover:scale-105">
                <Heart className="about-wiggle-target mx-auto mb-3 size-12" aria-hidden="true" />
                <h3 className="text-2xl font-bold">
                  {t("সাধারণ সদস্য", "General Members")}
                </h3>
                <p className="mt-2 text-sm font-semibold opacity-90">
                  {t("৭ম-৯ম শ্রেণির সকল শিক্ষার্থী", "All students in grades 7–9")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activities: floating bubbles */}
      <section
        id="activities"
        data-about-reveal
        className="relative z-10 bg-cover bg-center pt-14 pb-24 md:pt-20 md:pb-28"
        style={{ backgroundImage: `url(${aboutBg})` }}
      >
        <WaveDivider color={SECTION_BG.peach} flip />
        <div className="site-container relative z-10 px-4 pt-6 sm:px-6 lg:px-8">
          <SectionTitle
            emoji="🎨"
            title={t("আমাদের কার্যক্রম", "Our Activities")}
            subtitle={t(
              "হাতে-কলমে শিক্ষা এবং সম্প্রদায় সম্পৃক্ততা",
              "Hands-on learning and community engagement",
            )}
            subtitleColor="#ffffff"
          />
          <div
            className="grid grid-cols-2 justify-items-center gap-6 sm:grid-cols-3 lg:grid-cols-5"
            data-about-stagger
          >
            {activities.map((activity) => (
              <div
                key={activity.title}
                className={`about-bubble about-hover-wiggle flex aspect-square w-full max-w-44 flex-col items-center justify-center rounded-full bg-white/90 p-4 text-center shadow-xl ring-8 ${activity.ring} transition-shadow hover:shadow-2xl`}
              >
                <span aria-hidden="true" className="about-wiggle-target mb-2 text-5xl">
                  {activity.icon}
                </span>
                <h3 className="text-base leading-snug font-bold text-red-900">
                  {activity.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
        <WaveDivider color={SECTION_BG.cream} />
      </section>

      {/* Impact */}
      <section
        id="impact"
        data-about-reveal
        className="relative z-10 py-14 md:py-20"
        style={{ background: SECTION_BG.cream }}
      >
        <FloatingClouds tone="text-red-100" />
        <div className="site-container relative px-4 text-center sm:px-6 lg:px-8">
          <div className="relative mx-auto mb-8 grid size-64 place-items-center">
            <div
              aria-hidden="true"
              className="about-spin absolute inset-0 rounded-full border-4 border-dashed border-orange-300"
              style={{ animationDuration: "30s" }}
            >
              {[
                ["☀️", "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"],
                ["🌧️", "top-1/2 right-0 translate-x-1/2 -translate-y-1/2"],
                ["⛈️", "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"],
                ["🌈", "top-1/2 left-0 -translate-x-1/2 -translate-y-1/2"],
              ].map(([emoji, position]) => (
                <span key={emoji} className={`absolute text-3xl ${position}`}>
                  <span
                    className="about-spin inline-block"
                    style={{ animationDuration: "30s", animationDirection: "reverse" }}
                  >
                    {emoji}
                  </span>
                </span>
              ))}
            </div>
            <img src={logo} alt="MET CLUB LOGO" className="about-bob size-40" />
          </div>
          <h2
            className="mb-6 text-4xl font-black md:text-5xl"
            style={{ color: "#9A3324", textShadow: titleShadow }}
          >
            {t("তরুন চিন্তা, শক্তিশালী সতর্কতা", "Young Minds, Stronger Warnings")}
          </h2>
          <p className="mb-8 text-xl font-bold text-red-800 md:text-2xl">
            {t(
              "আবহাওয়ার পূর্বাভাস বুঝে গড়ি আমাদের নিরাপদের পথ",
              "We build a safer path by understanding weather forecasts.",
            )}
          </p>
          <div className="relative mx-auto max-w-4xl rounded-[2rem] border-4 border-dashed border-amber-300 bg-white p-8 text-lg leading-relaxed font-semibold text-gray-800 shadow-lg">
            <span
              aria-hidden="true"
              className="absolute -top-6 left-8 grid size-12 place-items-center rounded-full bg-amber-300 text-2xl shadow"
            >
              💬
            </span>
            {t(
              "আমরা বিশ্বাস করি যে শিশুরা পরিবর্তনের শক্তিশালী এজেন্ট। মেট ক্লাবের মাধ্যমে, আমরা তাদের জ্ঞান, দক্ষতা এবং আত্মবিশ্বাস দিয়ে সজ্জিত করি যাতে তারা তাদের পরিবার এবং সম্প্রদায়কে আবহাওয়াজনিত দুর্যোগ থেকে রক্ষা করতে পারে।",
              "We believe children are powerful agents of change. Through Met Club, we equip them with the knowledge, skills, and confidence to protect their families and communities from weather-related disasters.",
            )}
          </div>
        </div>
      </section>

      {/* Locations */}
      <section
        id="locations"
        data-about-reveal
        className="relative z-10 bg-cover bg-center pt-14 pb-24 md:pt-20 md:pb-28"
        style={{ backgroundImage: `url(${chapterBg})` }}
      >
        <WaveDivider color={SECTION_BG.cream} flip />
        <div className="site-container relative z-10 px-4 pt-6 sm:px-6 lg:px-8">
          <SectionTitle
            emoji="🗺️"
            title={t("কার্যক্রমের এলাকা", "Activity Areas")}
            subtitle={t("বাংলাদেশ জুড়ে সম্প্রসারণ", "Expanding across Bangladesh")}
          />

          <div className="grid gap-10 md:grid-cols-3" data-about-stagger>
            {locations.map((loc) => (
              <Link
                to={isEnglish ? `/en/location/${loc.id}` : `/location/${loc.id}`}
                key={loc.id}
                className="about-hover-wiggle group relative block rounded-[2rem] bg-white/90 p-8 pt-14 text-center shadow-xl transition-transform duration-300 hover:-translate-y-2 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-amber-500"
              >
                <span className="absolute -top-7 left-1/2 -translate-x-1/2">
                  <span className="about-pin block">
                    <span className="about-pulse-ring relative grid size-14 place-items-center rounded-full bg-red-600 text-red-400 shadow-lg">
                      <MapPin className="relative size-7 text-white" aria-hidden="true" />
                    </span>
                  </span>
                </span>
                <h3
                  className="mb-3 text-3xl font-black"
                  style={{ color: "#9A3324", textShadow: titleShadow }}
                >
                  {loc.name}
                </h3>
                <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-base font-bold text-green-800">
                  <span className="relative flex size-2.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-500 opacity-75 motion-reduce:animate-none" />
                    <span className="relative inline-flex size-2.5 rounded-full bg-green-600" />
                  </span>
                  {t("বর্তমানে সক্রিয়", "Currently active")}
                </p>
                <p className="mb-3 text-sm font-semibold" style={{ color: "#9A3324" }}>
                  {loc.org}
                </p>
                <div className="mt-4 mb-2 flex h-16 items-center justify-center">
                  <img
                    src={loc.logo}
                    alt={loc.name}
                    className="h-full w-auto max-w-[140px] rounded-md object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-red-600 to-orange-500 px-4 py-2 text-white shadow">
                  <Users className="size-5" aria-hidden="true" />
                  <span className="text-lg font-black">
                    <CountUp to={50} isEnglish={isEnglish} suffix={t("+ সদস্য", "+ members")} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <WaveDivider color={SECTION_BG.sand} />
      </section>

      {/* Values and Child Protection */}
      <section
        id="values"
        data-about-reveal
        className="relative z-10 py-14 md:py-20"
        style={{ background: SECTION_BG.sand }}
      >
        <FloatingClouds tone="text-orange-100" />
        <div className="site-container relative px-4 sm:px-6 lg:px-8">
          <SectionTitle
            emoji="💖"
            title={t("আমাদের মূল্যবোধ", "Our Values")}
            subtitle={t(
              "শিশু সুরক্ষা এবং অন্তর্ভুক্তিতে প্রতিশ্রুতিবদ্ধ",
              "Committed to child protection and inclusion",
            )}
          />

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5" data-about-stagger>
            {values.map((value) => (
              <div
                key={value.title}
                className="about-sticker about-hover-wiggle rounded-3xl border-4 border-white bg-white p-6 shadow-lg hover:shadow-2xl"
              >
                <div
                  aria-hidden="true"
                  className={`about-wiggle-target mx-auto mb-4 grid size-20 place-items-center rounded-full bg-linear-to-br ${value.color} text-4xl shadow-lg`}
                >
                  {value.icon}
                </div>
                <h3 className="text-center text-lg font-bold text-red-900">{value.title}</h3>
              </div>
            ))}
          </div>

          <div className="relative mx-auto mt-20 max-w-4xl rounded-[2rem] bg-linear-to-br from-red-600 to-orange-500 p-1.5 shadow-2xl">
            <div className="rounded-[1.75rem] bg-white px-6 pt-14 pb-10 text-center md:px-12">
              <span className="about-heartbeat absolute -top-10 left-1/2 -ml-10 grid size-20 place-items-center rounded-full bg-linear-to-br from-red-500 to-red-700 shadow-xl ring-8 ring-white">
                <Shield className="size-10 text-white" aria-hidden="true" />
              </span>
              <h3
                className="mb-6 text-3xl font-black md:text-4xl"
                style={{ color: "#9A3324", textShadow: titleShadow }}
              >
                {t("শিশু সুরক্ষা নীতি", "Child Protection Policy")}
              </h3>
              <p className="text-lg leading-relaxed font-semibold text-gray-800">
                {t(
                  "মেট ক্লাব সকল শিশুর সুরক্ষা এবং কল্যাণে প্রতিশ্রুতিবদ্ধ। আমরা একটি নিরাপদ, সহায়ক এবং অন্তর্ভুক্তিমূলক পরিবেশ নিশ্চিত করি যেখানে প্রতিটি শিশু শিখতে এবং বৃদ্ধি পেতে পারে। আমাদের কঠোর সুরক্ষা নীতি এবং প্রক্রিয়া রয়েছে যা আন্তর্জাতিক মান অনুসরণ করে।",
                  "Met Club is committed to the safety and well-being of every child. We provide a safe, supportive, and inclusive environment where all children can learn and grow, guided by safeguarding policies aligned with international standards.",
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter isEnglish={isEnglish} />
    </div>
  );
}
