import { useEffect, useState } from "react";
import type { JSX } from "react";
import axiosPublic from "../../hooks/axiosPublic";
import { useLocaleRouteSync } from "../../hooks/useLocaleRouteSync";
import { getStoredLocale } from "../../utils/language";
import { resolveMediaUrl } from "../../utils/media";
import TopNav from "../../components/Shared/TopBar";
import SiteFooter from "../../components/Shared/SiteFooter";

const PAGE_SIZE = 9;
type Story = {
  id: string;
  quoteBn: string;
  quoteEn: string;
  authorNameBn: string;
  authorNameEn: string;
  authorDetailBn: string;
  authorDetailEn: string;
  imageUrl: string;
};
type StoryResponse = { data?: Story[]; meta?: { total?: number } };

export default function StoriesPage(): JSX.Element {
  useLocaleRouteSync("/stories", "/en/stories");
  const isEnglish = getStoredLocale() === "en";
  const [stories, setStories] = useState<Story[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStories([]);
    setPage(1);
    setTotal(0);
    setIsLoading(true);
    setHasError(false);
    void axiosPublic()
      .get<StoryResponse>("/stories", { params: { page: 1, limit: PAGE_SIZE } })
      .then(({ data }) => {
        if (cancelled) return;
        setStories(Array.isArray(data?.data) ? data.data : []);
        setTotal(Number(data?.meta?.total) || 0);
      })
      .catch(() => {
        if (!cancelled) setHasError(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [retry]);

  const loadMore = async () => {
    if (isLoadingMore || isLoading || stories.length >= total) return;
    setIsLoadingMore(true);
    setHasError(false);
    try {
      const nextPage = page + 1;
      const { data } = await axiosPublic().get<StoryResponse>("/stories", {
        params: { page: nextPage, limit: PAGE_SIZE },
      });
      setStories((current) => [
        ...current,
        ...(Array.isArray(data?.data) ? data.data : []),
      ]);
      setPage(nextPage);
      setTotal(Number(data?.meta?.total) || 0);
    } catch {
      setHasError(true);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const hasMore = stories.length < total;
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <TopNav
        title={isEnglish ? "Stories" : "গল্প"}
        brandName={isEnglish ? "Met Club" : "মেট ক্লাব"}
      />
      <main className="site-container w-full flex-1 py-[60px] lg:py-[80px]">
        <header className="mb-10 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-[.16em] text-red-600">
            {isEnglish ? "OUR COMMUNITY" : "আমাদের কমিউনিটি"}
          </p>
          <h1 className="text-3xl font-black text-red-950 sm:text-4xl">
            {isEnglish ? "Stories from our community" : "আমাদের কমিউনিটির গল্প"}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {isEnglish
              ? "Learners and community members share how they learn, prepare, and help one another."
              : "শিক্ষার্থী ও কমিউনিটির সদস্যরা শেখা, প্রস্তুতি এবং একে অপরকে সাহায্য করার অভিজ্ঞতা ভাগ করে নেন।"}
          </p>
        </header>

        {isLoading ? (
          <div
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            aria-busy="true"
            role="status"
          >
            <span className="sr-only">
              {isEnglish ? "Loading stories" : "গল্প লোড হচ্ছে"}
            </span>
            {Array.from({ length: PAGE_SIZE }, (_, index) => (
              <div
                key={index}
                aria-hidden="true"
                className="flex min-h-[390px] animate-pulse flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
              >
                <div className="h-52 bg-slate-200" />
                <div className="flex-1 space-y-3 p-5">
                  <div className="h-4 w-10 rounded bg-red-100" />
                  <div className="h-4 w-full rounded bg-slate-200" />
                  <div className="h-4 w-5/6 rounded bg-slate-100" />
                  <div className="h-4 w-2/3 rounded bg-slate-100" />
                  <div className="mt-5 h-4 w-1/2 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : hasError && stories.length === 0 ? (
          <p
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-800"
          >
            {isEnglish ? "Stories could not be loaded." : "গল্প লোড করা যায়নি।"}
            <button
              type="button"
              onClick={() => setRetry((value) => value + 1)}
              className="ml-2 cursor-pointer font-bold underline"
            >
              {isEnglish ? "Retry" : "আবার চেষ্টা করুন"}
            </button>
          </p>
        ) : stories.length === 0 ? (
          <p className="py-16 text-center text-slate-600">
            {isEnglish
              ? "No stories are available yet."
              : "এখনো কোনো গল্প যোগ করা হয়নি।"}
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <article
                key={story.id}
                className="relative isolate min-h-[350px] overflow-hidden rounded-[28px] border border-red-900/10 bg-red-950 shadow-[0_10px_30px_rgba(64,48,45,.12)] sm:min-h-[380px]"
              >
                <div className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-64 rounded-full bg-red-700/35 blur-[70px]" />
                <div
                  className="pointer-events-none absolute inset-y-0 right-0 z-0 w-[55%] opacity-45"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11'%3E%3Crect x='1' y='1' width='3' height='3' fill='%23ffffff' fill-opacity='.3'/%3E%3C/svg%3E\")",
                    backgroundSize: "11px 11px",
                    maskImage:
                      "linear-gradient(135deg, transparent 10%, rgba(0,0,0,.35) 55%, #000 100%)",
                    WebkitMaskImage:
                      "linear-gradient(135deg, transparent 10%, rgba(0,0,0,.35) 55%, #000 100%)",
                  }}
                />
                <div className="relative z-10 flex min-h-[310px] w-full flex-col justify-center p-5 sm:min-h-[380px] sm:w-[68%] sm:p-6">
                  <span
                    aria-hidden="true"
                    className="mb-1 h-11 text-6xl font-black leading-[.8] text-red-400/75"
                  >
                    “
                  </span>
                  <blockquote className="whitespace-pre-line text-lg font-bold leading-relaxed text-white">
                    {isEnglish ? story.quoteEn : story.quoteBn}
                  </blockquote>
                  <div className="mt-6">
                    <p className="font-bold text-white">
                      {isEnglish ? story.authorNameEn : story.authorNameBn}
                    </p>
                    <p className="mt-1 text-sm text-white/60">
                      {isEnglish ? story.authorDetailEn : story.authorDetailBn}
                    </p>
                  </div>
                </div>
                <div className="relative z-[1] mx-auto h-[220px] w-full sm:absolute sm:inset-y-0 sm:right-0 sm:mx-0 sm:h-auto sm:w-[48%]">
                  <img
                    src={resolveMediaUrl(story.imageUrl)}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-contain"
                    style={{ objectPosition: "center bottom" }}
                  />
                </div>
              </article>
            ))}
          </div>
        )}

        {!isLoading && hasMore && (
          <div className="mt-10 flex flex-col items-center gap-3">
            {hasError && (
              <p role="alert" className="text-sm font-medium text-red-700">
                {isEnglish
                  ? "Could not load more stories. Please try again."
                  : "আরও গল্প লোড হয়নি। আবার চেষ্টা করুন।"}
              </p>
            )}
            <button
              type="button"
              disabled={isLoadingMore}
              onClick={() => void loadMore()}
              className="cursor-pointer rounded-full bg-red-700 px-6 py-3 font-bold text-white shadow-sm transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoadingMore
                ? isEnglish
                  ? "Loading…"
                  : "লোড হচ্ছে…"
                : hasError
                  ? isEnglish
                    ? "Try again"
                    : "আবার চেষ্টা করুন"
                  : isEnglish
                    ? "Load more"
                    : "আরও দেখুন"}
            </button>
          </div>
        )}
      </main>
      <SiteFooter isEnglish={isEnglish} />
    </div>
  );
}
