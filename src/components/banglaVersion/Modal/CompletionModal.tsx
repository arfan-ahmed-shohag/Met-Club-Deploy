import { Link } from "react-router";

export default function CompletionModal({ setShowModal, chapterId }: { setShowModal: React.Dispatch<React.SetStateAction<boolean>>, chapterId: string }) {
    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-4">

            {/* Background overlay */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setShowModal(false)}
            />

            {/* Glass Modal */}
            <div
                className="relative z-50 w-full max-w-md rounded-3xl p-6 sm:p-7 overflow-hidden"
                style={{
                    background: "rgba(255,255,255,0.18)",
                    backdropFilter: "blur(25px) saturate(180%)",
                    WebkitBackdropFilter: "blur(25px) saturate(180%)",
                    border: "1px solid rgba(255,255,255,0.35)",
                    boxShadow:
                        "0 25px 70px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.6)",
                }}
            >

                {/* Shine effect (FIXED pointer events) */}
                <div
                    className="absolute inset-0 pointer-events-none rounded-3xl"
                    style={{
                        background:
                            "linear-gradient(135deg, rgba(255,255,255,0.35), rgba(255,255,255,0.05))",
                    }}
                />

                {/* Content wrapper */}
                <div className="relative z-10">

                    {/* Badge */}
                    <div className="inline-flex rounded-full bg-red-100/70 backdrop-blur px-3 py-1 text-xs font-black tracking-wider text-red-800 border border-red-200">
                        অধ্যায় সম্পন্ন হয়েছে
                    </div>

                    {/* Title */}
                    <h3 className="mt-3 text-2xl font-black text-red-900" style={{  
                        textShadow:
                            "-0.6px -0.6px 0 rgba(255,255,255,0.95), 0.6px -0.6px 0 rgba(255,255,255,0.95), -0.6px 0.6px 0 rgba(255,255,255,0.95), 0.6px 0.6px 0 rgba(255,255,255,0.95), 0 2px 8px rgba(127,29,29,0.18)",
                    }} >
                        🎉 তুমি এই লেসন সম্পন্ন করেছো
                    </h3>

                    {/* Description */}
                    <p className="mt-2 text-sm leading-6 text-black font-medium">
                        এখন তুমি চাইলে আবার লেসনটি দেখতে পারো অথবা সরাসরি কুইজে অংশ নিতে পারো।
                    </p>

                    {/* Buttons */}
                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">

                        <button
                            onClick={() => setShowModal(false)}
                            className="rounded-2xl border border-white/40 bg-white/25 backdrop-blur px-4 py-3 text-sm font-bold text-red-900 transition-all hover:bg-white/35 active:scale-[0.98]"
                        >
                            📖 লেসন আবার দেখো
                        </button>

                        <Link to={`/start-quiz/${chapterId}`} className="w-full">
                            <div
                                className="rounded-2xl px-4 py-3 text-sm font-medium text-white text-center transition-all active:scale-[0.98]"
                                style={{
                                    background: "linear-gradient(135deg,#DA291C,#DA291C)",
                                    boxShadow: "0 12px 30px rgba(220,38,38,0.35)",
                                    border: "1px solid rgba(255,255,255,0.25)",
                                }}
                            >
                                🚀 সরাসরি কুইজে যাও
                            </div>
                        </Link>

                    </div>
                </div>
            </div>
        </div>
    )
}
