import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowRight, BookOpen, UserRound } from "lucide-react";
import TopNav from "../../components/Shared/TopBar";
import SiteFooter from "../../components/Shared/SiteFooter";
import axiosPublic from "../../hooks/axiosPublic";
import { getStoredLocale } from "../../utils/language";
import {
  blogHtmlFirstImage,
  blogHtmlWithoutFirstImage,
  sanitizeBlogHtml,
} from "../../utils/blogContent";
import { resolveMediaUrl } from "../../utils/media";
import { profileImageUrl } from "../../lib/profile";

type BlogPost = {
  id: string;
  title: string;
  titleEn?: string;
  content: string;
  contentEn?: string;
  featuredImage: string | null;
  createdAt: string;
  publishedAt: string | null;
  author: { id: string; fullName: string; profileImg: string | null };
};

// Same dark maroon band as the blog list hero (Blogs.tsx).
function BlogHero({ children }: { children: React.ReactNode }) {
  return (
    <header className="relative isolate overflow-hidden bg-[linear-gradient(115deg,#2a0806_0%,#4a0f0b_55%,#7a1d12_100%)] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_88%_20%,rgba(249,115,22,0.35),transparent_45%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/2 -z-10 h-[360px] w-[360px] -translate-y-1/4 rounded-full border border-orange-300/20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 top-1/2 -z-10 h-[560px] w-[560px] -translate-y-1/3 rounded-full border border-orange-300/10"
      />
      <div className="site-container flex min-h-52 flex-col items-center justify-center px-6 py-14 text-center sm:min-h-60">
        {children}
      </div>
    </header>
  );
}

