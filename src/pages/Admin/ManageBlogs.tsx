import { useCallback, useEffect, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { Eye, Send } from "lucide-react";
import useAxiosProtected from "../../hooks/axiosProtected";
import { sanitizeBlogHtml } from "../../utils/blogContent";
import { resolveMediaUrl } from "../../utils/media";

type BlogPost = {
    id: number;
    title: string;
    content: string;
    featuredImage: string | null;
    status: "pending" | "published";
    createdAt: string;
    publishedAt: string | null;
    author: { id: string; fullName: string; email: string };
};

type BlogFilter = "pending" | "published" | "all";

export default function ManageBlogs() {
    const axios = useAxiosProtected();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
    const [filter, setFilter] = useState<BlogFilter>("pending");
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [publishingId, setPublishingId] = useState<number | null>(null);

    const loadPosts = useCallback(async () => {
        setIsLoading(true);
        setLoadError("");
        try {
            const { data } = await axios.get("/blogs/admin");
            setPosts((data?.data || []) as BlogPost[]);
        } catch (error) {
            const message = isAxiosError(error) ? error.response?.data?.errorMessage : undefined;
            setLoadError(message || "Blog submissions could not be loaded.");
        } finally {
            setIsLoading(false);
        }
    }, [axios]);

    useEffect(() => {
        void loadPosts();
    }, [loadPosts]);

    const visiblePosts = useMemo(() => posts.filter((post) => filter === "all" || post.status === filter), [filter, posts]);

    const publishPost = async (post: BlogPost) => {
        setPublishingId(post.id);
        try {
            const { data } = await axios.patch(`/blogs/${post.id}/publish`);
            const published = (data?.data || { ...post, status: "published", publishedAt: new Date().toISOString() }) as BlogPost;
            setPosts((current) => current.map((item) => item.id === post.id ? published : item));
            setSelectedPost(null);
            toast.success("Blog published successfully.");
        } catch (error) {
            const message = isAxiosError(error) ? error.response?.data?.errorMessage : undefined;
            toast.error(message || "Blog could not be published.");
        } finally {
            setPublishingId(null);
        }
    };

    const filters: Array<{ id: BlogFilter; label: string }> = [
        { id: "pending", label: "Pending review" },
        { id: "published", label: "Published" },
        { id: "all", label: "All posts" },
    ];

    return (
        <div className="space-y-6">
            <section className="rounded-3xl border border-white/50 bg-white/85 p-6 shadow-xl backdrop-blur sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-red-700">Student writing</p>
                        <h2 className="mt-2 text-3xl font-black text-slate-900">Blog review</h2>
                        <p className="mt-2 text-slate-600">Review student submissions and publish posts for the public blog.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {filters.map((item) => (
                            <button key={item.id} type="button" onClick={() => setFilter(item.id)} className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${filter === item.id ? "bg-red-600 text-white shadow" : "bg-white text-slate-700 hover:bg-red-50"}`}>
                                {item.label}{item.id === "pending" ? ` (${posts.filter((post) => post.status === "pending").length})` : ""}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {isLoading ? (
                <div className="rounded-3xl bg-white/90 p-10 text-center text-slate-600">Loading submissions…</div>
            ) : loadError ? (
                <section className="rounded-3xl bg-white/90 p-8 text-center">
                    <p role="alert" className="text-red-700">{loadError}</p>
                    <button type="button" onClick={() => void loadPosts()} className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white">Try again</button>
                </section>
            ) : visiblePosts.length === 0 ? (
                <div className="rounded-3xl bg-white/90 p-10 text-center text-slate-600">{filter === "pending" ? "No blog posts are waiting for review." : "No blog posts found."}</div>
            ) : (
                <div className="overflow-hidden rounded-3xl border border-white/50 bg-white/90 shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[680px] text-left text-sm">
                            <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
                                <tr>
                                    <th className="px-5 py-4">Title</th>
                                    <th className="px-5 py-4">Student</th>
                                    <th className="px-5 py-4">Submitted</th>
                                    <th className="px-5 py-4">Status</th>
                                    <th className="px-5 py-4">Review</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visiblePosts.map((post) => (
                                    <tr key={post.id} className="border-t border-slate-200 align-top hover:bg-red-50/40">
                                        <td className="max-w-sm px-5 py-4 font-semibold text-slate-900">{post.title}</td>
                                        <td className="px-5 py-4 text-slate-700">
                                            <div>{post.author.fullName}</div>
                                            <div className="mt-1 text-xs text-slate-500">{post.author.email}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-4 text-slate-600">{new Date(post.createdAt).toLocaleDateString("en-GB")}</td>
                                        <td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${post.status === "published" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>{post.status}</span></td>
                                        <td className="px-5 py-4">
                                            <button type="button" onClick={() => setSelectedPost(post)} className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 font-semibold text-red-700 shadow-sm ring-1 ring-slate-200 hover:bg-red-50">
                                                <Eye size={16} /> Review
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {selectedPost && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedPost(null); }}>
                    <section role="dialog" aria-modal="true" aria-label={selectedPost.title} className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-9">
                        <button type="button" onClick={() => setSelectedPost(null)} aria-label="Close review" className="absolute right-4 top-4 rounded-full px-3 py-1 text-2xl text-slate-500 hover:bg-slate-100">×</button>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">{selectedPost.status}</p>
                        {selectedPost.featuredImage && <img src={resolveMediaUrl(selectedPost.featuredImage)} alt={selectedPost.title} className="blog-featured-image mt-6 max-h-[26rem] rounded-xl" />}
                        <h3 className="mt-2 pr-10 text-2xl font-black text-slate-900 sm:text-3xl">{selectedPost.title}</h3>
                        <p className="mt-3 text-sm text-slate-500">{selectedPost.author.fullName} · {selectedPost.author.email} · {new Date(selectedPost.createdAt).toLocaleString("en-GB")}</p>
                        <div className="blog-rich-content mt-7 text-base leading-8 text-slate-700" dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(selectedPost.content) }} />
                        {selectedPost.status === "pending" && (
                            <div className="mt-8 flex justify-end border-t border-slate-200 pt-5">
                                <button type="button" onClick={() => void publishPost(selectedPost)} disabled={publishingId === selectedPost.id} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white shadow transition hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-60">
                                    <Send size={17} /> {publishingId === selectedPost.id ? "Publishing…" : "Publish blog"}
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            )}
        </div>
    );
}
