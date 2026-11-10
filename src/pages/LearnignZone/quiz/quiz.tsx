import { useCallback, useEffect, useMemo, useState } from "react";
import bgImage from "../../../assets/images/start-journey-page-bg.jpeg";
import { MatchQuestion, CategorizeQuestion } from "./DragDropMobile";
import { Link, useLoaderData, useParams } from "react-router";
import TopNav from "../../../components/Shared/TopBar";
import BottomNav from "../../../components/Shared/BottomNav";
import type { FillBlanksQuestionProps, HotspotQuestionProps, ImageSelectionQuestionProps, MCQQuestionProps, QuestionRendererProps, QuizAnswer, QuizAnswers, QuizProps, QuizQuestion, SequenceQuestionProps, TrueFalseQuestionProps, PuzzleQuestionProps } from "../../../types";
import { QuestionHeader } from "../../../components/Quiz/QuestionHeader";
import useAxiosProtected from "../../../hooks/axiosProtected";
import { getStoredLocale } from "../../../utils/language";

// simple translator helper for this file — read stored locale on each call
const t = (bn: string, en: string) => (getStoredLocale() === "en" ? en : bn);

const isNonArrayObject = (
    value: QuizAnswer
): value is Record<string, string> | Record<string, string[]> => {
    return typeof value === "object" && value !== null && !Array.isArray(value);
};

const isStringRecord = (value: QuizAnswer): value is Record<string, string> => {
    return isNonArrayObject(value) && Object.values(value).every((v) => typeof v === "string");
};

const isStringArrayRecord = (value: QuizAnswer): value is Record<string, string[]> => {
    return (
        isNonArrayObject(value) &&
        Object.values(value).every(
            (v) => Array.isArray(v) && v.every((item) => typeof item === "string")
        )
    );
};



// Description card
function DescriptionBox({ text }: { text: string }) {
    return (
        <p className="text-sm leading-relaxed text-gray-600 px-1">
            {text}
        </p>
    );
}

