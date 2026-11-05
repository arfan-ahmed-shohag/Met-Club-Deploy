import { use, useState } from "react";

import bgImage from "../../../assets/images/start-journey-page-bg.jpeg";
import { Link } from "react-router";
import TopNav from "../../../components/Shared/TopBar";
import { useLocaleRouteSync } from "../../../hooks/useLocaleRouteSync";
import { getLocalizedPath, getStoredLocale } from "../../../utils/language";

export interface ChapterTopic {
  id: number;
  title: string;
  image: string;
  borderColor: string;
  glowColor: string;
  row: number;
}

const fetchChapters = async () => {
  const response = await fetch('/chapter.en.json');
  return response.json() as Promise<ChapterTopic[]>;
};

const chaptersPromise = fetchChapters();
const CHAPTERS_PER_LARGE_ROW = 5;

const redCardAccent = {
  border: "#fca5a5",
  glow: "rgba(252,165,165,0.26)",
};


function TopicCard({ topic, index }: { topic: ChapterTopic; index: number }) {
  const [hovered, setHovered] = useState(false);
  const locale = getStoredLocale();
  return (
    <Link to={getLocalizedPath(`/lesson/${topic.id}`, locale)} className="block w-45">
      <div
        className="relative flex flex-col items-center justify-between rounded-2xl w-45 min-h-45 md:min-h-47.5 bg-[linear-gradient(145deg,rgba(255,255,255,0.86),rgba(255,245,242,0.74))] backdrop-blur-md p-4 cursor-pointer transition-all duration-300"
        style={{
          border: `2.5px solid ${redCardAccent.border}`,
          boxShadow: hovered
            ? `0 8px 32px ${redCardAccent.glow}, 0 2px 8px rgba(0,0,0,0.10)`
            : `0 2px 12px rgba(0,0,0,0.08)`,
          transform: hovered ? "translateY(-6px)" : "translateY(0)",
          animationDelay: `${index * 0.08}s`,
          animation: "cardFade 0.5s ease both",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Title */}
        <p
          className="text-center font-bold text-red-900 leading-snug mb-3 line-clamp-2"
          style={{
            fontSize: "0.80rem",
          }}
        >
          {topic.title}
        </p>

        {/* Illustration emoji */}
        <div className="flex-1 flex items-center justify-center">
          <img src={topic.image} alt={topic.title} className="w-24 h-24 object-contain" />
        </div>
      </div>
    </Link>
  );
}


export default function Chapter() {

  useLocaleRouteSync("/learning-zone", "/en/learning-zone");

  const chapters = use(chaptersPromise);
  const chapterRows = chapters.reduce<ChapterTopic[][]>((rows, topic, index) => {
    const rowIndex = Math.floor(index / CHAPTERS_PER_LARGE_ROW);
    if (!rows[rowIndex]) {
      rows[rowIndex] = [];
    }
    rows[rowIndex].push(topic);
    return rows;
  }, []);

  return (
    <>
      <div
        className="relative min-h-screen flex flex-col items-stretch justify-start sm:justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="relative z-20 w-full self-stretch">
          <TopNav title="Learning Zone" brandName="Met Club" />
        </div>

        {/* Soft overlay so cards are readable over the bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,245,243,0.50) 0%, rgba(255,231,226,0.24) 60%, rgba(255,217,211,0.10) 100%)",
          }}
        />

        <div className="relative z-10 flex flex-1 flex-col items-center justify-start py-6 sm:justify-center sm:py-10">
          {/* Chapters Grid */}
          <div className="site-container px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 lg:hidden items-stretch">
              {chapters.map((topic: ChapterTopic, index: number) => (
                <TopicCard key={topic.id} topic={topic} index={index} />
              ))}
            </div>

            <div className="hidden lg:flex lg:flex-col lg:gap-8">
              {chapterRows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className={`flex items-stretch gap-8 ${row.length === CHAPTERS_PER_LARGE_ROW ? "justify-between" : "justify-center"}`}
                >
                  {row.map((topic, colIndex) => (
                    <TopicCard
                      key={topic.id}
                      topic={topic}
                      index={rowIndex * CHAPTERS_PER_LARGE_ROW + colIndex}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cardFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}
