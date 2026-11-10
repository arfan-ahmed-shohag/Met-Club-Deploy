import { Play, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { JSX } from "react";
import axiosPublic from "../../../hooks/axiosPublic";
import { galleryPhotos, type HomeVideo } from "./homeData";

const getYoutubeId = (videoLink: string) => {
    try {
        const url = new URL(videoLink);
        if (url.hostname.includes("youtu.be")) return url.pathname.slice(1).split("/")[0];
        if (url.hostname.includes("youtube.com")) return url.searchParams.get("v") || url.pathname.split("/embed/")[1]?.split("/")[0] || url.pathname.split("/shorts/")[1]?.split("/")[0];
    } catch { return ""; }
    return "";
};

export default function VideoShowcase({ isEnglish }: { isEnglish: boolean }): JSX.Element {
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
                            return <button key={video.id} type="button" onClick={() => setSelectedVideo(video)} className="group flex h-[457px] w-[290px] shrink-0 snap-start flex-col rounded-[28px] border border-white/10 bg-[linear-gradient(322deg,#222221_2%,#40302d_97%)] p-6 text-left shadow-[inset_4px_8px_16px_rgba(255,255,255,.2),inset_2px_4px_16px_rgba(255,255,255,.16)] transition duration-300 md:h-[492px] md:w-[375px] md:rounded-[38px]">
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