// HotsPot
export function HotspotQuestion({ q, answer, onChange }: HotspotQuestionProps) {
    const selected = Array.isArray(answer) ? answer : [];

    const isFull = selected.length >= q.correctAnswer.length;

    const allCorrect = isFull && q.correctAnswer.every((id) => selected.includes(id));

    const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isFull) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = ((e.clientX - rect.left) / rect.width) * 100;
        const clickY = ((e.clientY - rect.top) / rect.height) * 100;

        // আপডেট করা লজিক
        const matchedHotspot = q.hotspots.find((h) => {
            if (h.width && h.height) {
                // Area-ভিত্তিক হটস্পট (width এবং height দেওয়া থাকলে)
                // x এবং y-কে কেন্দ্রবিন্দু (center) ধরে হিসেব করা হচ্ছে
                const halfWidth = h.width / 2;
                const halfHeight = h.height / 2;
                return (
                    clickX >= h.x - halfWidth &&
                    clickX <= h.x + halfWidth &&
                    clickY >= h.y - halfHeight &&
                    clickY <= h.y + halfHeight
                );
            } else {
                // Point-ভিত্তিক হটস্পট (আগের মতো ডিফল্ট রেডিয়াস)
                const HIT_RADIUS = h.radius || 8; // JSON এ আলাদা radius দেওয়া থাকলে সেটা নেবে, না হলে 8
                return Math.abs(h.x - clickX) < HIT_RADIUS && Math.abs(h.y - clickY) < HIT_RADIUS;
            }
        });

        let clickId = "";
        if (matchedHotspot) {
            clickId = matchedHotspot.id;
        } else {
            clickId = `custom_${clickX.toFixed(1)}_${clickY.toFixed(1)}`;
        }

        if (selected.includes(clickId)) {
            const next = selected.filter((id) => id !== clickId);
            onChange(next.length ? next : null);
        } else {
            const next = [...selected, clickId];
            onChange(next.length ? next : null);
        }
    };;

    const removeMarker = (e: React.MouseEvent, idToRemove: string) => {
        // limit পূর্ণ হলে remove করা যাবে না
        if (isFull) return;
        e.stopPropagation();
        const next = selected.filter((id) => id !== idToRemove);
        onChange(next.length ? next : null);
    };

    return (
        <div className="flex flex-col gap-4">
            <p className="font-semibold text-gray-800 text-sm"
                style={{ fontFamily: "'Hind Siliguri',sans-serif" }}>
                {q.question}
            </p>

            <div
                className={`relative w-full rounded-2xl overflow-hidden border-2 shadow-sm touch-none transition-colors ${isFull
                    ? allCorrect
                        ? "border-green-400 cursor-default"
                        : "border-red-400 cursor-default"
                    : "border-gray-200 cursor-crosshair"
                    }`}
                style={{ background: "#f1f5f9" }}
                onClick={handleImageClick}
            >
                {q.image ? (
                    <div
                        className="w-full rounded-2xl overflow-hidden"
                        style={{
                            border: "2px solid rgba(226,232,240,0.8)",
                            backgroundColor: "#f8fafc",
                            aspectRatio: "16/9",
                        }}
                    >
                        <img
                            src={q.image}
                            alt="Hotspot"
                            className="w-full h-auto block pointer-events-none select-none"
                        />
                    </div>

                ) : (
                    <div className="w-full aspect-video flex flex-col items-center justify-center bg-gray-100">
                        <span style={{ fontSize: 80, opacity: 0.1 }}>🏠☀️👧</span>
                        <p className="text-gray-400 mt-4">{t("ছবি লোড হচ্ছে...", "Image loading...")}</p>
                    </div>
                )}

                {selected.map((id) => {
                    let markerX = 0;
                    let markerY = 0;

                    if (id.startsWith("custom_")) {
                        const parts = id.split("_");
                        markerX = parseFloat(parts[1]);
                        markerY = parseFloat(parts[2]);
                    } else {
                        const spot = q.hotspots.find((h) => h.id === id);
                        if (spot) {
                            markerX = spot.x;
                            markerY = spot.y;
                        }
                    }

                    // ── নতুন: limit পূর্ণ হলে correct/wrong color দেখাবে ──
                    const isCorrectMarker = isFull && q.correctAnswer.includes(id);
                    const isWrongMarker = isFull && !q.correctAnswer.includes(id);

                    return (
                        <div
                            key={id}
                            onClick={(e) => removeMarker(e, id)}
                            className="absolute flex items-center justify-center rounded-full transition-all duration-200 z-10"
                            style={{
                                left: `${markerX}%`,
                                top: `${markerY}%`,
                                transform: "translate(-50%, -50%)",
                                width: "36px",
                                height: "36px",
                                background: isCorrectMarker
                                    ? "rgba(220,252,231,0.95)"
                                    : isWrongMarker
                                        ? "rgba(254,226,226,0.95)"
                                        : "rgba(255,255,255,0.9)",
                                border: isCorrectMarker
                                    ? "2.5px solid #22c55e"
                                    : isWrongMarker
                                        ? "2.5px solid #DA291C"
                                        : "2.5px solid #3b82f6",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                cursor: isFull ? "default" : "pointer",
                            }}
                        >
                            <span className="text-lg drop-shadow-sm">
                                {isCorrectMarker ? "✅" : isWrongMarker ? "❌" : "✔️"}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* ── নতুন: limit পূর্ণ হলে feedback banner ── */}
            {isFull && (
                <div
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border ${allCorrect
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "bg-red-50 border-red-200 text-red-700"
                        }`}
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                    <span className="text-base">{allCorrect ? "✅" : "❌"}</span>
                    {allCorrect ? t("সঠিক হয়েছে! চমৎকার!", "Correct! Well done!") : t("ভুল হয়েছে! সঠিক জায়গায় ক্লিক করোনি।", "Incorrect! You didn't click the correct spot.")}
                </div>
            )}
        </div>
    );
}

// True False
export function TrueFalseQuestion({ q, answer, onChange }: TrueFalseQuestionProps) {
    const selectedAnswer = typeof answer === "string" ? answer : null;
    const isCorrect = selectedAnswer === q.correctAnswer;
    const locale = getStoredLocale();

    return (
        <div className="flex flex-col gap-5">
            {q.image ? (
                <div
                    className="w-full rounded-2xl overflow-hidden"
                    style={{
                        border: "2px solid rgba(226,232,240,0.8)",
                        backgroundColor: "#f8fafc",
                        aspectRatio: "16/9",
                    }}
                >
                    <img
                        src={q.image}
                        alt="Question Visual"
                        className="w-full h-full object-cover pointer-events-none select-none"
                    />
                </div>
            ) : (
                <DescriptionBox text={q.description} />
            )}

            <div className="flex flex-col gap-4 p-5 rounded-3xl"
                style={{
                    background: "rgba(255,255,255,0.7)",
                    border: "1.5px solid rgba(191,219,254,0.5)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
                }}>

                <div className="rounded-2xl px-5 py-4 font-semibold text-gray-800 text-lg leading-relaxed"
                    style={{
                        background: "rgba(239,246,255,0.85)",
                        border: "1px solid rgba(191,219,254,0.9)",
                        fontFamily: "'Hind Siliguri',sans-serif"
                    }}>
                    {q.question}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {[...q.options].reverse().map((opt) => {
                        const isTrue = opt === "সত্য" || opt === "True";
                        const selected = selectedAnswer === opt;
                        const label = isTrue
                            ? (locale === "en" ? "✅ True" : "✅ সত্য")
                            : (locale === "en" ? "❌ False" : "❌ মিথ্যা");

                        return (
                            <button
                                key={opt}
                                onClick={() => !selectedAnswer && onChange(opt)}
                                className="w-full h-full py-5 rounded-2xl font-bold text-xl transition-all duration-300"
                                style={{
                                    fontFamily: "'Hind Siliguri',sans-serif",
                                    cursor: selectedAnswer ? "default" : "pointer",
                                    background: selected
                                        ? isTrue
                                            ? "linear-gradient(135deg,#4ade80,#22c55e)"
                                            : "linear-gradient(135deg,#FC4C02,#DA291C)"
                                        : "#ffffff",
                                    border: selected
                                        ? isTrue ? "3.5px solid #16a34a" : "3.5px solid #DA291C"
                                        : "2px solid #cbd5e1",
                                    color: selected ? "#ffffff" : "#334155",
                                    boxShadow: selected ? "0 8px 20px rgba(0,0,0,0.15)" : "0 2px 6px rgba(0,0,0,0.04)",
                                    opacity: selectedAnswer && !selected ? 0.45 : 1,
                                }}>
                                {label}
                            </button>
                        );
                    })}
                </div>

                {/* ── Feedback banner ── */}
                {selectedAnswer && (
                    <div
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border ${isCorrect
                            ? "bg-green-50 border-green-200 text-green-700"
                            : "bg-red-50 border-red-200 text-red-700"
                            }`}
                        style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                    >
                        <span className="text-base">{isCorrect ? "✅" : "❌"}</span>
                        {isCorrect
                            ? t("সঠিক উত্তর! চমৎকার!", "Correct answer! Well done!")
                            : t("ভুল হয়েছে!", "Incorrect!")
                        }
                    </div>
                )}
            </div>
        </div>
    );
}

// 3. FILL IN THE BLANKS
function FillBlanksQuestion({ q, answer, onChange }: FillBlanksQuestionProps) {
    // answer এখন "ছয়-জলবায়ু" format এ থাকবে, split করে array বানাই
    const selectedAnswers: string[] = typeof answer === "string" && answer
        ? answer.split("-")
        : [];

    // statement এ যেকোনো সংখ্যক _ (underscore) থাকলে সেটা দিয়ে parts বানাই
    const statement = q.statement || q.question || "";
    const parts = statement.split(/_+/);

    // বাক্যে যতবার ভাঙা হয়েছে, তার চেয়ে ১ কম হবে আমাদের আসল শূন্যস্থান সংখ্যা
    const expectedBlankCount = parts.length - 1;

    // ডেটাবেসের correctAnswer এ কয়টি উত্তর দেওয়া আছে তা বের করি
    const originalCorrectLen = Array.isArray(q.correctAnswer)
        ? q.correctAnswer.length
        : (typeof q.correctAnswer === "string" ? q.correctAnswer.split("-").length : 0);

    // এটি কি এমন প্রশ্ন যেখানে একটি শব্দই সবগুলো গ্যাপে বসবে? (যেমন: "দেরি")
    const isSingleWordForAllBlanks = originalCorrectLen === 1 && expectedBlankCount > 1;

    // correctAnswer থেকে উত্তর বের করি
    let correctParts = Array.isArray(q.correctAnswer)
        ? q.correctAnswer
        : typeof q.correctAnswer === "string"
            ? q.correctAnswer.split("-")
            : [];

    // যদি একই শব্দ সব গ্যাপে বসে, তাহলে কোড নিজে থেকেই সেটাকে ডুপ্লিকেট করে নেবে
    if (isSingleWordForAllBlanks) {
        correctParts = Array(expectedBlankCount).fill(correctParts[0]);
    }

    const blankCount = expectedBlankCount;

    // কোনো blank এ click হলে
    const handleSelect = (opt: string) => {
        // নতুন লজিক: যদি এটি "এক শব্দে সব গ্যাপ" পূরণের প্রশ্ন হয়
        if (isSingleWordForAllBlanks) {
            // এক ক্লিকেই সবগুলো গ্যাপে সিলেক্ট করা অপশনটি বসিয়ে দেবে
            const next = Array(expectedBlankCount).fill(opt);
            onChange(next.join("-"));
            return;
        }

        // সাধারণ প্রশ্নের জন্য (যেখানে আলাদা আলাদা শব্দ বসে)
        const nextBlankIdx = selectedAnswers.length;
        if (nextBlankIdx >= blankCount) return; // সব ভরা থাকলে কিছু করবে না

        const next = [...selectedAnswers, opt];
        onChange(next.join("-"));
    };

    // কোনো filled blank এ click করলে সেটা এবং পরেরগুলো clear হবে
    const handleClearFrom = (idx: number) => {
        if (isSingleWordForAllBlanks) {
            // এক ক্লিকে সব বসে থাকলে, মুছলে একসাথেই সব মুছে যাবে
            onChange(null);
            return;
        }
        const next = selectedAnswers.slice(0, idx);
        onChange(next.length ? next.join("-") : null);
    };

    const allFilled = selectedAnswers.length >= blankCount;
    const isCorrect = allFilled && selectedAnswers.every(
        (ans, i) => ans === correctParts[i]
    );

    return (
        <div className="flex flex-col gap-4">
            {q.image && (
                <div
                    className="w-full rounded-2xl overflow-hidden"
                    style={{
                        border: "2px solid rgba(226,232,240,0.8)",
                        backgroundColor: "#f8fafc",
                        aspectRatio: "16/9",
                    }}
                >
                    <img
                        src={q.image}
                        alt="Question Visual"
                        className="w-full h-full object-cover pointer-events-none select-none"
                    />
                </div>
            )}

            {/* Statement with blanks */}
            <div
                className="rounded-2xl px-5 py-4 text-lg font-semibold text-gray-800 leading-relaxed"
                style={{
                    background: "rgba(239,246,255,0.85)",
                    border: "2px solid #bfdbfe",
                    fontFamily: "'Hind Siliguri',sans-serif",
                }}
            >
                {parts.map((part, idx) => (
                    <span key={idx} style={{ whiteSpace: "pre-wrap" }}>
                        {part}
                        {idx < parts.length - 1 && (
                            <span
                                onClick={() => selectedAnswers[idx] && handleClearFrom(idx)}
                                className="inline-block min-w-16 mx-1 px-3 py-0.5 rounded-xl text-center font-bold transition-all duration-200"
                                style={{
                                    minHeight: 32,
                                    cursor: selectedAnswers[idx] ? "pointer" : "default",
                                    background: selectedAnswers[idx]
                                        ? allFilled
                                            ? selectedAnswers[idx] === correctParts[idx]
                                                ? "#dcfce7"  // সঠিক — green
                                                : "#fee2e2"  // ভুল — red
                                            : "#dbeafe"      // filled কিন্তু submit হয়নি — blue
                                        : "rgba(219,234,254,0.4)",  // খালি
                                    border: selectedAnswers[idx]
                                        ? allFilled
                                            ? selectedAnswers[idx] === correctParts[idx]
                                                ? "2.5px solid #22c55e"
                                                : "2.5px solid #DA291C"
                                            : "2.5px solid #3b82f6"
                                        : "2.5px dashed #60a5fa",
                                    color: selectedAnswers[idx]
                                        ? allFilled
                                            ? selectedAnswers[idx] === correctParts[idx]
                                                ? "#15803d"
                                                : "#9A3324"
                                            : "#1d4ed8"
                                        : "#93c5fd",
                                }}
                            >
                                {selectedAnswers[idx] || "?"}
                            </span>
                        )}
                    </span>
                ))}
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-3">
                {q.options.map((opt) => {
                    // যদি একাধিক আলাদা গ্যাপ থাকে (যেমন সাধারণ প্রশ্ন), তবে একবার ব্যবহৃত অপশন হাইড বা হালকা করতে পারেন,
                    // কিন্তু আপনার এই প্রশ্নের জন্য অপশন সবসময় ক্লিকের যোগ্য থাকবে।
                    const isUsed = !isSingleWordForAllBlanks && selectedAnswers.includes(opt);

                    return (
                        <button
                            key={opt}
                            onClick={() => (!isUsed || isSingleWordForAllBlanks) && handleSelect(opt)}
                            className="py-3 px-4 rounded-xl font-semibold text-base transition-all duration-200 hover:bg-blue-50 hover:shadow-md active:scale-95"
                            style={{
                                fontFamily: "'Hind Siliguri',sans-serif",
                                cursor: isUsed ? "default" : "pointer",
                                opacity: isUsed ? 0.4 : 1,
                                background: isUsed ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.85)",
                                border: isUsed ? "2px solid #e2e8f0" : "2px solid #93c5fd",
                                color: "#374151",
                                boxShadow: isUsed ? "none" : "0 1px 4px rgba(0,0,0,0.06)",
                            }}
                        >
                            {opt}
                        </button>
                    );
                })}
            </div>

            {/* Feedback banner */}
            {allFilled && (
                <div
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border ${isCorrect
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "bg-red-50 border-red-200 text-red-700"
                        }`}
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                    <span className="text-base">{isCorrect ? "✅" : "❌"}</span>
                    {isCorrect
                        ? t("সঠিক উত্তর! চমৎকার!", "Correct answer! Well done!")
                        : t("ভুল হয়েছে!", "Incorrect!")
                    }
                </div>
            )}
        </div>
    );
}

// 4. IMAGE SELECTION
function ImageSelectionQuestion({ q, answer, onChange }: ImageSelectionQuestionProps) {
    const selectedAnswer = typeof answer === "string" ? answer : null;
    const isCorrect = selectedAnswer === q.correctAnswer;
    const isWrong = selectedAnswer !== null && !isCorrect;

    return (
        <div className="flex flex-col gap-4">
            <DescriptionBox text={q.description} />
            <p className="font-semibold text-gray-800 text-sm"
                style={{ fontFamily: "'Hind Siliguri',sans-serif" }}>
                {q.question}
            </p>

            <div className="grid grid-cols-2 gap-4">
                {q.options.map((opt) => {
                    const selected = selectedAnswer === opt.id;
                    const isCorrectOpt = opt.id === q.correctAnswer;

                    // select হওয়ার পর correct option highlight করব
                    const showCorrect = selectedAnswer !== null && isCorrectOpt && isCorrect;
                    const showWrong = selected && isWrong;

                    return (
                        <button
                            key={opt.id}
                            onClick={() => !selectedAnswer && onChange(opt.id)}
                            className="flex flex-col items-center justify-center gap-3 rounded-2xl transition-all duration-200"
                            style={{
                                cursor: selectedAnswer ? "default" : "pointer",
                                opacity: selectedAnswer && !selected && !isCorrectOpt ? 0.4 : 1,
                                background: showCorrect
                                    ? "#dcfce7"
                                    : showWrong
                                        ? "#fee2e2"
                                        : selected
                                            ? "linear-gradient(135deg,#dbeafe,#bfdbfe)"
                                            : "rgba(255,255,255,0.85)",
                                border: showCorrect
                                    ? "3px solid #22c55e"
                                    : showWrong
                                        ? "3px solid #DA291C"
                                        : selected
                                            ? "3px solid #3b82f6"
                                            : "2.5px solid #e2e8f0",
                                boxShadow: showCorrect
                                    ? "0 6px 20px rgba(34,197,94,0.25)"
                                    : showWrong
                                        ? "0 6px 20px rgba(239,68,68,0.25)"
                                        : selected
                                            ? "0 6px 20px rgba(59,130,246,0.25)"
                                            : "0 2px 8px rgba(0,0,0,0.06)",
                            }}
                        >
                            {opt.image
                                ? <img src={opt.image} alt={opt.label} className="object-contain rounded-xl" />
                                : <span style={{ fontSize: 56 }}>{opt.emoji}</span>
                            }
                        </button>
                    );
                })}
            </div>

            {/* Feedback banner */}
            {/* Feedback banner */}
            {selectedAnswer && (
                <div
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border ${isCorrect
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "bg-red-50 border-red-200 text-red-700"
                        }`}
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                    <span className="text-base">{isCorrect ? "✅" : "❌"}</span>
                    {isCorrect ? t("সঠিক উত্তর! চমৎকার!", "Correct answer! Well done!") : t("ভুল হয়েছে!", "Incorrect!")}
                </div>
            )}
        </div>
    );
}

