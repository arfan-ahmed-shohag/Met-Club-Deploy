import { useParams, useNavigate } from "react-router";
import TopNav from "../../components/Shared/TopBar";
import { useLocaleRouteSync } from "../../hooks/useLocaleRouteSync";
import schoolImage from "../../assets/images/school_illustration.png";
import bgImage from "../../assets/images/start-journey-page-bg.jpeg";
import { MapPin, Users, Leaf } from "lucide-react";
import { useEffect, useState } from "react";
import useAxiosProtected from "../../hooks/axiosProtected";
import toast from "react-hot-toast";
import { resolveMediaUrl } from "../../utils/media";

type Student = {
    id: number;
    nameBn: string;
    nameEn: string;
    classBn: string;
    image: string;
};

type School = {
    id: number;
    nameBn: string;
    addressBn: string;
    videoLink?: string;
    descBn: string;
    members: Student[];
};

const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    try {
        let videoId = "";
        if (url.includes("youtu.be/")) {
            videoId = url.split("youtu.be/")[1]?.split("?")[0];
        } else if (url.includes("youtube.com/watch")) {
            const urlParams = new URL(url).searchParams;
            videoId = urlParams.get("v") || "";
        } else if (url.includes("youtube.com/embed/")) {
            videoId = url.split("embed/")[1]?.split("?")[0];
        }
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    } catch (e) {
        return null;
    }
};

