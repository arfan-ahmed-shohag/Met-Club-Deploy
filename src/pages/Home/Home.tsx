import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import coverVideo from "../../assets/videos/Drone shot for cover.mp4";
import childrenLearningImage from "../../assets/images/citizen_science_img-cutout.webp";
import TopNav from "../../components/Shared/TopBar";
import WeatherCanvas from "../../components/Shared/WeatherCanvas";
import { useLocaleRouteSync } from "../../hooks/useLocaleRouteSync";
import { getStoredLocale } from "../../utils/language";

type Chapter = {
    id: number;
    title: string;
    image: string;
    borderColor?: string;
};

const chapterDescriptions: Record<number, { bn: string; en: string }> = {
    1: { bn: "আবহাওয়া ও জলবায়ুর পার্থক্য এবং আমাদের চারপাশের পরিবর্তন চিনে নাও।", en: "Understand weather, climate, and the changes we see around us." },
    2: { bn: "পূর্বাভাস কেন বদলাতে পারে এবং অনিশ্চয়তার মাঝেও কীভাবে প্রস্তুত থাকতে হয় জানো।", en: "Learn why forecasts can change and how to prepare when outcomes are uncertain." },
    3: { bn: "বাষ্পীভবন থেকে বৃষ্টিপানির চক্র কীভাবে কাজ করে আবিষ্কার করো।", en: "Discover how water moves through evaporation, clouds, and rain." },
    4: { bn: "নদী, পানির প্রবাহ আর তোমার এলাকার সঙ্গে তাদের সম্পর্ক বুঝে নাও।", en: "Explore rivers, water flow, and how they shape your local area." },
    5: { bn: "বন্যার কারণ, আগাম সংকেত এবং নিরাপদ থাকার উপায় শিখে নাও।", en: "Learn what causes floods, how to spot warnings, and how to stay safe." },
    6: { bn: "স্কুল দুর্যোগ ব্যবস্থাপনা কমিটি কীভাবে সবাইকে প্রস্তুত রাখে জানো।", en: "See how a school disaster management committee helps everyone prepare." },
    7: { bn: "স্কুলের ঝুঁকি চিহ্নিত করে নিরাপদ করার উপায় খুঁজে বের করো।", en: "Identify hazards at school and find practical ways to make it safer." },
    8: { bn: "স্থানীয় অভিজ্ঞতা ও ঐতিহ্যবাহী জ্ঞান থেকে দুর্যোগ মোকাবিলা শিখো।", en: "Learn how local experience and traditional knowledge help communities." },
    9: { bn: "ঘূর্ণিঝড়ের সংকেত বুঝে আগে থেকেই নিরাপদ হওয়ার প্রস্তুতি নাও।", en: "Understand cyclone warnings and get ready to move to safety." },
    10: { bn: "জরুরি সময়ে দরকারি জিনিস নিয়ে নিজের Go-Bag তৈরি করো।", en: "Build a Go-Bag with the essentials you may need in an emergency." },
};

