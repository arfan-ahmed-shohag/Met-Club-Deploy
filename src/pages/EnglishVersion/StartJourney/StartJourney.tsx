import { useState, useEffect } from "react";
import storyImg from "../../../assets/images/learning-zone.png";
import simulationImg from "../../../assets/images/practice-zone.png";
import bgImage from "../../../assets/images/start-journey-page-bg.jpeg";
import useAxiosProtected from "../../../hooks/axiosProtected";
import ZoneCard from "../../../components/StartJourney/ZoneCard";
import TopNav from "../../../components/Shared/TopBar";
import { useLocaleRouteSync } from "../../../hooks/useLocaleRouteSync";



export default function StartJourney() {

    useLocaleRouteSync("/start-journey", "/en/start-journey");

    const axios = useAxiosProtected();

    const [isChapterOneCompleted, setIsChapterOneCompleted] = useState(false);

    useEffect(() => {
        const checkChapterOneCompletion = async () => {
            const res = await axios.get("/user/chapter-one-completion-status");
            setIsChapterOneCompleted(res.data.data);
        }
        checkChapterOneCompletion();
    }, [axios]);



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

            <TopNav brandName="Met Club" />

            {/* ── Main Content ── */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-12 pb-12">
                {/* Header */}
                <div className="header-anim text-center mb-10">
                    <h1
                        className="text-3xl md:text-5xl font-black mb-2"
                        style={{
                            color: "#b91c1c",
                            textShadow:
                                "-1px -1px 0 rgba(255,255,255,0.96), 1px -1px 0 rgba(255,255,255,0.96), -1px 1px 0 rgba(255,255,255,0.96), 1px 1px 0 rgba(255,255,255,0.96), 0 2px 0 rgba(185,28,28,0.20), 0 8px 20px rgba(127,29,29,0.24)",
                        }}
                    >
                        Welcome to the Met Club!
                    </h1>
                    <p
                        className="text-lg md:text-xl mt-4"
                        style={{
                            color: "#1f2937",
                            fontWeight: 600,
                            textShadow: "0 1px 6px rgba(255,255,255,0.28)",
                        }}
                    >
                        Choose your path to preparation.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
                    <div className="card1 h-full">
                        <ZoneCard
                            title="Learning Zone"
                            titleColor="#991b1b"
                            borderColor="#f87171"
                            btnBg="linear-gradient(135deg, #ef4444, #dc2626)"
                            btnShadow="rgba(239,68,68,0.42)"
                            btnLabel="Start Learning"
                            link="/en/learning-selection"
                            description={
                                <>
                                    <strong>Enhance your knowledge!</strong>
                                    <br />
                                    Learn about weather, climate, and disasters.
                                </>
                            }
                            blobColor="#fca5a5"
                            illustration={
                                <img
                                    src={storyImg}
                                    alt="Story Zone"
                                    className="w-40 h-40 object-contain"
                                />
                            }
                        />
                    </div>

                    <div className="card2 h-full">
                        <ZoneCard
                            title="Simulation Zone"
                            titleColor="#9a3412"
                            borderColor="#fb923c"
                            btnBg="linear-gradient(135deg, #fb923c, #f97316)"
                            btnShadow="rgba(249,115,22,0.42)"
                            btnLabel={isChapterOneCompleted ? "Enter Simulation" : "Complete First Chapter"}
                            // disabled={!isChapterOneCompleted}
                            link="https://game.meteorologyclub.com/"
                            description={
                                <>
                                    <strong>Test your skills!</strong>
                                    <br />
                                    Test your skills in a real-life simulation.
                                </>
                            }
                            blobColor="#fdba74"
                            illustration={
                                <img
                                    src={simulationImg}
                                    alt="Simulation Zone"
                                    className="w-40 h-40 object-contain"
                                />
                            }
                        />
                    </div>
                </div>

                {/* NASA Learning Resources Banner */}
                <div className="mt-8 md:mt-10 w-full max-w-4xl z-10 px-2 animate-[dropIn_0.5s_ease-out]">
                    <a
                        href="https://www.nasa.gov/learning-resources/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex flex-col sm:flex-row items-center justify-between p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.015] active:scale-[0.99] overflow-hidden"
                        style={{
                            background: "rgba(255, 255, 255, 0.16)",
                            borderColor: "rgba(255, 255, 255, 0.28)",
                            backdropFilter: "blur(24px) saturate(160%)",
                            WebkitBackdropFilter: "blur(24px) saturate(160%)",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
                        }}
                    >
                        {/* Glass shine animation effect */}
                        <div
                            className="absolute inset-0 pointer-events-none rounded-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-300"
                            style={{
                                background: "linear-gradient(120deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
                            }}
                        />

                        <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row z-10">
                            <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-blue-950/40 border border-blue-400/30 shadow-inner flex-shrink-0">
                                <svg
                                    className="w-8 h-8 text-cyan-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M4.5 16.5c-1.5 1.26-2.5 3.19-2.5 5.5s1 4.24 2.5 5.5" />
                                    <path d="M12 2s-8 6-8 12c0 2 2 4 4 4v2l3-3 3 3v-2c2 0 4-2 4-4 0-6-8-12-8-12z" />
                                    <line x1="9" y1="15" x2="15" y2="15" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-[#7f1d1d] flex items-center gap-2 justify-center sm:justify-start" style={{ textShadow: "0 1px 2px rgba(255,255,255,0.3)" }}>
                                    NASA Learning Resources
                                </h3>
                                <p className="text-sm text-gray-800 font-semibold mt-1">
                                    Explore exciting space, climate, and weather educational materials directly from NASA's official portal.
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 sm:mt-0 z-10 flex-shrink-0">
                            <span
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold text-sm transition-all duration-200"
                                style={{
                                    background: "linear-gradient(135deg, #ef4444, #dc2626)",
                                    boxShadow: "0 4px 14px rgba(220, 38, 38, 0.4)",
                                }}
                            >
                                Explore Resources
                                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </span>
                        </div>
                    </a>
                </div>
            </div>

            {/* Dropdown animation keyframe */}
            <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
      `}</style>
        </div>
    );
}