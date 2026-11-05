import { Target, Eye, Users, Award, MapPin, Heart, Shield, Sparkles, TrendingUp } from 'lucide-react';
import logo from "../../../assets/images/logo_original.png";
import Partners from '../../../components/Shared/Partners';
import coverVideo from "../../../assets/videos/Drone shot for cover.mp4";
import whatIsVideo from "../../../assets/videos/What is MET Club_.mp4";
import whatIsPoster from "../../../assets/images/what_is_poster.jpg";
import startJourneyBg from "../../../assets/images/start-journey-page-bg.jpeg";
import aboutBg from "../../../assets/images/about-page-bg.png";
import chapterBg from "../../../assets/images/chapter-bg.png";
import TopNav from "../../../components/Shared/TopBar";
import { useLocaleRouteSync } from "../../../hooks/useLocaleRouteSync";
import { Link } from "react-router";

const titleShadow = "-1px -1px 0 rgba(255,255,255,0.96), 1px -1px 0 rgba(255,255,255,0.96), -1px 1px 0 rgba(255,255,255,0.96), 1px 1px 0 rgba(255,255,255,0.96), 0 2px 0 rgba(185,28,28,0.20), 0 8px 20px rgba(127,29,29,0.24)";
const subtitleShadow = "0 1px 6px rgba(255,255,255,0.28)";