// 6. MCQ
function MCQQuestion({ q, answer, onChange }: MCQQuestionProps) {
    const selectedAnswer = typeof answer === "string" ? answer : null;
    const locale = getStoredLocale();
    const letters = locale === "en" ? ["A", "B", "C", "D"] : ["ক", "খ", "গ", "ঘ"];
    const isCorrect = selectedAnswer === q.correctAnswer;

    return (
        <div className="flex flex-col gap-4">
            {q.image && (
                <div
                    className="w-full rounded-2xl overflow-hidden"
                    style={{
                        border: "2px solid rgba(226,232,240,0.8)",
                        backgroundColor: "#f8fafc",
                        aspectRatio: "16/9",
                    }}
                >
                    <img
                        src={q.image}
                        alt="Question Visual"
                        className="w-full h-full object-cover pointer-events-none select-none"
                    />
                </div>
            )}

            {!q.image && (
                <DescriptionBox text={q.description} />
            )}

            <p className="font-semibold text-gray-800 text-lg">
                {q.question}
            </p>

            <div className="flex flex-col gap-3">
                {q.options.map((opt, i) => {
                    const selected = selectedAnswer === opt;
                    const isCorrectOpt = opt === q.correctAnswer;
                    const showCorrect = selectedAnswer !== null && isCorrectOpt && isCorrect;
                    const showWrong = selected && !isCorrectOpt;

                    return (
                        <button
                            key={opt}
                            onClick={() => !selectedAnswer && onChange(opt)}
                            className="flex items-center gap-4 px-5 py-4 rounded-xl font-semibold text-left transition-all duration-200"
                            style={{
                                fontFamily: "'Hind Siliguri',sans-serif",
                                cursor: selectedAnswer ? "default" : "pointer",
                                opacity: selectedAnswer && !selected ? 0.4 : 1,
                                background: showCorrect
                                    ? "#dcfce7"
                                    : showWrong
                                        ? "#fee2e2"
                                        : selected
                                            ? "linear-gradient(135deg,#dbeafe,#bfdbfe)"
                                            : "rgba(255,255,255,0.85)",
                                border: showCorrect
                                    ? "2.5px solid #22c55e"
                                    : showWrong
                                        ? "2.5px solid #DA291C"
                                        : selected
                                            ? "2.5px solid #3b82f6"
                                            : "2px solid #e2e8f0",
                                color: showCorrect
                                    ? "#15803d"
                                    : showWrong
                                        ? "#9A3324"
                                        : selected
                                            ? "#1d4ed8"
                                            : "#374151",
                                boxShadow: showCorrect
                                    ? "0 4px 16px rgba(34,197,94,0.2)"
                                    : showWrong
                                        ? "0 4px 16px rgba(239,68,68,0.2)"
                                        : selected
                                            ? "0 4px 16px rgba(59,130,246,0.22)"
                                            : "0 1px 4px rgba(0,0,0,0.05)",
                            }}
                        >
                            <span
                                className="w-8 h-8 flex items-center justify-center rounded-full shrink-0 font-bold text-sm"
                                style={{
                                    background: showCorrect
                                        ? "#22c55e"
                                        : showWrong
                                            ? "#DA291C"
                                            : selected
                                                ? "#3b82f6"
                                                : "#e2e8f0",
                                    color: showCorrect || showWrong || selected ? "#fff" : "#6b7280",
                                }}
                            >
                                {showCorrect ? "✓" : showWrong ? "✗" : letters[i]}
                            </span>
                            {opt}
                        </button>
                    );
                })}
            </div>

            {/* Feedback banner */}
            {selectedAnswer && (
                <div
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border ${isCorrect
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "bg-red-50 border-red-200 text-red-700"
                        }`}
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                    <span className="text-base">{isCorrect ? "✅" : "❌"}</span>
                    {isCorrect
                        ? t("সঠিক উত্তর! চমৎকার!", "Correct answer! Well done!")
                        : t("ভুল হয়েছে!", "Incorrect!")
                    }
                </div>
            )}
        </div>
    );
}

// 7. ARRANGE SEQUENCE
function SequenceQuestion({ q, answer, onChange }: SequenceQuestionProps) {
    const selectedOrder = Array.isArray(answer) ? answer : null;

    const shuffleArray = useCallback((array: string[]) => {
        const correctAnswer = q.correctAnswer as string[];

        // Fisher-Yates shuffle
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        // কোনো item যদি correct position এ থাকে তাহলে swap করো
        for (let i = 0; i < shuffled.length; i++) {
            if (shuffled[i] === correctAnswer[i]) {
                // পরের index এর সাথে swap, শেষেরটা হলে আগেরটার সাথে
                const swapWith = i < shuffled.length - 1 ? i + 1 : i - 1;
                [shuffled[i], shuffled[swapWith]] = [shuffled[swapWith], shuffled[i]];
            }
        }

        return shuffled;
    }, [q.correctAnswer]);

    useEffect(() => {
        if (!selectedOrder) {
            const initialIds = q.options.map((o) => o.id);
            const shuffledIds = shuffleArray(initialIds);
            onChange(shuffledIds);
        }
    }, [onChange, q.id, q.options, selectedOrder, shuffleArray]);

    const moveItem = (fromIdx: number, toIdx: number) => {
        if (!selectedOrder) return;
        const next = [...selectedOrder];
        const [moved] = next.splice(fromIdx, 1);
        next.splice(toIdx, 0, moved);
        onChange(next);
    };

    const currentOrder = selectedOrder || q.options.map((o) => o.id);

    const isCorrectOrder = currentOrder.every((id, idx) => id === q.correctAnswer[idx]);
    const isItemCorrect = (id: string, idx: number) => id === q.correctAnswer[idx];

    return (
        <div className="flex flex-col gap-4">
            <DescriptionBox text={q.description} />
            <p className="font-semibold text-gray-800 text-sm"
                style={{ fontFamily: "'Hind Siliguri',sans-serif" }}>
                {q.question}
            </p>

            <div className="flex flex-col gap-3">
                {currentOrder.map((id, idx) => {
                    const item = q.options.find((o) => o.id === id);
                    const correct = isItemCorrect(id, idx);

                    return (
                        <div key={id} className="flex items-center gap-3">
                            <span
                                className="w-8 h-8 flex items-center justify-center rounded-full font-black text-white shrink-0 text-sm shadow-sm"
                                style={{ background: correct ? "#22c55e" : "#3b82f6" }}
                            >
                                {idx + 1}
                            </span>

                            <div
                                className="flex-1 flex items-center gap-3 rounded-xl font-semibold shadow-sm transition-all duration-300 overflow-hidden"
                                style={{
                                    fontSize: "0.95rem",
                                    background: correct ? "#dcfce7" : "rgba(255,255,255,0.95)",
                                    border: correct ? "2px solid #22c55e" : "2px solid #e2e8f0",
                                    color: correct ? "#15803d" : "#374151",
                                }}
                            >
                                {item?.image ? (
                                    // ── Image mode ──
                                    <div
                                        className="w-full rounded-xl overflow-hidden"
                                        style={{
                                            border: "2px solid rgba(226,232,240,0.8)",
                                            backgroundColor: "#f8fafc",
                                            aspectRatio: "16/9",
                                        }}
                                    >
                                        <img
                                            src={item.image}
                                            alt="Question Visual"
                                            className="w-full h-full pointer-events-none select-none"
                                        />
                                        {correct && (
                                            <span
                                                className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full text-white text-xs font-bold"
                                                style={{ background: "#22c55e" }}
                                            >
                                                ✓
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    // ── Text mode ──
                                    <div className="px-4 py-3 flex items-center gap-2">
                                        {item?.emoji && <span style={{ fontSize: 28 }}>{item.emoji}</span>}
                                        <span>{item?.text}</span>
                                        {correct && (
                                            <span className="ml-auto text-green-500 font-bold">✓</span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* সব সঠিক হলে move button hide করি */}
                            {!isCorrectOrder && (
                                <div className="flex flex-col gap-1">
                                    <button
                                        onClick={() => idx > 0 && moveItem(idx, idx - 1)}
                                        disabled={idx === 0}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all hover:bg-blue-200 active:scale-90 disabled:opacity-20 bg-blue-50 text-blue-600 border border-blue-100 shadow-sm"
                                    >
                                        ▲
                                    </button>
                                    <button
                                        onClick={() => idx < currentOrder.length - 1 && moveItem(idx, idx + 1)}
                                        disabled={idx === currentOrder.length - 1}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all hover:bg-blue-200 active:scale-90 disabled:opacity-20 bg-blue-50 text-blue-600 border border-blue-100 shadow-sm"
                                    >
                                        ▼
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {!isCorrectOrder && (
                <p className="text-[10px] text-gray-400 text-center italic">
                    {t("সঠিক ক্রম সাজাতে তীর চিহ্নগুলো ব্যবহার করো", "Use the arrow buttons to arrange into the correct order")}
                </p>
            )}

            {isCorrectOrder && (
                <div
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border bg-green-50 border-green-200 text-green-700"
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                    <span className="text-base">✅</span>
                    {t("সঠিক ক্রম! চমৎকার!", "Correct order! Well done!")}
                </div>
            )}
        </div>
    );
}

// 8. Puzzle game
function PuzzleQuestion({ q, answer, onChange }: PuzzleQuestionProps) {
    // answer = placed words এর id array, শুরুতে null
    const placedIds: string[] = Array.isArray(answer) ? answer : [];

    const pool = useMemo(() => {
        const correctAnswer = q.correctAnswer as string[];
        const shuffled = [...q.options.map((o) => o.id)].sort((a, b) => {
            const score = (id: string) => {
                let hash = q.id * 131;
                for (let i = 0; i < id.length; i++) {
                    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
                }
                return hash;
            };
            return score(a) - score(b);
        });

        for (let i = 0; i < shuffled.length; i++) {
            if (shuffled[i] === correctAnswer[i]) {
                const swapWith = i < shuffled.length - 1 ? i + 1 : i - 1;
                [shuffled[i], shuffled[swapWith]] = [shuffled[swapWith], shuffled[i]];
            }
        }

        return shuffled;
    }, [q.correctAnswer, q.id, q.options]);

    // নতুন question এ placed answer reset
    useEffect(() => {
        onChange(null);
    }, [onChange, q.id]);

    const unplacedIds = pool.filter((id) => !placedIds.includes(id));
    const allPlaced = placedIds.length === q.options.length;
    const isCorrect = allPlaced && placedIds.every((id, idx) => id === q.correctAnswer[idx]);

    const handlePlace = (id: string) => {
        if (allPlaced) return;
        onChange([...placedIds, id]);
    };

    const handleRemove = (idx: number) => {
        if (allPlaced && isCorrect) return;
        const next = [...placedIds];
        next.splice(idx, 1);
        onChange(next.length ? next : null);
    };


    return (
        <div className="flex flex-col gap-4">
            <DescriptionBox text={q.description} />
            <p
                className="font-semibold text-gray-800 text-sm"
                style={{ fontFamily: "'Hind Siliguri',sans-serif" }}
            >
                {q.question}
            </p>

            {/* Sentence builder */}
            <div
                className="rounded-2xl px-4 py-3 flex flex-wrap gap-2 items-center"
                style={{
                    minHeight: "56px",
                    fontFamily: "'Hind Siliguri',sans-serif",
                    background: allPlaced
                        ? isCorrect ? "#dcfce7" : "#fee2e2"
                        : "rgba(239,246,255,0.85)",
                    border: allPlaced
                        ? isCorrect ? "2px solid #22c55e" : "2px solid #DA291C"
                        : "2px dashed #93c5fd",
                }}
            >
                {placedIds.length === 0 && (
                    <span className="text-blue-300 text-sm italic">{t("এখানে শব্দ সাজাও...", "Arrange words here...")}</span>
                )}
                {placedIds.map((id, idx) => {
                    const item = q.options.find((o) => o.id === id);
                    return (
                        <button
                            key={`${id}-${idx}`}
                            onClick={() => handleRemove(idx)}
                            className="px-3 py-1.5 rounded-lg text-sm font-semibold transition-all active:scale-95"
                            style={{
                                fontFamily: "'Hind Siliguri',sans-serif",
                                cursor: allPlaced && isCorrect ? "default" : "pointer",
                                background: allPlaced
                                    ? isCorrect ? "#bbf7d0" : "#fecaca"
                                    : "#dbeafe",
                                border: allPlaced
                                    ? isCorrect ? "1.5px solid #22c55e" : "1.5px solid #DA291C"
                                    : "1.5px solid #93c5fd",
                                color: allPlaced
                                    ? isCorrect ? "#15803d" : "#9A3324"
                                    : "#1d4ed8",
                            }}
                        >
                            {item?.text}
                        </button>
                    );
                })}
            </div>

            {/* Word pool */}
            {!allPlaced && (
                <div className="flex flex-wrap gap-2">
                    {unplacedIds.map((id) => {
                        const item = q.options.find((o) => o.id === id);
                        return (
                            <button
                                key={id}
                                onClick={() => handlePlace(id)}
                                className="px-3 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 hover:border-blue-400 hover:bg-blue-50"
                                style={{
                                    fontFamily: "'Hind Siliguri',sans-serif",
                                    background: "rgba(255,255,255,0.9)",
                                    border: "2px solid #93c5fd",
                                    color: "#1e40af",
                                }}
                            >
                                {item?.text}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Feedback */}
            {allPlaced && (
                <div
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border ${isCorrect
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "bg-red-50 border-red-200 text-red-700"
                        }`}
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                    <span>{isCorrect ? "✅" : "❌"}</span>
                    {isCorrect ? t("সঠিক বাক্য! চমৎকার!", "Correct sentence! Well done!") : t("ভুল হয়েছে!", "Incorrect!")}
                </div>
            )}
        </div>
    );
}


