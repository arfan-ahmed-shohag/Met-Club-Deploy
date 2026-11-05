import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, ArrowRight, PencilLine } from "lucide-react";
import toast from "react-hot-toast";
import TopNav from "../../components/Shared/TopBar";
import axiosPublic from "../../hooks/axiosPublic";
import useAxiosProtected from "../../hooks/axiosProtected";
import useAuth from "../../hooks/useAuth";
import { getStoredLocale } from "../../utils/language";
import { blogHtmlFirstImage, blogHtmlToText } from "../../utils/blogContent";
import { resolveMediaUrl } from "../../utils/media";

type BlogPost = {
    id: number;
    title: string;
    content: string;
    featuredImage: string | null;
    status: "pending" | "published";
    createdAt: string;
    publishedAt: string | null;
    author: { id: string; fullName: string; profileImg: string | null };
};

const PAGE_SIZE = 9;

export default function Blogs() {
    const publicApi = axiosPublic();
    const protectedApi = useAxiosProtected();
    const { user, isAuthenticated } = useAuth();
    const isEnglish = getStoredLocale() === "en";
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [myPostsState, setMyPostsState] = useState<{ userId: string; posts: BlogPost[] } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [page, setPage] = useState(1);
    const myPosts = myPostsState && myPostsState.userId === user?.id ? myPostsState.posts : [];

    useEffect(() => {
        let cancelled = false;
        publicApi.get("/blogs").then(({ data }) => {
            if (!cancelled) setPosts((data?.data || []) as BlogPost[]);
        }).catch((error: unknown) => {
            console.error("Failed to load blog posts:", error);
            if (!cancelled) setLoadError(true);
        }).finally(() => {
            if (!cancelled) setIsLoading(false);
        });
        return () => { cancelled = true; };
    }, [publicApi]);

    useEffect(() => {
        if (!isAuthenticated || user?.role !== "student") {
            return;
        }
        let cancelled = false;
        protectedApi.get("/blogs/mine").then(({ data }) => {
            if (!cancelled) setMyPostsState({ userId: user.id, posts: (data?.data || []) as BlogPost[] });
        }).catch((error: unknown) => {
            console.error("Failed to load your blog posts:", error);
            if (!cancelled) toast.error(isEnglish ? "Could not load your submissions." : "আপনার জমা দেওয়া ব্লগ আনা যায়নি।");
        });
        return () => { cancelled = true; };
    }, [isAuthenticated, isEnglish, protectedApi, user?.id, user?.role]);

    const pageCount = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
    const visiblePosts = posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const getDate = (post: BlogPost) => new Date(post.publishedAt || post.createdAt).toLocaleDateString(isEnglish ? "en-US" : "bn-BD", { year: "numeric", month: "short", day: "numeric" });

    return (
        <div className="min-h-screen overflow-x-hidden bg-slate-100 text-slate-900">
            <TopNav title={isEnglish ? "Community Blog" : "কমিউনিটি ব্লগ"} brandName={isEnglish ? "Met Club" : "মেট ক্লাব"} />

            <main className="site-container px-4 pb-14 pt-8 sm:px-6 lg:px-8 lg:pt-10">
                <section className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-red-700">{isEnglish ? "MET Club community" : "মেট ক্লাব কমিউনিটি"}</p>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">{isEnglish ? "Recent Stories" : "সাম্প্রতিক লেখা"}</h1>
                        <p className="mt-2 max-w-2xl text-base text-slate-600">{isEnglish ? "Explore stories and ideas shared by MET Club students." : "মেট ক্লাবের শিক্ষার্থীদের অভিজ্ঞতা, গল্প ও ভাবনা পড়ুন।"}</p>
                    </div>
                    <Link to={isEnglish ? "/en/blogs/write" : "/blogs/write"} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-5 py-3 font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:from-red-700 hover:to-orange-600">
                        {isEnglish ? "Write New Blog" : "নতুন ব্লগ লিখুন"}<PencilLine size={18} aria-hidden="true" />
                    </Link>
                </section>

                <section aria-label={isEnglish ? "Published stories" : "প্রকাশিত লেখা"}>
                    {isLoading ? (
                        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">{isEnglish ? "Loading stories…" : "লেখাগুলো লোড হচ্ছে…"}</div>
                    ) : loadError ? (
                        <div className="rounded-2xl border border-red-100 bg-white p-10 text-center text-red-700">{isEnglish ? "Stories could not be loaded. Please refresh." : "লেখাগুলো আনা যায়নি। আবার চেষ্টা করুন।"}</div>
                    ) : posts.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                            <h2 className="text-xl font-bold text-slate-800">{isEnglish ? "No published stories yet" : "এখনো কোনো লেখা প্রকাশিত হয়নি"}</h2>
                            <p className="mt-2 text-slate-500">{isEnglish ? "Student stories will appear here after admin review." : "Admin অনুমোদন করলে শিক্ষার্থীদের লেখা এখানে দেখা যাবে।"}</p>
                        </div>
                    ) : (
                        <div className="grid items-start gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            {visiblePosts.map((post) => {
                                const coverImage = post.featuredImage ? resolveMediaUrl(post.featuredImage) : blogHtmlFirstImage(post.content);
                                const excerpt = blogHtmlToText(post.content);
                                return (
                                    <article key={post.id} className="flex w-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.07)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(15,23,42,0.12)]">
                                        <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-gradient-to-br from-red-800 via-red-600 to-orange-400">
                                            {coverImage ? (
                                                <img src={coverImage} alt={post.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]" />
                                            ) : (
                                                <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.85),transparent_55%)]">
                                                    <span className="rounded-full border border-white/40 bg-white/15 px-4 py-2 text-sm font-bold tracking-[0.15em] text-white">MET CLUB</span>
                                                </div>
                                            )}
                                            <span className="absolute left-3 top-3 rounded-full bg-red-700/90 px-3 py-1 text-xs font-bold text-white shadow">{isEnglish ? "Student story" : "শিক্ষার্থীর লেখা"}</span>
                                        </div>
                                        <div className="flex flex-1 flex-col px-1 pb-1 pt-4">
                                            <h2 className="line-clamp-2 text-xl font-bold leading-snug text-slate-900">{post.title}</h2>
                                            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                                                <span className="font-medium text-slate-600">{post.author.fullName}</span>
                                                <span aria-hidden="true">·</span>
                                                <time dateTime={post.publishedAt || post.createdAt}>{getDate(post)}</time>
                                            </div>
                                            <p className="mt-3 line-clamp-2 break-words text-[0.95rem] leading-6 text-slate-600">{excerpt}</p>
                                            <Link to={`${isEnglish ? "/en/blogs" : "/blogs"}/${post.id}`} className="mt-4 inline-flex w-fit items-center gap-2 font-bold text-red-700 transition hover:text-red-900">
                                                {isEnglish ? "Read More" : "আরও পড়ুন"}<ArrowRight size={17} aria-hidden="true" />
                                            </Link>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>

                {!isLoading && !loadError && pageCount > 1 && (
                    <nav aria-label={isEnglish ? "Blog pages" : "ব্লগ পৃষ্ঠা"} className="mt-8 flex flex-wrap items-center justify-center gap-2">
                        <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"><ArrowLeft size={16} />{isEnglish ? "Previous" : "আগের"}</button>
                        {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                            <button key={pageNumber} type="button" aria-current={page === pageNumber ? "page" : undefined} onClick={() => setPage(pageNumber)} className={`h-9 min-w-9 rounded-lg px-3 text-sm font-bold ${page === pageNumber ? "bg-red-700 text-white shadow" : "text-slate-700 hover:bg-white"}`}>
                                {pageNumber}
                            </button>
                        ))}
                        <button type="button" onClick={() => setPage((current) => Math.min(pageCount, current + 1))} disabled={page === pageCount} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40">{isEnglish ? "Next" : "পরের"}<ArrowRight size={16} /></button>
                    </nav>
                )}

                {user?.role === "student" && (
                    <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                        <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-end">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">{isEnglish ? "Your submissions" : "আপনার জমা দেওয়া লেখা"}</h2>
                                <p className="mt-1 text-sm text-slate-500">{isEnglish ? "Posts appear publicly after admin approval." : "Admin প্রকাশ করলে তবেই লেখা সবার ব্লগে দেখা যাবে।"}</p>
                            </div>
                        </div>
                        {myPosts.length === 0 ? (
                            <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">{isEnglish ? "You have not submitted a blog yet." : "আপনি এখনো কোনো ব্লগ জমা দেননি।"}</p>
                        ) : (
                            <ul className="mt-3 divide-y divide-slate-100">
                                {myPosts.map((post) => (
                                    <li key={post.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                                        <span className="font-semibold text-slate-800">{post.title}</span>
                                        <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${post.status === "published" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                                            {post.status === "published" ? (isEnglish ? "Published" : "প্রকাশিত") : (isEnglish ? "Pending review" : "অনুমোদনের অপেক্ষায়")}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                )}
            </main>

        </div>
    );
}
