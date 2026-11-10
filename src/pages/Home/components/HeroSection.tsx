import { Sparkles } from "lucide-react";
import { Link } from "react-router";
import coverVideo from "../../../assets/videos/Drone shot for cover.mp4";
import WeatherCanvas from "../../../components/Shared/WeatherCanvas";

export default function HeroSection({ isEnglish }: { isEnglish: boolean }) {
 const t=(bangla:string,english:string)=>isEnglish?english:bangla;
 return (
<main className="relative flex flex-1 items-center overflow-hidden isolate">
                <video autoPlay loop muted playsInline className="absolute inset-0 z-0 h-full w-full object-cover" aria-hidden="true"><source src={coverVideo} type="video/mp4" /></video>
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-red-950/85 via-red-950/65 to-slate-950/35" />
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
                <WeatherCanvas />
                <div className="site-container relative z-20 grid min-h-[min(820px,calc(100svh-4rem))] items-center gap-12 px-5 py-[60px] sm:px-8 lg:grid-cols-[1.08fr_.92fr] lg:gap-16 lg:py-[80px]">
                    <div className="max-w-2xl text-white">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-4 py-2 text-sm font-bold shadow-lg backdrop-blur-md"><Sparkles className="h-4 w-4 text-amber-300" />{t("শিশুদের জন্য আবহাওয়া ও দুর্যোগ সচেতনতা", "Weather and disaster learning for every child")}</div>
                        <h1 className="mb-5 text-4xl font-black leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl" style={{ textShadow: "0 4px 24px rgba(0,0,0,.32)" }}>{t("আবহাওয়া শিখি,", "Learn about weather,")}<br /><span className="text-red-200">{t("নিরাপদ সমাজ গড়ি", "build safer communities")}</span></h1>
                        <p className="max-w-xl text-base font-normal leading-relaxed text-white/90 sm:text-lg">{t("খেলার ছলে আবহাওয়া পর্যবেক্ষণ, হাতে-কলমে শেখা আর দুর্যোগ প্রস্তুতির মাধ্যমে শিশুরা নিজেদের কমিউনিটিকে নিরাপদ রাখতে শিখবে।", "MET Club helps children explore weather, practice observation, and build disaster readiness so they can help keep their communities safe.")}</p>
                        <div className="mt-8 flex flex-wrap gap-3"><Link to={isEnglish ? "/en/start-journey" : "/start-journey"} className="inline-flex items-center justify-center rounded-xl bg-red-600 px-6 py-3.5 font-bold text-white shadow-xl shadow-red-950/25 transition hover:-translate-y-0.5 hover:bg-red-500">{t("শেখা শুরু করি", "Start learning")}</Link><Link to={isEnglish ? "/en/about" : "/about"} className="inline-flex items-center justify-center rounded-xl border border-white/50 bg-white/10 px-6 py-3.5 font-bold text-white backdrop-blur transition hover:bg-white/20">{t("মেট ক্লাব সম্পর্কে", "About MET Club")}</Link></div>
                        <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold text-white/90">{[
                            t("আবহাওয়া পর্যবেক্ষণ", "Weather observation"),
                            t("হাতে-কলমে অনুশীলন", "Hands-on practice"),
                            t("দুর্যোগ প্রস্তুতি", "Disaster readiness"),
                        ].map((item, index) => <span key={item} className="inline-flex items-center gap-2"><span aria-hidden="true" className="hero-feature-dot h-2 w-2 rounded-full bg-red-300 shadow-[0_0_12px_rgba(252,165,165,.9)]" style={{ animationDelay: `${index * 220}ms` }} />{item}</span>)}</div>
                    </div>
                    <div className="relative mx-auto w-full max-w-[520px] animate-float"><div className="absolute -inset-5 rounded-[2.5rem] bg-red-400/20 blur-3xl" /><div className="relative overflow-hidden rounded-[2rem] border border-white/40 bg-white/90 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-7">
                        <div className="flex items-center justify-between border-b border-red-100 pb-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-red-500">MET CLUB</p><h2 className="mt-1 text-xl font-black text-red-950 sm:text-2xl">{t("তোমার শেখার যাত্রা", "Your learning journey")}</h2></div><div className="grid h-12 w-12 place-items-center rounded-2xl bg-red-100 text-2xl" aria-hidden="true">{String.fromCodePoint(0x1f326,0xfe0f)}</div></div>
                        <div className="mt-5 grid gap-3">{[
                            { icon: String.fromCodePoint(0x1f324,0xfe0f), title: t("আবহাওয়া জানি", "Explore the weather"), desc: t("মেঘ, বৃষ্টি ও আবহাওয়ার সংকেত", "Clouds, rain, and weather signals"), color: "bg-amber-50" },
                            { icon: String.fromCodePoint(0x1f50e), title: t("দেখি ও অনুশীলন করি", "Observe and practice"), desc: t("কুইজ, গল্প ও হাতে-কলমে কাজ", "Quizzes, stories, and activities"), color: "bg-rose-50" },
                            { icon: String.fromCodePoint(0x1f6e1,0xfe0f), title: t("প্রস্তুত থাকি", "Be ready"), desc: t("নিজে ও কমিউনিটিকে নিরাপদ রাখি", "Help keep people around us safe"), color: "bg-orange-50" },
                        ].map((item, index) => <div key={item.title} className={"flex items-center gap-4 rounded-2xl " + item.color + " p-4 transition duration-300 hover:translate-x-1"} style={{ animation: "fadeSlideUp .6s ease both " + (index * 140) + "ms" }}><div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white text-2xl shadow-sm" aria-hidden="true">{item.icon}</div><div><h3 className="font-black text-red-950">{item.title}</h3><p className="mt-0.5 text-sm text-slate-600">{item.desc}</p></div><span className="ml-auto text-lg font-bold text-red-400" aria-hidden="true">&gt;</span></div>)}</div>
                        <div className="mt-5 flex items-center justify-between rounded-xl bg-red-900 px-4 py-3 text-white"><span className="text-sm font-bold">{t("কৌতূহল থেকে আত্মবিশ্বাস", "Curiosity grows into confidence")}</span><span className="text-xl" aria-hidden="true">*</span></div>
                    </div><div className="absolute -left-5 top-1/3 hidden h-14 w-14 animate-float-delayed place-items-center rounded-2xl border border-white/50 bg-white/90 text-2xl shadow-lg sm:grid" aria-hidden="true">{String.fromCodePoint(0x2600,0xfe0f)}</div><div className="absolute -right-4 bottom-10 hidden h-14 w-14 animate-float-delayed place-items-center rounded-2xl border border-white/50 bg-white/90 text-2xl shadow-lg sm:grid" aria-hidden="true">{String.fromCodePoint(0x1f327,0xfe0f)}</div></div>
                </div>
            </main>
 );
}