/* ═══════════════════════════════════════
   QUESTION RENDERER DISPATCHER
═══════════════════════════════════════ */

function QuestionRenderer({ q, answer, onChange }: QuestionRendererProps) {
    switch (q.type) {
        case "hotspot": return <HotspotQuestion q={q} answer={answer} onChange={onChange} />;
        case "true_false": return <TrueFalseQuestion q={q} answer={answer} onChange={onChange} />;
        case "fill_in_the_blanks": return <FillBlanksQuestion q={q} answer={answer} onChange={onChange} />;
        case "image_selection": return <ImageSelectionQuestion q={q} answer={answer} onChange={onChange} />;
        case "match_the_following": return <MatchQuestion q={q} answer={isStringRecord(answer) ? answer : null} onChange={(value) => onChange(value)} />;
        case "mcq": return <MCQQuestion q={q} answer={answer} onChange={onChange} />;
        case "arrange_sequence": return <SequenceQuestion q={q} answer={answer} onChange={onChange} />;
        case "puzzle": return <PuzzleQuestion q={q} answer={answer} onChange={onChange} />;
        case "drag_drop_categorize": return <CategorizeQuestion q={q} answer={isStringArrayRecord(answer) ? answer : null} onChange={(value) => onChange(value)} />;
        default: return <p className="text-center text-gray-400">Question type not supported</p>;
    }
}


