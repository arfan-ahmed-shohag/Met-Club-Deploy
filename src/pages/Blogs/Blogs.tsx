import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, ArrowRight, PencilLine } from "lucide-react";
import toast from "react-hot-toast";
import TopNav from "../../components/Shared/TopBar";
import SiteFooter from "../../components/Shared/SiteFooter";
import axiosPublic from "../../hooks/axiosPublic";
import useAxiosProtected from "../../hooks/axiosProtected";
import useAuth from "../../hooks/useAuth";
import { getStoredLocale } from "../../utils/language";
import { blogHtmlFirstImage, blogHtmlToText } from "../../utils/blogContent";
import { resolveMediaUrl } from "../../utils/media";

type BlogPost = {
  id: string;
  title: string;
  titleEn?: string;
  content: string;
  contentEn?: string;
  featuredImage: string | null;
  status: "pending" | "published";
  createdAt: string;
  publishedAt: string | null;
  author: { id: string; fullName: string; profileImg: string | null };
};

// The newest post is featured on page 1; the rest are listed PAGE_SIZE per page.
const PAGE_SIZE = 9;
const cardShadow =
  "shadow-[0_8px_24px_rgba(127,29,29,0.08)] hover:shadow-[0_18px_40px_rgba(127,29,29,0.14)]";

function postText(post: BlogPost, isEnglish: boolean) {
  const title = isEnglish ? post.titleEn || post.title : post.title;
  const content = isEnglish ? post.contentEn || post.content : post.content;
  return {
    title,
    cover: post.featuredImage
      ? resolveMediaUrl(post.featuredImage)
      : blogHtmlFirstImage(content),
    excerpt: blogHtmlToText(content),
  };
}

function PostCover({
  src,
  alt,
  className,
}: {
  src: string | null | undefined;
  alt: string;
  className: string;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-red-800 via-red-600 to-orange-400 ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.85),transparent_55%)]">
          <span className="rounded-full border border-white/40 bg-white/15 px-4 py-2 text-sm font-bold tracking-[0.15em] text-white">
            MET CLUB
          </span>
        </div>
      )}
    </div>
  );
}

// The link's ::after layer covers the whole card (the card must be `relative group`),
// so clicking anywhere on the card opens the post while it stays a single link.
function ReadLink({
  to,
  label,
  title,
  big = false,
}: {
  to: string;
  label: string;
  title: string;
  big?: boolean;
}) {
  return (
    <Link
      to={to}
      aria-label={`${label}: ${title}`}
      className="inline-flex w-fit items-center gap-3 font-bold text-red-700 transition after:absolute after:inset-0 after:z-10 after:rounded-[inherit] after:content-[''] group-hover:text-red-900 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-red-500"
    >
      {label}
      <span
        aria-hidden="true"
        className={`grid place-items-center rounded-full transition group-hover:translate-x-1 ${big ? "h-9 w-9 bg-red-700 text-white" : "h-8 w-8 bg-red-50 text-red-700"}`}
      >
        <ArrowRight size={big ? 18 : 16} />
      </span>
    </Link>
  );
}

