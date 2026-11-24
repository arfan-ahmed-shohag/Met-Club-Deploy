import { useEffect, type JSX } from "react";
import { useLocation } from "react-router";
import TopNav from "../../components/Shared/TopBar";
import SiteFooter from "../../components/Shared/SiteFooter";
import AboutSection from "./components/AboutSection";
import AnticipatoryActionBriefSection from "./components/AnticipatoryActionBriefSection";
import ChapterOverviewSection from "./components/ChapterOverviewSection";
import CitizenScienceSection from "./components/CitizenScienceSection";
import GamesSection from "./components/GamesSection";
import LatestNewsSection from "./components/LatestNewsSection";
import HeroSection from "./components/HeroSection";
import PhotoGallerySection from "./components/PhotoGallerySection";
import ReviewShowcaseSection from "./components/ReviewShowcaseSection";
import StatsSection from "./components/StatsSection";
import VideoShowcaseSection from "./components/VideoShowcaseSection";
import { useLocaleRouteSync } from "../../hooks/useLocaleRouteSync";
import { getStoredLocale } from "../../utils/language";

export default function HomePage(): JSX.Element {
  useLocaleRouteSync("/", "/en");
  const isEnglish = getStoredLocale() === "en";
  const { hash } = useLocation();

  // Links like "/#chapter-overview" land on that section once it has rendered.
  useEffect(() => {
    if (!hash) return;
    const frame = requestAnimationFrame(() =>
      document
        .getElementById(decodeURIComponent(hash.slice(1)))
        ?.scrollIntoView({ block: "start" }),
    );
    return () => cancelAnimationFrame(frame);
  }, [hash]);

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-gray-50">
      <TopNav title={isEnglish ? "Home" : "হোম"} />
      <HeroSection isEnglish={isEnglish} />
      <AboutSection isEnglish={isEnglish} />
      <AnticipatoryActionBriefSection isEnglish={isEnglish} />
      <ChapterOverviewSection isEnglish={isEnglish} />
      <GamesSection isEnglish={isEnglish} />
      <CitizenScienceSection isEnglish={isEnglish} />
      <StatsSection isEnglish={isEnglish} />
      <VideoShowcaseSection isEnglish={isEnglish} />
      <LatestNewsSection isEnglish={isEnglish} />
      <PhotoGallerySection isEnglish={isEnglish} />
      <ReviewShowcaseSection isEnglish={isEnglish} />
      <SiteFooter isEnglish={isEnglish} />
    </div>
  );
}