const checkIsCorrect = (q: QuizQuestion, userAnswer: QuizAnswer) => {
    if (userAnswer === null || userAnswer === undefined) return false;

    switch (q.type) {
        case "hotspot": {
            if (!Array.isArray(userAnswer)) return false;
            if (q.correctAnswer.length !== userAnswer.length) return false;
            return q.correctAnswer.every((val) => userAnswer.includes(val));
        }
        case "arrange_sequence": {
            if (!Array.isArray(userAnswer)) return false;
            if (q.correctAnswer.length !== userAnswer.length) return false;
            return q.correctAnswer.every((val, i) => val === userAnswer[i]);
        }
        case "match_the_following": {
            if (!isStringRecord(userAnswer)) return false;
            const correctKeys = Object.keys(q.correctAnswer);
            const userKeys = Object.keys(userAnswer);
            if (correctKeys.length !== userKeys.length) return false;
            return correctKeys.every((key) => q.correctAnswer[key] === userAnswer[key]);
        }
        case "drag_drop_categorize": {
            if (!isStringArrayRecord(userAnswer)) return false;
            const correctKeys = Object.keys(q.correctAnswer);
            const userKeys = Object.keys(userAnswer);
            if (correctKeys.length !== userKeys.length) return false;

            return correctKeys.every((key) => {
                const sortedCorrect = [...q.correctAnswer[key]].sort();
                const sortedUser = [...(userAnswer[key] ?? [])].sort();
                return sortedCorrect.length === sortedUser.length && sortedCorrect.every((v, i) => v === sortedUser[i]);
            });
        }
        case "true_false":
        case "fill_in_the_blanks":
        case "image_selection":
        case "mcq":
            return typeof userAnswer === "string" && q.correctAnswer === userAnswer;
        default:
            return false;
    }
};