function ChapterOverview({ isEnglish }: { isEnglish: boolean }) {
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
        <section className="bg-linear-to-b from-white to-red-50/70 py-14 sm:py-18" aria-labelledby="chapter-overview-title">
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
                    className="chapter-slider flex cursor-grab gap-4 overflow-x-auto pb-5 active:cursor-grabbing sm:gap-5"
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

export default function HomePage() {
    useLocaleRouteSync("/", "/en");
    const isEnglish = getStoredLocale() === "en";
    const t = (bangla: string, english: string) => isEnglish ? english : bangla;
    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-gray-50">
            <TopNav title={t("হোম", "Home")} brandName={t("মেট ক্লাব", "Met Club")} />
            <main className="relative flex flex-1 items-center overflow-hidden isolate">
                <video autoPlay loop muted playsInline className="absolute inset-0 z-0 h-full w-full object-cover" aria-hidden="true"><source src={coverVideo} type="video/mp4" /></video>
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-red-950/85 via-red-950/65 to-slate-950/35" />
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
                <WeatherCanvas />
                <div className="site-container relative z-20 grid min-h-[min(820px,calc(100svh-4rem))] items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.08fr_.92fr] lg:gap-16">
                    <div className="max-w-2xl text-white">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-4 py-2 text-sm font-bold shadow-lg backdrop-blur-md"><Sparkles className="h-4 w-4 text-amber-300" />{t("শিশুদের জন্য আবহাওয়া ও দুর্যোগ সচেতনতা", "Weather and disaster learning for every child")}</div>
                        <h1 className="mb-5 text-4xl font-black leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl" style={{ textShadow: "0 4px 24px rgba(0,0,0,.32)" }}>{t("আবহাওয়া শিখি,", "Learn about weather,")}<br /><span className="text-red-200">{t("নিরাপদ সমাজ গড়ি", "build safer communities")}</span></h1>
                        <p className="max-w-xl text-base font-normal leading-relaxed text-white/90 sm:text-lg">{t("খেলার ছলে আবহাওয়া পর্যবেক্ষণ, হাতে-কলমে শেখা আর দুর্যোগ প্রস্তুতির মাধ্যমে শিশুরা নিজেদের কমিউনিটিকে নিরাপদ রাখতে শিখবে।", "MET Club helps children explore weather, practice observation, and build disaster readiness so they can help keep their communities safe.")}</p>
                        <div className="mt-8 flex flex-wrap gap-3"><Link to={isEnglish ? "/en/start-journey" : "/start-journey"} className="inline-flex items-center justify-center rounded-xl bg-red-600 px-6 py-3.5 font-bold text-white shadow-xl shadow-red-950/25 transition hover:-translate-y-0.5 hover:bg-red-500">{t("শেখা শুরু করি", "Start learning")}</Link><Link to={isEnglish ? "/en/about" : "/about"} className="inline-flex items-center justify-center rounded-xl border border-white/50 bg-white/10 px-6 py-3.5 font-bold text-white backdrop-blur transition hover:bg-white/20">{t("মেট ক্লাব সম্পর্কে", "About MET Club")}</Link></div>
                        <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold text-white/90">{[
                            t("আবহাওয়া পর্যবেক্ষণ", "Weather observation"),
                            t("হাতে-কলমে অনুশীলন", "Hands-on practice"),
                            t("দুর্যোগ প্রস্তুতি", "Disaster readiness"),
                        ].map((item, index) => <span key={item} className="inline-flex items-center gap-2"><span aria-hidden="true" className="hero-feature-dot h-2 w-2 rounded-full bg-red-300 shadow-[0_0_12px_rgba(252,165,165,.9)]" style={{ animationDelay: `${index * 220}ms` }} />{item}</span>)}</div>
                    </div>
                    <div className="relative mx-auto w-full max-w-[520px] animate-float"><div className="absolute -inset-5 rounded-[2.5rem] bg-red-400/20 blur-3xl" /><div className="relative overflow-hidden rounded-[2rem] border border-white/40 bg-white/90 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-7">
                        <div className="flex items-center justify-between border-b border-red-100 pb-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-red-500">MET CLUB</p><h2 className="mt-1 text-xl font-black text-red-950 sm:text-2xl">{t("তোমার শেখার যাত্রা", "Your learning journey")}</h2></div><div className="grid h-12 w-12 place-items-center rounded-2xl bg-red-100 text-2xl" aria-hidden="true">{String.fromCodePoint(0x1f326,0xfe0f)}</div></div>
                        <div className="mt-5 grid gap-3">{[
                            { icon: String.fromCodePoint(0x1f324,0xfe0f), title: t("আবহাওয়া জানি", "Explore the weather"), desc: t("মেঘ, বৃষ্টি ও আবহাওয়ার সংকেত", "Clouds, rain, and weather signals"), color: "bg-amber-50" },
                            { icon: String.fromCodePoint(0x1f50e), title: t("দেখি ও অনুশীলন করি", "Observe and practice"), desc: t("কুইজ, গল্প ও হাতে-কলমে কাজ", "Quizzes, stories, and activities"), color: "bg-rose-50" },
                            { icon: String.fromCodePoint(0x1f6e1,0xfe0f), title: t("প্রস্তুত থাকি", "Be ready"), desc: t("নিজে ও কমিউনিটিকে নিরাপদ রাখি", "Help keep people around us safe"), color: "bg-orange-50" },
                        ].map((item, index) => <div key={item.title} className={"flex items-center gap-4 rounded-2xl " + item.color + " p-4 transition duration-300 hover:translate-x-1"} style={{ animation: "fadeSlideUp .6s ease both " + (index * 140) + "ms" }}><div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white text-2xl shadow-sm" aria-hidden="true">{item.icon}</div><div><h3 className="font-black text-red-950">{item.title}</h3><p className="mt-0.5 text-sm text-slate-600">{item.desc}</p></div><span className="ml-auto text-lg font-bold text-red-400" aria-hidden="true">&gt;</span></div>)}</div>
                        <div className="mt-5 flex items-center justify-between rounded-xl bg-red-900 px-4 py-3 text-white"><span className="text-sm font-bold">{t("কৌতূহল থেকে আত্মবিশ্বাস", "Curiosity grows into confidence")}</span><span className="text-xl" aria-hidden="true">*</span></div>
                    </div><div className="absolute -left-5 top-1/3 hidden h-14 w-14 animate-float-delayed place-items-center rounded-2xl border border-white/50 bg-white/90 text-2xl shadow-lg sm:grid" aria-hidden="true">{String.fromCodePoint(0x2600,0xfe0f)}</div><div className="absolute -right-4 bottom-10 hidden h-14 w-14 animate-float-delayed place-items-center rounded-2xl border border-white/50 bg-white/90 text-2xl shadow-lg sm:grid" aria-hidden="true">{String.fromCodePoint(0x1f327,0xfe0f)}</div></div>
                </div>
            </main>
            <ChapterOverview isEnglish={isEnglish} />
            <section className="relative overflow-hidden bg-white py-16 sm:py-24" aria-labelledby="about-met-club-title">
                <div className="site-container relative grid items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
                    <div className="relative mx-auto flex min-h-[300px] w-full max-w-xl items-center justify-center sm:min-h-[390px]">
                        <div className="absolute h-64 w-64 rounded-full bg-gradient-to-br from-red-100 to-orange-100 sm:h-80 sm:w-80" />
                        <div className="absolute h-72 w-72 rounded-full border border-red-200/70 sm:h-[22rem] sm:w-[22rem]" />
                        <img src={childrenLearningImage} alt={isEnglish ? "Children learning through weather observation" : "আবহাওয়া পর্যবেক্ষণের মাধ্যমে শিশুদের শেখা"} className="relative z-10 w-full max-w-[440px] animate-float object-contain drop-shadow-[0_20px_24px_rgba(127,29,29,0.12)]" />
                        <span className="absolute right-[8%] top-[12%] grid h-14 w-14 animate-float-delayed place-items-center rounded-2xl bg-white text-2xl shadow-lg" aria-hidden="true">{String.fromCodePoint(0x1f326,0xfe0f)}</span>
                        <span className="absolute bottom-[14%] left-[5%] grid h-12 w-12 animate-float place-items-center rounded-2xl bg-white text-xl shadow-lg" aria-hidden="true">{String.fromCodePoint(0x1f50d)}</span>
                    </div>
                    <div className="max-w-xl text-center lg:text-left">
                        <p className="mb-3 text-sm font-bold uppercase tracking-[.16em] text-red-600">{isEnglish ? "ABOUT MET CLUB" : "মেট ক্লাব কী"}</p>
                        <h2 id="about-met-club-title" className="title-anim text-[36px] font-black leading-tight text-red-950">
                            {isEnglish ? "Curiosity today. Safer communities tomorrow." : "কৌতূহলী শিশুরাই গড়বে নিরাপদ আগামী"}
                        </h2>
                        <p className="sub-anim mt-5 text-base font-normal leading-relaxed text-slate-700 sm:text-lg">
                            {isEnglish
                                ? "At MET Club, children explore changing weather, understand early warnings, and practice what to do during disasters. Through hands-on activities, stories, and quizzes, they turn curiosity into confidence. They take what they learn back to their families and friends, helping their whole community become more aware and prepared."
                                : "মেট ক্লাবে শিশুরা খেলার ছলে আবহাওয়ার পরিবর্তন পর্যবেক্ষণ করে, আগাম সতর্কতার অর্থ বোঝে এবং দুর্যোগের সময় কীভাবে নিরাপদ থাকতে হয় তা অনুশীলন করে। হাতে-কলমে কাজ, গল্প ও কুইজের মাধ্যমে তারা শেখাকে আত্মবিশ্বাসে বদলে নেয়। শেখা বিষয়গুলো পরিবার ও বন্ধুদের সঙ্গে ভাগ করে নিয়ে তারা নিজেদের কমিউনিটিকে আরও সচেতন ও প্রস্তুত করতে ভূমিকা রাখে।"}
                        </p>
                        <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-bold text-red-800 lg:justify-start">
                            {[isEnglish ? "Weather learning" : "আবহাওয়া শিক্ষা", isEnglish ? "Early warnings" : "আগাম সতর্কতা", isEnglish ? "Community safety" : "কমিউনিটির নিরাপত্তা"].map((item, index) => <span key={item} className="inline-flex items-center gap-2"><span aria-hidden="true" className="hero-feature-dot h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,.45)]" style={{ animationDelay: `${index * 220}ms` }} />{item}</span>)}
                        </div>
                        <Link to={isEnglish ? "/en/about" : "/about"} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-bold text-white shadow-lg shadow-red-900/15 transition hover:-translate-y-0.5 hover:bg-red-800">
                            {isEnglish ? "Learn more" : "আরও জানুন"}<span aria-hidden="true">{String.fromCodePoint(0x2192)}</span>
                        </Link>
                    </div>
                </div>
            </section>
            <footer className="relative z-20 bg-red-950 py-4 text-center text-sm text-white"><a href="http://cdsr.com.bd" target="_blank" rel="noopener noreferrer">{t("পরিকল্পনা ও বাস্তবায়ন: Centre for Data Science Research (CDSR)", "Developed by Centre for Data Science Research (CDSR)")}</a></footer>
        </div>
    );
}



