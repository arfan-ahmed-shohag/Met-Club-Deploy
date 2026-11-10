import { Link, useParams } from "react-router";
import bgImage from "../../../assets/images/start-journey-page-bg.jpeg";
import TopNav from "../../../components/Shared/TopBar";

export default function StartInterface() {
    const { chapterId } = useParams();

    return (
        <>
            <div
                className="fixed inset-0 z-50 flex flex-col overflow-hidden"
                style={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center bottom",
                }}
            >
                {/* ───────────────── TOP BAR ───────────────── */}
                <div className="relative z-40">
                    <TopNav brandName="মেট ক্লাব" />
                </div>

                {/* ───────────────── MAIN CONTENT ───────────────── */}
                <div className="px-4 py-4 flex flex-col items-center justify-center flex-1 overflow-auto relative z-0">

                    <div className="w-full max-w-md sm:max-w-lg">

                        {/* 🧊 APPLE GLASS CARD (ONLY THIS HAS GLASS NOW) */}
                        <div
                            className="relative rounded-3xl overflow-hidden pt-14 sm:pt-16 flex flex-col items-center"
                            style={{
                                background: "rgba(255,255,255,0.16)",

                                backdropFilter: "blur(30px) saturate(180%)",
                                WebkitBackdropFilter: "blur(30px) saturate(180%)",

                                border: "1px solid rgba(255,255,255,0.35)",

                                boxShadow:
                                    "0 30px 90px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.55)",
                            }}
                        >

                            {/* 🌟 glass shine */}
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    background:
                                        "linear-gradient(120deg, rgba(255,255,255,0.45), rgba(255,255,255,0.10), transparent 65%)",
                                }}
                            />

                            {/* ───────── RIBBON ───────── */}
                            <div className="relative z-10 -mt-5 mb-3">
                                <div
                                    className="relative px-6 py-3 rounded-2xl text-center"
                                    style={{
                                        background:
                                            "linear-gradient(135deg,#f59e0b,#fbbf24,#FC4C02)",
                                        border: "1px solid rgba(255,255,255,0.4)",
                                        boxShadow:
                                            "0 12px 35px rgba(251,146,60,0.35), inset 0 1px 0 rgba(255,255,255,0.4)",
                                    }}
                                >
                                    <h1 className="font-bold text-white text-2xl sm:text-[1.9rem]">
                                        মজার মূল্যায়ন
                                    </h1>
                                </div>
                            </div>

                            {/* ───────── BODY ───────── */}
                            <div className="relative z-10 flex flex-col items-center gap-5 px-5 sm:px-7 py-6">

                                <p className="text-center text-gray-700 font-medium text-sm sm:text-base">
                                    এখানে প্রতিটি প্রশ্ন সঠিক উত্তর দিলে তুমি পাবে
                                    <br />
                                    <span className="font-bold text-gray-900">১০ পয়েন্ট!</span> ভুল উত্তর = ০ পয়েন্ট
                                </p>

                                <div className="flex gap-3 flex-wrap justify-center">
                                    <div
                                        className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm"
                                        style={{
                                            background: "rgba(254,226,226,0.6)",
                                            border: "1px solid rgba(252,165,165,0.8)",
                                        }}
                                    >
                                        <span className="w-6 h-6 flex items-center justify-center rounded-full bg-green-500 text-white text-xs font-black">
                                            ✓
                                        </span>
                                        +10 pts
                                    </div>

                                    <div
                                        className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm"
                                        style={{
                                            background: "rgba(254,226,226,0.35)",
                                            border: "1px solid rgba(248,113,113,0.6)",
                                        }}
                                    >
                                        <span className="w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-black">
                                            ✗
                                        </span>
                                        0 pts
                                    </div>
                                </div>

                                <p className="text-center text-gray-700 font-medium text-sm sm:text-base">
                                    তোমার স্কোর যত বেশি হবে চ্যাম্পিয়ন হওয়ার সম্ভাবনা তত বেশি
                                </p>

                                <p className="font-bold text-gray-600">দেখা যাক কি হয়!</p>
                                <Link to={`/select-difficulty/${chapterId}`} className="w-full">
                                    <button
                                        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white text-lg transition-all duration-300 active:scale-95 hover:scale-[1.02] cursor-pointer"
                                        style={{
                                            background: "rgba(239,68,68,0.85)",
                                            border: "1px solid rgba(255,255,255,0.35)",
                                            boxShadow: "0 10px 35px rgba(239,68,68,0.35)",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.boxShadow =
                                                "0 15px 45px rgba(239,68,68,0.55)";
                                            e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.boxShadow =
                                                "0 10px 35px rgba(239,68,68,0.35)";
                                            e.currentTarget.style.transform = "translateY(0px) scale(1)";
                                        }}
                                    >
                                        এখনই শুরু করুন
                                        <span className="text-2xl font-black transition-transform duration-300 group-hover:translate-x-1">
                                            ›
                                        </span>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
