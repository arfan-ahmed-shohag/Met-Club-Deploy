import { ChevronLeft, ChevronRight, Eye, Globe2, Play, Sparkles, Users, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { JSX } from "react";
import { Link } from "react-router";
import coverVideo from "../../assets/videos/Drone shot for cover.mp4";
import childrenLearningImage from "../../assets/images/citizen_science_img-cutout.webp";
import reviewLearningImage from "../../assets/images/learning-zone-cutout-cutout.webp";
import reviewCommunityImage from "../../assets/images/citizen_science_img-cutout.webp";
import reviewReadinessImage from "../../assets/images/practice-zone-new-cutout.webp";
import logo from "../../assets/images/logo_original.png";
import Partners from "../../components/Shared/Partners";
import TopNav from "../../components/Shared/TopBar";
import WeatherCanvas from "../../components/Shared/WeatherCanvas";
import { useLocaleRouteSync } from "../../hooks/useLocaleRouteSync";
import axiosPublic from "../../hooks/axiosPublic";
import { getStoredLocale } from "../../utils/language";

type HomeVideo = { id: number; tutorialNumber: number; name: string; title: string; thumbnailImage: string; videoLink: string };

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

const galleryPhotos = [
    { src: "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=900&q=80", alt: "Students learning together" },
    { src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80", alt: "A classroom learning activity" },
    { src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80", alt: "Students at a school event" },
    { src: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=900&q=80", alt: "Students working in a group" },
    { src: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=900&q=80", alt: "Students sharing ideas" },
    { src: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=900&q=80", alt: "A group learning session" },
    { src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80", alt: "A community workshop" },
    { src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80", alt: "A team sharing knowledge" },
    { src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=900&q=80", alt: "Students learning in a classroom" },
    { src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80", alt: "A student studying" },
];

function PhotoGallery({ isEnglish }: { isEnglish: boolean }) {
    const renderRow = (reverse = false) => (
        <div className={`gallery-marquee-track flex w-max ${reverse ? "gallery-marquee-reverse" : ""}`}>
            {[0, 1].map((copy) => (
                <div key={copy} className="flex shrink-0 gap-4 pr-4" aria-hidden={copy === 1}>
                    {galleryPhotos.map((photo, index) => (
                        <div key={`${copy}-${photo.src}`} className="group relative h-[160px] w-[255px] shrink-0 overflow-hidden rounded-xl border border-red-100 shadow-sm md:h-[360px] md:w-[560px]">
                            <img src={photo.src} alt={copy === 0 ? (isEnglish ? photo.alt : `শেখার মুহূর্ত ${index + 1}`) : ""} loading="lazy" draggable={false} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-red-950/25 via-transparent to-transparent opacity-60" />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );

    return (
        <section className="overflow-hidden bg-red-50/60 py-[60px] lg:py-[80px]" aria-labelledby="photo-gallery-title">
            <div className="mb-8 px-4 text-center sm:mb-10">
                <p className="mb-2 text-sm font-bold uppercase tracking-[.16em] text-red-600">{isEnglish ? "MET CLUB MOMENTS" : "মেট ক্লাবের মুহূর্ত"}</p>
                <h2 id="photo-gallery-title" className="text-[36px] font-black text-red-950">{isEnglish ? "Learning, exploring, growing" : "শিখি, দেখি, একসাথে এগিয়ে যাই"}</h2>
                <p className="mx-auto mt-2 max-w-2xl text-base font-normal leading-relaxed text-slate-600 sm:text-lg">{isEnglish ? "A glimpse of the curiosity, teamwork, and discovery that make learning meaningful." : "কৌতূহল, দলগত কাজ আর নতুন কিছু আবিষ্কারের মধ্য দিয়ে শেখার কিছু মুহূর্ত।"}</p>
            </div>
            <div className="gallery-marquee space-y-4 md:space-y-5" aria-label={isEnglish ? "MET Club photo gallery" : "মেট ক্লাবের ফটো গ্যালারি"}>
                {renderRow()}
                {renderRow(true)}
            </div>
        </section>
    );
}

const getYoutubeId = (videoLink: string) => {
    try {
        const url = new URL(videoLink);
        if (url.hostname.includes("youtu.be")) return url.pathname.slice(1).split("/")[0];
        if (url.hostname.includes("youtube.com")) return url.searchParams.get("v") || url.pathname.split("/embed/")[1]?.split("/")[0] || url.pathname.split("/shorts/")[1]?.split("/")[0];
    } catch { return ""; }
    return "";
};

function VideoShowcase({ isEnglish }: { isEnglish: boolean }): JSX.Element {
    const axios = axiosPublic();
    const [videos, setVideos] = useState<HomeVideo[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<HomeVideo | null>(null);
    const [isVideoModalClosing, setIsVideoModalClosing] = useState(false);
    const carouselRef = useRef<HTMLDivElement>(null);
    const videoDragRef = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });
    const modalCloseTimerRef = useRef<number | null>(null);

    const demoVideos: HomeVideo[] = galleryPhotos.map((photo, index) => ({
        id: -100 - index,
        tutorialNumber: index + 1,
        name: isEnglish ? `MET Club story ${String(index + 1).padStart(2, "0")}` : `মেট ক্লাবের গল্প ${String(index + 1).padStart(2, "০")}`,
        title: isEnglish
            ? ["Weather learning and community safety", "Learning through observation", "Getting ready for changing weather", "Students explore their environment", "Building safer communities", "Learning together at school", "Discovering local weather", "From knowledge to action", "Learning with the community", "Prepared for every season"][index]
            : ["আবহাওয়া শিক্ষা ও কমিউনিটির নিরাপত্তা", "পর্যবেক্ষণের মাধ্যমে শেখা", "বদলে যাওয়া আবহাওয়ার প্রস্তুতি", "শিক্ষার্থীদের পরিবেশ অনুসন্ধান", "নিরাপদ কমিউনিটি গড়ে তোলা", "স্কুলে একসাথে শেখা", "স্থানীয় আবহাওয়া চেনা", "জ্ঞান থেকে কাজে এগিয়ে যাওয়া", "কমিউনিটির সঙ্গে শেখা", "সব ঋতুর জন্য প্রস্তুতি"][index],
        thumbnailImage: photo.src,
        videoLink: "https://www.youtube.com/watch?v=M7lc1UVf-VE",
    }));

    useEffect(() => {
        let cancelled = false;
        axios.get("/tutorials").then(({ data }) => {
            const availableVideos = (data?.data || []).filter((video: HomeVideo) => getYoutubeId(video.videoLink)).slice(0, 10);
            if (!cancelled) setVideos(availableVideos.length ? [...availableVideos, ...demoVideos].slice(0, 10) : demoVideos);
        }).catch((error) => {
            console.error("Failed to load homepage videos:", error);
            if (!cancelled) setVideos(demoVideos);
        });
        return () => { cancelled = true; };
    }, [axios, isEnglish]);

    useEffect(() => () => {
        if (modalCloseTimerRef.current !== null) window.clearTimeout(modalCloseTimerRef.current);
    }, []);

    const closeVideoModal = () => {
        if (!selectedVideo || isVideoModalClosing) return;
        setIsVideoModalClosing(true);
        modalCloseTimerRef.current = window.setTimeout(() => {
            setSelectedVideo(null);
            setIsVideoModalClosing(false);
            modalCloseTimerRef.current = null;
        }, 220);
    };

    return (
        <section className="overflow-hidden bg-red-950 py-[60px] lg:py-[80px]" aria-labelledby="home-videos-title">
            <div className="relative z-10 mb-8 px-4 text-center sm:mb-10">
                    <p className="mb-2 text-sm font-bold uppercase tracking-[.16em] text-red-300">{isEnglish ? "OUR STORIES" : "আমাদের গল্প"}</p>
                    <h2 id="home-videos-title" className="text-[36px] font-black leading-tight text-white">{isEnglish ? "Stories from our learning community" : "আমাদের শেখার কমিউনিটির গল্প"}</h2>
                    <p className="mx-auto mt-2 max-w-2xl text-base leading-relaxed text-red-100/70 sm:text-lg">{isEnglish ? "Watch learners share their experiences and discover how MET Club makes weather learning practical." : "শিক্ষার্থীদের অভিজ্ঞতা শুনে দেখো, মেট ক্লাব কীভাবে আবহাওয়া শেখাকে হাতে-কলমে করে তোলে।"}</p>
            </div>
            {videos.length ? <div className="relative w-full">
                    <div
                        ref={carouselRef}
                        className="chapter-slider flex cursor-grab snap-x snap-mandatory gap-6 overflow-x-auto px-0 pb-5 select-none active:cursor-grabbing"
                        style={{ maskImage: "linear-gradient(to right, transparent, #000 3%, #000 97%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, #000 3%, #000 97%, transparent)" }}
                        onMouseDown={(event) => {
                            if (event.button !== 0 || !carouselRef.current) return;
                            videoDragRef.current = { active: true, startX: event.clientX, scrollLeft: carouselRef.current.scrollLeft, moved: false };
                        }}
                        onMouseMove={(event) => {
                            if (!videoDragRef.current.active || !carouselRef.current) return;
                            const distance = event.clientX - videoDragRef.current.startX;
                            if (Math.abs(distance) > 4) videoDragRef.current.moved = true;
                            carouselRef.current.scrollLeft = videoDragRef.current.scrollLeft - distance;
                        }}
                        onMouseUp={() => { videoDragRef.current.active = false; }}
                        onMouseLeave={() => { videoDragRef.current.active = false; }}
                        onClickCapture={(event) => {
                            if (!videoDragRef.current.moved) return;
                            event.preventDefault();
                            event.stopPropagation();
                            videoDragRef.current.moved = false;
                        }}
                    >
                        {videos.map((video) => {
                            const youtubeId = getYoutubeId(video.videoLink);
                            const image = video.thumbnailImage?.startsWith("http") ? video.thumbnailImage : `https://api.meteorologyclub.com${video.thumbnailImage || ""}`.replace("/api/v1", "");
                            return <button key={video.id} type="button" onClick={() => setSelectedVideo(video)} className="group flex h-[457px] w-[290px] shrink-0 snap-start flex-col rounded-[28px] border border-white/10 bg-[linear-gradient(322deg,#180609_2%,#4a151d_97%)] p-6 text-left shadow-[inset_4px_8px_16px_rgba(255,255,255,.2),inset_2px_4px_16px_rgba(255,255,255,.16)] transition duration-300 md:h-[492px] md:w-[375px] md:rounded-[38px]">
                                <div className="relative mb-3 min-h-0 flex-1 overflow-hidden rounded-[20px] bg-slate-900 md:mb-4 md:rounded-[30px]">
                                    <img src={image || `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`} onError={(event) => { event.currentTarget.src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`; }} alt={video.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-slate-950/25 transition group-hover:bg-slate-950/10"/>
                                    <span className="absolute left-1/2 top-1/2 grid h-[60px] w-[60px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/45 p-[7px] shadow-[0_4px_18px_rgba(0,0,0,.3)] transition group-hover:scale-110"><span className="grid h-full w-full place-items-center rounded-full bg-white text-red-600"><Play size={19} fill="currentColor" className="ml-0.5"/></span></span>
                                </div>
                                <div className="flex items-center gap-3 text-white"><img src={image || `https://img.youtube.com/vi/${youtubeId}/default.jpg`} alt="" className="h-12 w-12 shrink-0 rounded-full border border-white/25 object-cover md:h-[52px] md:w-[52px]"/><div className="min-w-0"><h3 className="truncate text-sm font-semibold leading-5 md:text-base md:leading-6">{video.name}</h3><p className="mt-0.5 line-clamp-2 text-xs leading-4 text-white/60 md:text-sm md:leading-5">{video.title}</p></div></div>
                            </button>;
                        })}
                    </div>
                </div> : <p className="mx-5 rounded-2xl border border-red-100 bg-white px-5 py-8 text-center text-slate-600">{isEnglish ? "Videos will appear here soon." : "শিগগিরই এখানে ভিডিও দেখা যাবে।"}</p>}
            {selectedVideo && <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm ${isVideoModalClosing ? "animate-[videoModalFadeOut_.22s_ease-in_both]" : "animate-[videoModalFadeIn_.28s_ease-out_both]"}`} onClick={closeVideoModal} role="dialog" aria-modal="true" aria-label={selectedVideo.title}>
                <div className={`relative w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl ${isVideoModalClosing ? "animate-[videoModalScaleOut_.22s_ease-in_both]" : "animate-[videoModalScaleIn_.38s_cubic-bezier(.16,1,.3,1)_both]"}`} onClick={(event) => event.stopPropagation()}>
                    <button type="button" onClick={closeVideoModal} aria-label={isEnglish ? "Close video" : "ভিডিও বন্ধ করুন"} className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-red-800 shadow"><X size={22}/></button>
                    <iframe className="aspect-video w-full" src={`https://www.youtube-nocookie.com/embed/${getYoutubeId(selectedVideo.videoLink)}?autoplay=1&rel=0`} title={selectedVideo.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
                </div>
            </div>}
        </section>
    );
}

function ReviewShowcase({ isEnglish }: { isEnglish: boolean }): JSX.Element {
    const [slidePosition, setSlidePosition] = useState(0);
    const [slideTransitionEnabled, setSlideTransitionEnabled] = useState(true);
    const reviews = isEnglish
        ? [
            { parts: [{ text: "With MET Club, I learned to understand weather signals and ", tone: "plain" }, { text: "get ready before a disaster.", tone: "red" }, { text: " I can now share ", tone: "plain" }, { text: "safer choices with my family.", tone: "green" }], name: "MET Club learner", detail: "Student · Demo review", image: reviewLearningImage },
            { parts: [{ text: "The hands-on lessons helped me feel more confident. Now I can ", tone: "plain" }, { text: "notice changing weather", tone: "red" }, { text: " and help my community ", tone: "plain" }, { text: "stay prepared.", tone: "green" }], name: "Community participant", detail: "Learner · Demo review", image: reviewCommunityImage },
            { parts: [{ text: "We learned together how a ", tone: "plain" }, { text: "prepared community", tone: "green" }, { text: " can understand risks and respond to ", tone: "plain" }, { text: "extreme weather.", tone: "red" }], name: "School participant", detail: "Student · Demo review", image: reviewReadinessImage },
        ]
        : [
            { parts: [{ text: "মেট ক্লাবের সঙ্গে শিখে এখন আবহাওয়ার সংকেত বুঝতে পারি এবং ", tone: "plain" }, { text: "দুর্যোগের আগেই প্রস্তুতি নিতে পারি।", tone: "red" }, { text: " পরিবারের সবার সঙ্গে ", tone: "plain" }, { text: "নিরাপদ থাকার উপায়ও ভাগ করি।", tone: "green" }], name: "মেট ক্লাবের শিক্ষার্থী", detail: "শিক্ষার্থী", image: reviewLearningImage },
            { parts: [{ text: "হাতে-কলমে শেখার পর এখন ", tone: "plain" }, { text: "আবহাওয়ার পরিবর্তন খেয়াল করি", tone: "red" }, { text: " এবং কমিউনিটিকে ", tone: "plain" }, { text: "প্রস্তুত থাকতে সাহায্য করি।", tone: "green" }], name: "কমিউনিটির অংশগ্রহণকারী", detail: "শিক্ষার্থী", image: reviewCommunityImage },
            { parts: [{ text: "একসাথে শিখে বুঝেছি, ", tone: "plain" }, { text: "প্রস্তুত কমিউনিটি", tone: "green" }, { text: " আবহাওয়ার ঝুঁকি বুঝে ", tone: "plain" }, { text: "নিরাপদে সাড়া দিতে পারে।", tone: "red" }], name: "স্কুলের অংশগ্রহণকারী", detail: "শিক্ষার্থী", image: reviewReadinessImage },
        ];

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            if (!document.hidden) setSlidePosition((current) => current + 1);
        }, 6000);
        return () => window.clearInterval(intervalId);
    }, [reviews.length]);

    const activeReview = slidePosition % reviews.length;
    const slides = [...reviews, reviews[0]];

    return (
        <section className="overflow-hidden bg-white py-[60px] lg:py-[80px]" aria-label={isEnglish ? "Learner reviews" : "শিক্ষার্থীদের অভিজ্ঞতা"}>
            <div className="mx-auto w-full max-w-[1150px] px-4 sm:px-6">
                <div className="overflow-hidden rounded-[32px] sm:rounded-[48px]">
                    <div
                        className={`flex ${slideTransitionEnabled ? "transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)]" : ""}`}
                        style={{ transform: `translateX(-${slidePosition * 100}%)` }}
                        onTransitionEnd={(event) => {
                            if (event.target !== event.currentTarget || event.propertyName !== "transform" || slidePosition < reviews.length) return;
                            setSlideTransitionEnabled(false);
                            setSlidePosition(0);
                            window.requestAnimationFrame(() => {
                                window.requestAnimationFrame(() => setSlideTransitionEnabled(true));
                            });
                        }}
                    >
                        {slides.map((review, reviewIndex) => (
                            <article key={`${review.name}-${reviewIndex}`} className="relative isolate min-h-[350px] min-w-full overflow-hidden border border-red-900/10 bg-red-950 shadow-[inset_0_1px_0_rgba(255,255,255,.1)] sm:min-h-[380px]">
                                <div className="pointer-events-none absolute -bottom-24 -left-12 h-64 w-80 rounded-full bg-red-700/35 blur-[80px]" />
                                <div className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-[58%] opacity-55 sm:block" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11'%3E%3Crect x='1' y='1' width='3' height='3' fill='%23ffffff' fill-opacity='.3'/%3E%3C/svg%3E\")", backgroundSize: "11px 11px", maskImage: "linear-gradient(135deg, transparent 12%, rgba(0,0,0,.08) 28%, rgba(0,0,0,.58) 48%, #000 66%)", WebkitMaskImage: "linear-gradient(135deg, transparent 12%, rgba(0,0,0,.08) 28%, rgba(0,0,0,.58) 48%, #000 66%)" }} />
                                <div className="absolute inset-y-0 right-0 w-full sm:w-[48%]">
                                    <img src={review.image} alt="" loading="lazy" className="relative z-[1] h-full w-full object-contain opacity-100" style={{ objectPosition: "right bottom" }} />
                                </div>
                                <div className="relative z-10 flex min-h-[350px] w-full flex-col justify-center p-7 sm:min-h-[380px] sm:w-[68%] sm:p-10 lg:p-12">
                                    <span aria-hidden="true" className="mb-1 h-14 text-7xl font-black leading-[.8] text-red-400/70">“</span>
                                    <blockquote className="text-xl font-bold leading-relaxed text-white sm:text-2xl lg:text-[27px]">{review.parts.map((part, index) => <span key={index} className={part.tone === "red" ? "text-red-400" : part.tone === "green" ? "text-emerald-400" : ""}>{part.text}</span>)}</blockquote>
                                    <div className="mt-8">
                                        <p className="font-bold text-white">{review.name}</p>
                                        <p className="mt-1 text-sm text-white/55">{review.detail}</p>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
                <div className="mt-7 flex items-center justify-center gap-3" aria-label={isEnglish ? "Choose review" : "রিভিউ বেছে নিন"}>
                    {reviews.map((item, index) => <button key={item.name} type="button" onClick={() => { setSlideTransitionEnabled(true); setSlidePosition(index); }} aria-label={isEnglish ? `Go to review ${index + 1}` : `রিভিউ ${index + 1} দেখুন`} aria-current={index === activeReview} className={`h-2 rounded-full transition-all duration-300 ${index === activeReview ? "w-10 bg-red-700" : "w-2 bg-slate-300 hover:bg-red-300"}`} />)}
                </div>
            </div>
        </section>
    );
}

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

export default function HomePage() {
    useLocaleRouteSync("/", "/en");
    const isEnglish = getStoredLocale() === "en";
    const t = (bangla: string, english: string) => isEnglish ? english : bangla;
    const statsSectionRef = useRef<HTMLElement>(null);
    const [statsCounts, setStatsCounts] = useState([0, 0, 0]);

    useEffect(() => {
        const section = statsSectionRef.current;
        if (!section) return;

        let frameId = 0;
        let startedAt: number | null = null;
        const targets = [10000, 2500, 750];
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            observer.disconnect();

            const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            if (reducedMotion) {
                setStatsCounts(targets);
                return;
            }

            const countUp = (time: number) => {
                startedAt ??= time;
                const progress = Math.min((time - startedAt) / 1500, 1);
                const easedProgress = 1 - Math.pow(1 - progress, 3);
                setStatsCounts(targets.map((target) => Math.floor(target * easedProgress)));
                if (progress < 1) frameId = window.requestAnimationFrame(countUp);
                else setStatsCounts(targets);
            };

            frameId = window.requestAnimationFrame(countUp);
        }, { threshold: 0.3 });

        observer.observe(section);
        return () => {
            observer.disconnect();
            window.cancelAnimationFrame(frameId);
        };
    }, []);
    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-gray-50">
            <TopNav title={t("হোম", "Home")} brandName={t("মেট ক্লাব", "Met Club")} />
            <main className="relative flex flex-1 items-center overflow-hidden isolate">
                <video autoPlay loop muted playsInline className="absolute inset-0 z-0 h-full w-full object-cover" aria-hidden="true"><source src={coverVideo} type="video/mp4" /></video>
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-red-950/85 via-red-950/65 to-slate-950/35" />
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
                <WeatherCanvas />
                <div className="site-container relative z-20 grid min-h-[min(820px,calc(100svh-4rem))] items-center gap-12 px-5 py-[60px] sm:px-8 lg:grid-cols-[1.08fr_.92fr] lg:gap-16 lg:py-[80px]">
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
            <section className="relative overflow-hidden bg-white py-[60px] lg:py-[80px]" aria-labelledby="about-met-club-title">
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
            <section ref={statsSectionRef} className="relative isolate overflow-hidden bg-red-950 py-[60px] lg:py-[80px]" aria-labelledby="met-club-stats-title">
                <div className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)", backgroundSize: "42px 42px" }} />
                <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-red-700/30 blur-3xl" />
                <div className="site-container relative px-4 sm:px-6 lg:px-8">
                    <div className="mb-9 text-center">
                        <p className="mb-2 text-sm font-bold uppercase tracking-[.16em] text-red-300">{isEnglish ? "OUR COMMUNITY" : "আমাদের কমিউনিটি"}</p>
                        <h2 id="met-club-stats-title" className="text-[36px] font-black text-white">{isEnglish ? "Learning together, growing together" : "একসাথে শিখছি, একসাথে এগোচ্ছি"}</h2>
                        <p className="mt-2 text-sm font-normal text-red-100/70 sm:text-base">{isEnglish ? "A snapshot of the learners and visitors connecting with MET Club." : "মেট ক্লাবের সঙ্গে যুক্ত শিক্ষার্থী ও দর্শনার্থীদের একটি সংক্ষিপ্ত চিত্র।"}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
                        {[
                            { icon: Eye, value: statsCounts[0], label: isEnglish ? "Total visitors" : "মোট দর্শনার্থী" },
                            { icon: Users, value: statsCounts[1], label: isEnglish ? "Users in Bangladesh" : "বাংলাদেশের ব্যবহারকারী" },
                            { icon: Globe2, value: statsCounts[2], label: isEnglish ? "Users from other countries" : "অন্যান্য দেশের ব্যবহারকারী" },
                        ].map(({ icon: Icon, value, label }, index) => (
                            <div key={label} className={`group relative min-h-56 overflow-hidden rounded-[2rem] p-7 transition-all duration-500 hover:-translate-y-2 md:col-span-4 sm:p-9 ${index === 2 ? "bg-red-300 text-red-950 hover:shadow-[0_24px_50px_rgba(248,113,113,.25)]" : "border border-white/10 bg-white/[0.06] text-white hover:border-red-300/50 hover:bg-white/[0.09] hover:shadow-[0_24px_50px_rgba(0,0,0,.25)]"}`} style={{ animation: "fadeSlideUp .55s ease both", animationDelay: (index * 120) + "ms" }}>
                                <div className="relative z-10 flex h-full flex-col">
                                    {index === 2 && <span className="mb-8 grid h-12 w-12 place-items-center rounded-xl bg-red-950 text-red-200 transition-transform duration-700 group-hover:rotate-[360deg]"><Icon size={23} aria-hidden="true" /></span>}
                                    <p className={`text-5xl font-black tracking-tighter sm:text-6xl ${index === 2 ? "text-red-950" : "text-white"}`}>{value.toLocaleString(isEnglish ? "en-US" : "bn-BD")}<span className={index === 2 ? "text-white" : "text-red-300"}>+</span></p>
                                    <p className={`mt-2 text-xs font-bold uppercase tracking-[.18em] ${index === 2 ? "text-red-950/65" : "text-red-100/60"}`}>{label}</p>
                                    {index === 1 && <div className="mt-8 flex gap-1.5"><span className="h-1 flex-1 rounded-full bg-red-300 transition-all duration-700 group-hover:flex-[2]" /><span className="h-1 flex-1 rounded-full bg-red-300/80 transition-all duration-700 group-hover:flex-[1.5]" /><span className="h-1 flex-1 rounded-full bg-red-300/55 transition-all duration-700 group-hover:flex-[2.5]" /><span className="h-1 flex-1 rounded-full bg-white/10 transition-colors group-hover:bg-red-300/30" /></div>}
                                </div>
                                {index === 0 && <div className="absolute -bottom-5 -right-3 text-7xl font-black italic tracking-tighter text-white/[0.035] transition-all duration-700 group-hover:scale-110 group-hover:text-red-300/10 sm:text-8xl">MET</div>}
                                {index === 2 && <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border-[24px] border-white/15 transition-transform duration-1000 group-hover:scale-125" />}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <VideoShowcase isEnglish={isEnglish} />
            <PhotoGallery isEnglish={isEnglish} />
            <ReviewShowcase isEnglish={isEnglish} />
            <footer className="relative z-10 border-t border-red-900 bg-red-950 py-10 text-white md:py-15 lg:py-20">
                <div className="site-container px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-center space-x-4 lg:flex-row">
                        <img src={logo} alt="MET CLUB LOGO" className="h-32 w-32" />
                        <div>
                            <h3 className="text-2xl font-black text-red-500" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>{t("মেট ক্লাব", "Met Club")}</h3>
                            <p className="mt-1 text-sm font-semibold text-gray-300">{t("আবহাওয়া চক্র", "Weather Cycle")}</p>
                            <p className="my-4 font-semibold italic text-red-200">{t('"তরুণ মন, শক্তিশালী সতর্কতা"', '"Young Minds, Stronger Warnings"')}</p>
                        </div>
                    </div>
                    <div className="mt-8">
                        <Partners bg="bg-white" />
                    </div>
                </div>
            </footer>
            <footer className="relative z-20 bg-red-950 py-4 text-center text-sm text-white"><a href="http://cdsr.com.bd" target="_blank" rel="noopener noreferrer">{t("পরিকল্পনা ও বাস্তবায়ন: Centre for Data Science Research (CDSR)", "Developed by Centre for Data Science Research (CDSR)")}</a></footer>
        </div>
    );
}



