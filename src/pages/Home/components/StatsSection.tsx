import { Eye, Globe2, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function StatsSection({isEnglish}:{isEnglish:boolean}){
 const statsSectionRef=useRef<HTMLElement>(null);
 const [statsCounts,setStatsCounts]=useState([0,0,0]);
 useEffect(()=>{
  const section=statsSectionRef.current; if(!section)return;
  let frameId=0; let startedAt:number|null=null; const targets=[10000,2500,750];
  const observer=new IntersectionObserver(([entry])=>{
   if(!entry.isIntersecting)return; observer.disconnect();
   if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){setStatsCounts(targets);return;}
   const countUp=(time:number)=>{startedAt??=time;const progress=Math.min((time-startedAt)/1500,1);const easedProgress=1-Math.pow(1-progress,3);setStatsCounts(targets.map(target=>Math.floor(target*easedProgress)));if(progress<1)frameId=window.requestAnimationFrame(countUp);else setStatsCounts(targets);};
   frameId=window.requestAnimationFrame(countUp);
  },{threshold:.3});
  observer.observe(section); return()=>{observer.disconnect();window.cancelAnimationFrame(frameId);};
 },[]);
 return (
<section ref={statsSectionRef} className="relative isolate overflow-hidden bg-red-950 py-[60px] lg:py-[80px]" aria-labelledby="met-club-stats-title">
                <div className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)", backgroundSize: "42px 42px" }} />
                <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-red-700/30 blur-3xl" />
                <div className="site-container relative px-4 sm:px-6 lg:px-8">
                    <div className="mb-9 text-center">
                        <p className="mb-2 text-sm font-bold uppercase tracking-[.16em] text-red-300">{isEnglish ? "OUR COMMUNITY" : "আমাদের কমিউনিটি"}</p>
                        <h2 id="met-club-stats-title" className="text-[36px] font-black text-white">{isEnglish ? "Learning together, growing together" : "একসাথে শিখছি, একসাথে এগোচ্ছি"}</h2>
                        <p className="mt-2 text-sm font-normal text-red-100/70 sm:text-base">{isEnglish ? "A snapshot of the learners and visitors connecting with MET Club." : "মেট ক্লাবের সঙ্গে যুক্ত শিক্ষার্থী ও দর্শনার্থীদের একটি সংক্ষিপ্ত চিত্র।"}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                            { icon: Eye, value: statsCounts[0], label: isEnglish ? "Total visitors" : "মোট দর্শনার্থী" },
                            { icon: Users, value: statsCounts[1], label: isEnglish ? "Users in Bangladesh" : "বাংলাদেশের ব্যবহারকারী" },
                            { icon: Globe2, value: statsCounts[2], label: isEnglish ? "Users from other countries" : "অন্যান্য দেশের ব্যবহারকারী" },
                        ].map(({ icon: Icon, value, label }, index) => (
                            <div key={label} className={`group relative min-h-56 overflow-hidden rounded-[2rem] p-7 transition-all duration-500 hover:-translate-y-2 sm:p-9 ${index === 2 ? "sm:col-span-2 sm:mx-auto sm:w-1/2 lg:col-span-1 lg:mx-0 lg:w-full" : "sm:col-span-1"} ${index === 2 ? "bg-red-300 text-red-950 hover:shadow-[0_24px_50px_rgba(248,113,113,.25)]" : "border border-white/10 bg-white/[0.06] text-white hover:border-red-300/50 hover:bg-white/[0.09] hover:shadow-[0_24px_50px_rgba(0,0,0,.25)]"}`} style={{ animation: "fadeSlideUp .55s ease both", animationDelay: (index * 120) + "ms" }}>
                                <div className="relative z-10 flex h-full flex-col">
                                    {index === 2 && <span className="mb-8 grid h-12 w-12 place-items-center rounded-xl bg-red-950 text-red-200 transition-transform duration-700 group-hover:rotate-[360deg]"><Icon size={23} aria-hidden="true" /></span>}
                                    <p className={`text-5xl font-black tracking-tighter sm:text-6xl ${index === 2 ? "text-red-950" : "text-white"}`}>{value.toLocaleString(isEnglish ? "en-US" : "bn-BD")}<span className={index === 2 ? "text-white" : "text-red-300"}>+</span></p>
                                    <p className={`mt-2 text-xs font-bold uppercase tracking-[.18em] ${index === 2 ? "text-red-950/65" : "text-red-100/60"}`}>{label}</p>
                                    {index === 1 && <div className="mt-8 flex gap-1.5"><span className="h-1 flex-1 rounded-full bg-red-300 transition-all duration-700 group-hover:flex-[2]" /><span className="h-1 flex-1 rounded-full bg-red-300/80 transition-all duration-700 group-hover:flex-[1.5]" /><span className="h-1 flex-1 rounded-full bg-red-300/55 transition-all duration-700 group-hover:flex-[2.5]" /><span className="h-1 flex-1 rounded-full bg-white/10 transition-colors group-hover:bg-red-300/30" /></div>}
                                </div>
                                {index === 0 && <div className="absolute -bottom-5 -right-3 text-7xl font-black italic tracking-tighter text-white/[0.035] transition-all duration-700 group-hover:scale-110 group-hover:text-red-300/10 sm:text-8xl">MET</div>}
                                {index === 2 && <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border-[24px] border-white/15 transition-transform duration-1000 group-hover:scale-125" />}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
 );
}
