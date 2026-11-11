import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import anticipatoryActionImage from "../../../assets/images/anticipatory-action-cutout.png";

export default function AnticipatoryActionBriefSection({ isEnglish }: { isEnglish: boolean }) {
    return (
        <section className="relative overflow-hidden bg-white py-[60px] lg:py-[80px]" aria-labelledby="anticipatory-action-brief-title">
            <div className="site-container relative grid items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
                        <p className="mb-3 text-sm font-bold uppercase tracking-[.16em] text-red-600">
                            {isEnglish ? "LEARN TO BE READY" : "শিখি, প্রস্তুত থাকি"}
                        </p>
                        <h2 id="anticipatory-action-brief-title" className="text-[32px] font-black leading-tight text-red-950 sm:text-[36px]">
                            {isEnglish ? "Child-friendly anticipatory action" : "শিশুবান্ধব আগাম পদক্ষেপ"}
                        </h2>
                        <p className="mt-4 text-base leading-relaxed text-slate-700 sm:text-lg text-justify">
                            {isEnglish
                                ? "Explore an interactive course where children learn about weather forecasts, early warnings, and the risks of hazards in a simple, engaging way. Through stories, illustrations, quizzes, and hands-on activities, they discover how to make safer choices before storms, floods, or other emergencies. They can use what they learn to help their families and communities prepare in time."
                                : "ইন্টার‌্যাকটিভ এই কোর্সে শিশুরা সহজ ও আনন্দময় উপায়ে আবহাওয়ার পূর্বাভাস, আগাম সতর্কতা এবং বিভিন্ন দুর্যোগের ঝুঁকি সম্পর্কে জানতে পারবে। গল্প, ছবি, কুইজ ও হাতে-কলমে অনুশীলনের মাধ্যমে তারা বুঝবে—ঝড়, বন্যা বা অন্য কোনো বিপদের আগে কীভাবে নিরাপদ সিদ্ধান্ত নিতে হয়। শেখা বিষয়গুলো কাজে লাগিয়ে শিশুরা নিজেদের পরিবার ও কমিউনিটিকে সময়মতো প্রস্তুত হতে সাহায্য করবে।"}
                        </p>
                        <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-bold text-red-800 lg:justify-start">
                            {[isEnglish ? "Weather awareness" : "আবহাওয়া সচেতনতা", isEnglish ? "Early warnings" : "আগাম সতর্কতা", isEnglish ? "Safety planning" : "নিরাপত্তা প্রস্তুতি"].map((item, index) => <span key={item} className="inline-flex items-center gap-2"><span aria-hidden="true" className="hero-feature-dot h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,.45)]" style={{ animationDelay: `${index * 220}ms` }} />{item}</span>)}
                        </div>
                        <Link to={isEnglish ? "/en/anticipatory-action" : "/anticipatory-action"} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-bold text-white shadow-lg shadow-red-900/15 transition hover:-translate-y-0.5 hover:bg-red-800">
                            {isEnglish ? "Explore the course" : "কোর্সটি দেখুন"}<ArrowRight size={18} aria-hidden="true" />
                        </Link>
                    </div>
                    <div className="relative mx-auto flex min-h-[300px] w-full max-w-[760px] items-center justify-center sm:min-h-[390px] lg:max-w-[660px]">
                        <div className="absolute h-64 w-64 rounded-full bg-gradient-to-br from-red-100 to-orange-100 sm:h-80 sm:w-80" />
                        <div className="absolute h-72 w-72 rounded-full border border-red-200/70 sm:h-[22rem] sm:w-[22rem]" />
                        <img src={anticipatoryActionImage} alt={isEnglish ? "A friendly weather station illustration with a smiling sun and cloud" : "হাসিমুখ সূর্য ও মেঘসহ একটি বন্ধুসুলভ আবহাওয়া পর্যবেক্ষণ কেন্দ্রের ছবি"} className="relative z-10 w-full max-w-[720px] animate-float object-contain drop-shadow-[0_20px_24px_rgba(127,29,29,0.12)] lg:max-w-[560px]" />
                    </div>
            </div>
        </section>
    );
}
