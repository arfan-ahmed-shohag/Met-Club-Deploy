import { Target, Eye, Users, Award, MapPin, Heart, Shield, Sparkles, TrendingUp } from 'lucide-react';
import logo from "../../assets/images/logo_original.png"
import Partners from '../../components/Shared/Partners';
import coverVideo from "../../assets/videos/Drone shot for cover.mp4";
import whatIsVideo from "../../assets/videos/What is MET Club_.mp4";
import whatIsPoster from "../../assets/images/what_is_poster.jpg";
import startJourneyBg from "../../assets/images/start-journey-page-bg.jpeg"
import aboutBg from "../../assets/images/about-page-bg.png"
import chapterBg from "../../assets/images/chapter-bg.png"
import TopNav from "../../components/Shared/TopBar";
import { useLocaleRouteSync } from "../../hooks/useLocaleRouteSync";
import jagoNariLogo from "../../assets/partners/partner3.png";
import sksLogo from "../../assets/partners/partner4.png";
import ypsaLogo from "../../assets/partners/partner5.jpg";
import { Link } from "react-router";
import { getStoredLocale } from "../../utils/language";

const titleShadow = "-1px -1px 0 rgba(255,255,255,0.96), 1px -1px 0 rgba(255,255,255,0.96), -1px 1px 0 rgba(255,255,255,0.96), 1px 1px 0 rgba(255,255,255,0.96), 0 2px 0 rgba(185,28,28,0.20), 0 8px 20px rgba(127,29,29,0.24)";
const subtitleShadow = "0 1px 6px rgba(255,255,255,0.28)";