const getQuestionPrompt = (question: QuizQuestion) => {
    if (question.type === "fill_in_the_blanks") {
        return question.statement || question.question || "";
    }
    return question.question;
};

const formatAnswerText = (q: QuizQuestion, ans: QuizAnswer) => {
    if (!ans || (Array.isArray(ans) && ans.length === 0) || (isNonArrayObject(ans) && Object.keys(ans).length === 0)) {
        return t("উত্তর দেওয়া হয়নি", "No answer given");
    }

    switch (q.type) {
        case "hotspot":
            return Array.isArray(ans)
                ? ans.map((id) => q.hotspots.find((h) => h.id === id)?.label || id).join(", ")
                : t("উত্তর দেওয়া হয়নি", "No answer given");
        case "image_selection":
            return typeof ans === "string" ? q.options.find((o) => o.id === ans)?.label || ans : t("উত্তর দেওয়া হয়নি", "No answer given");
        case "arrange_sequence":
            return Array.isArray(ans)
                ? ans.map((id) => q.options.find((o) => o.id === id)?.text || id).join(" ➔ ")
                : t("উত্তর দেওয়া হয়নি", "No answer given");
        case "match_the_following":
            return isStringRecord(ans)
                ? Object.entries(ans)
                    .map(([k, v]) => `${q.leftItems.find((l) => l.id === k)?.label || k} ➔ ${v}`)
                    .join(" | ")
                : t("উত্তর দেওয়া হয়নি", "No answer given");
        case "drag_drop_categorize":
            return isStringArrayRecord(ans)
                ? Object.entries(ans)
                    .map(([cat, itemIds]) => {
                        const names = itemIds.map((id) => q.itemsToCategorize.find((item) => item.id === id)?.text || id);
                        return `${cat}: [${names.join(", ")}]`;
                    })
                    .join(" | ")
                : "উত্তর দেওয়া হয়নি";
        default:
            return String(ans);
    }
};

