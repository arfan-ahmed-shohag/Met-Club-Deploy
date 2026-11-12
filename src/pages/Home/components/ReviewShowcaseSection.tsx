import { useEffect, useState } from "react";
import type { JSX } from "react";
import axiosPublic from "../../../hooks/axiosPublic";
import { resolveMediaUrl } from "../../../utils/media";

type Story = {
  id: string;
  quoteBn: string;
  quoteEn: string;
  authorNameBn: string;
  authorNameEn: string;
  authorDetailBn: string;
  authorDetailEn: string;
  imageUrl: string;
};

export default function ReviewShowcase({
  isEnglish,
}: {
  isEnglish: boolean;
}): JSX.Element {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [slidePosition, setSlidePosition] = useState(0);
  const [slideTransitionEnabled, setSlideTransitionEnabled] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void axiosPublic()
      .get<{ data?: Story[] }>("/stories", { params: { page: 1, limit: 3 } })
      .then(({ data }) => {
        if (!cancelled) setStories(Array.isArray(data?.data) ? data.data : []);
      })
      .catch((error) =>
        console.error("Failed to load homepage stories:", error),
      )
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (stories.length < 2) return;
    const intervalId = window.setInterval(() => {
      if (!document.hidden) setSlidePosition((current) => current + 1);
    }, 6000);
    return () => window.clearInterval(intervalId);
  }, [stories.length]);

  if (isLoading)
    return (
      <section
        className="bg-white py-[60px] lg:py-[80px]"
        aria-label={isEnglish ? "Stories" : "গল্প"}
      >
        <div className="mx-auto h-[350px] w-[calc(100%-2rem)] max-w-[1150px] animate-pulse rounded-[32px] bg-slate-200 sm:h-[380px] sm:rounded-[48px]" />
      </section>
    );
  if (!stories.length) return <></>;

  const activeStory = slidePosition % stories.length;
  const slides = [...stories, stories[0]];
  return (
    <section
      className="overflow-hidden bg-white py-[60px] lg:py-[80px]"
      aria-label={isEnglish ? "Learner stories" : "শিক্ষার্থীদের গল্প"}
    >
      <div className="mx-auto w-full max-w-[1150px] px-4 sm:px-6">
        <div className="overflow-hidden rounded-[32px] sm:rounded-[48px]">
          <div
            className={`flex ${slideTransitionEnabled ? "transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)]" : ""}`}
            style={{ transform: `translateX(-${slidePosition * 100}%)` }}
            onTransitionEnd={(event) => {
              if (
                event.target !== event.currentTarget ||
                event.propertyName !== "transform" ||
                slidePosition < stories.length
              )
                return;
              setSlideTransitionEnabled(false);
              setSlidePosition(0);
              window.requestAnimationFrame(() =>
                window.requestAnimationFrame(() =>
                  setSlideTransitionEnabled(true),
                ),
              );
            }}
          >
            {slides.map((story, index) => (
              <article
                key={`${story.id}-${index}`}
                className="relative isolate min-h-[350px] min-w-full overflow-hidden border border-red-900/10 bg-red-950 shadow-[inset_0_1px_0_rgba(255,255,255,.1)] sm:min-h-[380px]"
              >
                <div className="pointer-events-none absolute -bottom-24 -left-12 h-64 w-80 rounded-full bg-red-700/35 blur-[80px]" />
                <div
                  className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-[58%] opacity-55 sm:block"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11'%3E%3Crect x='1' y='1' width='3' height='3' fill='%23ffffff' fill-opacity='.3'/%3E%3C/svg%3E\")",
                    backgroundSize: "11px 11px",
                    maskImage:
                      "linear-gradient(135deg, transparent 12%, rgba(0,0,0,.08) 28%, rgba(0,0,0,.58) 48%, #000 66%)",
                    WebkitMaskImage:
                      "linear-gradient(135deg, transparent 12%, rgba(0,0,0,.08) 28%, rgba(0,0,0,.58) 48%, #000 66%)",
                  }}
                />
                <div className="relative z-10 flex min-h-[310px] w-full flex-col justify-center p-6 sm:min-h-[380px] sm:w-[68%] sm:p-10 lg:p-12">
                  <span
                    aria-hidden="true"
                    className="mb-1 h-14 text-7xl font-black leading-[.8] text-red-400/70"
                  >
                    “
                  </span>
                  <blockquote className="whitespace-pre-line text-xl font-bold leading-relaxed text-white sm:text-2xl lg:text-[27px]">
                    {isEnglish ? story.quoteEn : story.quoteBn}
                  </blockquote>
                  <div className="mt-8">
                    <p className="font-bold text-white">
                      {isEnglish ? story.authorNameEn : story.authorNameBn}
                    </p>
                    <p className="mt-1 text-sm text-white/55">
                      {isEnglish ? story.authorDetailEn : story.authorDetailBn}
                    </p>
                  </div>
                </div>
                <div className="relative mx-auto h-[220px] w-full sm:absolute sm:inset-y-0 sm:right-0 sm:mx-0 sm:h-auto sm:w-[48%]">
                  <img
                    src={resolveMediaUrl(story.imageUrl)}
                    alt=""
                    loading="lazy"
                    className="relative z-[1] h-full w-full object-contain"
                    style={{ objectPosition: "center bottom" }}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
        <div
          className="mt-7 flex items-center justify-center gap-3"
          aria-label={isEnglish ? "Choose story" : "গল্প বেছে নিন"}
        >
          {stories.map((story, index) => (
            <button
              key={story.id}
              type="button"
              onClick={() => {
                setSlideTransitionEnabled(true);
                setSlidePosition(index);
              }}
              aria-label={
                isEnglish ? `Go to story ${index + 1}` : `গল্প ${index + 1} দেখুন`
              }
              aria-current={index === activeStory}
              className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${index === activeStory ? "w-10 bg-red-700" : "w-2 bg-slate-300 hover:bg-red-300"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