export default function About() {
    useLocaleRouteSync("/about", "/en/about");
    const isEnglish = getStoredLocale() === "en";
    const t = (bangla: string, english: string) => isEnglish ? english : bangla;

    const objectives = [
        { icon: '🌡️', title: t('আবহাওয়া পর্যবেক্ষণের জ্ঞান প্রদান', 'Providing knowledge about weather observation') },
        { icon: '⚠️', title: t('আগাম সতর্কীকরণ ব্যবস্থার অনিশ্চয়তা সম্পর্কে জানানো', 'Explaining uncertainty in early warning systems') },
        { icon: '🛡️', title: t('নিজেকে এবং অন্যকে নিরাপদ রাখতে শেখানো', 'Teaching children to keep themselves and others safe') },
        { icon: '💡', title: t('শিশুদের মাঝে সচেতনতা গড়ে তোলা', 'Building awareness among children') },
        { icon: '✍️', title: t('হাতে কলমে প্রশিক্ষণ দেওয়া', 'Providing hands-on training') },
        { icon: '🦸', title: t('দুর্যোগ মোকাবেলায় শিশুদের সক্রিয় ভূমিকা রাখতে অনুপ্রাণিত করা', 'Inspiring children to take an active role in disaster response') },
    ];

    const activities = [
        { icon: '👥', title: t('ক্লাব সভা', 'Club meetings') },
        { icon: '🌤️', title: t('আবহাওয়া পর্যবেক্ষণ', 'Weather observation') },
        { icon: '📚', title: t('ওয়ার্কশপ ও প্রশিক্ষণ', 'Workshops and training') },
        { icon: '📢', title: t('সচেতনতা ক্যাম্পেইন', 'Awareness campaigns') },
        { icon: '📅', title: t('ইভেন্ট উদযাপন', 'Event celebrations') },
    ];

    const locations = [
        { name: t('চট্টগ্রাম', 'Chattogram'), org: t('বাস্তবায়নকারী সংস্থা: ইপসা (YPSA)', 'Implementing partner: YPSA'), logo: ypsaLogo, id: 'chattogram' },
        { name: t('পটুয়াখালী', 'Patuakhali'), org: t('বাস্তবায়নকারী সংস্থা: জাগোনারী (JAGO NARI)', 'Implementing partner: JAGO NARI'), logo: jagoNariLogo, id: 'patuakhali' },
        { name: t('গাইবান্ধা', 'Gaibandha'), org: t('বাস্তবায়নকারী সংস্থা: এসকেএস ফাউন্ডেশন (SKS Foundation)', 'Implementing partner: SKS Foundation'), logo: sksLogo, id: 'gaibandha' },
    ];

    const values = [
        { icon: '👥', title: t('ক্লাব সভা', 'Club meetings'), color: 'from-teal-400 to-cyan-500' },
        { icon: '🌤️', title: t('আবহাওয়া পর্যবেক্ষণ', 'Weather observation'), color: 'from-blue-400 to-indigo-500' },
        { icon: '📚', title: t('ওয়ার্কশপ ও প্রশিক্ষণ', 'Workshops and training'), color: 'from-orange-400 to-red-500' },
        { icon: '📢', title: t('সচেতনতা ক্যাম্পেইন', 'Awareness campaigns'), color: 'from-pink-400 to-purple-500' },
        { icon: '📅', title: t('ইভেন্ট/দিবস উদ্যাপন', 'Event and day celebrations'), color: 'from-yellow-400 to-orange-500' },
    ];

    return (
        <div className="relative min-h-screen flex flex-col overflow-x-hidden bg-gray-50">
            <TopNav title={t("আমাদের সম্পর্কে", "About Us")} brandName={t("মেট ক্লাব", "Met Club")} />

            {/* Hero Section */}
            <section className="relative z-10 min-h-screen flex items-center justify-center py-10 md:py-15 lg:py-20 overflow-hidden">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0"
                >
                    <source src={coverVideo} type="video/mp4" />
                </video>
                {/* Overlay for text readability */}
                <div className="absolute inset-0 bg-black/45 z-10"></div>

                <div className="site-container relative z-20 text-center px-4 sm:px-6 lg:px-8 header-anim">
                    <div
                        className="text-3xl md:text-5xl font-bold mb-6 animate-slide-up delay-100"
                        style={{ color: "#b91c1c", textShadow: titleShadow }}
                    >
                        {t("আবহাওয়া চক্র", "Weather Cycle")}
                    </div>

                    <p
                        className="text-xl md:text-3xl font-semibold mb-8 animate-slide-up delay-200"
                        style={{ color: "#ffffff", textShadow: subtitleShadow }}
                    >
                        {t('"তরুণ মন, শক্তিশালী সতর্কতা"', '"Young Minds, Stronger Warnings"')}
                    </p>

                    <div
                        className="text-lg max-w-3xl mx-auto leading-relaxed animate-slide-up delay-300 font-semibold"
                        style={{ color: "#ffffff", textShadow: subtitleShadow }}
                    >
                        {t("একটি শিশু-কিশোর চালিত প্ল্যাটফর্ম যেখানে শিশুরা আবহাওয়া পর্যবেক্ষণ এবং দুর্যোগ সতর্কতার মাধ্যমে তাদের সম্প্রদায়কে নিরাপদ রাখতে শিখে", "A youth-led platform where children learn weather observation and disaster warnings to help keep their communities safe.")}
                    </div>
                </div>
            </section>

            {/* Mission & Vision - Solid Background, Solid Cards */}
            <section id="mission-vision" className="relative z-10 py-10 md:py-15 lg:py-20 bg-linear-to-br from-red-50 to-orange-50">
                <div className="site-container px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        <div className="group rounded-3xl p-10 hover:scale-105 transition-all duration-500 animate-slide-right"
                            style={{
                                background: "rgba(255,255,255,0.22)",
                                border: "1.5px solid #fca5a599",
                                backdropFilter: "blur(20px) saturate(160%)",
                                WebkitBackdropFilter: "blur(20px) saturate(160%)",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                            }}>
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-20 h-20 bg-linear-to-br from-red-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                                    <Eye className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-3xl md:text-4xl font-black" style={{ color: "#b91c1c", textShadow: titleShadow }}>{t("ভিশন", "Vision")}</h3>
                            </div>
                            <p className="text-lg text-gray-800 font-semibold leading-relaxed">
                                {t("একটি নিরাপদ ও সচেতন সমাজ গড়ে তুলতে শিশুদের আবহাওয়া পর্যবেক্ষণ, পূর্বাভাস এবং আগাম সতর্কতার শিক্ষা প্রদান করা।", "To educate children about weather observation, forecasting, and early warnings so they can help build a safer, more aware society.")}
                            </p>
                            <div className="mt-6 flex items-center space-x-2 text-red-700 font-bold">
                                <Sparkles className="w-5 h-5" />
                                <span>{t("একটি নিরাপদ ভবিষ্যৎ", "A Safer Future")}</span>
                            </div>
                        </div>

                        <div className="group rounded-3xl p-10 hover:scale-105 transition-all duration-500 animate-slide-left"
                            style={{
                                background: "rgba(255,255,255,0.22)",
                                border: "1.5px solid #fca5a599",
                                backdropFilter: "blur(20px) saturate(160%)",
                                WebkitBackdropFilter: "blur(20px) saturate(160%)",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                            }}>
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-20 h-20 bg-linear-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                                    <Target className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-3xl md:text-4xl font-black" style={{ color: "#b91c1c", textShadow: titleShadow }}>{t("মিশন", "Mission")}</h3>
                            </div>
                            <p className="text-lg text-gray-800 font-semibold leading-relaxed">
                                {t("একটি প্ল্যাটফর্ম যেখানে শিশুরা দুর্যোগের পূর্বাভাস এবং আগাম সতর্কতা সম্পর্কে জেনে নিজের পরিবার, জীবন এবং সম্পদ রক্ষা করতে পারবে।", "To create a platform where children learn about disaster forecasts and early warnings so they can protect their families, lives, and property.")}
                            </p>
                            <div className="mt-6 flex items-center space-x-2 text-red-700 font-bold">
                                <Heart className="w-5 h-5" />
                                <span>{t("সম্প্রদায় সুরক্ষা", "Community Protection")}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="text-center mb-10">
                            <h3 className="text-4xl md:text-5xl font-black mb-4" style={{ color: "#b91c1c", textShadow: titleShadow }}>{t("মেট ক্লাব কী?", "What is Met Club?")}</h3>
                            <div className="w-24 h-1 bg-red-500 mx-auto mb-6"></div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="text-center md:text-left">
                                <p className="text-xl font-semibold text-gray-800 leading-relaxed mb-6">
                                    {t('"মেট ক্লাব – আবহাওয়া চক্র" একটি শিশু-কিশোর চালিত প্ল্যাটফর্ম যা শিশু এবং তরুণদের দ্বারা পরিচালিত হয়।', '"Met Club – Weather Cycle" is a youth-led platform run by children and young people.')}
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3 bg-red-50 rounded-xl p-4 border border-red-200">
                                        <div className="text-3xl">📚</div>
                                        <span className="text-lg font-bold text-red-900">{t("আবহাওয়া শিক্ষা ও প্রশিক্ষণ", "Weather education and training")}</span>
                                    </div>
                                    <div className="flex items-center space-x-3 bg-red-50 rounded-xl p-4 border border-red-200">
                                        <div className="text-3xl">⚠️</div>
                                        <span className="text-lg font-bold text-red-900">{t("আগাম সতর্কীকরণ ব্যবস্থা", "Early warning systems")}</span>
                                    </div>
                                    <div className="flex items-center space-x-3 bg-red-50 rounded-xl p-4 border border-red-200">
                                        <div className="text-3xl">🦸</div>
                                        <span className="text-lg font-bold text-red-900">{t("দুর্যোগ প্রস্তুতি", "Disaster preparedness")}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center w-full">
                                <div className="relative w-full max-w-lg">
                                    {/* Video Wrapper */}
                                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-black hover:scale-[1.02] transition-transform duration-300 z-10">
                                        <video
                                            controls
                                            controlsList="nodownload"
                                            preload="metadata"
                                            poster={whatIsPoster}
                                            className="w-full aspect-video object-cover"
                                        >
                                            <source src={whatIsVideo} type="video/mp4" />
                                            {t("আপনার ব্রাউজার ভিডিও সমর্থন করে না।", "Your browser does not support the video tag.")}
                                        </video>
                                        <div className="absolute top-3 right-3 bg-red-600/90 text-white font-bold text-xs px-3 py-1 rounded-full shadow-md pointer-events-none z-10 animate-pulse">
                                            {t("ভিডিও 🎥", "Video 🎥")}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Objectives - Image Background, Glassy Cards */}
            <section id="objectives" className="relative z-10 py-10 md:py-15 lg:py-20 bg-cover bg-center" style={{ backgroundImage: `url(${startJourneyBg})` }}>
                <div className="absolute inset-0 bg-white/40 pointer-events-none backdrop-blur-[1px]"></div>
                <div className="site-container relative z-10 px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: "#b91c1c", textShadow: titleShadow }}>{t("আমাদের উদ্দেশ্য", "Our Objectives")}</h2>
                        <p className="text-lg md:text-xl font-semibold" style={{ color: "#1f2937", textShadow: subtitleShadow }}>
                            {t("শিশুদের জীবন রক্ষাকারী দক্ষতা প্রদান এবং দুর্যোগ প্রস্তুতিতে তাদের ক্ষমতায়ন", "Equipping children with life-saving skills and empowering them to prepare for disasters.")}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {objectives.map((objective, index) => (
                            <div
                                key={index}
                                className="group rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                                style={{
                                    background: "rgba(255,255,255,0.22)",
                                    border: "1.5px solid #fca5a599",
                                    backdropFilter: "blur(20px) saturate(160%)",
                                    WebkitBackdropFilter: "blur(20px) saturate(160%)",
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                                }}
                            >
                                <div className={`w-20 h-20 bg-linear-to-br from-red-400 to-orange-500 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-lg mx-auto`}>
                                    {objective.icon}
                                </div>
                                <h3 className="text-lg font-bold text-red-900 text-center leading-relaxed" style={{ textShadow: titleShadow }}>
                                    {objective.title}
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Structure - Solid Background, Solid Cards */}
            <section id="structure" className="relative z-10 py-10 md:py-15 lg:py-20 bg-linear-to-br from-orange-50 to-red-50">
                <div className="site-container px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: "#b91c1c", textShadow: titleShadow }}>{t("সংগঠন কাঠামো", "Organizational Structure")}</h2>
                        <p className="text-lg md:text-xl font-semibold" style={{ color: "#1f2937", textShadow: subtitleShadow }}>{t("যুব নেতৃত্ব এবং সহযোগিতার মাধ্যমে শক্তিশালী", "Strengthened through youth leadership and collaboration")}</p>
                    </div>

                    <div className="space-y-12">
                        {/* Technical Advisor Section */}
                        <div>
                            <div className="w-full max-w-3xl mx-auto mb-8">
                                <div className="bg-linear-to-r from-red-700 to-red-600 text-white rounded-2xl p-8 text-center shadow-lg hover:scale-105 transition-transform">
                                    <Users className="w-14 h-14 mx-auto mb-3" />
                                    <h3 className="text-3xl font-bold mb-2">{t("কারিগরি উপদেষ্টা", "Technical Advisor")}</h3>
                                    <p className="text-sm opacity-90 font-semibold">{t("পেশাদার নির্দেশনা এবং কারিগরি সহায়তা প্রদান", "Providing professional guidance and technical support")}</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl p-8 shadow-md border-l-4 border-red-500">
                                <h4 className="text-xl font-bold mb-4" style={{ color: "#b91c1c" }}>{t("দায়িত্বসমূহ:", "Responsibilities:")}</h4>
                                <ul className="space-y-3 text-gray-800 font-semibold">
                                    <li className="flex items-start space-x-3">
                                        <span className="text-red-600 font-bold mt-1">•</span>
                                        <span>{t("আবহাওয়া ও দুর্যোগ সংক্রান্ত কারিগরি জ্ঞান ও তথ্য দিয়ে ক্লাবকে সহায়তা প্রদান করা", "Supporting the club with technical knowledge and information about weather and disasters")}</span>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <span className="text-red-600 font-bold mt-1">•</span>
                                        <span>{t("শিশু ও তরুণ সদস্যদের সহজ ও বোধগম্যভাবে আবহাওয়া বিষয়ক শিক্ষা ও প্রশিক্ষণ দেওয়ার পদ্ধতি নির্ধারণে সহায়তা করা", "Helping develop clear, age-appropriate ways to teach weather topics and train children and young members")}</span>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <span className="text-red-600 font-bold mt-1">•</span>
                                        <span>{t("ক্লাবের কার্যক্রম পরিকল্পনা, বাস্তবায়ন ও মূল্যায়নে পরামর্শ প্রদান করা", "Advising on the planning, delivery, and evaluation of club activities")}</span>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <span className="text-red-600 font-bold mt-1">•</span>
                                        <span>{t("ক্লাব সদস্যদের আবহাওয়া পর্যবেক্ষণ, পূর্বাভাস ব্যাখ্যা, এবং আগাম সতর্কবার্তার ব্যবহার শেখাতে নির্দেশনা ও সহায়তা প্রদান করা", "Guiding and supporting members in weather observation, forecast interpretation, and the use of early warnings")}</span>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <span className="text-red-600 font-bold mt-1">•</span>
                                        <span>{t("ক্লাবের যাবতীয় উপকরণ (পাঠ্য, ভিজ্যুয়াল, পোস্টার ইত্যাদি) প্রস্তুতকরণে কারিগরি দিকনির্দেশনা প্রদান করা", "Providing technical guidance for preparing club materials, including lessons, visuals, and posters")}</span>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <span className="text-red-600 font-bold mt-1">•</span>
                                        <span>{t("শিশুদের জন্য নিরাপদ ও অংশগ্রহণমূলক শেখার পরিবেশ নিশ্চিত করতে দিকনির্দেশনা দেওয়া", "Helping ensure a safe and participatory learning environment for children")}</span>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <span className="text-red-600 font-bold mt-1">•</span>
                                        <span>{t("প্রয়োজনে সংশ্লিষ্ট সংস্থা বা বিশেষজ্ঞদের সঙ্গে ক্লাবের যোগাযোগ স্থাপন এবং সমন্বয় সাধন করা", "Connecting and coordinating the club with relevant organizations or experts when needed")}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Executive Structure */}
                        <div className="pt-8">
                            <div className="flex flex-col items-center space-y-8">
                                <div className="flex items-center justify-center w-full">
                                    <div className="w-1 h-12 bg-linear-to-b from-red-500 to-orange-500"></div>
                                </div>

                                {/* Chief Executives */}
                                <div className="w-full">
                                    <h4 className="text-2xl font-bold text-center mb-6" style={{ color: "#b91c1c", textShadow: titleShadow }}>{t("প্রধান নির্বাহী (৪ জন)", "Chief Executives (4)")}</h4>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="bg-gradient-to-br from-orange-600 to-orange-500 text-white rounded-2xl p-6 text-center shadow-lg hover:scale-105 transition-transform">
                                            <Award className="w-10 h-10 mx-auto mb-3" />
                                            <h3 className="text-xl font-bold">{t("ক্যাপ্টেন", "Captain")}</h3>
                                        </div>
                                        <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl p-6 text-center shadow-lg hover:scale-105 transition-transform">
                                            <Users className="w-10 h-10 mx-auto mb-3" />
                                            <h3 className="text-xl font-bold">{t("ভাইস-ক্যাপ্টেন", "Vice-Captain")}</h3>
                                        </div>
                                        <div className="bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-2xl p-6 text-center shadow-lg hover:scale-105 transition-transform">
                                            <Target className="w-10 h-10 mx-auto mb-3" />
                                            <h3 className="text-xl font-bold">{t("অর্থ-বন্ধু", "Finance Lead")}</h3>
                                        </div>
                                        <div className="bg-gradient-to-br from-orange-500 to-red-400 text-white rounded-2xl p-6 text-center shadow-lg hover:scale-105 transition-transform">
                                            <Heart className="w-10 h-10 mx-auto mb-3" />
                                            <h3 className="text-xl font-bold">{t("বার্তা-বন্ধু", "Communications Lead")}</h3>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center w-full">
                                    <div className="w-1 h-12 bg-linear-to-b from-orange-500 to-red-400"></div>
                                </div>

                                {/* Executive Members & General Members */}
                                <div className="grid md:grid-cols-2 gap-6 w-full">
                                    <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl p-6 text-center shadow-lg hover:scale-105 transition-transform">
                                        <Users className="w-10 h-10 mx-auto mb-3" />
                                        <h3 className="text-xl font-bold">{t("কার্যনির্বাহী সদস্য", "Executive Members")}</h3>
                                        <p className="text-3xl font-black mt-2 text-white">{t("৭ জন", "7 people")}</p>
                                    </div>
                                    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl p-6 text-center shadow-lg hover:scale-105 transition-transform">
                                        <Heart className="w-12 h-12 mx-auto mb-3" />
                                        <h3 className="text-2xl font-bold">{t("সাধারণ সদস্য", "General Members")}</h3>
                                        <p className="text-sm mt-2 opacity-90 font-semibold">{t("৭ম-৯ম শ্রেণির সকল শিক্ষার্থী", "All students in grades 7–9")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Activities - Image Background, Glassy Cards */}
            <section id="activities" className="relative z-10 py-10 md:py-15 lg:py-20 bg-cover bg-center" style={{ backgroundImage: `url(${aboutBg})` }}>
                <div className="site-container relative z-10 px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: "#b91c1c", textShadow: titleShadow }}>{t("আমাদের কার্যক্রম", "Our Activities")}</h2>
                        <p className="text-lg md:text-xl font-semibold" style={{ color: "#ffffff", textShadow: subtitleShadow }}>{t("হাতে-কলমে শিক্ষা এবং সম্প্রদায় সম্পৃক্ততা", "Hands-on learning and community engagement")}</p>
                    </div>

                    <div className="grid md:grid-cols-5 gap-6">
                        {activities.map((activity, index) => (
                            <div
                                key={index}
                                className="group rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-3"
                                style={{
                                    background: "rgba(255,255,255,0.22)",
                                    border: "1.5px solid #fca5a599",
                                    backdropFilter: "blur(20px) saturate(160%)",
                                    WebkitBackdropFilter: "blur(20px) saturate(160%)",
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                                }}
                            >
                                <div className={`w-16 h-16 bg-linear-to-br from-red-400 to-orange-500 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 group-hover:rotate-12 transition-transform shadow-lg mx-auto`}>
                                    {activity.icon}
                                </div>
                                <h3 className="text-base font-bold text-red-900 text-center" style={{ textShadow: titleShadow }}>
                                    {activity.title}
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Impact - Solid Background, Solid Cards */}
            <section id="impact" className="relative z-10 py-10 md:py-15 lg:py-20 bg-red-50">
                <div className="site-container px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-4 mb-6">
                            <img src={logo} alt="MET CLUB LOGO" className='w-40 h-40' />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ color: "#b91c1c", textShadow: titleShadow }}>{t("তরুন চিন্তা, শক্তিশালী সতর্কতা", "Young Minds, Stronger Warnings")}</h2>
                        <p className="text-xl md:text-2xl font-bold mb-8 text-red-800">
                            {t("আবহাওয়ার পূর্বাভাস বুঝে গড়ি আমাদের নিরাপদের পথ", "We build a safer path by understanding weather forecasts.")}
                        </p>
                        <div className="max-w-4xl mx-auto text-lg leading-relaxed font-semibold text-gray-800">
                            {t("আমরা বিশ্বাস করি যে শিশুরা পরিবর্তনের শক্তিশালী এজেন্ট। মেট ক্লাবের মাধ্যমে, আমরা তাদের জ্ঞান, দক্ষতা এবং আত্মবিশ্বাস দিয়ে সজ্জিত করি যাতে তারা তাদের পরিবার এবং সম্প্রদায়কে আবহাওয়াজনিত দুর্যোগ থেকে রক্ষা করতে পারে।", "We believe children are powerful agents of change. Through Met Club, we equip them with the knowledge, skills, and confidence to protect their families and communities from weather-related disasters.")}
                        </div>
                    </div>
                </div>
            </section>

            {/* Locations - Image Background, Glassy Cards */}
            <section id="locations" className="relative z-10 py-10 md:py-15 lg:py-20 bg-cover bg-center" style={{ backgroundImage: `url(${chapterBg})` }}>
                <div className="site-container relative z-10 px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: "#b91c1c", textShadow: titleShadow }}>{t("কার্যক্রমের এলাকা", "Activity Areas")}</h2>
                        <p className="text-lg md:text-xl font-semibold" style={{ color: "#1f2937", textShadow: subtitleShadow }}>{t("বাংলাদেশ জুড়ে সম্প্রসারণ", "Expanding across Bangladesh")}</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {locations.map((loc) => (
                            <Link to={isEnglish ? `/en/location/${loc.id}` : `/location/${loc.id}`} key={loc.id} className="group relative rounded-3xl shadow-xl p-8 pt-12 text-center hover:scale-105 transition-all duration-500 block" style={{
                                background: "rgba(255,255,255,0.22)",
                                border: "1.5px solid #fca5a599",
                                backdropFilter: "blur(20px) saturate(160%)",
                                WebkitBackdropFilter: "blur(20px) saturate(160%)",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                            }}>
                                <div className="absolute top-6 right-8">
                                    <div className="relative">
                                        <MapPin className="w-7 h-7 text-red-500/80 group-hover:scale-110 group-hover:text-red-500 transition-all duration-300" />
                                        <div className="absolute -top-2 -right-4 bg-red-600 text-white rounded-full px-2 py-[2px] text-[10px] font-bold shadow-md tracking-wide whitespace-nowrap z-10">
                                            {t("চালু", "Active")}
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-3xl font-black mb-3 mt-4" style={{ color: "#b91c1c", textShadow: titleShadow }}>{loc.name}</h3>
                                <p className="text-lg text-gray-800 font-semibold mb-3">{t("বর্তমানে সক্রিয়", "Currently active")}</p>
                                <p className="text-sm font-semibold mb-3" style={{ color: "#b91c1c" }}>{loc.org}</p>
                                <div className="flex items-center justify-center h-16 mt-4 mb-2">
                                    <img src={loc.logo} alt={loc.name} className="h-full w-auto max-w-[140px] object-contain rounded-md" />
                                </div>
                                <div className="mt-6 flex items-center justify-center space-x-2 text-red-700">
                                    <TrendingUp className="w-5 h-5" />
                                    <span className="font-bold">{t("৫০+ সদস্য", "50+ members")}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values - Solid Background, Solid Cards */}
            <section id="values" className="relative z-10 py-10 md:py-15 lg:py-20 bg-linear-to-br from-red-50 to-orange-50">
                <div className="site-container px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: "#b91c1c", textShadow: titleShadow }}>{t("আমাদের মূল্যবোধ", "Our Values")}</h2>
                        <p className="text-lg md:text-xl font-semibold" style={{ color: "#1f2937", textShadow: subtitleShadow }}>{t("শিশু সুরক্ষা এবং অন্তর্ভুক্তিতে প্রতিশ্রুতিবদ্ধ", "Committed to child protection and inclusion")}</p>
                    </div>

                    <div className="grid md:grid-cols-5 gap-6">
                        {values.map((activity, index) => (
                            <div
                                key={index}
                                className="group rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3"
                                style={{
                                    background: "rgba(255,255,255,0.22)",
                                    border: "1.5px solid #fca5a599",
                                    backdropFilter: "blur(20px) saturate(160%)",
                                    WebkitBackdropFilter: "blur(20px) saturate(160%)",
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                                }}
                            >
                                <div className={`w-20 h-20 bg-linear-to-br ${activity.color} rounded-2xl flex items-center justify-center text-4xl mb-4 group-hover:scale-110 group-hover:rotate-12 transition-transform shadow-lg mx-auto`}>
                                    {activity.icon}
                                </div>
                                <h3 className="text-lg font-bold text-red-900 text-center" style={{ textShadow: titleShadow }}>
                                    {activity.title}
                                </h3>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <Shield className="w-16 h-16 mx-auto mb-6 text-red-600" />
                        <h3 className="text-3xl md:text-4xl font-black mb-6" style={{ color: "#b91c1c", textShadow: titleShadow }}>{t("শিশু সুরক্ষা নীতি", "Child Protection Policy")}</h3>
                        <p className="text-lg font-semibold text-gray-800 leading-relaxed max-w-4xl mx-auto">
                            {t("মেট ক্লাব সকল শিশুর সুরক্ষা এবং কল্যাণে প্রতিশ্রুতিবদ্ধ। আমরা একটি নিরাপদ, সহায়ক এবং অন্তর্ভুক্তিমূলক পরিবেশ নিশ্চিত করি যেখানে প্রতিটি শিশু শিখতে এবং বৃদ্ধি পেতে পারে। আমাদের কঠোর সুরক্ষা নীতি এবং প্রক্রিয়া রয়েছে যা আন্তর্জাতিক মান অনুসরণ করে।", "Met Club is committed to the safety and well-being of every child. We provide a safe, supportive, and inclusive environment where all children can learn and grow, guided by safeguarding policies aligned with international standards.")}
                        </p>
                    </div>
                </div>
            </section>

            <footer className="relative z-10 bg-[linear-gradient(180deg,rgba(20,6,6,0.9),rgba(20,6,6,1))] text-white py-10 md:py-15 lg:py-20 border-t border-red-900">
                <div className="site-container px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center justify-center space-x-4">
                        <img src={logo} alt="MET CLUB LOGO" className='w-32 h-32' />
                        <div>
                            <h3 className="text-2xl font-black text-red-500" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>{t("মেট ক্লাব", "Met Club")}</h3>
                            <p className="text-sm text-gray-300 font-semibold mt-1">{t("আবহাওয়া চক্র", "Weather Cycle")}</p>
                            <p className="text-red-200 my-4 font-semibold italic">
                                {t('"তরুণ মন, শক্তিশালী সতর্কতা"', '"Young Minds, Stronger Warnings"')}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <Partners bg="bg-white" />
                    </div>
                </div>
            </footer>
        </div>
    )
}
