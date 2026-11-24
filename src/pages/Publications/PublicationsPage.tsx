import { useCallback, useEffect, useState } from "react";
import { FileText, LoaderCircle } from "lucide-react";
import axiosPublic from "../../hooks/axiosPublic";
import { useLocaleRouteSync } from "../../hooks/useLocaleRouteSync";
import { getStoredLocale } from "../../utils/language";
import { resolveMediaUrl } from "../../utils/media";
import TopNav from "../../components/Shared/TopBar";
import SiteFooter from "../../components/Shared/SiteFooter";

type Category = "comics" | "flyer" | "pressRelease";
type PdfResource = {
  id: string;
  category: Category;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  pdfUrl: string;
  pdfUrlEn?: string | null;
  featuredImageUrl?: string | null;
  createdAt: string;
};
type ApiResult = { data?: PdfResource[]; meta?: { total?: number } };
const PAGE_SIZE = 12;
const categoryCopy: Record<
  Category,
  {
    bn: { title: string; description: string };
    en: { title: string; description: string };
  }
> = {
  comics: {
    bn: {
      title: "কমিকস",
      description: "গল্প ও ছবির মাধ্যমে মেট ক্লাবের শিক্ষামূলক কমিকস পড়ুন।",
    },
    en: {
      title: "Comics",
      description: "Explore learning comics through stories and illustrations.",
    },
  },
  flyer: {
    bn: {
      title: "ফ্লায়ার",
      description: "মেট ক্লাবের তথ্যবহুল ফ্লায়ারগুলো দেখুন ও পড়ুন।",
    },
    en: {
      title: "Flyers",
      description: "Read and explore informative MET Club flyers.",
    },
  },
  pressRelease: {
    bn: {
      title: "News",
      description: "মেট ক্লাবের সংবাদ ও আনুষ্ঠানিক ঘোষণা পড়ুন।",
    },
    en: {
      title: "News",
      description: "Read news and official announcements from MET Club.",
    },
  },
};

function PublicationPage({ category }: { category: Category }) {
  const routeSlug =
    category === "pressRelease"
      ? "press-releases"
      : category === "flyer"
        ? "flyers"
        : "comics";
  useLocaleRouteSync(`/${routeSlug}`, `/en/${routeSlug}`);
  const isEnglish = getStoredLocale() === "en";
  const copy = isEnglish
    ? categoryCopy[category].en
    : categoryCopy[category].bn;
  const [items, setItems] = useState<PdfResource[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);

  const loadFirstPage = useCallback(async () => {
    setIsLoading(true);
    setError(false);
    try {
      const { data } = await axiosPublic().get<ApiResult>("/pdf-resources", {
        params: { category, page: 1, limit: PAGE_SIZE },
      });
      setItems(Array.isArray(data?.data) ? data.data : []);
      setTotal(Number(data?.meta?.total) || 0);
      setPage(1);
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, [category]);

  useEffect(() => {
    void loadFirstPage();
  }, [loadFirstPage, retry]);

  const loadMore = async () => {
    if (isLoadingMore || items.length >= total) return;
    setIsLoadingMore(true);
    setError(false);
    try {
      const nextPage = page + 1;
      const { data } = await axiosPublic().get<ApiResult>("/pdf-resources", {
        params: { category, page: nextPage, limit: PAGE_SIZE },
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <TopNav
        title={copy.title}
      />
      <main className="site-container min-h-[60vh] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <header className="mx-auto mb-9 max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[.18em] text-red-700">
            MET CLUB LIBRARY
          </p>
          <h1 className="mt-2 text-3xl font-black text-red-950 sm:text-4xl">
            {copy.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">
            {copy.description}
          </p>
        </header>
        {isLoading ? (
          <div
            role="status"
            aria-busy="true"
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="h-12 w-12 rounded-xl bg-slate-200" />
                <div className="mt-5 h-5 w-2/3 rounded bg-slate-200" />
                <div className="mt-3 h-4 w-full rounded bg-slate-100" />
                <div className="mt-2 h-4 w-4/5 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : error && items.length === 0 ? (
          <div
            className="rounded-2xl border border-red-200 bg-white p-8 text-center text-red-800"
            role="alert"
          >
            {isEnglish ? "PDFs could not be loaded." : "PDF আনা যায়নি।"}
            <button
              type="button"
              onClick={() => setRetry((value) => value + 1)}
              className="ml-2 cursor-pointer font-bold underline"
            >
              {isEnglish ? "Retry" : "আবার চেষ্টা করুন"}
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center text-slate-600">
            {isEnglish
              ? "No publications have been added yet."
              : "এখনো কোনো PDF যোগ করা হয়নি।"}
          </div>
        ) : (
          <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <a
                key={item.id}
                href={resolveMediaUrl(
                  isEnglish && item.pdfUrlEn ? item.pdfUrlEn : item.pdfUrl,
                )}
                target="_blank"
                rel="noreferrer"
                className="group flex min-h-52 flex-col overflow-hidden rounded-2xl border border-red-100 bg-white shadow-[0_8px_24px_rgba(64,48,45,.08)] transition hover:-translate-y-1 hover:border-red-200 hover:shadow-[0_14px_32px_rgba(64,48,45,.14)]"
              >
                {item.featuredImageUrl ? (
                  <img
                    src={resolveMediaUrl(item.featuredImageUrl)}
                    alt={isEnglish ? item.titleEn : item.titleBn}
                    loading="lazy"
                    className="aspect-[16/9] w-full bg-red-50 object-cover"
                  />
                ) : (
                  <div className="grid aspect-[16/9] w-full place-items-center bg-gradient-to-br from-red-100 via-orange-50 to-slate-100 text-red-700">
                    <FileText size={40} />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-xl font-bold leading-snug text-slate-900 group-hover:text-red-800">
                    {isEnglish ? item.titleEn : item.titleBn}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
                    {isEnglish ? item.descriptionEn : item.descriptionBn}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-red-700">
                    {isEnglish ? "Open PDF" : "PDF খুলুন"}
                    <span aria-hidden="true">↗</span>
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
        {!isLoading && items.length < total && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              disabled={isLoadingMore}
              onClick={() => void loadMore()}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-bold text-white transition hover:bg-red-800 disabled:cursor-wait disabled:opacity-60"
            >
              {isLoadingMore && (
                <LoaderCircle size={18} className="animate-spin" />
              )}
              {isEnglish ? "Load more" : "আরও দেখুন"}
            </button>
          </div>
        )}
        {error && items.length > 0 && (
          <p role="alert" className="mt-4 text-center text-sm text-red-700">
            {isEnglish
              ? "More PDFs could not be loaded. Try again."
              : "আরও PDF আনা যায়নি। আবার চেষ্টা করুন।"}
            <button
              type="button"
              onClick={() => void loadMore()}
              className="ml-2 cursor-pointer font-bold underline"
            >
              {isEnglish ? "Retry" : "আবার চেষ্টা করুন"}
            </button>
          </p>
        )}
      </main>
      <SiteFooter isEnglish={isEnglish} />
    </div>
  );
}

export const ComicsPage = () => <PublicationPage category="comics" />;
export const FlyersPage = () => <PublicationPage category="flyer" />;
export const PressReleasePage = () => (
  <PublicationPage category="pressRelease" />
);
