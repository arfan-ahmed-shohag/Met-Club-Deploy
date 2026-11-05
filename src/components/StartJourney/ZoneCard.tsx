import { useState } from "react";
import { Link } from "react-router";

function CardBlob({ color }: { color: string }) {
    return (
        <div
            className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
            aria-hidden="true"
        >
            <div
                className="absolute -top-8 -left-8 w-40 h-40 rounded-full opacity-20 blur-2xl"
                style={{ background: color }}
            />
            <div
                className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-15 blur-2xl"
                style={{ background: color }}
            />
        </div>
    );
}

export default function ZoneCard({
    title,
    titleColor,
    borderColor,
    btnBg,
    btnLabel,
    link,
    disabled = false,
    description,
    blobColor,
    illustration,
}: {
    title: string;
    titleColor: string;
    borderColor: string;
    btnBg: string;
    btnShadow: string;
    btnLabel: string;
    link: string;
    disabled?: boolean;
    description: React.ReactNode;
    blobColor: string;
    illustration: React.ReactNode;
}) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="relative flex h-full flex-col items-center justify-between rounded-2xl p-6 cursor-pointer select-none transition-all duration-300 overflow-hidden"
            style={{
                background: hovered
                    ? "rgba(255, 255, 255, 0.25)"
                    : "rgba(255, 255, 255, 0.18)",

                border: `1.5px solid ${borderColor}99`,

                backdropFilter: "blur(20px) saturate(160%)",
                WebkitBackdropFilter: "blur(20px) saturate(160%)",

                boxShadow: hovered
                    ? "0 20px 60px rgba(0,0,0,0.25)"
                    : "0 10px 30px rgba(0,0,0,0.15)",

                transform: hovered ? "translateY(-6px)" : "translateY(0)",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Glass shine effect */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(120deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.05) 40%, transparent 70%)",
                    opacity: 0.6,
                }}
            />

            <CardBlob color={blobColor} />

            {/* Title */}
            <h2
                className="text-2xl font-black tracking-widest uppercase z-10 text-center"
                style={{
                    color: titleColor,
                    textShadow:
                        "-1px -1px 0 rgba(255,255,255,0.96), 1px -1px 0 rgba(255,255,255,0.96), -1px 1px 0 rgba(255,255,255,0.96), 1px 1px 0 rgba(255,255,255,0.96), 0 2px 0 rgba(185,28,28,0.20), 0 5px 10px rgba(127,29,29,0.24)",
                }}
            >
                {title}
            </h2>

            {/* Illustration */}
            <div
                className="flex flex-1 items-center justify-center rounded-full transition-transform duration-500 my-2"
                style={{
                    background: `radial-gradient(circle, ${blobColor}22 0%, transparent 70%)`,
                    transform: hovered ? "scale(1.04)" : "scale(1)",
                }}
            >
                <div
                    className="transition-transform duration-500"
                    style={{
                        filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.12))",
                    }}
                >
                    {illustration}
                </div>
            </div>

            {/* Description */}
            <p
                className="text-center mb-6 z-10 leading-relaxed"
                style={{
                    fontSize: "1rem",
                    color: "#111827",
                    fontWeight: 500,
                }}
            >
                {description}
            </p>

            {/* Button */}
            {link.startsWith("/") && !link.startsWith("//") ? (
                <Link to={link} className="z-10 inline-block cursor-pointer">
                    <button
                        className="z-10 px-8 py-3 rounded-full text-white font-medium text-sm md:text-base transition-all duration-200 active:scale-95 cursor-pointer"
                        style={{
                            background: btnBg,
                            boxShadow: hovered
                                ? "0 6px 24px rgba(0,0,0,0.3)"
                                : "0 3px 12px rgba(0,0,0,0.2)",
                            transform: hovered ? "scale(1.05)" : "scale(1)",
                            cursor: "pointer",
                        }}
                    >
                        {btnLabel}
                    </button>
                </Link>
            ) : (
                disabled ? (
                    <button
                        disabled
                        className="z-10 px-8 py-3 rounded-full text-white font-medium text-sm md:text-base transition-all duration-200 active:scale-95 cursor-not-allowed opacity-60"
                        style={{
                            background: "linear-gradient(135deg, #cbd5e1, #94a3b8)",
                            boxShadow: "0 3px 10px rgba(51,65,85,0.2)",
                        }}
                    >
                        {btnLabel}
                    </button>
                ) : (
                    <a href={link} className="z-10 inline-block cursor-pointer">
                        <button
                            className="z-10 px-8 py-3 rounded-full text-white font-medium text-sm md:text-base transition-all duration-200 active:scale-95 cursor-pointer"
                            style={{
                                background: btnBg,
                                boxShadow: hovered
                                    ? "0 6px 24px rgba(0,0,0,0.3)"
                                    : "0 3px 12px rgba(0,0,0,0.2)",
                                transform: hovered ? "scale(1.05)" : "scale(1)",
                                cursor: "pointer",
                            }}
                        >
                            {btnLabel}
                        </button>
                    </a>
                )
            )}
        </div>
    );
}