export default function Quiz({ onFinish }: QuizProps) {
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState<QuizAnswers>({});
    const [finished, setFinished] = useState(false);
    const [showReview, setShowReview] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const quizQuestions = useLoaderData() as QuizQuestion[];
    const { chapterId } = useParams();
    const axios = useAxiosProtected();

    // stable setter that doesn't depend on the current question object
    const handleAnswer = useCallback((questionId: number, val: QuizAnswer) => {
        setAnswers((prev) => ({ ...prev, [questionId]: val }));
    }, []);

    // If loader returns no questions (can happen during locale redirect or missing params),
    // avoid accessing `q.id` and render a friendly message instead of crashing.
    if (!quizQuestions || !Array.isArray(quizQuestions) || quizQuestions.length === 0) {
        return (
            <div className="min-h-[40vh] flex items-center justify-center p-6">
                <p className="text-gray-700 text-center">{t("কোন প্রশ্ন পাওয়া যায়নি — অধ্যায় বা ডিফিকালটি সঠিক আছে কিনা পরীক্ষা করুন।", "No quiz found — please check chapter and difficulty parameters.")}</p>
            </div>
        );
    }

    console.log(chapterId)
    const TOTAL = quizQuestions.length;

    const q = quizQuestions[current];
    const handleCurrentAnswer = useCallback((val: QuizAnswer) => {
        handleAnswer(q.id, val);
    }, [handleAnswer, q.id]);
    const answer = answers[q.id] ?? null;
    const isAnswered = answer !== null && answer !== undefined &&
        !(Array.isArray(answer) && answer.length === 0) &&
        !(isNonArrayObject(answer) && Object.keys(answer).length === 0);

    const goNext = async () => {
        if (current === TOTAL - 1) {
            setIsSubmitting(true);
            try {
                const difficulty = quizQuestions[0]?.difficulty;
                if (difficulty) {
                    await axios.patch(`/user/update-quiz-level/${chapterId}`, {
                        level: difficulty,
                    });
                }
            } catch (err) {
                console.error("Failed to update quiz completion", err);
            } finally {
                setIsSubmitting(false);
            }
            setFinished(true);
            if (onFinish) onFinish(answers);
        } else {
            setCurrent(c => c + 1);
        }
    };

    const goPrev = () => {
        if (current > 0) {
            setCurrent(c => c - 1);
        }
    };

    let correctCount = 0;
    let wrongCount = 0;
    let totalScore = 0;
    const POINTS_PER_QUESTION = 10;

    if (finished) {
        quizQuestions.forEach((question) => {
            const userAnswer = answers[question.id];
            if (userAnswer) {
                if (checkIsCorrect(question, userAnswer)) {
                    correctCount++;
                    totalScore += POINTS_PER_QUESTION;
                } else {
                    wrongCount++;
                }
            }
        });
    }

    return (
        <>
            <div className="fixed inset-0 z-50 flex flex-col"
                style={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: "cover", backgroundPosition: "center bottom",
                }}>
                {/* Overlay */}
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(to bottom,rgba(255,244,242,0.56) 0%,rgba(255,230,226,0.22) 55%,rgba(255,214,210,0.08) 100%)" }} />

                {/* Top nav */}
                <TopNav
                    title="আবহাওয়া আঙ্কেল আর টুনির গল্প" brandName="মেট ক্লাব" />

                {/* Scrollable body */}
                <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="min-h-full flex flex-col items-center justify-center px-4 py-6">
                        {finished ? (
                            showReview ? (
                                /* ── Review Screen (ভুল উত্তরগুলো দেখা) ── */
                                <div className="q-enter w-full max-w-3xl mt-4 rounded-3xl p-6 md:p-8 flex flex-col gap-6"
                                    style={{
                                        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)",
                                        border: "2.5px solid #fecaca", boxShadow: "0 12px 48px rgba(239,68,68,0.15)"
                                    }}>
                                    <div className="flex justify-between items-center border-b pb-4">
                                        <h2 className="text-2xl font-bold text-red-800">{t("ভুল উত্তরগুলো মিলিয়ে নাও", "Review incorrect answers")}</h2>
                                        <button onClick={() => setShowReview(false)}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300">
                                            {t("← ফিরে যাও", "← Go back")}
                                        </button>
                                    </div>

                                    <div className="flex flex-col gap-6 overflow-y-auto" style={{ maxHeight: "60vh" }}>
                                        {quizQuestions.map((question) => {
                                            const userAnswer = answers[question.id];
                                            const isCorrect = checkIsCorrect(question, userAnswer);

                                            // যদি সঠিক হয়, তাহলে লিস্টে দেখানোর দরকার নেই
                                            if (isCorrect) return null;

                                            return (
                                                <div key={question.id} className="p-5 rounded-2xl bg-red-50 border border-red-200 flex flex-col gap-3">
                                                    <p className="font-bold text-gray-800">{question.title}</p>
                                                    <p className="text-sm text-gray-600 mb-2">{getQuestionPrompt(question)}</p>

                                                    <div className="flex flex-col gap-2 text-sm font-medium">
                                                        <div className="p-3 bg-white rounded-xl border border-red-100 shadow-sm">
                                                            <span className="text-red-600 font-bold flex items-center gap-1"><span className="text-lg">❌</span> {t("তোমার উত্তর:", "Your answer:")}</span>
                                                            <span className="text-gray-700 mt-1 block pl-6">
                                                                {formatAnswerText(question, userAnswer)}
                                                            </span>
                                                        </div>

                                                        <div className="p-3 bg-white rounded-xl border border-green-100 shadow-sm mt-1">
                                                            <span className="text-green-600 font-bold flex items-center gap-1"><span className="text-lg">✅</span> {t("সঠিক উত্তর:", "Correct answer:")}</span>
                                                            <span className="text-gray-700 mt-1 block pl-6">
                                                                {formatAnswerText(question, question.correctAnswer)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* যদি সব উত্তর সঠিক হয়! */}
                                        {wrongCount === 0 && (
                                            <div className="text-center py-10">
                                                <span className="text-6xl block mb-4">🌟</span>
                                                <h3 className="text-2xl font-bold text-green-600">{t("বাহ! তোমার সব উত্তর সঠিক হয়েছে!", "Wow! All your answers are correct!")}</h3>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                /* ── Main Score Screen ── */
                                <div className="q-enter w-full max-w-2xl mt-8 rounded-3xl p-8 flex flex-col items-center gap-6"
                                    style={{
                                        background: "rgba(255,255,255,0.88)", backdropFilter: "blur(12px)",
                                        border: "2.5px solid #fecaca", boxShadow: "0 12px 48px rgba(239,68,68,0.16)"
                                    }}>
                                    <div style={{ fontSize: 88 }}>🏆</div>
                                    <h2 className="text-4xl font-bold text-center" style={{ color: "#991b1b" }}>গেম শেষ!</h2>

                                    {/* Score Card */}
                                    <div className="w-full bg-red-50 p-6 rounded-2xl border-2 border-red-200 flex flex-col items-center gap-3 shadow-inner">
                                        <p className="text-xl font-bold text-gray-700">তোমার মোট স্কোর</p>
                                        <p className="text-5xl font-black text-red-600 drop-shadow-sm">
                                            {totalScore} <span className="text-2xl text-red-400">/ {TOTAL * POINTS_PER_QUESTION}</span>
                                        </p>
                                    </div>

                                    {/* Correct / Wrong Stats */}
                                    <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-3 text-base sm:text-lg font-semibold">
                                        <div className="flex items-center justify-center gap-2 px-5 py-3 bg-green-100 text-green-700 rounded-xl border border-green-300">
                                            ✅ সঠিক: {correctCount}
                                        </div>
                                        <div className="flex items-center justify-center gap-2 px-5 py-3 bg-red-100 text-red-700 rounded-xl border border-red-300">
                                            ❌ ভুল: {wrongCount}
                                        </div>
                                    </div>

                                    <div className="mt-4 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                                        {/* Review Button */}
                                        {wrongCount > 0 && (
                                            <button onClick={() => setShowReview(true)}
                                                className="w-full px-6 py-4 rounded-full font-bold text-red-700 text-base sm:text-lg transition-all hover:scale-105 active:scale-95"
                                                style={{
                                                    background: "#fee2e2", border: "2px solid #D1CCBD"
                                                }}>
                                                উত্তর মিলিয়ে দেখ
                                            </button>
                                        )}

                                        {/* Play Again Button */}
                                        <button onClick={() => { setFinished(false); setShowReview(false); setCurrent(0); setAnswers({}); }}
                                            className="w-full px-6 py-4 rounded-full font-bold text-white text-base sm:text-lg transition-all hover:scale-105 active:scale-95"
                                            style={{
                                                background: "linear-gradient(135deg,#DA291C,#DA291C)",
                                                boxShadow: "0 6px 0 #991b1b,0 8px 24px rgba(239,68,68,0.35)"
                                            }}>
                                            আবার খেলো
                                        </button>

                                        {/* Go to Home Button */}
                                        <Link to={`/select-difficulty/${chapterId}`} className="w-full">
                                            <button
                                                className="px-6 py-4 rounded-full font-bold text-white text-base sm:text-lg transition-all hover:scale-105 active:scale-95 w-full"
                                                style={{
                                                    background: "linear-gradient(135deg,#f59e0b,#d97706)",
                                                    boxShadow: "0 6px 0 #b45309,0 8px 24px rgba(245,158,11,0.35)"
                                                }}
                                            >
                                                নতুন Level বেছে নাও
                                            </button>
                                        </Link>

                                        <Link to="/learning-zone" className="w-full">
                                            <button
                                                className="px-6 py-4 rounded-full font-bold text-red-700 text-base sm:text-lg transition-all hover:scale-105 active:scale-95 w-full"
                                                style={{
                                                    background: "#fff1f2",
                                                    border: "2px solid #fda4af",
                                                    boxShadow: "0 6px 0 #fb7185,0 8px 24px rgba(244,63,94,0.24)",
                                                }}
                                            >
                                                চ্যাপ্টারে ফিরে যাও
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            )) : (
                            <div key={q.id} className="q-enter w-full max-w-4xl">
                                <div
                                    className="w-full rounded-3xl overflow-visible"
                                    style={{
                                        background: "rgba(255,255,255,0.88)",
                                        backdropFilter: "blur(12px)",
                                        border: "2.5px solid rgba(252,165,165,0.85)",
                                        boxShadow: "0 8px 40px rgba(239,68,68,0.12), 0 2px 12px rgba(0,0,0,0.07)",
                                    }}
                                >
                                    <QuestionHeader title={q.title} qNum={current + 1} total={TOTAL} audioUrl={q.audio} text="প্রশ্ন" />
                                    <div className="flex flex-col gap-4 px-5 py-5">
                                        <QuestionRenderer q={q} answer={answer} onChange={handleCurrentAnswer} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {/* Bottom nav */}
                {!finished && (
                    <BottomNav
                        current={current}
                        total={TOTAL}
                        onPrev={goPrev}
                        onNext={goNext}
                        variant="quiz"
                        isPending={isSubmitting}
                        answered={isAnswered}
                    />
                )}
            </div>
        </>
    );
}