// Placeholder in the shape of the article page while the post loads.
function BlogDetailsSkeleton({ isEnglish }: { isEnglish: boolean }) {
  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">
        {isEnglish ? "Loading story" : "লেখাটি লোড হচ্ছে"}
      </span>
      <div aria-hidden="true" className="animate-pulse">
        <BlogHero>
          <div className="h-9 w-64 rounded-full bg-white/20 sm:w-80" />
          <div className="mt-4 h-4 w-72 max-w-full rounded-full bg-white/15" />
        </BlogHero>
        <div className="site-container grid min-w-0 gap-8 p-5 sm:p-8 lg:gap-10 lg:p-10">
          <div className="space-y-3 border-b border-red-100 pb-5">
            <div className="h-6 w-72 max-w-full rounded-full bg-slate-200" />
            <div className="h-4 w-full rounded-full bg-slate-100" />
            <div className="h-4 w-2/3 rounded-full bg-slate-100" />
          </div>
          <div className="h-64 w-full rounded-2xl bg-red-50 sm:h-120" />
          <div className="mt-7 grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-8">
              <div className="h-3.5 w-28 rounded-full bg-red-100" />
              <div className="h-8 w-11/12 rounded-full bg-slate-200" />
              <div className="h-8 w-2/3 rounded-full bg-slate-200" />
              <div className="h-4 w-48 rounded-full bg-slate-100" />
              <div className="space-y-3 pt-4">
                {["w-full", "w-full", "w-11/12", "w-full", "w-5/6", "w-full", "w-3/4"].map(
                  (width, index) => (
                    <div
                      key={index}
                      className={`h-4 rounded-full bg-slate-100 ${width}`}
                    />
                  ),
                )}
              </div>
            </div>
            <div className="w-full max-w-xl space-y-5 lg:col-span-4 lg:justify-self-end">
              <div className="rounded-2xl border border-red-100 bg-red-50/40 p-5">
                <div className="h-5 w-24 rounded-full bg-slate-200" />
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-red-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 rounded-full bg-slate-200" />
                    <div className="h-3 w-24 rounded-full bg-slate-100" />
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-red-100 bg-white p-5">
                <div className="h-3 w-20 rounded-full bg-red-100" />
                <div className="mt-2 h-5 w-28 rounded-full bg-slate-200" />
                <div className="mt-5 space-y-4">
                  {[0, 1, 2].map((row) => (
                    <div
                      key={row}
                      className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3"
                    >
                      <div className="aspect-square rounded-lg bg-red-100" />
                      <div className="space-y-2 self-center">
                        <div className="h-4 w-full rounded-full bg-slate-200" />
                        <div className="h-4 w-2/3 rounded-full bg-slate-100" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BlogDetails() {
  const { id } = useParams<{ id: string }>();
  const publicApi = axiosPublic();
  const isEnglish = getStoredLocale() === "en";
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const post = posts.find((item) => String(item.id) === id);
  const relatedPosts = posts
    .filter((item) => String(item.id) !== id)
    .slice(0, 3);

  useEffect(() => {
    let cancelled = false;
    publicApi
      .get("/blogs")
      .then(({ data }) => {
        if (!cancelled) setPosts((data?.data || []) as BlogPost[]);
      })
      .catch((error: unknown) => {
        console.error("Failed to load blog post:", error);
        if (!cancelled) setLoadError(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [publicApi]);

  const getDate = (item: BlogPost) =>
    new Date(item.publishedAt || item.createdAt).toLocaleDateString(
      isEnglish ? "en-US" : "bn-BD",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );

  const bannerTitle = isEnglish ? "Our Blog Details" : "ব্লগের বিস্তারিত";
  const welcomeTitle = isEnglish
    ? "Welcome to the MET Club Blog"
    : "মেট ক্লাব ব্লগে স্বাগতম";
  const welcomeText = isEnglish
    ? "Stories and ideas from MET Club students. Read their experiences, learn from each other, and explore the work happening in our community."
    : "মেট ক্লাবের শিক্ষার্থীদের অভিজ্ঞতা ও ভাবনার লেখা। তাঁদের গল্প পড়ুন, একে অন্যের কাছ থেকে শিখুন, আর আমাদের কমিউনিটির কাজগুলো জানুন।";

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-900">
      <TopNav title={isEnglish ? "Community Blog" : "কমিউনিটি ব্লগ"} />
      <main className="w-full bg-white">
        {isLoading ? (
          <BlogDetailsSkeleton isEnglish={isEnglish} />
        ) : loadError ? (
          <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 lg:px-10">
            <div
              className="rounded-2xl border border-red-100 bg-red-50/40 p-10 text-center text-red-700"
              role="alert"
            >
              {isEnglish
                ? "This story could not be loaded. Please try again."
                : "লেখাটি আনা যায়নি। আবার চেষ্টা করুন।"}
            </div>
          </div>
        ) : !post ? (
          <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 lg:px-10">
            <div className="rounded-2xl border border-dashed border-red-200 bg-red-50/30 p-10 text-center">
              <h1 className="text-2xl font-bold text-slate-800">
                {isEnglish ? "Story not found" : "লেখাটি পাওয়া যায়নি"}
              </h1>
              <p className="mt-2 text-slate-600">
                {isEnglish
                  ? "It may have been removed or is no longer public."
                  : "লেখাটি সরানো হয়েছে অথবা এখন আর প্রকাশিত নেই।"}
              </p>
            </div>
          </div>
        ) : (
          (() => {
            const postTitle = isEnglish
              ? post.titleEn || post.title
              : post.title;
            const postContent = isEnglish
              ? post.contentEn || post.content
              : post.content;
            const inlineCover = post.featuredImage
              ? null
              : blogHtmlFirstImage(postContent);
            const coverImage = post.featuredImage
              ? resolveMediaUrl(post.featuredImage)
              : inlineCover;
            const articleContent = inlineCover
              ? blogHtmlWithoutFirstImage(postContent)
              : postContent;

            return (
              <div className="w-full">
                <BlogHero>
                  <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                    {bannerTitle}
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm text-red-100/90 sm:text-base">
                    {isEnglish
                      ? "Stories shared by our student community"
                      : "আমাদের শিক্ষার্থী কমিউনিটির লেখা ও অভিজ্ঞতা"}
                  </p>
                </BlogHero>

                <div className="grid min-w-0 gap-8 p-5 sm:p-8 lg:gap-10 lg:p-10 site-container">
                  <section className="border-b border-red-100 pb-5">
                    <div className="flex items-center gap-2 text-red-700">
                      <BookOpen size={19} aria-hidden="true" />
                      <h2 className="text-xl font-bold text-slate-900">
                        {welcomeTitle}
                      </h2>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
                      {welcomeText}
                    </p>
                  </section>

                  {coverImage && (
                    <img
                      src={coverImage}
                      alt={postTitle}
                      className="h-64 w-full rounded-2xl bg-red-50 object-cover sm:h-120"
                    />
                  )}
                  <div className="mt-7 grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-12">
                    <article className="min-w-0 w-full max-w-300 lg:col-span-8">
                      <div>
                        <div className="mb-5">
                          <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-700">
                            {isEnglish ? "Student story" : "শিক্ষার্থীর লেখা"}
                          </p>
                          <h2 className="mt-2 wrap-break-word text-2xl font-black leading-tight text-slate-900 sm:text-3xl">
                            {postTitle}
                          </h2>
                          <p className="mt-3 text-sm text-slate-500">
                            {post.author.fullName}{" "}
                            <span aria-hidden="true">·</span>{" "}
                            <time dateTime={post.publishedAt || post.createdAt}>
                              {getDate(post)}
                            </time>
                          </p>
                        </div>
                        <div
                          className="blog-rich-content min-w-0 text-base leading-8 text-slate-700"
                          dangerouslySetInnerHTML={{
                            __html: sanitizeBlogHtml(articleContent),
                          }}
                        />
                      </div>
                    </article>

                    <aside className="min-w-0 w-full max-w-xl space-y-5 lg:col-span-4 lg:justify-self-end">
                      <section className="rounded-2xl border border-red-100 bg-red-50/40 p-5">
                        <h2 className="text-lg font-bold text-slate-900">
                          {isEnglish ? "Written by" : "লেখক"}
                        </h2>
                        <div className="mt-4 flex min-w-0 items-center gap-3">
                          {post.author.profileImg ? (
                            <img
                              src={profileImageUrl(post.author.profileImg)}
                              alt=""
                              className="h-10 w-10 shrink-0 rounded-full object-cover"
                            />
                          ) : (
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-red-100 text-red-700">
                              <UserRound size={20} />
                            </span>
                          )}
                          <div className="min-w-0">
                            <p className="wrap-break-word font-bold text-slate-800">
                              {post.author.fullName}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {isEnglish
                                ? "MET Club student"
                                : "মেট ক্লাব শিক্ষার্থী"}
                            </p>
                          </div>
                        </div>
                      </section>

                      <section className="rounded-2xl border border-red-100 bg-white p-5 shadow-[0_8px_24px_rgba(127,29,29,0.06)]">
                        <div className="mb-4 border-b border-red-100 pb-3">
                          <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-700">
                            MET CLUB
                          </p>
                          <h2 className="mt-1 text-lg font-black text-slate-900">
                            {isEnglish ? "More stories" : "আরও লেখা"}
                          </h2>
                        </div>
                        {relatedPosts.length ? (
                          <div className="space-y-3">
                            {relatedPosts.map((related) => {
                              const image = related.featuredImage
                                ? resolveMediaUrl(related.featuredImage)
                                : blogHtmlFirstImage(
                                    isEnglish
                                      ? related.contentEn || related.content
                                      : related.content,
                                  );
                              const relatedTitle = isEnglish
                                ? related.titleEn || related.title
                                : related.title;
                              return (
                                <Link
                                  key={related.id}
                                  to={`${isEnglish ? "/en/blogs" : "/blogs"}/${related.id}`}
                                  className="group grid min-w-0 grid-cols-[4.5rem_minmax(0,1fr)] gap-3 rounded-xl p-2 transition hover:bg-red-50"
                                >
                                  <div className="aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-red-800 to-orange-400">
                                    {image && (
                                      <img
                                        src={image}
                                        alt=""
                                        loading="lazy"
                                        className="h-full w-full object-cover"
                                      />
                                    )}
                                  </div>
                                  <div className="min-w-0 self-center">
                                    <h3 className="line-clamp-2 break-words font-bold leading-snug text-slate-800 group-hover:text-red-800">
                                      {relatedTitle}
                                    </h3>
                                    <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-red-700">
                                      {isEnglish ? "Read story" : "লেখাটি পড়ুন"}
                                      <ArrowRight size={15} />
                                    </span>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-500">
                            {isEnglish
                              ? "No other stories yet."
                              : "এখনো অন্য কোনো লেখা নেই।"}
                          </p>
                        )}
                      </section>
                    </aside>
                  </div>
                </div>
              </div>
            );
          })()
        )}
      </main>
      <SiteFooter isEnglish={isEnglish} />
    </div>
  );
}
