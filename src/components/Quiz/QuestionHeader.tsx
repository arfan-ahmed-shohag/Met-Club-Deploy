import { FaPause, FaPlay } from "react-icons/fa";
import { useAudio, useAudioSync } from "../../hooks/UseAudio";
import type { QuestionHeaderProps } from "../../types";

export function QuestionHeader({ title, qNum, total, audioUrl, text  }: QuestionHeaderProps) {
    const { toggle, isThisSrcPlaying } = useAudio();
    useAudioSync(audioUrl);
    const isPlaying = !!audioUrl && isThisSrcPlaying(audioUrl);

    const toggleAudio = () => {
        if (audioUrl) {
            toggle(audioUrl);
        }
    };

    return (
        <div
            className="flex items-center justify-between gap-2 px-3 sm:px-6 py-3 sm:py-4"
            style={{ borderBottom: "1px dashed rgba(148,163,184,0.35)" }}
        >
            {/* ── Title — grows, wraps on small screens ── */}
            <h2
                className="font-bold leading-snug flex-1 min-w-0
                   text-sm sm:text-base md:text-lg lg:text-xl
                   line-clamp-2 sm:line-clamp-none"
                style={{ color: "#991b1b" }}
            >
                {title}
            </h2>

            {/* ── Right side: audio btn + badge ── */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">

                {/* Audio button */}
                {audioUrl && (
                    <button
                        onClick={toggleAudio}
                        className={`flex items-center justify-center
                        w-9 h-9 sm:w-11 sm:h-11
                        rounded-full transition-all duration-300
                        border-2 shrink-0
                        ${isPlaying
                            ? "bg-red-100 border-red-500 text-red-600 animate-pulse scale-105 shadow-md"
                            : "bg-white border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-500 hover:border-red-300 hover:scale-105 hover:shadow-md active:scale-95"
                            }`}
                        title={isPlaying ? "অডিও থামাও" : "প্রশ্নটি শোনো"}
                    >
                        {isPlaying
                            ? <FaPause className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            : <FaPlay className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5" />
                        }
                    </button>
                )}

                {/* Question badge */}
                <span
                    className="font-bold rounded-full border border-red-200 shrink-0
                     text-xs sm:text-sm
                     px-2.5 py-1 sm:px-4 sm:py-2"
                    style={{
                        background: "#fee2e2", color: "#9A3324",
                        fontFamily: "'Hind Siliguri',sans-serif"
                    }}
                >
                    {/* xs: "৩/১০", sm+: "প্রশ্ন ৩ / ১০" */}
                    <span className="sm:hidden">{qNum}/{total}</span>
                    <span className="hidden sm:inline">{text} {qNum} / {total}</span>
                </span>
            </div>
        </div>
    );
}