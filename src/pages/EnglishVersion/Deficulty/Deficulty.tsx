import bgImage from "../../../assets/images/start-journey-page-bg.jpeg";
import { Link, useParams } from "react-router";
import { use, useEffect, useState } from "react";
import useAxiosProtected from "../../../hooks/axiosProtected";
import type { ChapterTopic } from "../Chapter/Chapter";

const DIFFICULTIES = [
    {
        key: "easy",
        label: "Easy",
        emoji: "☀️",
        border: "border-red-300",
        bg: "bg-gradient-to-br from-red-100 to-rose-200",
        hoverBg: "hover:bg-gradient-to-br hover:from-red-400 hover:to-rose-500",
        textColor: "text-red-900",
        hoverText: "hover:text-white",
        shadow: "shadow-[0_8px_32px_rgba(248,113,113,0.35)]",
        glow: "hover:shadow-[0_0_25px_rgba(248,113,113,0.45)]",
    },
    {
        key: "medium",
        label: "Medium",
        emoji: "⛰️",
        border: "border-rose-300",
        bg: "bg-gradient-to-br from-rose-100 to-red-200",
        hoverBg: "hover:bg-gradient-to-br hover:from-rose-400 hover:to-red-500",
        textColor: "text-rose-900",
        hoverText: "hover:text-white",
        shadow: "shadow-[0_8px_32px_rgba(244,63,94,0.35)]",
        glow: "hover:shadow-[0_0_25px_rgba(244,63,94,0.45)]",
    },
    {
        key: "hard",
        label: "Hard",
        emoji: "🏔️",
        border: "border-red-300",
        bg: "bg-gradient-to-br from-red-100 to-red-200",
        hoverBg: "hover:bg-gradient-to-br hover:from-red-400 hover:to-red-500",
        textColor: "text-red-900",
        hoverText: "hover:text-white",
        shadow: "shadow-[0_8px_32px_rgba(248,113,113,0.35)]",
        glow: "hover:shadow-[0_0_25px_rgba(248,113,113,0.45)]",
    },
];

const fetchChapters = async () => {
    const response = await fetch('/chapter.en.json');
    return response.json() as Promise<ChapterTopic[]>;
};

const chaptersPromise = fetchChapters();

export default function Deficulty() {

    const { chapterId } = useParams();

    const chapters = use(chaptersPromise);

    const topic = chapters.find((c) => c.id === Number(chapterId));

    const [quizLevel, setQuizLevel] = useState<"easy" | "medium" | "hard" | null>(null);

    const axios = useAxiosProtected();

    useEffect(() => {
        const quizLevel = async () => {
            const res = await axios.get(`/user/quiz-level-info/${chapterId}`);
            setQuizLevel(res.data.data);
        };
        quizLevel();

    }, [axios, chapterId])

    const isLocked = (key: string) => {
        if (quizLevel === null) return key === "medium" || key === "hard";
        if (quizLevel === "easy") return key === "hard";
        return false;
    };

    return (
        <>
            <div
                className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"
                style={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center bottom",
                    backgroundRepeat: "no-repeat",
                }}
            >
                {/* Overlay */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            "linear-gradient(to bottom, rgba(255,244,242,0.56) 0%, rgba(255,230,226,0.22) 55%, rgba(255,214,210,0.08) 100%)",
                    }}
                />

                {/* ── Title ── */}
                <h1
                    className="title-anim relative z-10 text-5xl md:text-6xl text-center mt-10 font-black"
                    style={{
                        color: "#9A3324",
                        textShadow:
                            "-0.6px -0.6px 0 rgba(255,255,255,0.95), 0.6px -0.6px 0 rgba(255,255,255,0.95), -0.6px 0.6px 0 rgba(255,255,255,0.95), 0.6px 0.6px 0 rgba(255,255,255,0.95), 0 2px 8px rgba(127,29,29,0.18)",
                        letterSpacing: "0.04em",
                    }}
                >
                    Learning Zone
                </h1>

                {/* ── Subtitle ── */}
                <p
                    className="sub-anim relative z-10 mt-3 text-base md:text-lg font-extrabold tracking-wide text-gray-700 text-center"
                    style={{ letterSpacing: "0.06em" }}
                >
                    Select Difficulty Level:&nbsp;
                    <span style={{
                        color: "#9A3324", textShadow:
                            "-0.6px -0.6px 0 rgba(255,255,255,0.95), 0.6px -0.6px 0 rgba(255,255,255,0.95), -0.6px 0.6px 0 rgba(255,255,255,0.95), 0.6px 0.6px 0 rgba(255,255,255,0.95), 0 2px 8px rgba(127,29,29,0.18)",
                    }}>{topic?.title}</span>
                </p>

                {/* ── Topic card ── */}
                <div
                    className="topic-anim topic-float relative z-10 mt-10 flex flex-col items-center justify-between rounded-2xl bg-white/85 backdrop-blur-sm p-5"
                    style={{
                        border: "2.5px solid #D1CCBD",
                        width: 210,
                        minHeight: 210,
                        boxShadow: "0 8px 40px rgba(248,113,113,0.25), 0 2px 12px rgba(0,0,0,0.08)",
                        animation: "cardPop 0.65s cubic-bezier(.34,1.56,.64,1) both 0.25s, topicFloat 3.5s ease-in-out infinite 1s",
                    }}
                >
                    <p
                        className="text-center font-bold text-gray-800 text-sm leading-snug mb-3"
                    >
                        {topic?.title}
                    </p>

                    {/* Topic illustration — replace emoji with <img> when you have the asset */}
                    <div
                        className="w-32 h-32 rounded-xl flex items-center justify-center"
                        style={{ fontSize: 72 }}
                    >
                        {/* 👇 Swap this with your actual image:*/}
                        <img src={topic?.image} alt={topic?.title} className="w-full h-full object-contain" />
                    </div>
                </div>

                {/* ── Difficulty buttons ── */}
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-5 mt-10 pb-14 px-6">
                    {DIFFICULTIES.map((d, idx) => {
                        const locked = isLocked(d.key);

                        const btn = (
                            <div className="relative">
                                <button
                                    disabled={locked}
                                    className={`
                                    flex items-center justify-center gap-3
                                    px-10 py-5
                                    rounded-full
                                    font-black
                                    text-2xl md:text-3xl
                                    tracking-widest
                                    transition-all duration-200
                                    select-none
                                    border
                                    ${locked
                                            ? "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400 shadow-none opacity-60"
                                            : `cursor-pointer ${d.border} ${d.bg} ${d.hoverBg} ${d.textColor} ${d.hoverText} ${d.shadow} ${d.glow} hover:-translate-y-1.5 hover:scale-[1.06]`
                                        }
                                `}
                                >
                                    {d.label}
                                    <span className="text-[28px] leading-none">{locked ? "🔒" : d.emoji}</span>
                                </button>
                            </div>
                        );

                        return (
                            <div key={d.key} className={`btn-${idx + 1}`}>
                                {locked
                                    ? btn
                                    : <Link to={`/quiz/${chapterId}/${d.key}`}>{btn}</Link>}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
