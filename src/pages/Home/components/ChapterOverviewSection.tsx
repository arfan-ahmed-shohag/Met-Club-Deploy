import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { chapterDescriptions, type Chapter } from "./homeData";

export default function ChapterOverview({ isEnglish }: { isEnglish: boolean }) {
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const sliderRef = useRef<HTMLDivElement>(null);
    const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });
    const pauseAutoSlideRef = useRef(false);

    useEffect(() => {
        const controller = new AbortController();
        const file = isEnglish ? "/chapter.en.json" : "/chapter.json";
        fetch(file, { signal: controller.signal })
            .then((response) => {
                if (!response.ok) throw new Error("Could not load chapters");
                return response.json() as Promise<Chapter[]>;
            })
            .then((data) => setChapters(data.slice(0, 10)))
            .catch(() => {
                if (!controller.signal.aborted) setChapters([]);
            });
        return () => controller.abort();
    }, [isEnglish]);

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            const slider = sliderRef.current;
            const firstCard = slider?.firstElementChild as HTMLElement | null;
            if (!slider || !firstCard || pauseAutoSlideRef.current || document.hidden) return;

            const gap = Number.parseFloat(window.getComputedStyle(slider).columnGap) || 0;
            const step = firstCard.getBoundingClientRect().width + gap;
            const atEnd = slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - step / 2;

            if (atEnd) slider.scrollTo({ left: 0, behavior: "smooth" });
            else slider.scrollBy({ left: step, behavior: "smooth" });
        }, 4000);

        return () => window.clearInterval(intervalId);
    }, []);

    const slide = (direction: -1 | 1) => {
        sliderRef.current?.scrollBy({ left: direction * 340, behavior: "smooth" });
    };

    return (
        <section className="bg-linear-to-b from-white to-red-50/70 py-[60px] lg:py-[80px]" aria-labelledby="chapter-overview-title">
            <div className="site-container px-4 sm:px-6 lg:px-8">
                <div className="mb-5 text-center sm:mb-6">
                    <p className="mb-2 text-sm font-bold uppercase tracking-[.16em] text-red-600">{isEnglish ? "MET CLUB LEARNING" : "মেট ক্লাবের শেখার জগৎ"}</p>
                    <h2 id="chapter-overview-title" className="text-[36px] font-black text-red-950">
                        {isEnglish ? "Learn about weather. Be ready." : "আবহাওয়া জানো, নিরাপদে থাকো"}
                    </h2>
                    <p className="mx-auto mt-2 max-w-2xl text-base font-normal leading-relaxed text-slate-600 sm:text-lg">
                        {isEnglish ? "From weather basics to disaster readiness, explore lessons that help build safer communities." : "আবহাওয়ার পাঠ থেকে দুর্যোগ প্রস্তুতি - শেখার প্রতিটি ধাপে এগিয়ে চলো নিরাপদ কমিউনিটির পথে।"}
                    </p>
                </div>
                <div className="relative">
                    <button type="button" onClick={() => slide(-1)} aria-label={isEnglish ? "Previous chapters" : "আগের অধ্যায়"} className="absolute -left-5 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-red-100 bg-white text-red-700 shadow-md transition hover:bg-red-50"><ChevronLeft size={20} /></button>
                    <button type="button" onClick={() => slide(1)} aria-label={isEnglish ? "Next chapters" : "পরের অধ্যায়"} className="absolute -right-5 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-red-100 bg-white text-red-700 shadow-md transition hover:bg-red-50"><ChevronRight size={20} /></button>
                    <div
                    ref={sliderRef}
                    className="chapter-slider flex cursor-grab gap-4 overflow-x-auto px-1 pt-5 pb-10 active:cursor-grabbing sm:gap-5"
                    onMouseEnter={() => { pauseAutoSlideRef.current = true; }}
                    onMouseLeave={() => { pauseAutoSlideRef.current = false; }}
                    onPointerDown={(event) => {
                        pauseAutoSlideRef.current = true;
                        if (event.pointerType !== "mouse" || event.button !== 0 || !sliderRef.current) return;
                        dragRef.current = { active: true, startX: event.clientX, scrollLeft: sliderRef.current.scrollLeft, moved: false };
                    }}
                    onPointerMove={(event) => {
                        const drag = dragRef.current;
                        if (!drag.active || !sliderRef.current) return;
                        const delta = event.clientX - drag.startX;
                        if (Math.abs(delta) > 4) drag.moved = true;
                        sliderRef.current.scrollLeft = drag.scrollLeft - delta;
                    }}
                    onPointerUp={() => {
                        pauseAutoSlideRef.current = false;
                        if (!dragRef.current.active) return;
                        dragRef.current.active = false;
                        window.setTimeout(() => { dragRef.current.moved = false; }, 0);
                    }}
                    onPointerCancel={() => { dragRef.current.active = false; pauseAutoSlideRef.current = false; }}
                    onClickCapture={(event) => {
                        if (dragRef.current.moved) {
                            event.preventDefault();
                            event.stopPropagation();
                            dragRef.current.moved = false;
                        }
                    }}
                >
                    {chapters.map((chapter, index) => {
                        const description = chapterDescriptions[chapter.id];
                        return (
                            <Link
                                key={chapter.id}
                                to={isEnglish ? `/en/lesson/${chapter.id}` : `/lesson/${chapter.id}`}
                                draggable={false}
                                className="group w-[250px] shrink-0 overflow-hidden rounded-2xl border border-red-100 bg-white shadow-[0_5px_20px_rgba(127,29,29,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(127,29,29,0.14)] sm:w-[275px]"
                                style={{ animation: "fadeSlideUp .5s ease both", animationDelay: `${index * 55}ms` }}
                            >
                                <div className="relative h-40 overflow-hidden bg-gradient-to-br from-red-50 to-orange-50 sm:h-44">
                                    <img src={chapter.image} alt="" draggable={false} className="h-full w-full object-contain p-3 transition duration-500 group-hover:scale-105" />
                                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-red-700 shadow-sm">{isEnglish ? `CHAPTER ${chapter.id}` : `অধ্যায় ${chapter.id}`}</span>
                                </div>
                                <div className="p-4 sm:p-5">
                                    <h3 className="line-clamp-1 text-lg font-black text-red-950">{chapter.title}</h3>
                                    <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-relaxed text-slate-600">{description ? (isEnglish ? description.en : description.bn) : (isEnglish ? "Explore the topic and learn how it connects to everyday safety." : "বিষয়টি জেনে নাও এবং দৈনন্দিন নিরাপত্তার সঙ্গে এর সম্পর্ক বোঝো।")}</p>
                                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-red-700">{isEnglish ? "Explore chapter" : "অধ্যায়টি দেখো"}<span aria-hidden="true">→</span></span>
                                </div>
                            </Link>
                        );
                    })}
                    </div>
                </div>
            </div>
        </section>
    );
}
