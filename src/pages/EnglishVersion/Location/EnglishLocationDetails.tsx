import { useParams, useNavigate } from "react-router";
import schoolImage from "../../../assets/images/school_illustration.png";
import bgImage from "../../../assets/images/start-journey-page-bg.jpeg";
import { MapPin, Users, Leaf } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAxiosProtected from "../../../hooks/axiosProtected";
import { useLocaleRouteSync } from "../../../hooks/useLocaleRouteSync";
import TopNav from "../../../components/Shared/TopBar";
import { resolveMediaUrl } from "../../../utils/media";

type Student = {
    id: number;
    nameBn: string;
    nameEn: string;
    classEn: string;
    image: string;
};

type School = {
    id: number;
    nameEn: string;
    addressEn: string;
    videoLink?: string;
    descEn: string;
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

export default function EnglishLocationDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const axiosInstance = useAxiosProtected();

    // Sync to bengali route
    useLocaleRouteSync(`/en/location/${id}`, `/location/${id}`);

    const [schools, setSchools] = useState<School[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const locationSummaryMap: Record<string, { name: string; summary: string }> = {
        chattogram: { name: "Chattogram", summary: "Met Clubs in Chattogram" },
        patuakhali: { name: "Patuakhali", summary: "Met Clubs in Patuakhali" },
        gaibandha: { name: "Gaibandha", summary: "Met Clubs in Gaibandha" }
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
                    toast.error("Failed to load information");
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
                    <h2 className="text-3xl font-bold text-red-600 mb-4">Not Found</h2>
                    <p className="text-gray-600 mb-6">No information available for this location.</p>
                    <button
                        onClick={() => navigate('/en')}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <TopNav title={`${locationInfo.name} Location`} brandName="MET Club" />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-500 font-semibold text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen flex flex-col bg-gray-50">
            <TopNav title={`${locationInfo.name} Location`} brandName="MET Club" />
            <div className="flex-1 bg-gray-50 pb-20">
                {schools.find(s => s.videoLink)?.videoLink && (
                    <section 
                        className="relative py-16 md:py-20 shadow-sm border-b border-gray-200"
                        style={{ 
                            backgroundImage: `url(${bgImage})`, 
                            backgroundSize: 'cover', 
                            backgroundPosition: 'center',
                        }}
                    >
                        {/* Dark overlay to make text visible */}
                        <div className="absolute inset-0 bg-black/60 z-0"></div>

                        <div className="container mx-auto px-4 max-w-6xl relative z-10">
                            {/* Centered Title */}
                            <div className="text-center mb-12">
                                <h2 className="text-4xl md:text-5xl font-extrabold text-white inline-block relative drop-shadow-md">
                                    Activities in {locationInfo.name}
                                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-red-500"></div>
                                </h2>
                            </div>

                            <div className="flex flex-col lg:flex-row items-center gap-10">
                                {/* Left Side: Text and Cards */}
                                <div className="lg:w-1/2 flex flex-col justify-center">
                                    <p className="text-gray-100 text-lg md:text-xl leading-relaxed font-medium mb-8 drop-shadow">
                                        "MET Club – Weather Cycle" is a platform led by youth and children. Under this project in the {locationInfo.name} region, the following activities are being successfully implemented.
                                    </p>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 bg-white/95 border border-white/50 p-4 rounded-xl shadow-lg hover:bg-white transition-colors">
                                            <span className="text-2xl drop-shadow-sm">📚</span>
                                            <span className="text-red-900 font-bold text-lg">Weather Education & Training</span>
                                        </div>
                                        <div className="flex items-center gap-4 bg-white/95 border border-white/50 p-4 rounded-xl shadow-lg hover:bg-white transition-colors">
                                            <span className="text-2xl drop-shadow-sm">⚠️</span>
                                            <span className="text-red-900 font-bold text-lg">Early Warning System</span>
                                        </div>
                                        <div className="flex items-center gap-4 bg-white/95 border border-white/50 p-4 rounded-xl shadow-lg hover:bg-white transition-colors">
                                            <span className="text-2xl drop-shadow-sm">🦸‍♂️</span>
                                            <span className="text-red-900 font-bold text-lg">Disaster Preparedness & Response</span>
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
                        <div className="container mx-auto text-center text-gray-500 pt-10">
                            No schools or members have been added to this location yet.
                        </div>
                    )}
                    {schools.map((school) => (
                        <section key={school.id} className="relative z-10">
                            {/* School Banner (Full Width Background) */}
                            <div className="bg-gradient-to-r from-red-800 to-red-600 shadow-xl mb-10 w-full">
                                <div className="container mx-auto px-4 md:px-0 text-white p-8 md:p-10 relative overflow-hidden flex flex-col md:flex-row justify-between items-center max-w-6xl">
                                    <div className="z-10 md:w-3/5">
                                        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight drop-shadow-md mb-3">
                                            {school.nameEn}
                                        </h2>
                                        <div className="flex items-center space-x-2 text-red-100 mb-4 text-lg">
                                            <MapPin className="w-5 h-5" />
                                            <span>{school.addressEn}</span>
                                        </div>
                                        <p className="text-red-50 text-base md:text-lg leading-relaxed max-w-xl">
                                            {school.descEn}
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
                            <div className="container mx-auto px-4 md:px-0 max-w-6xl">
                                <div>
                                    <h3 className="text-xl md:text-2xl font-bold text-red-800 mb-6 flex items-center gap-2">
                                        <Users className="w-6 h-6" />
                                        MET Club Members ({school.members.length})
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
                                                    <img src={getAvatarUrl()} alt={student.nameEn} className="w-full h-full object-cover" />
                                                </div>

                                                {/* Details */}
                                                <h4 className="font-bold text-gray-800 text-sm leading-tight mb-1">{student.nameEn}</h4>
                                                <p className="text-xs text-red-600 font-semibold">{student.classEn}</p>
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
