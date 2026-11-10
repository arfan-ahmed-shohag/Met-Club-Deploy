import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowRight, BookOpen, UserRound } from "lucide-react";
import TopNav from "../../components/Shared/TopBar";
import axiosPublic from "../../hooks/axiosPublic";
import { getStoredLocale } from "../../utils/language";
import { blogHtmlFirstImage, blogHtmlWithoutFirstImage, sanitizeBlogHtml } from "../../utils/blogContent";
import { resolveMediaUrl } from "../../utils/media";
import { profileImageUrl } from "../../lib/profile";

type BlogPost = {
    id: string;
    title: string;
    content: string;
    featuredImage: string | null;
    createdAt: string;
    publishedAt: string | null;
    author: { id: string; fullName: string; profileImg: string | null };
};

export default function BlogDetails() {
    const { id } = useParams<{ id: string }>();
    const publicApi = axiosPublic();
    const isEnglish = getStoredLocale() === "en";
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const post = posts.find((item) => String(item.id) === id);
    const relatedPosts = posts.filter((item) => String(item.id) !== id).slice(0, 3);

    useEffect(() => {
        let cancelled = false;
        publicApi.get("/blogs").then(({ data }) => {
            if (!cancelled) setPosts((data?.data || []) as BlogPost[]);
        }).catch((error: unknown) => {
            console.error("Failed to load blog post:", error);
            if (!cancelled) setLoadError(true);
        }).finally(() => {
            if (!cancelled) setIsLoading(false);
        });
        return () => { cancelled = true; };
    }, [publicApi]);

    const getDate = (item: BlogPost) => new Date(item.publishedAt || item.createdAt).toLocaleDateString(isEnglish ? "en-US" : "bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const bannerTitle = isEnglish ? "Our Blog Details" : "ব্লগের বিস্তারিত";
    const welcomeTitle = isEnglish ? "Welcome to the MET Club Blog" : "মেট ক্লাব ব্লগে স্বাগতম";
    const welcomeText = isEnglish
        ? "Stories and ideas from MET Club students. Read their experiences, learn from each other, and explore the work happening in our community."
        : "মেট ক্লাবের শিক্ষার্থীদের অভিজ্ঞতা ও ভাবনার লেখা। তাঁদের গল্প পড়ুন, একে অন্যের কাছ থেকে শিখুন, আর আমাদের কমিউনিটির কাজগুলো জানুন।";

    return (
        <div className="min-h-screen overflow-x-hidden bg-slate-100 text-slate-900">
            <TopNav title={isEnglish ? "Community Blog" : "কমিউনিটি ব্লগ"} brandName={isEnglish ? "Met Club" : "মেট ক্লাব"} />
            <main className="w-full bg-white">
                {isLoading ? (
                    <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 lg:px-10">
                        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500" role="status">
                            {isEnglish ? "Loading story…" : "লেখাটি লোড হচ্ছে…"}
                        </div>
                    </div>
                ) : loadError ? (
                    <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 lg:px-10">
                        <div className="rounded-2xl border border-red-100 bg-white p-10 text-center text-red-700" role="alert">
                            {isEnglish ? "This story could not be loaded. Please try again." : "লেখাটি আনা যায়নি। আবার চেষ্টা করুন।"}
                        </div>
                    </div>
                ) : !post ? (
                    <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 lg:px-10">
                        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                            <h1 className="text-2xl font-bold text-slate-800">{isEnglish ? "Story not found" : "লেখাটি পাওয়া যায়নি"}</h1>
                            <p className="mt-2 text-slate-600">{isEnglish ? "It may have been removed or is no longer public." : "লেখাটি সরানো হয়েছে অথবা এখন আর প্রকাশিত নেই।"}</p>
                        </div>
                    </div>
                ) : (() => {
                    const inlineCover = post.featuredImage ? null : blogHtmlFirstImage(post.content);
                    const coverImage = post.featuredImage ? resolveMediaUrl(post.featuredImage) : inlineCover;
                    const articleContent = inlineCover ? blogHtmlWithoutFirstImage(post.content) : post.content;

                    return (
                        <div className="w-full">
                            <header className="relative isolate flex min-h-44 flex-col items-center justify-center overflow-hidden bg-linear-to-br from-[#713941] via-[#85464b] to-[#975656] px-6 py-10 text-center text-white sm:min-h-52 pt-28">
                                <div aria-hidden="true" className="pointer-events-none absolute -left-10 top-0 -z-10 h-44 w-44 rounded-full border-[28px] border-white/5" />
                                <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 right-10 -z-10 h-52 w-52 rounded-full border-[34px] border-orange-200/10" />
                                <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{bannerTitle}</h1>
                                <p className="mt-2 max-w-2xl text-sm text-red-50 sm:text-base">{isEnglish ? "Stories shared by our student community" : "আমাদের শিক্ষার্থী কমিউনিটির লেখা ও অভিজ্ঞতা"}</p>
                            </header>

                            <div className="grid min-w-0 gap-8 p-5 sm:p-8 lg:gap-10 lg:p-10 site-container">
                                <section className="border-b border-slate-200 pb-5">
                                    <div className="flex items-center gap-2 text-red-700">
                                        <BookOpen size={19} aria-hidden="true" />
                                        <h2 className="text-xl font-bold text-slate-900">{welcomeTitle}</h2>
                                    </div>
                                    <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">{welcomeText}</p>
                                </section>

                                {coverImage && (
                                    <img src={coverImage} alt={post.title} className="h-120 rounded-xl bg-slate-100 w-full object-cover" />
                                )}
                                <div className="mt-7 grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-12">
                                    <article className="min-w-0 w-full max-w-300 lg:col-span-8">
                                        <div>
                                            <div className="mb-5">
                                                <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-700">{isEnglish ? "Student story" : "শিক্ষার্থীর লেখা"}</p>
                                                <h2 className="mt-2 wrap-break-word text-2xl font-black leading-tight text-slate-900 sm:text-3xl">{post.title}</h2>
                                                <p className="mt-3 text-sm text-slate-500">
                                                    {post.author.fullName} <span aria-hidden="true">·</span> <time dateTime={post.publishedAt || post.createdAt}>{getDate(post)}</time>
                                                </p>
                                            </div>
                                            <div className="blog-rich-content min-w-0 text-base leading-8 text-slate-700" dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(articleContent) }} />
                                        </div>
                                    </article>

                                    <aside className="min-w-0 w-full max-w-xl space-y-5 lg:col-span-4 lg:justify-self-end">
                                        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                            <h2 className="text-lg font-bold text-slate-900">{isEnglish ? "Written by" : "লেখক"}</h2>
                                            <div className="mt-4 flex min-w-0 items-center gap-3">
                                                {post.author.profileImg ? (
                                                    <img src={profileImageUrl(post.author.profileImg)} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
                                                ) : (
                                                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-red-100 text-red-700"><UserRound size={20} /></span>
                                                )}
                                                <div className="min-w-0">
                                                    <p className="wrap-break-word font-bold text-slate-800">{post.author.fullName}</p>
                                                    <p className="mt-1 text-xs text-slate-500">{isEnglish ? "MET Club student" : "মেট ক্লাব শিক্ষার্থী"}</p>
                                                </div>
                                            </div>
                                        </section>

                                        <section className="rounded-2xl border border-slate-200 bg-white p-5">
                                            <div className="mb-4 border-b border-slate-200 pb-3">
                                                <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-700">MET CLUB</p>
                                                <h2 className="mt-1 text-lg font-black text-slate-900">{isEnglish ? "More stories" : "আরও লেখা"}</h2>
                                            </div>
                                            {relatedPosts.length ? (
                                                <div className="space-y-3">
                                                    {relatedPosts.map((related) => {
                                                        const image = related.featuredImage
                                                            ? resolveMediaUrl(related.featuredImage)
                                                            : blogHtmlFirstImage(related.content);
                                                        return (
                                                            <Link key={related.id} to={`${isEnglish ? "/en/blogs" : "/blogs"}/${related.id}`} className="group grid min-w-0 grid-cols-[4.5rem_minmax(0,1fr)] gap-3 rounded-xl p-2 transition hover:bg-red-50">
                                                                <div className="aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-red-800 to-orange-400">
                                                                    {image && <img src={image} alt="" loading="lazy" className="h-full w-full object-cover" />}
                                                                </div>
                                                                <div className="min-w-0 self-center">
                                                                    <h3 className="line-clamp-2 break-words font-bold leading-snug text-slate-800 group-hover:text-red-800">{related.title}</h3>
                                                                    <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-red-700">{isEnglish ? "Read story" : "লেখাটি পড়ুন"}<ArrowRight size={15} /></span>
                                                                </div>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-slate-500">{isEnglish ? "No other stories yet." : "এখনো অন্য কোনো লেখা নেই।"}</p>
                                            )}
                                        </section>
                                    </aside>
                                </div>
                            </div>
                        </div>
                    );
                })()}
            </main>
        </div>
    );
}
