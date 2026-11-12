import { useEffect, useState } from "react";
import type { JSX } from "react";
import { Play, X } from "lucide-react";
import { useLocaleRouteSync } from "../../hooks/useLocaleRouteSync";
import axiosPublic from "../../hooks/axiosPublic";
import { resolveMediaUrl } from "../../utils/media";
import { getStoredLocale } from "../../utils/language";
import TopNav from "../../components/Shared/TopBar";
import AboutFooter from "../Home/components/AboutFooter";
import CreditsFooter from "../Home/components/CreditsFooter";

const VIDEO_PAGE_SIZE = 12;
const PHOTO_PAGE_SIZE = 9;

type GalleryPhoto = { id: string; imageUrl: string; alt: string };
type HomeVideo = {
  id: string;
  name: string;
  nameEn?: string;
  title: string;
  titleEn?: string;
  thumbnailImage: string;
  videoLink: string;
  videoLinkEn?: string;
};
type PaginatedResponse<T> = { data?: T[]; meta?: { total?: number } };

function useMediaPage<T>(endpoint: "/gallery" | "/videos", pageSize: number) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setItems([]);
    setPage(1);
    setTotal(0);
    setIsLoading(true);
    setError(false);
    void axiosPublic()
      .get<PaginatedResponse<T>>(endpoint, {
        params: { page: 1, limit: pageSize },
      })
      .then(({ data }) => {
        if (cancelled) return;
        setItems(Array.isArray(data?.data) ? data.data : []);
        setTotal(Number(data?.meta?.total) || 0);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [endpoint, pageSize, retry]);

  const loadMore = async () => {
    if (isLoadingMore || isLoading || items.length >= total) return;
    setIsLoadingMore(true);
    setError(false);
    const nextPage = page + 1;
    try {
      const { data } = await axiosPublic().get<PaginatedResponse<T>>(endpoint, {
        params: { page: nextPage, limit: pageSize },
      });
      const nextItems = Array.isArray(data?.data) ? data.data : [];
      setItems((current) => [...current, ...nextItems]);
      setPage(nextPage);
      setTotal(Number(data?.meta?.total) || 0);
    } catch {
      setError(true);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return {
    items,
    total,
    isLoading,
    isLoadingMore,
    hasMore: items.length < total,
    error,
    loadMore,
    retryLoad: () => setRetry((value) => value + 1),
  };
}

function PageSkeleton({
  kind,
  isEnglish,
}: {
  kind: "gallery" | "videos";
  isEnglish: boolean;
}) {
  return (
    <div
      className={`grid gap-5 sm:grid-cols-2 ${kind === "videos" ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
      aria-busy="true"
      role="status"
    >
      <span className="sr-only">{isEnglish ? "Loading" : "লোড হচ্ছে"}</span>
      {Array.from(
        { length: kind === "videos" ? VIDEO_PAGE_SIZE : PHOTO_PAGE_SIZE },
        (_, index) =>
          kind === "videos" ? (
            <div
              key={index}
              aria-hidden="true"
              className="flex h-[457px] animate-pulse flex-col rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:h-[492px] md:rounded-[38px] md:p-6"
            >
              <div className="mb-3 min-h-0 flex-1 rounded-[20px] bg-slate-200 md:mb-4 md:rounded-[30px]" />
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 rounded-full bg-slate-200 md:h-[52px] md:w-[52px]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-slate-200" />
                  <div className="h-3 w-full rounded bg-slate-100" />
                  <div className="h-3 w-2/3 rounded bg-slate-100" />
                </div>
              </div>
            </div>
          ) : (
            <div
              key={index}
              aria-hidden="true"
              className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="aspect-[4/3] bg-slate-200" />
            </div>
          ),
      )}
    </div>
  );
}

function LoadMore({
  isEnglish,
  isLoadingMore,
  error,
  onClick,
}: {
  isEnglish: boolean;
  isLoadingMore: boolean;
  error: boolean;
  onClick: () => void;
}) {
  return (
    <div className="mt-10 flex flex-col items-center gap-3">
      {error && (
        <p role="alert" className="text-sm font-medium text-red-700">
          {isEnglish
            ? "Could not load more items. Please try again."
            : "আরও কনটেন্ট লোড হয়নি। আবার চেষ্টা করুন।"}
        </p>
      )}
      <button
        type="button"
        onClick={onClick}
        disabled={isLoadingMore}
        className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-red-700 px-6 py-3 font-bold text-white shadow-sm transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoadingMore
          ? isEnglish
            ? "Loading…"
            : "লোড হচ্ছে…"
          : error
            ? isEnglish
              ? "Try again"
              : "আবার চেষ্টা করুন"
            : isEnglish
              ? "Load more"
              : "আরও দেখুন"}
      </button>
    </div>
  );
}

function VideoLibrary({ isEnglish }: { isEnglish: boolean }) {
  const {
    items: videos,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    retryLoad,
  } = useMediaPage<HomeVideo>("/videos", VIDEO_PAGE_SIZE);
  const [selected, setSelected] = useState<HomeVideo | null>(null);

  useEffect(() => {
    if (!selected) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [selected]);

  return (
    <>
      {isLoading ? (
        <PageSkeleton kind="videos" isEnglish={isEnglish} />
      ) : error && videos.length === 0 ? (
        <p
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-800"
        >
          {isEnglish ? "Videos could not be loaded." : "ভিডিও লোড করা যায়নি।"}
          <button
            type="button"
            onClick={retryLoad}
            className="ml-2 cursor-pointer font-bold underline"
          >
            {isEnglish ? "Retry" : "আবার চেষ্টা করুন"}
          </button>
        </p>
      ) : videos.length === 0 ? (
        <p className="py-16 text-center text-slate-600">
          {isEnglish
            ? "No videos are available yet."
            : "এখনো কোনো ভিডিও যোগ করা হয়নি।"}
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {videos.map((video) => (
            <button
              key={video.id}
              type="button"
              onClick={() => setSelected(video)}
              className="group flex h-[457px] cursor-pointer flex-col rounded-[28px] border border-red-100 bg-white p-5 text-left shadow-[0_8px_24px_rgba(64,48,45,.1)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(64,48,45,.16)] md:h-[492px] md:rounded-[38px] md:p-6"
            >
              <div className="relative mb-3 min-h-0 flex-1 overflow-hidden rounded-[20px] bg-slate-100 md:mb-4 md:rounded-[30px]">
                <img
                  src={resolveMediaUrl(video.thumbnailImage)}
                  alt={video.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-slate-950/20 transition group-hover:bg-slate-950/10" />
                <span className="absolute left-1/2 top-1/2 grid h-[60px] w-[60px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/45 p-[7px] shadow-[0_4px_18px_rgba(0,0,0,.3)] transition group-hover:scale-110">
                  <span className="grid h-full w-full place-items-center rounded-full bg-white text-red-700">
                    <Play size={19} fill="currentColor" className="ml-0.5" />
                  </span>
                </span>
              </div>
              <span className="flex items-center gap-3 text-left text-slate-900">
                <img
                  src={resolveMediaUrl(video.thumbnailImage)}
                  alt=""
                  className="h-12 w-12 shrink-0 rounded-full border border-slate-200 object-cover md:h-[52px] md:w-[52px]"
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold leading-5 md:text-base md:leading-6">
                    {isEnglish ? video.nameEn || video.name : video.name}
                  </span>
                  <span className="mt-0.5 line-clamp-2 block text-xs leading-4 text-slate-600 md:text-sm md:leading-5">
                    {isEnglish ? video.titleEn || video.title : video.title}
                  </span>
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
      {!isLoading && hasMore && (
        <LoadMore
          isEnglish={isEnglish}
          isLoadingMore={isLoadingMore}
          error={error}
          onClick={() => void loadMore()}
        />
      )}
      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
        >
          <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl">
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label={isEnglish ? "Close video" : "ভিডিও বন্ধ করুন"}
              className="absolute right-3 top-3 z-10 grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-white/90 text-red-800 shadow"
            >
              <X size={22} />
            </button>
            <iframe
              className="aspect-video w-full"
              src={`https://www.youtube-nocookie.com/embed/${youtubeId(isEnglish && selected.videoLinkEn ? selected.videoLinkEn : selected.videoLink)}?autoplay=1&rel=0`}
              title={
                isEnglish ? selected.titleEn || selected.title : selected.title
              }
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}

function youtubeId(videoLink: string) {
  try {
    const url = new URL(videoLink);
    if (url.hostname.includes("youtu.be"))
      return url.pathname.slice(1).split("/")[0];
    if (url.hostname.includes("youtube.com"))
      return (
        url.searchParams.get("v") ||
        url.pathname.split("/embed/")[1]?.split("/")[0] ||
        url.pathname.split("/shorts/")[1]?.split("/")[0] ||
        ""
      );
  } catch {
    /* Invalid links are rejected by the admin API. */
  }
  return "";
}

function PhotoLibrary({ isEnglish }: { isEnglish: boolean }) {
  const {
    items: photos,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    retryLoad,
  } = useMediaPage<GalleryPhoto>("/gallery", PHOTO_PAGE_SIZE);
  const [selected, setSelected] = useState<GalleryPhoto | null>(null);

  useEffect(() => {
    if (!selected) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [selected]);

  return (
    <>
      {isLoading ? (
        <PageSkeleton kind="gallery" isEnglish={isEnglish} />
      ) : error && photos.length === 0 ? (
        <p
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-800"
        >
          {isEnglish
            ? "Gallery photos could not be loaded."
            : "গ্যালারির ছবি লোড করা যায়নি।"}
          <button
            type="button"
            onClick={retryLoad}
            className="ml-2 cursor-pointer font-bold underline"
          >
            {isEnglish ? "Retry" : "আবার চেষ্টা করুন"}
          </button>
        </p>
      ) : photos.length === 0 ? (
        <p className="py-16 text-center text-slate-600">
          {isEnglish
            ? "No photos are available yet."
            : "এখনো কোনো ছবি যোগ করা হয়নি।"}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setSelected(photo)}
              aria-label={
                photo.alt ||
                (isEnglish
                  ? `View photo ${index + 1}`
                  : `ছবি ${index + 1} বড় করে দেখুন`)
              }
              className="group relative cursor-zoom-in overflow-hidden rounded-2xl border border-red-100 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <img
                src={resolveMediaUrl(photo.imageUrl)}
                alt={
                  photo.alt || (isEnglish ? "MET Club photo" : "মেট ক্লাবের ছবি")
                }
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
              />
              {photo.alt && (
                <span className="block px-4 py-3 text-sm font-semibold text-slate-700">
                  {photo.alt}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
      {!isLoading && hasMore && (
        <LoadMore
          isEnglish={isEnglish}
          isLoadingMore={isLoadingMore}
          error={error}
          onClick={() => void loadMore()}
        />
      )}
      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
          role="dialog"
          aria-modal="true"
          aria-label={
            selected.alt ||
            (isEnglish ? "Expanded gallery photo" : "বড় করে দেখা গ্যালারির ছবি")
          }
        >
          <button
            type="button"
            onClick={() => setSelected(null)}
            aria-label={isEnglish ? "Close photo" : "ছবি বন্ধ করুন"}
            className="absolute right-4 top-4 z-10 grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-white/25 bg-black/40 text-white"
          >
            <X size={23} />
          </button>
          <figure className="max-h-full max-w-full">
            <img
              src={resolveMediaUrl(selected.imageUrl)}
              alt={selected.alt || ""}
              className="max-h-[84vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl"
            />
            {selected.alt && (
              <figcaption className="mt-3 text-center text-sm text-white">
                {selected.alt}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </>
  );
}

function MediaPage({ kind }: { kind: "gallery" | "videos" }): JSX.Element {
  const bnPath = kind === "videos" ? "/videos" : "/gallery";
  const enPath = kind === "videos" ? "/en/videos" : "/en/gallery";
  useLocaleRouteSync(bnPath, enPath);
  const isEnglish = getStoredLocale() === "en";
  const isVideos = kind === "videos";
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <TopNav
        title={
          isEnglish
            ? isVideos
              ? "Videos"
              : "Photo Gallery"
            : isVideos
              ? "ভিডিও"
              : "ফটো গ্যালারি"
        }
        brandName={isEnglish ? "Met Club" : "মেট ক্লাব"}
      />
      <main className="site-container w-full flex-1 py-[60px] lg:py-[80px]">
        <header className="mb-10 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-[.16em] text-red-600">
            {isVideos
              ? isEnglish
                ? "OUR STORIES"
                : "আমাদের গল্প"
              : isEnglish
                ? "MET CLUB MOMENTS"
                : "মেট ক্লাবের মুহূর্ত"}
          </p>
          <h1 className="text-3xl font-black text-red-950 sm:text-4xl">
            {isVideos
              ? isEnglish
                ? "Stories from our learning community"
                : "আমাদের শেখার কমিউনিটির গল্প"
              : isEnglish
                ? "Learning, exploring, growing"
                : "শিখি, দেখি, একসাথে এগিয়ে যাই"}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {isVideos
              ? isEnglish
                ? "Watch learners share their experiences and discover how MET Club makes weather learning practical."
                : "শিক্ষার্থীদের অভিজ্ঞতা শুনে দেখো, মেট ক্লাব কীভাবে আবহাওয়া শেখাকে হাতে-কলমে করে তোলে।"
              : isEnglish
                ? "A glimpse of the curiosity, teamwork, and discovery that make learning meaningful."
                : "কৌতূহল, দলগত কাজ আর নতুন কিছু আবিষ্কারের মধ্য দিয়ে শেখার মুহূর্তগুলো দেখুন।"}
          </p>
        </header>
        {isVideos ? (
          <VideoLibrary isEnglish={isEnglish} />
        ) : (
          <PhotoLibrary isEnglish={isEnglish} />
        )}
      </main>
      <AboutFooter isEnglish={isEnglish} />
      <CreditsFooter isEnglish={isEnglish} />
    </div>
  );
}

export function VideoLibraryPage(): JSX.Element {
  return <MediaPage kind="videos" />;
}
export function PhotoGalleryPage(): JSX.Element {
  return <MediaPage kind="gallery" />;
}