export default function About() {
    useLocaleRouteSync("/", "/en");

    return (
        <div className="relative min-h-screen flex flex-col overflow-x-hidden -mt-18.5 bg-gray-50">
            <TopNav title="About Us" brandName="Met Club" />

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

                <div className="relative z-20 text-center px-4 max-w-6xl mx-auto header-anim">
                    <div
                        className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 animate-slide-up delay-100"
                        style={{ color: "#b91c1c", textShadow: titleShadow }}
                    >
                        Weather Cycle
                    </div>

                    <p
                        className="text-xl md:text-3xl font-semibold mb-4 md:mb-6 lg:mb-8 animate-slide-up delay-200"
                        style={{ color: "#ffffff", textShadow: subtitleShadow }}
                    >
                        "Young Minds, Stronger Warnings"
                    </p>

                    <div
                        className="text-[16px] md:text-lg max-w-3xl mx-auto leading-relaxed animate-slide-up delay-300 font-normal"
                        style={{ color: "#ffffff", textShadow: subtitleShadow }}
                    >
                        A youth-led platform where children learn weather observation and disaster warnings to help keep their communities safe.
                    </div>
                </div>

                <div className="absolute top-32 left-10 text-6xl animate-float opacity-60 z-20">☀️</div>
                <div className="absolute top-52 right-20 text-7xl animate-float-delayed opacity-60 z-20">☁️</div>
                <div className="absolute bottom-32 left-32 text-5xl animate-float opacity-60 z-20">🌧️</div>
            </section>

            {/* Mission & Vision - Solid Background, Solid Cards */}
            <section id="mission-vision" className="relative z-10 py-10 md:py-15 lg:py-20 px-4 bg-linear-to-br from-red-50 to-orange-50">
                <div className="container mx-auto max-w-6xl">
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
                                <h3 className="text-3xl md:text-4xl font-black" style={{ color: "#b91c1c", textShadow: titleShadow }}>Vision</h3>
                            </div>
                            <p className="text-lg text-gray-800 font-semibold leading-relaxed">
                                To educate children about weather observation, forecasting, and early warning so that they can help build a safer and more aware society.
                            </p>
                            <div className="mt-6 flex items-center space-x-2 text-red-700 font-bold">
                                <Sparkles className="w-5 h-5" />
                                <span>A Safer Future</span>
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
                                <h3 className="text-3xl md:text-4xl font-black" style={{ color: "#b91c1c", textShadow: titleShadow }}>Mission</h3>
                            </div>
                            <p className="text-lg text-gray-800 font-semibold leading-relaxed">
                                To create a platform where children can learn about disaster forecasting and early warnings so they can protect their families, lives, and resources.
                            </p>
                            <div className="mt-6 flex items-center space-x-2 text-red-700 font-bold">
                                <Heart className="w-5 h-5" />
                                <span>Community Protection</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="text-center mb-10">
                            <h3 className="text-4xl md:text-5xl font-black mb-4" style={{ color: "#b91c1c", textShadow: titleShadow }}>What is Met Club?</h3>
                            <div className="w-24 h-1 bg-red-500 mx-auto mb-6"></div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="text-center md:text-left">
                                <p className="text-xl font-semibold text-gray-800 leading-relaxed mb-6">
                                    "Met Club - Weather Cycle" is a youth-led platform run by children and young people.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3 bg-red-50 rounded-xl p-4 border border-red-200">
                                        <div className="text-3xl">📚</div>
                                        <span className="text-lg font-bold text-red-900">Weather education and training</span>
                                    </div>
                                    <div className="flex items-center space-x-3 bg-red-50 rounded-xl p-4 border border-red-200">
                                        <div className="text-3xl">⚠️</div>
                                        <span className="text-lg font-bold text-red-900">Early warning systems</span>
                                    </div>
                                    <div className="flex items-center space-x-3 bg-red-50 rounded-xl p-4 border border-red-200">
                                        <div className="text-3xl">🦸</div>
                                        <span className="text-lg font-bold text-red-900">Disaster preparedness</span>
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
                                            Your browser does not support the video tag.
                                        </video>
                                        <div className="absolute top-3 right-3 bg-red-600/90 text-white font-bold text-xs px-3 py-1 rounded-full shadow-md pointer-events-none z-10 animate-pulse">
                                            Video 🎥
                                        </div>
                                    </div>
                                    {/* Atmospheric floating emojis */}
                                    <div className="absolute -top-8 -right-8 text-6xl animate-float-delayed opacity-80 pointer-events-none z-20">☀️</div>
                                    <div className="absolute -bottom-4 -left-8 text-6xl animate-float opacity-80 pointer-events-none z-20">🌧️</div>
                                    <div className="absolute top-1/2 -right-12 text-6xl animate-float-delayed opacity-80 pointer-events-none z-20">☁️</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Objectives - Image Background, Glassy Cards */}
            <section id="objectives" className="relative z-10 py-10 md:py-15 lg:py-20 px-4 bg-cover bg-center" style={{ backgroundImage: `url(${startJourneyBg})` }}>
                <div className="absolute inset-0 bg-white/40 pointer-events-none backdrop-blur-[1px]"></div>
                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: "#b91c1c", textShadow: titleShadow }}>Our Objectives</h2>
                        <p className="text-lg md:text-xl font-semibold" style={{ color: "#1f2937", textShadow: subtitleShadow }}>
                            Providing children with life-saving skills and empowering them in disaster preparedness
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: '🌡️', title: 'Providing knowledge about weather observation' },
                            { icon: '⚠️', title: 'Explaining uncertainty in early warning systems' },
                            { icon: '🛡️', title: 'Teaching children how to keep themselves and others safe' },
                            { icon: '💡', title: 'Building awareness among children' },
                            { icon: '✍️', title: 'Giving hands-on training' },
                            { icon: '🦸', title: 'Inspiring children to take an active role in disaster response' }
                        ].map((objective, index) => (
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
            <section id="structure" className="relative z-10 py-10 md:py-15 lg:py-20 px-4 bg-linear-to-br from-orange-50 to-red-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: "#b91c1c", textShadow: titleShadow }}>Organizational Structure</h2>
                        <p className="text-lg md:text-xl font-semibold" style={{ color: "#1f2937", textShadow: subtitleShadow }}>Strengthened through youth leadership and collaboration</p>
                    </div>

                    <div className="max-w-6xl mx-auto">
                        <div>
                            <div className="flex flex-col items-center space-y-8">
                                <div className="w-full max-w-md">
                                    <div className="bg-linear-to-r from-red-600 to-red-500 text-white rounded-2xl p-6 text-center shadow-lg hover:scale-105 transition-transform">
                                        <Users className="w-12 h-12 mx-auto mb-3" />
                                        <h3 className="text-2xl font-bold">Technical Advisors</h3>
                                        <p className="text-sm mt-2 opacity-90 font-semibold">Providing professional guidance</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center w-full">
                                    <div className="w-1 h-12 bg-linear-to-b from-red-500 to-orange-500"></div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 w-full">
                                    <div className="bg-linear-to-br from-orange-500 to-red-500 text-white rounded-2xl p-6 text-center shadow-lg hover:scale-105 transition-transform">
                                        <Award className="w-10 h-10 mx-auto mb-3" />
                                        <h3 className="text-xl font-bold">Chief Executives</h3>
                                        <p className="text-3xl font-black mt-2 text-white">4 people</p>
                                    </div>
                                    <div className="bg-linear-to-br from-red-400 to-orange-500 text-white rounded-2xl p-6 text-center shadow-lg hover:scale-105 transition-transform">
                                        <Users className="w-10 h-10 mx-auto mb-3" />
                                        <h3 className="text-xl font-bold">Executive Members</h3>
                                        <p className="text-3xl font-black mt-2 text-white">7 people</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center w-full">
                                    <div className="w-1 h-12 bg-linear-to-b from-orange-500 to-red-400"></div>
                                </div>

                                <div className="w-full max-w-md">
                                    <div className="bg-linear-to-r from-red-500 to-red-600 text-white rounded-2xl p-6 text-center shadow-lg hover:scale-105 transition-transform">
                                        <Heart className="w-12 h-12 mx-auto mb-3" />
                                        <h3 className="text-2xl font-bold">General Members</h3>
                                        <p className="text-sm mt-2 opacity-90 font-semibold">All students from class 7 to 9</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Activities - Image Background, Glassy Cards */}
            <section id="activities" className="relative z-10 py-10 md:py-15 lg:py-20 px-4 bg-cover bg-center" style={{ backgroundImage: `url(${aboutBg})` }}>
                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: "#b91c1c", textShadow: titleShadow }}>Our Activities</h2>
                        <p className="text-lg md:text-xl font-semibold" style={{ color: "#ffffff", textShadow: subtitleShadow }}>Hands-on learning and community engagement</p>
                    </div>

                    <div className="grid md:grid-cols-5 gap-6">
                        {[
                            { icon: '👥', title: 'Club meetings' },
                            { icon: '🌤️', title: 'Weather observation' },
                            { icon: '📚', title: 'Workshops and training' },
                            { icon: '📢', title: 'Awareness campaigns' },
                            { icon: '📅', title: 'Event celebrations' }
                        ].map((activity, index) => (
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
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-4 mb-6">
                            <img src={logo} alt="MET CLUB LOGO" className='w-40 h-40' />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ color: "#b91c1c", textShadow: titleShadow }}>Young Minds, Stronger Warnings</h2>
                        <p className="text-xl md:text-2xl font-bold mb-8 text-red-800">
                            We build a safer path by understanding weather forecasts.
                        </p>
                        <div className="max-w-4xl mx-auto text-lg leading-relaxed font-semibold text-gray-800">
                            We believe children are powerful agents of change. Through Met Club, we equip them with knowledge, skills, and confidence so they can protect their families and communities from weather-related disasters.
                        </div>


                    </div>
                </div>
            </section>

            {/* Locations - Image Background, Glassy Cards */}
            <section id="locations" className="relative z-10 py-10 md:py-15 lg:py-20 px-4 bg-cover bg-center" style={{ backgroundImage: `url(${chapterBg})` }}>
                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: "#b91c1c", textShadow: titleShadow }}>Activity Areas</h2>
                        <p className="text-lg md:text-xl font-semibold" style={{ color: "#1f2937", textShadow: subtitleShadow }}>Expansion across Bangladesh</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { name: 'Chattogram', id: 'chattogram' },
                            { name: 'Patuakhali', id: 'patuakhali' },
                            { name: 'Gaibandha', id: 'gaibandha' }
                        ].map((loc, idx) => (
                            <Link to={`/en/location/${loc.id}`} key={idx} className="group rounded-3xl shadow-xl p-10 text-center hover:scale-105 transition-all duration-500 block" style={{
                                background: "rgba(255,255,255,0.22)",
                                border: "1.5px solid #fca5a599",
                                backdropFilter: "blur(20px) saturate(160%)",
                                WebkitBackdropFilter: "blur(20px) saturate(160%)",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                            }}>
                                <div className="relative mb-6">
                                    <MapPin className="w-20 h-20 mx-auto text-red-500 group-hover:scale-110 transition-transform" />
                                    <div className="absolute -top-2 right-1/4 bg-red-600 text-white rounded-full px-3 py-1 text-xs font-bold shadow-md">
                                        Active
                                    </div>
                                </div>
                                <h3 className="text-3xl font-black mb-3" style={{ color: "#b91c1c", textShadow: titleShadow }}>{loc.name}</h3>
                                <p className="text-lg text-gray-800 font-semibold">Currently active</p>
                                <div className="mt-6 flex items-center justify-center space-x-2 text-red-700">
                                    <TrendingUp className="w-5 h-5" />
                                    <span className="font-bold">50+ members</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values - Solid Background, Solid Cards */}
            <section id="values" className="relative z-10 py-10 md:py-15 lg:py-20 px-4 bg-linear-to-br from-red-50 to-orange-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: "#b91c1c", textShadow: titleShadow }}>Our Values</h2>
                        <p className="text-lg md:text-xl font-semibold" style={{ color: "#1f2937", textShadow: subtitleShadow }}>Committed to child protection and inclusion</p>
                    </div>

                    <div className="grid md:grid-cols-5 gap-6">
                        {[
                            { icon: '👥', title: 'Club meetings', color: 'from-teal-400 to-cyan-500' },
                            { icon: '🌤️', title: 'Weather observation', color: 'from-blue-400 to-indigo-500' },
                            { icon: '📚', title: 'Workshops and training', color: 'from-orange-400 to-red-500' },
                            { icon: '📢', title: 'Awareness campaigns', color: 'from-pink-400 to-purple-500' },
                            { icon: '📅', title: 'Event / day celebrations', color: 'from-yellow-400 to-orange-500' }
                        ].map((activity, index) => (
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
                        <h3 className="text-3xl md:text-4xl font-black mb-6" style={{ color: "#b91c1c", textShadow: titleShadow }}>Child Protection Policy</h3>
                        <p className="text-lg font-semibold text-gray-800 leading-relaxed max-w-4xl mx-auto">
                            Met Club is committed to the safety and well-being of all children. We ensure a safe, supportive, and inclusive environment where every child can learn and grow. We follow strict safeguarding policies and procedures aligned with international standards.
                        </p>
                    </div>
                </div>
            </section>

            <footer className="relative z-10 bg-[linear-gradient(180deg,rgba(20,6,6,0.9),rgba(20,6,6,1))] text-white py-10 md:py-15 lg:py-20 px-4 border-t border-red-900">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col lg:flex-row items-center justify-center space-x-4">
                        <img src={logo} alt="MET CLUB LOGO" className='w-32 h-32' />
                        <div>
                            <h3 className="text-2xl font-black text-red-500" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>Met Club</h3>
                            <p className="text-sm text-gray-300 font-semibold mt-1">Weather Cycle</p>
                            <p className="text-red-200 my-4 font-semibold italic">
                                "Young Minds, Stronger Warnings"
                            </p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <Partners bg="bg-white" />
                    </div>
                </div>
            </footer>
        </div>
    );
}
