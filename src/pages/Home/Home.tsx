import type { JSX } from "react";
import TopNav from "../../components/Shared/TopBar";
import AboutFooter from "./components/AboutFooter";
import AboutSection from "./components/AboutSection";
import ChapterOverviewSection from "./components/ChapterOverviewSection";
import CreditsFooter from "./components/CreditsFooter";
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

    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-gray-50">
            <TopNav title={isEnglish ? "Home" : "হোম"} brandName={isEnglish ? "Met Club" : "মেট ক্লাব"} />
            <HeroSection isEnglish={isEnglish} />
            <ChapterOverviewSection isEnglish={isEnglish} />
            <AboutSection isEnglish={isEnglish} />
            <StatsSection isEnglish={isEnglish} />
            <VideoShowcaseSection isEnglish={isEnglish} />
            <PhotoGallerySection isEnglish={isEnglish} />
            <ReviewShowcaseSection isEnglish={isEnglish} />
            <AboutFooter isEnglish={isEnglish} />
            <CreditsFooter isEnglish={isEnglish} />
        </div>
    );
}
