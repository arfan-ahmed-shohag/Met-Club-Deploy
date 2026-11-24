import { useEffect, useState } from "react";
import { ArrowRight, Newspaper } from "lucide-react";
import { Link } from "react-router";
import axiosPublic from "../../../hooks/axiosPublic";
import { resolveMediaUrl } from "../../../utils/media";

type NewsItem = {
  id: string;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  pdfUrl: string;
  pdfUrlEn?: string | null;
  featuredImageUrl?: string | null;
  createdAt: string;
};

export default function LatestNewsSection({
  isEnglish,
}: {
  isEnglish: boolean;
}) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    let active = true;
    axiosPublic()
      .get<{ data?: NewsItem[] }>("/pdf-resources", {
        params: { category: "pressRelease", page: 1, limit: 3 },
      })
      .then(({ data }) => {
        if (!active) return;
        setItems(Array.isArray(data?.data) ? data.data.slice(0, 3) : []);
        setStatus("ready");
      })
      .catch(() => {
        if (active) setStatus("error");
      });
    return () => {
      active = false;
    };
  }, []);

  // Nothing to show: keep the Home page clean instead of an empty block.
  if (status !== "loading" && items.length === 0) return null;

  const dateFormat = new Intl.DateTimeFormat(isEnglish ? "en-GB" : "bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section
      className="bg-white py-[60px] lg:py-[80px]"
      aria-labelledby="home-news-title"
    >
      <div className="site-container px-4 sm:px-6 lg:px-8">
        <header className="mb-10 flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[.16em] text-red-600">
              {isEnglish ? "LATEST UPDATES" : "সর্বশেষ খবর"}
            </p>
            <h2
              id="home-news-title"
              className="text-[32px] font-black leading-tight text-red-950 sm:text-[36px]"
            >
              {isEnglish ? "News" : "সংবাদ"}
            </h2>
          </div>
          <Link
            to={isEnglish ? "/en/press-releases" : "/press-releases"}
            className="inline-flex items-center gap-2 font-bold text-red-700 hover:text-red-800"
          >
            {isEnglish ? "All news" : "সব সংবাদ"}
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </header>

        {status === "loading" ? (
          <div
            role="status"
            aria-busy="true"
            aria-label={isEnglish ? "Loading news" : "সংবাদ লোড হচ্ছে"}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white motion-safe:animate-pulse"
              >
                <div className="aspect-[16/9] bg-slate-200" />
                <div className="p-6">
                  <div className="h-4 w-1/3 rounded bg-slate-100" />
                  <div className="mt-4 h-5 w-3/4 rounded bg-slate-200" />
                  <div className="mt-3 h-4 w-full rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const title = isEnglish ? item.titleEn : item.titleBn;
              const date = new Date(item.createdAt);
              return (
                <li key={item.id}>
                  <a
                    href={resolveMediaUrl(
                      isEnglish && item.pdfUrlEn ? item.pdfUrlEn : item.pdfUrl,
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-red-100 bg-white shadow-[0_8px_24px_rgba(64,48,45,.08)] transition hover:-translate-y-1 hover:border-red-200 hover:shadow-[0_14px_32px_rgba(64,48,45,.14)]"
                  >
                    {item.featuredImageUrl ? (
                      <img
                        src={resolveMediaUrl(item.featuredImageUrl)}
                        alt={title}
                        loading="lazy"
                        className="aspect-[16/9] w-full bg-red-50 object-cover"
                      />
                    ) : (
                      <div className="grid aspect-[16/9] w-full place-items-center bg-gradient-to-br from-red-100 via-orange-50 to-slate-100 text-red-700">
                        <Newspaper size={40} aria-hidden="true" />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      {!Number.isNaN(date.getTime()) && (
                        <time
                          dateTime={item.createdAt}
                          className="text-xs font-bold uppercase tracking-wide text-slate-500"
                        >
                          {dateFormat.format(date)}
                        </time>
                      )}
                      <h3 className="mt-2 text-lg font-bold leading-snug text-slate-900 group-hover:text-red-800">
                        {title}
                      </h3>
                      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-slate-600">
                        {isEnglish ? item.descriptionEn : item.descriptionBn}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-red-700">
                        {isEnglish ? "Read more" : "বিস্তারিত পড়ুন"}
                        <span aria-hidden="true">↗</span>
                      </span>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
