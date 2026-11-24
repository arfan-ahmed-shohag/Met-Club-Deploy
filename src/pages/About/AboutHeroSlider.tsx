import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import school from "../../assets/images/about-hero-school.webp";
import workshop from "../../assets/images/about-hero-workshop.webp";
import community from "../../assets/images/about-hero-community.webp";
import clubPresentation from "../../assets/images/home-about.jpeg";

const slides = [
  { src: school, position: "50% 25%" },
  { src: workshop, position: "50% 45%" },
  { src: community, position: "55% 60%" },
  { src: clubPresentation, position: "50% 60%" },
];
const slideInterval = 6000;
const controlClass =
  "grid size-10 place-items-center rounded-full text-white hover:bg-white/15 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white";

export default function AboutHeroSlider({
  children,
  isEnglish,
}: {
  children: ReactNode;
  isEnglish: boolean;
}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) {
        setActiveSlide((current) => (current + 1) % slides.length);
      }
    }, slideInterval);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  const playLabel = isEnglish ? "Play slideshow" : "ছবির স্লাইড চালু করুন";
  const pauseLabel = isEnglish ? "Pause slideshow" : "ছবির স্লাইড থামান";

  return (
    <section className="relative z-10 isolate flex min-h-[calc(100svh-4.625rem)] items-center justify-center overflow-hidden bg-slate-900 pt-12 pb-24 md:pt-16">
      <div aria-hidden="true" className="absolute inset-0 -z-20">
        {slides.map(({ src, position }, index) => (
          <img
            key={src}
            src={src}
            alt=""
            fetchPriority={index === 0 ? "high" : "low"}
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover motion-safe:transition-opacity motion-safe:duration-700 ${index === activeSlide ? "opacity-100" : "opacity-0"}`}
            style={{ objectPosition: position }}
          />
        ))}
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/50" />
      <div className="about-hero-glow about-hero-glow-one" aria-hidden="true" />
      <div className="about-hero-glow about-hero-glow-two" aria-hidden="true" />

      {children}

      <div
        role="group"
        aria-label={isEnglish ? "Hero images" : "হিরোর ছবিগুলো"}
        className="absolute inset-x-0 bottom-6 z-20 flex justify-center"
      >
        <div className="flex items-center gap-1 rounded-full border border-white/25 bg-black/45 px-1.5 py-1 backdrop-blur-sm">
          {slides.map(({ src }, index) => (
            <button
              key={src}
              type="button"
              className={controlClass}
              aria-label={
                isEnglish
                  ? `Show image ${index + 1}`
                  : `${(index + 1).toLocaleString("bn-BD")} নম্বর ছবি দেখুন`
              }
              aria-current={index === activeSlide || undefined}
              onClick={() => {
                setActiveSlide(index);
                setIsPlaying(false);
              }}
            >
              <span
                className={`h-2 rounded-full motion-safe:transition-[width,background-color] ${index === activeSlide ? "w-6 bg-white" : "w-2 bg-white/60"}`}
              />
            </button>
          ))}
          <span aria-hidden="true" className="h-5 w-px bg-white/25" />
          <button
            type="button"
            className={controlClass}
            aria-label={isPlaying ? pauseLabel : playLabel}
            onClick={() => setIsPlaying((playing) => !playing)}
          >
            {isPlaying ? (
              <Pause size={17} aria-hidden="true" />
            ) : (
              <Play size={17} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
