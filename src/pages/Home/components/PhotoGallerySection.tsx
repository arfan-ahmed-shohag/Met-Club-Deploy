import { useEffect, useState } from "react";
import type { JSX } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import axiosPublic from "../../../hooks/axiosPublic";
import { resolveMediaUrl } from "../../../utils/media";

const PAGE_SIZE = 10;

type GalleryImage = {
    id: string;
    imageUrl: string;
    alt: string;
};

export default function PhotoGallerySection({ isEnglish }: { isEnglish: boolean }): JSX.Element {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const pageCount = Math.ceil(total / PAGE_SIZE);

    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);
        setHasError(false);
        void axiosPublic().get("/gallery", { params: { page, limit: PAGE_SIZE } })
            .then(({ data }) => {
                if (cancelled) return;
                setImages(Array.isArray(data?.data) ? data.data.slice(0, PAGE_SIZE) : []);
                setTotal(Number(data?.meta?.total) || 0);
            })
            .catch(() => {
                if (!cancelled) {
                    setImages([]);
                    setHasError(true);
                }
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });
        return () => { cancelled = true; };
    }, [page]);

    const renderRow = (reverse = false) => (
        <div className={`gallery-marquee-track flex w-max ${reverse ? "gallery-marquee-reverse" : ""}`}>
            {[0, 1].map((copy) => (
                <div key={copy} className="flex shrink-0 gap-4 pr-4" aria-hidden={copy === 1}>
                    {images.map((image, index) => (
                        <div key={`${copy}-${image.id}`} className="group relative h-[160px] w-[255px] shrink-0 overflow-hidden rounded-xl border border-red-100 shadow-sm md:h-[360px] md:w-[560px]">
                            <img
                                src={resolveMediaUrl(image.imageUrl)}
                                alt={copy === 0 ? (image.alt || (isEnglish ? `MET Club moment ${index + 1}` : `মেট ক্লাবের মুহূর্ত ${index + 1}`)) : ""}
                                loading="lazy"
                                draggable={false}
                                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-red-950/25 via-transparent to-transparent opacity-60" />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );

    return (
        <section className="overflow-hidden bg-red-50/60 py-[60px] lg:py-[80px]" aria-labelledby="photo-gallery-title">
            <div className="mb-8 flex flex-col items-center gap-5 px-4 text-center sm:mb-10">
                <div>
                    <p className="mb-2 text-sm font-bold uppercase tracking-[.16em] text-red-600">{isEnglish ? "MET CLUB MOMENTS" : "মেট ক্লাবের মুহূর্ত"}</p>
                    <h2 id="photo-gallery-title" className="text-[36px] font-black text-red-950">{isEnglish ? "Learning, exploring, growing" : "শিখি, দেখি, একসাথে এগিয়ে যাই"}</h2>
                    <p className="mx-auto mt-2 max-w-2xl text-base font-normal leading-relaxed text-slate-600 sm:text-lg">{isEnglish ? "A glimpse of the curiosity, teamwork, and discovery that make learning meaningful." : "কৌতূহল, দলগত কাজ আর নতুন কিছু আবিষ্কারের মধ্য দিয়ে শেখার কিছু মুহূর্ত।"}</p>
                </div>
                {pageCount > 1 && (
                    <nav className="flex items-center gap-3" aria-label={isEnglish ? "Gallery pages" : "গ্যালারি পৃষ্ঠা"}>
                        <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1 || isLoading} aria-label={isEnglish ? "Previous gallery images" : "আগের ছবিগুলো"} className="grid h-10 w-10 place-items-center rounded-full border border-red-200 bg-white text-red-700 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"><ArrowLeft size={18} /></button>
                        <span className="min-w-16 text-sm font-semibold text-red-900">{page} / {pageCount}</span>
                        <button type="button" onClick={() => setPage((current) => Math.min(pageCount, current + 1))} disabled={page >= pageCount || isLoading} aria-label={isEnglish ? "Next gallery images" : "পরের ছবিগুলো"} className="grid h-10 w-10 place-items-center rounded-full border border-red-200 bg-white text-red-700 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"><ArrowRight size={18} /></button>
                    </nav>
                )}
            </div>
            {images.length > 0 ? (
                <div className={`gallery-marquee space-y-4 md:space-y-5 ${isLoading ? "opacity-60" : ""}`} aria-label={isEnglish ? "MET Club photo gallery" : "মেট ক্লাবের ফটো গ্যালারি"} aria-busy={isLoading}>
                    {renderRow()}
                    {renderRow(true)}
                </div>
            ) : (
                <p className="mx-auto max-w-xl px-4 py-12 text-center text-slate-600" role={hasError ? "alert" : "status"}>
                    {isLoading
                        ? (isEnglish ? "Loading gallery images…" : "গ্যালারির ছবি লোড হচ্ছে…")
                        : hasError
                            ? (isEnglish ? "Gallery images could not be loaded." : "গ্যালারির ছবি লোড করা যায়নি।")
                            : (isEnglish ? "Gallery photos will appear here soon." : "গ্যালারির ছবি শিগগিরই এখানে দেখা যাবে।")}
                </p>
            )}
        </section>
    );
}
