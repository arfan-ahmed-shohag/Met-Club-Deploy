import { useEffect, useState } from "react";
import { FiPlay, FiX } from "react-icons/fi";
import TopNav from "../../components/Shared/TopBar";
import bgImage from "../../assets/images/start-journey-page-bg.jpeg";
import axiosPublic from "../../hooks/axiosPublic";


type Tutorial = {
    id: number;
    tutorialNumber: number;
    name: string;
    title: string;
    thumbnailImage: string;
    videoLink: string;
};

const resolveImageUrl = (value: string) => {
    if (!value) return "";
    if (value.startsWith("http")) return value;
    return ("https://api.meteorologyclub.com" + value).replace("/api/v1", "");
};

const getYoutubeEmbedUrl = (input: string) => {
    try {
        const url = new URL(input);
        const host = url.hostname.replace("www.", "");

        if (host.includes("youtu.be")) {
            return `https://www.youtube.com/embed/${url.pathname.replace("/", "")}`;
        }

        const videoId = url.searchParams.get("v");
        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }

        if (url.pathname.includes("/embed/")) {
            return input;
        }
    } catch {
        // ignore invalid URLs here; the browser link still works
    }

    return input;
};

export default function Tutorials() {
    const axios = axiosPublic();
    const [tutorials, setTutorials] = useState<Tutorial[]>([]);
    const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const loadTutorials = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get("/tutorials");
                const data = (response.data?.data || []) as Tutorial[];
                if (!cancelled) {
                    setTutorials(data);
                }
            } catch (error) {
                console.error("Failed to load tutorials:", error);
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        loadTutorials();

        return () => {
            cancelled = true;
        };
    }, [axios]);

    const filteredTutorials = tutorials;



    return (
        <div className="relative min-h-screen flex flex-col overflow-x-hidden" style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
        }}>

            <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                    background: "linear-gradient(180deg, rgba(20,6,6,0.22) 0%, rgba(20,6,6,0.14) 55%, rgba(20,6,6,0.18) 100%)",
                }}
            />
            <TopNav title="টিউটোরিয়াল ভিডিও" brandName="মেট ক্লাব" />

            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">

                    {isLoading ? (
                        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
                            লোড হচ্ছে...
                        </div>
                    ) : filteredTutorials.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 shadow-sm">
                            কোনো tutorial পাওয়া যায়নি
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            {filteredTutorials.map((tutorial) => (
                                <button
                                    key={tutorial.id}
                                    type="button"
                                    onClick={() => setSelectedTutorial(tutorial)}
                                    className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white p-0 text-left shadow-[0_12px_32px_rgba(15,23,42,0.12)] transition-transform duration-200 hover:-translate-y-1 cursor-pointer"
                                >
                                    <div className="relative aspect-16/10 overflow-hidden">
                                        <img
                                            src={resolveImageUrl(tutorial.thumbnailImage)}
                                            alt={tutorial.title}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-slate-950/55 via-slate-950/10 to-transparent" />
                                        <div className="absolute left-4 bottom-4 flex items-end gap-3 text-white">
                                            <div className="text-5xl font-black leading-none text-white/95 drop-shadow-lg">
                                                {String(tutorial.tutorialNumber).padStart(2, "0")}
                                            </div>
                                            <div className="pb-1">
                                                <p className="text-xs uppercase tracking-[0.28em] text-white/80">{tutorial.name}</p>
                                                <h2 className="mt-1 text-xl font-bold leading-tight">{tutorial.title}</h2>
                                            </div>
                                        </div>
                                        <div className="absolute right-4 top-4 rounded-full bg-white/95 p-2 text-red-600 shadow-lg transition-transform duration-200 group-hover:scale-110">
                                            <FiPlay className="h-5 w-5" />
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {selectedTutorial && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm"
                        onClick={() => setSelectedTutorial(null)}
                        role="dialog"
                        aria-label="ভিডিও পপআপ"
                    >
                        <div
                            className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                type="button"
                                onClick={() => setSelectedTutorial(null)}
                                className="absolute right-3 top-3 z-20 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-3 text-sm font-medium text-slate-800 shadow cursor-pointer"
                                aria-label="বন্ধ করুন"
                            >
                                <FiX className="h-6 w-6" />
                            </button>

                            <div className="w-full">
                                {(() => {
                                    const embed = getYoutubeEmbedUrl(selectedTutorial.videoLink);
                                    const isYoutube = embed.includes("youtube.com/embed") || embed.includes("youtu.be/embed");
                                    if (isYoutube) {
                                        const sep = embed.includes("?") ? "&" : "?";
                                        const src = `${embed}${sep}autoplay=1&rel=0`;
                                        return (
                                            <iframe
                                                title={selectedTutorial.title}
                                                src={src}
                                                className="aspect-video w-full h-[90vh]"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        );
                                    }

                                    // fallback to HTML5 video for direct links
                                    return (
                                        <video
                                            src={selectedTutorial.videoLink}
                                            className="aspect-video w-full h-[60vh] bg-black"
                                            controls
                                            autoPlay
                                        />
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}