export default function LocationDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const axiosInstance = useAxiosProtected();

    // Sync to english route
    useLocaleRouteSync(`/location/${id}`, `/en/location/${id}`);

    const [schools, setSchools] = useState<School[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const locationSummaryMap: Record<string, { name: string; summary: string }> = {
        chattogram: { name: "চট্টগ্রাম", summary: "চট্টগ্রামের মেট ক্লাবসমূহ" },
        patuakhali: { name: "পটুয়াখালী", summary: "পটুয়াখালীর মেট ক্লাবসমূহ" },
        gaibandha: { name: "গাইবান্ধা", summary: "গাইবান্ধার মেট ক্লাবসমূহ" }
    };

    const locationInfo = id && locationSummaryMap[id] ? locationSummaryMap[id] : null;

    useEffect(() => {
        if (id) {
            const fetchSchools = async () => {
                setIsLoading(true);
                try {
                    const res = await axiosInstance.get(`/schools?location=${id}`);
                    setSchools(res.data.data || []);
                } catch (err) {
                    toast.error("তথ্য লোড করতে সমস্যা হয়েছে");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchSchools();
        }
    }, [id, axiosInstance]);

    if (!locationInfo) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
                    <h2 className="text-3xl font-bold text-red-600 mb-4">তথ্য পাওয়া যায়নি</h2>
                    <p className="text-gray-600 mb-6">এই লোকেশনের জন্য কোনো তথ্য পাওয়া যায়নি।</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                        ফিরে যান
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <TopNav title={`${locationInfo.name} লোকেশন`} brandName="মেট ক্লাব" />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-500 font-semibold text-lg">লোড হচ্ছে...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen flex flex-col bg-gray-50">
            <TopNav title={`${locationInfo.name} লোকেশন`} brandName="মেট ক্লাব" />
            <div className="flex-1 bg-gray-50 pb-20">
                {schools.find(s => s.videoLink)?.videoLink && (
                    <section
                        className="relative py-16 md:py-20 shadow-sm "
                        style={{
                            backgroundImage: `url(${bgImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        {/* Dark overlay to make text visible */}
                        <div className="absolute inset-0 bg-black/60 z-0"></div>

                        <div className="site-container relative z-10 px-4 sm:px-6 lg:px-8">
                            {/* Centered Title */}
                            <div className="text-center mb-12">
                                <h2 className="text-4xl md:text-5xl font-extrabold text-red-600 inline-block relative drop-shadow-md" style={{ color: "#9A3324", textShadow: "-1px -1px 0 rgba(255,255,255,0.96), 1px -1px 0 rgba(255,255,255,0.96), -1px 1px 0 rgba(255,255,255,0.96), 1px 1px 0 rgba(255,255,255,0.96), 0 2px 0 rgba(185,28,28,0.20), 0 8px 20px rgba(127,29,29,0.24)" }}>
                                    {locationInfo.name} লোকেশনের কার্যক্রম
                                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-red-500"></div>
                                </h2>
                            </div>

                            <div className="flex flex-col lg:flex-row items-center gap-10">
                                {/* Left Side: Text and Cards */}
                                <div className="lg:w-1/2 flex flex-col justify-center">
                                    <p className="text-gray-100 text-lg md:text-xl leading-relaxed font-medium mb-8 drop-shadow">
                                        "মেট ক্লাব – আবহাওয়া চক্র" একটি শিশু-কিশোর চালিত প্ল্যাটফর্ম যা শিশু এবং তরুণদের দ্বারা পরিচালিত হয়। {locationInfo.name} অঞ্চলে এই প্রকল্পের আওতায় নিচের কার্যক্রমগুলো বাস্তাবায়িত হচ্ছে।
                                    </p>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 bg-white/95 border border-white/50 p-4 rounded-xl shadow-lg hover:bg-white transition-colors">
                                            <span className="text-2xl drop-shadow-sm">📚</span>
                                            <span className="text-red-900 font-bold text-lg">আবহাওয়া শিক্ষা ও প্রশিক্ষণ</span>
                                        </div>
                                        <div className="flex items-center gap-4 bg-white/95 border border-white/50 p-4 rounded-xl shadow-lg hover:bg-white transition-colors">
                                            <span className="text-2xl drop-shadow-sm">⚠️</span>
                                            <span className="text-red-900 font-bold text-lg">আগাম সতর্কীকরণ ব্যবস্থা</span>
                                        </div>
                                        <div className="flex items-center gap-4 bg-white/95 border border-white/50 p-4 rounded-xl shadow-lg hover:bg-white transition-colors">
                                            <span className="text-2xl drop-shadow-sm">🦸‍♂️</span>
                                            <span className="text-red-900 font-bold text-lg">দুর্যোগ প্রস্তুতি ও মোকাবিলা</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Video */}
                                <div className="lg:w-1/2 w-full mt-8 lg:mt-0">
                                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-300">
                                        <iframe
                                            src={getYouTubeEmbedUrl(schools.find(s => s.videoLink)?.videoLink || "") || ""}
                                            title={`${locationInfo.name} Location Video`}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="w-full h-full object-cover"
                                        ></iframe>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                <div className="space-y-16">
                    {schools.length === 0 && (
                        <div className="site-container px-4 pt-10 text-center text-gray-500 sm:px-6 lg:px-8">
                            এই লোকেশনে এখনো কোনো স্কুল বা মেম্বার যোগ করা হয়নি।
                        </div>
                    )}
                    {schools.map((school) => (
                        <section key={school.id} className="relative z-10">
                            {/* School Banner (Full Width Background) */}
                            <div className="bg-gradient-to-r from-red-800 to-red-600 shadow-xl mb-10 w-full">
                                <div className="site-container relative flex flex-col items-center justify-between overflow-hidden px-4 py-8 text-white sm:px-6 md:flex-row md:py-10 lg:px-8">
                                    <div className="z-10 md:w-3/5">
                                        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight drop-shadow-md mb-3">
                                            {school.nameBn}
                                        </h2>
                                        <div className="flex items-center space-x-2 text-red-100 mb-4 text-lg">
                                            <MapPin className="w-5 h-5" />
                                            <span>{school.addressBn}</span>
                                        </div>
                                        <p className="text-red-50 text-base md:text-lg leading-relaxed max-w-xl">
                                            {school.descBn}
                                        </p>
                                    </div>
                                    <div className="z-10 mt-8 md:mt-0 md:w-2/5 flex justify-center md:justify-end">
                                        <img src={schoolImage} alt="School" className="w-64 h-auto object-contain drop-shadow-2xl" />
                                    </div>
                                    {/* Cloud decorations */}
                                    <div className="absolute top-4 right-1/3 opacity-20 hidden md:block">☁️</div>
                                    <div className="absolute top-12 right-1/4 opacity-10 text-2xl hidden md:block">☁️</div>
                                    <div className="absolute bottom-6 left-1/2 opacity-20 text-3xl hidden md:block">☁️</div>
                                </div>
                            </div>

                            {/* Members Section (Centered) */}
                            <div className="site-container px-4 sm:px-6 lg:px-8">
                                <div>
                                    <h3 className="text-xl md:text-2xl font-bold text-red-800 mb-6 flex items-center gap-2">
                                        <Users className="w-6 h-6" />
                                        মেট ক্লাব সদস্য ({school.members.length})
                                    </h3>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                        {school.members.map((student) => {
                                            const getAvatarUrl = () => {
                                                if (student.image) {
                                                    if (student.image.startsWith('/uploads')) {
                                                        return resolveMediaUrl(student.image);
                                                    }
                                                    if (student.image.includes('ui-avatars.com')) {
                                                        return `https://ui-avatars.com/api/?name=${encodeURIComponent(student.nameEn || "Member")}&background=random&color=fff`;
                                                    }
                                                    return student.image;
                                                }
                                                return `https://ui-avatars.com/api/?name=${encodeURIComponent(student.nameEn || "Member")}&background=random&color=fff`;
                                            };
                                            return (
                                            <div key={student.id} className="bg-white rounded-2xl p-4 flex flex-col items-center text-center shadow-md hover:shadow-lg transition-shadow relative group cursor-default">
                                                {/* Avatar */}
                                                <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-red-50 overflow-hidden mb-3 mt-2 shadow-inner">
                                                    <img src={getAvatarUrl()} alt={student.nameBn} className="w-full h-full object-cover" />
                                                </div>

                                                {/* Details */}
                                                <h4 className="font-bold text-gray-800 text-sm leading-tight mb-1">{student.nameBn}</h4>
                                                <p className="text-xs text-red-600 font-semibold">{student.classBn}</p>
                                            </div>
                                        )})}
                                    </div>
                                </div>
                            </div>
                        </section>
                    ))}
                </div>

                {/* Footer Summary */}
                {schools.length > 0 && (
                    <div className="mt-16 flex justify-center px-4">
                        <div className="bg-white border border-gray-200 rounded-full py-3 px-6 shadow-sm flex items-center gap-3 text-gray-700">
                            <Users className="w-5 h-5 text-red-600" />
                            <span className="font-semibold">{locationInfo.summary}</span>
                            <Leaf className="w-5 h-5 text-red-600" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
