import { ArrowUpRight, CheckCircle2, MapPin, Users } from "lucide-react";
import type { JSX } from "react";
import { CITIZEN_SCIENCE_URL } from "./homeExtraData";

export default function CitizenScienceSection({
  isEnglish,
}: {
  isEnglish: boolean;
}): JSX.Element {
  const t = (bn: string, en: string) => (isEnglish ? en : bn);

  const steps = [
    {
      title: t("ফর্মটি খুলুন", "Open the form"),
      text: t("নিচের বোতামে চাপ দিলেই জরিপ খুলবে।", "The button below opens the survey."),
    },
    {
      title: t("পরিবারের তথ্য দিন", "Share household details"),
      text: t(
        "সদস্য সংখ্যা, আয়ের উৎস আর আপনার জেলা।",
        "Family size, main income and your district.",
      ),
    },
    {
      title: t("জমা দিন", "Submit"),
      text: t(
        "আপনার তথ্য দুর্যোগ প্রস্তুতির পরিকল্পনায় কাজে লাগবে।",
        "Your answers help plan for disaster preparedness.",
      ),
    },
  ];

  return (
    <section
      id="citizen-science"
      className="bg-white pb-[60px] pt-4 lg:pb-[80px] lg:pt-6"
      aria-labelledby="home-citizen-science-title"
    >
      <div className="site-container px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[28px] border border-red-100 bg-gradient-to-br from-red-50 via-white to-orange-50 px-6 py-10 text-slate-900 shadow-[0_18px_50px_rgba(127,29,29,.10)] sm:px-10 lg:px-14 lg:py-14">
          {/* soft background shapes */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-red-200/40 blur-2xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-orange-200/40 blur-2xl"
          />

          <div className="relative grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-1.5 text-sm font-bold text-red-700">
                <Users size={16} aria-hidden="true" />
                {t("আপনিও হতে পারেন বিজ্ঞানী", "Anyone can be a scientist")}
              </p>
              <h2
                id="home-citizen-science-title"
                className="mt-4 text-[32px] font-black leading-tight text-red-950 sm:text-[40px]"
              >
                {t("সিটিজেন সায়েন্স", "Citizen Science")}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-700 sm:text-lg">
                {t(
                  "আপনার পরিবার ও এলাকার তথ্য দিয়ে জলবায়ু ঝুঁকি বুঝতে আমাদের সাহায্য করুন। সবার দেওয়া তথ্য মিলে তৈরি হবে আরও ভালো আগাম প্রস্তুতির পরিকল্পনা।",
                  "Help us understand climate risk by sharing information about your household and area. Together, everyone's answers build better plans to prepare early.",
                )}
              </p>

              <ol className="mt-8 space-y-4">
                {steps.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-red-700 text-base font-black text-white shadow-md shadow-red-900/20">
                      {isEnglish
                        ? index + 1
                        : (index + 1).toLocaleString("bn-BD")}
                    </span>
                    <div>
                      <p className="font-bold text-red-950">{step.title}</p>
                      <p className="text-sm text-slate-600">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
                <a
                  href={CITIZEN_SCIENCE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-red-700 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-red-900/15 transition hover:-translate-y-0.5 hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-700 motion-reduce:transition-none"
                >
                  {t("জরিপে অংশ নিন", "Take the survey")}
                  <ArrowUpRight size={20} aria-hidden="true" />
                  <span className="sr-only">
                    {t("(নতুন ট্যাবে খুলবে)", "(opens in a new tab)")}
                  </span>
                </a>
                <span className="inline-flex items-center gap-2 text-sm text-slate-600">
                  <MapPin size={16} aria-hidden="true" />
                  {t(
                    "পটুয়াখালী · গাইবান্ধা · চট্টগ্রাম",
                    "Patuakhali · Gaibandha · Chattogram",
                  )}
                </span>
              </div>
            </div>

            {/* Illustrated preview of the survey form */}
            <div aria-hidden="true" className="relative mx-auto w-full max-w-sm">
              <div className="absolute -left-4 top-10 h-full w-full rotate-[-5deg] rounded-2xl bg-gradient-to-br from-red-100 to-orange-100" />
              <div className="relative rotate-[2deg] rounded-2xl border border-red-100 bg-white p-6 text-slate-800 shadow-[0_20px_40px_rgba(127,29,29,.14)] transition-transform duration-500 hover:rotate-0 motion-reduce:transition-none">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-black text-red-900">
                    {t("সিটিজেন সায়েন্স", "Citizen Science")}
                  </p>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                    {t("জরিপ", "Survey")}
                  </span>
                </div>
                <div className="mt-5 space-y-4">
                  {[t("নাম", "Name"), t("পরিবারের সদস্য সংখ্যা", "Family members")].map(
                    (label) => (
                      <div key={label}>
                        <p className="text-xs font-bold text-slate-500">{label}</p>
                        <div className="mt-1.5 h-8 rounded-md border border-slate-200 bg-slate-50" />
                      </div>
                    ),
                  )}
                  <div>
                    <p className="text-xs font-bold text-slate-500">
                      {t("জেলা", "District")}
                    </p>
                    <div className="mt-2 space-y-2">
                      {[
                        t("পটুয়াখালী", "Patuakhali"),
                        t("গাইবান্ধা", "Gaibandha"),
                        t("চট্টগ্রাম", "Chattogram"),
                      ].map((district, index) => (
                        <div
                          key={district}
                          className="flex items-center gap-2 text-sm"
                        >
                          <span
                            className={`grid h-4 w-4 place-items-center rounded-full border-2 ${index === 0 ? "border-red-600" : "border-slate-300"}`}
                          >
                            {index === 0 && (
                              <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                            )}
                          </span>
                          {district}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex h-10 items-center justify-center gap-2 rounded-lg bg-red-700 text-sm font-bold text-white">
                  <CheckCircle2 size={16} />
                  {t("জমা দিন", "Submit")}
                </div>
              </div>
              <div className="absolute -right-3 -top-4 rotate-6 rounded-xl bg-orange-400 px-3 py-2 text-sm font-black text-red-950 shadow-lg">
                {t("আপনার তথ্য গুরুত্বপূর্ণ!", "Your data matters!")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
