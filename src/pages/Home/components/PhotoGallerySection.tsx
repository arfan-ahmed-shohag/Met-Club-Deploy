import { useEffect, useState } from "react";
import type { JSX } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
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
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const pageCount = Math.ceil(total / PAGE_SIZE);

    useEffect(() => {
        if (!selectedImage) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setSelectedImage(null);
        };
        window.addEventListener("keydown", closeOnEscape);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", closeOnEscape);
        };
    }, [selectedImage]);

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
                    {images.map((image, index) => {
                        const accessibleAlt = image.alt || (isEnglish ? `MET Club moment ${index + 1}` : `মেট ক্লাবের মুহূর্ত ${index + 1}`);
                        const imageContent = <>
                            <img src={resolveMediaUrl(image.imageUrl)} alt="" loading="lazy" draggable={false} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-red-950/25 via-transparent to-transparent opacity-60" />
                        </>;
                        return (
                            <div key={`${copy}-${image.id}`} className="group relative h-[160px] w-[255px] shrink-0 overflow-hidden rounded-xl border border-red-100 shadow-sm md:h-[360px] md:w-[560px]">
                                {copy === 0 ? (
                                    <button type="button" onClick={() => setSelectedImage(image)} aria-label={isEnglish ? `View larger: ${accessibleAlt}` : `বড় করে দেখুন: ${accessibleAlt}`} className="absolute inset-0 block h-full w-full cursor-zoom-in text-left focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-red-600">
                                        {imageContent}
                                    </button>
                                ) : <div aria-hidden="true" className="absolute inset-0">{imageContent}</div>}
                            </div>
                        );
                    })}
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
            {selectedImage && (
                <div className="gallery-lightbox-backdrop fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm sm:p-8" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedImage(null); }} role="dialog" aria-modal="true" aria-label={isEnglish ? "Expanded gallery image" : "বড় করে দেখা গ্যালারি ছবি"}>
                    <button type="button" autoFocus onClick={() => setSelectedImage(null)} aria-label={isEnglish ? "Close image preview" : "ছবির preview বন্ধ করুন"} className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-black/40 text-white transition hover:rotate-90 hover:bg-black/70 sm:right-7 sm:top-7"><X size={23} /></button>
                    <figure className="gallery-lightbox-image max-h-full max-w-full" onMouseDown={(event) => event.stopPropagation()}>
                        <img src={resolveMediaUrl(selectedImage.imageUrl)} alt={selectedImage.alt || (isEnglish ? "MET Club gallery photo" : "মেট ক্লাবের গ্যালারির ছবি")} className="max-h-[82vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl sm:max-h-[86vh]" />
                        {selectedImage.alt && <figcaption className="mt-3 text-center text-sm font-medium text-white/90">{selectedImage.alt}</figcaption>}
                    </figure>
                </div>
            )}
        </section>
    );
}
