import { useEffect, useState } from "react";
import type { JSX } from "react";
import reviewLearningImage from "../../../assets/images/learning-zone-cutout-cutout.webp";
import reviewCommunityImage from "../../../assets/images/citizen_science_img-cutout.webp";
import reviewReadinessImage from "../../../assets/images/practice-zone-new-cutout.webp";

export default function ReviewShowcase({ isEnglish }: { isEnglish: boolean }): JSX.Element {
    const [slidePosition, setSlidePosition] = useState(0);
    const [slideTransitionEnabled, setSlideTransitionEnabled] = useState(true);
    const reviews = isEnglish
        ? [
            { parts: [{ text: "With MET Club, I learned to understand weather signals and ", tone: "plain" }, { text: "get ready before a disaster.", tone: "red" }, { text: " I can now share ", tone: "plain" }, { text: "safer choices with my family.", tone: "green" }], name: "MET Club learner", detail: "Student · Demo review", image: reviewLearningImage },
            { parts: [{ text: "The hands-on lessons helped me feel more confident. Now I can ", tone: "plain" }, { text: "notice changing weather", tone: "red" }, { text: " and help my community ", tone: "plain" }, { text: "stay prepared.", tone: "green" }], name: "Community participant", detail: "Learner · Demo review", image: reviewCommunityImage },
            { parts: [{ text: "We learned together how a ", tone: "plain" }, { text: "prepared community", tone: "green" }, { text: " can understand risks and respond to ", tone: "plain" }, { text: "extreme weather.", tone: "red" }], name: "School participant", detail: "Student · Demo review", image: reviewReadinessImage },
        ]
        : [
            { parts: [{ text: "মেট ক্লাবের সঙ্গে শিখে এখন আবহাওয়ার সংকেত বুঝতে পারি এবং ", tone: "plain" }, { text: "দুর্যোগের আগেই প্রস্তুতি নিতে পারি।", tone: "red" }, { text: " পরিবারের সবার সঙ্গে ", tone: "plain" }, { text: "নিরাপদ থাকার উপায়ও ভাগ করি।", tone: "green" }], name: "মেট ক্লাবের শিক্ষার্থী", detail: "শিক্ষার্থী", image: reviewLearningImage },
            { parts: [{ text: "হাতে-কলমে শেখার পর এখন ", tone: "plain" }, { text: "আবহাওয়ার পরিবর্তন খেয়াল করি", tone: "red" }, { text: " এবং কমিউনিটিকে ", tone: "plain" }, { text: "প্রস্তুত থাকতে সাহায্য করি।", tone: "green" }], name: "কমিউনিটির অংশগ্রহণকারী", detail: "শিক্ষার্থী", image: reviewCommunityImage },
            { parts: [{ text: "একসাথে শিখে বুঝেছি, ", tone: "plain" }, { text: "প্রস্তুত কমিউনিটি", tone: "green" }, { text: " আবহাওয়ার ঝুঁকি বুঝে ", tone: "plain" }, { text: "নিরাপদে সাড়া দিতে পারে।", tone: "red" }], name: "স্কুলের অংশগ্রহণকারী", detail: "শিক্ষার্থী", image: reviewReadinessImage },
        ];

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            if (!document.hidden) setSlidePosition((current) => current + 1);
        }, 6000);
        return () => window.clearInterval(intervalId);
    }, [reviews.length]);

    const activeReview = slidePosition % reviews.length;
    const slides = [...reviews, reviews[0]];

    return (
        <section className="overflow-hidden bg-white py-[60px] lg:py-[80px]" aria-label={isEnglish ? "Learner reviews" : "শিক্ষার্থীদের অভিজ্ঞতা"}>
            <div className="mx-auto w-full max-w-[1150px] px-4 sm:px-6">
                <div className="overflow-hidden rounded-[32px] sm:rounded-[48px]">
                    <div
                        className={`flex ${slideTransitionEnabled ? "transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)]" : ""}`}
                        style={{ transform: `translateX(-${slidePosition * 100}%)` }}
                        onTransitionEnd={(event) => {
                            if (event.target !== event.currentTarget || event.propertyName !== "transform" || slidePosition < reviews.length) return;
                            setSlideTransitionEnabled(false);
                            setSlidePosition(0);
                            window.requestAnimationFrame(() => {
                                window.requestAnimationFrame(() => setSlideTransitionEnabled(true));
                            });
                        }}
                    >
                        {slides.map((review, reviewIndex) => (
                            <article key={`${review.name}-${reviewIndex}`} className="relative isolate min-h-[350px] min-w-full overflow-hidden border border-red-900/10 bg-red-950 shadow-[inset_0_1px_0_rgba(255,255,255,.1)] sm:min-h-[380px]">
                                <div className="pointer-events-none absolute -bottom-24 -left-12 h-64 w-80 rounded-full bg-red-700/35 blur-[80px]" />
                                <div className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-[58%] opacity-55 sm:block" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11'%3E%3Crect x='1' y='1' width='3' height='3' fill='%23ffffff' fill-opacity='.3'/%3E%3C/svg%3E\")", backgroundSize: "11px 11px", maskImage: "linear-gradient(135deg, transparent 12%, rgba(0,0,0,.08) 28%, rgba(0,0,0,.58) 48%, #000 66%)", WebkitMaskImage: "linear-gradient(135deg, transparent 12%, rgba(0,0,0,.08) 28%, rgba(0,0,0,.58) 48%, #000 66%)" }} />
                                <div className="relative z-10 flex min-h-[310px] w-full flex-col justify-center p-6 sm:min-h-[380px] sm:w-[68%] sm:p-10 lg:p-12">
                                    <span aria-hidden="true" className="mb-1 h-14 text-7xl font-black leading-[.8] text-red-400/70">“</span>
                                    <blockquote className="text-xl font-bold leading-relaxed text-white sm:text-2xl lg:text-[27px]">{review.parts.map((part, index) => <span key={index} className={part.tone === "red" ? "text-red-400" : part.tone === "green" ? "text-emerald-400" : ""}>{part.text}</span>)}</blockquote>
                                    <div className="mt-8">
                                        <p className="font-bold text-white">{review.name}</p>
                                        <p className="mt-1 text-sm text-white/55">{review.detail}</p>
                                    </div>
                                </div>
                                <div className="relative mx-auto h-[220px] w-full sm:absolute sm:inset-y-0 sm:right-0 sm:mx-0 sm:h-auto sm:w-[48%]">
                                    <img src={review.image} alt="" loading="lazy" className="relative z-[1] h-full w-full object-contain opacity-100" style={{ objectPosition: "center bottom" }} />
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
                <div className="mt-7 flex items-center justify-center gap-3" aria-label={isEnglish ? "Choose review" : "রিভিউ বেছে নিন"}>
                    {reviews.map((item, index) => <button key={item.name} type="button" onClick={() => { setSlideTransitionEnabled(true); setSlidePosition(index); }} aria-label={isEnglish ? `Go to review ${index + 1}` : `রিভিউ ${index + 1} দেখুন`} aria-current={index === activeReview} className={`h-2 rounded-full transition-all duration-300 ${index === activeReview ? "w-10 bg-red-700" : "w-2 bg-slate-300 hover:bg-red-300"}`} />)}
                </div>
            </div>
        </section>
    );
}