export default function Blogs() {
  const publicApi = axiosPublic();
  const protectedApi = useAxiosProtected();
  const { user, isAuthenticated } = useAuth();
  const isEnglish = getStoredLocale() === "en";
  const locale = isEnglish ? "en-US" : "bn-BD";
  const blogsPath = isEnglish ? "/en/blogs" : "/blogs";
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [myPostsState, setMyPostsState] = useState<{
    userId: string;
    posts: BlogPost[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [page, setPage] = useState(1);
  const myPosts =
    myPostsState && myPostsState.userId === user?.id ? myPostsState.posts : [];

  useEffect(() => {
    let cancelled = false;
    publicApi
      .get("/blogs")
      .then(({ data }) => {
        if (!cancelled) setPosts((data?.data || []) as BlogPost[]);
      })
      .catch((error: unknown) => {
        console.error("Failed to load blog posts:", error);
        if (!cancelled) setLoadError(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [publicApi]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "student") {
      return;
    }
    let cancelled = false;
    protectedApi
      .get("/blogs/mine")
      .then(({ data }) => {
        if (!cancelled)
          setMyPostsState({
            userId: user.id,
            posts: (data?.data || []) as BlogPost[],
          });
      })
      .catch((error: unknown) => {
        console.error("Failed to load your blog posts:", error);
        if (!cancelled)
          toast.error(
            isEnglish
              ? "Could not load your submissions."
              : "আপনার জমা দেওয়া ব্লগ আনা যায়নি।",
          );
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isEnglish, protectedApi, user?.id, user?.role]);

  const [featured, ...rest] = posts;
  const pageCount = Math.max(1, Math.ceil(rest.length / PAGE_SIZE));
  const visiblePosts = rest.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const getDate = (post: BlogPost) =>
    new Date(post.publishedAt || post.createdAt).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  const readLabel = isEnglish ? "Read the story" : "লেখাটি পড়ুন";
  const goToPage = (next: number) => {
    setPage(next);
    document
      .getElementById("blog-posts")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-900">
      <TopNav title={isEnglish ? "Community Blog" : "কমিউনিটি ব্লগ"} />

      {/* Hero */}
      <header className="relative overflow-hidden bg-[linear-gradient(115deg,#2a0806_0%,#4a0f0b_55%,#7a1d12_100%)] text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_20%,rgba(249,115,22,0.35),transparent_45%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-1/2 h-[420px] w-[420px] -translate-y-1/4 rounded-full border border-orange-300/20"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-48 top-1/2 h-[620px] w-[620px] -translate-y-1/3 rounded-full border border-orange-300/10"
        />
        <div className="site-container relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <span className="inline-block rounded-full border border-orange-300/50 bg-orange-400/10 px-4 py-1.5 text-xs font-bold tracking-wide text-orange-200">
            {isEnglish ? "MET Club community" : "মেট ক্লাব কমিউনিটি"}
          </span>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            {isEnglish ? "Community Blog" : "কমিউনিটি ব্লগ"}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-red-100/90 sm:text-lg">
            {isEnglish
              ? "Explore stories and ideas shared by MET Club students."
              : "মেট ক্লাবের শিক্ষার্থীদের অভিজ্ঞতা, গল্প ও ভাবনা পড়ুন।"}
          </p>
          <Link
            to={isEnglish ? "/en/blogs/write" : "/blogs/write"}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-6 py-3 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:from-red-700 hover:to-orange-600"
          >
            <PencilLine size={18} aria-hidden="true" />
            {isEnglish ? "Write New Blog" : "নতুন ব্লগ লিখুন"}
          </Link>
        </div>
      </header>

      <main
        id="blog-posts"
        className="site-container scroll-mt-24 px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pt-20"
      >
        {/* Section heading */}
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold text-red-700">
              {isEnglish ? "Recent writing" : "সাম্প্রতিক লেখা"}
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              {isEnglish ? "Published stories" : "প্রকাশিত ব্লগ লেখা"}
            </h2>
          </div>
          {!isLoading && !loadError && posts.length > 0 && (
            <p className="text-sm font-semibold text-slate-500">
              {isEnglish
                ? `${posts.length} published ${posts.length === 1 ? "story" : "stories"}`
                : `${posts.length.toLocaleString("bn-BD")} টি প্রকাশিত লেখা`}
            </p>
          )}
        </div>

        <section aria-label={isEnglish ? "Published stories" : "প্রকাশিত লেখা"}>
          {isLoading ? (
            <div aria-busy="true" role="status">
              <span className="sr-only">
                {isEnglish ? "Loading stories" : "লেখাগুলো লোড হচ্ছে"}
              </span>
              <div
                aria-hidden="true"
                className="grid animate-pulse overflow-hidden rounded-3xl border border-red-100 bg-white md:grid-cols-[1.35fr_1fr]"
              >
                <div className="aspect-[16/10] bg-slate-200 md:aspect-auto md:min-h-[380px]" />
                <div className="space-y-4 p-7 sm:p-10">
                  <div className="h-4 w-24 rounded bg-red-100" />
                  <div className="h-4 w-32 rounded bg-slate-100" />
                  <div className="h-8 w-11/12 rounded bg-slate-200" />
                  <div className="h-8 w-3/4 rounded bg-slate-200" />
                  <div className="h-4 w-full rounded bg-slate-100" />
                  <div className="h-4 w-5/6 rounded bg-slate-100" />
                  <div className="h-9 w-36 rounded-full bg-red-100" />
                </div>
              </div>
              <div
                aria-hidden="true"
                className="mt-8 grid animate-pulse gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {Array.from({ length: 3 }, (_, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-2xl border border-red-100 bg-white"
                  >
                    <div className="aspect-[4/3] bg-slate-200" />
                    <div className="space-y-3 p-5">
                      <div className="h-6 w-4/5 rounded bg-slate-200" />
                      <div className="h-4 w-full rounded bg-slate-100" />
                      <div className="h-4 w-2/3 rounded bg-slate-100" />
                      <div className="h-8 w-32 rounded-full bg-red-100" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : loadError ? (
            <div className="rounded-2xl border border-red-100 bg-red-50/40 p-10 text-center text-red-700">
              {isEnglish
                ? "Stories could not be loaded. Please refresh."
                : "লেখাগুলো আনা যায়নি। আবার চেষ্টা করুন।"}
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-red-200 bg-red-50/30 px-6 py-16 text-center">
              <h3 className="text-xl font-bold text-slate-800">
                {isEnglish
                  ? "No published stories yet"
                  : "এখনো কোনো লেখা প্রকাশিত হয়নি"}
              </h3>
              <p className="mt-2 text-slate-500">
                {isEnglish
                  ? "Student stories will appear here after admin review."
                  : "Admin অনুমোদন করলে শিক্ষার্থীদের লেখা এখানে দেখা যাবে।"}
              </p>
            </div>
          ) : (
            <>
              {page === 1 &&
                featured &&
                (() => {
                  const { title, cover, excerpt } = postText(
                    featured,
                    isEnglish,
                  );
                  return (
                    <article
                      className={`group relative grid cursor-pointer overflow-hidden rounded-3xl border border-red-100 bg-white transition duration-300 md:grid-cols-[1.35fr_1fr] ${cardShadow}`}
                    >
                      <PostCover
                        src={cover}
                        alt={title}
                        className="aspect-[16/10] md:aspect-auto md:min-h-[380px]"
                      />
                      <div className="flex flex-col justify-center p-7 sm:p-10">
                        <span className="text-xs font-bold uppercase tracking-wider text-red-700">
                          {isEnglish ? "Featured story" : "নির্বাচিত লেখা"}
                        </span>
                        <p className="mt-3 text-sm text-slate-500">
                          <time
                            dateTime={featured.publishedAt || featured.createdAt}
                          >
                            {getDate(featured)}
                          </time>
                          <span aria-hidden="true"> · </span>
                          {featured.author.fullName}
                        </p>
                        <h3 className="mt-4 line-clamp-4 text-2xl font-black leading-tight text-slate-900 sm:text-3xl lg:text-4xl">
                          {title}
                        </h3>
                        <p className="mt-5 line-clamp-4 break-words leading-7 text-slate-600">
                          {excerpt}
                        </p>
                        <div className="mt-7">
                          <ReadLink
                            to={`${blogsPath}/${featured.id}`}
                            label={readLabel}
                            title={title}
                            big
                          />
                        </div>
                      </div>
                    </article>
                  );
                })()}

              {visiblePosts.length > 0 && (
                <div
                  className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${page === 1 ? "mt-8" : ""}`}
                >
                  {visiblePosts.map((post) => {
                    const { title, cover, excerpt } = postText(post, isEnglish);
                    return (
                      <article
                        key={post.id}
                        className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-red-100 bg-white transition duration-300 hover:-translate-y-1 ${cardShadow}`}
                      >
                        <PostCover
                          src={cover}
                          alt={title}
                          className="aspect-[4/3]"
                        />
                        <div className="flex flex-1 flex-col p-5 sm:p-6">
                          <h3 className="line-clamp-2 text-lg font-bold leading-snug text-slate-900 sm:text-xl">
                            {title}
                          </h3>
                          <p className="mt-3 line-clamp-3 break-words text-[0.95rem] leading-6 text-slate-600">
                            {excerpt}
                          </p>
                          <p className="mt-auto pt-5 text-sm text-slate-500">
                            <time dateTime={post.publishedAt || post.createdAt}>
                              {getDate(post)}
                            </time>
                            <span aria-hidden="true"> · </span>
                            {post.author.fullName}
                          </p>
                          <div className="mt-4">
                            <ReadLink
                              to={`${blogsPath}/${post.id}`}
                              label={readLabel}
                              title={title}
                            />
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </section>

        {!isLoading && !loadError && pageCount > 1 && (
          <nav
            aria-label={isEnglish ? "Blog pages" : "ব্লগ পৃষ্ঠা"}
            className="mt-10 flex flex-wrap items-center justify-center gap-2"
          >
            <button
              type="button"
              onClick={() => goToPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft size={16} />
              {isEnglish ? "Previous" : "আগের"}
            </button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  aria-current={page === pageNumber ? "page" : undefined}
                  onClick={() => goToPage(pageNumber)}
                  className={`h-10 min-w-10 rounded-full px-3 text-sm font-bold ${page === pageNumber ? "bg-red-700 text-white shadow" : "text-slate-700 hover:bg-red-50"}`}
                >
                  {isEnglish ? pageNumber : pageNumber.toLocaleString("bn-BD")}
                </button>
              ),
            )}
            <button
              type="button"
              onClick={() => goToPage(Math.min(pageCount, page + 1))}
              disabled={page === pageCount}
              className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isEnglish ? "Next" : "পরের"}
              <ArrowRight size={16} />
            </button>
          </nav>
        )}

        {user?.role === "student" && (
          <section className="mt-16 rounded-3xl border border-red-100 bg-red-50/30 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">
              {isEnglish ? "Your submissions" : "আপনার জমা দেওয়া লেখা"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {isEnglish
                ? "Posts appear publicly after admin approval."
                : "Admin প্রকাশ করলে তবেই লেখা সবার ব্লগে দেখা যাবে।"}
            </p>
            {myPosts.length === 0 ? (
              <p className="mt-4 rounded-xl bg-white p-4 text-sm text-slate-500">
                {isEnglish
                  ? "You have not submitted a blog yet."
                  : "আপনি এখনো কোনো ব্লগ জমা দেননি।"}
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-red-100 rounded-2xl bg-white px-4">
                {myPosts.map((post) => (
                  <li
                    key={post.id}
                    className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="font-semibold text-slate-800">
                      {isEnglish ? post.titleEn || post.title : post.title}
                    </span>
                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${post.status === "published" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}
                    >
                      {post.status === "published"
                        ? isEnglish
                          ? "Published"
                          : "প্রকাশিত"
                        : isEnglish
                          ? "Pending review"
                          : "অনুমোদনের অপেক্ষায়"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>
      <SiteFooter isEnglish={isEnglish} />
    </div>
  );
}
