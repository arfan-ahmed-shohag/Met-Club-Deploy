import { Link } from "react-router";
import { useLocaleRouteSync } from "../../../hooks/useLocaleRouteSync";
import bgImage from "../../../assets/images/start-journey-page-bg.jpeg";
import forecastImg from "../../../assets/images/anticipatory_forecast.webp";
import storyLearningImg from "../../../assets/images/story_learning.webp";
import TopNav from "../../../components/Shared/TopBar";
import ZoneCard from "../../../components/StartJourney/ZoneCard";

export default function LearningSelection() {
  useLocaleRouteSync("/learning-selection", "/en/learning-selection");

  return (
    <div 
      className="relative min-h-screen flex flex-col overflow-x-hidden" 
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* Background Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "linear-gradient(180deg, rgba(20,6,6,0.22) 0%, rgba(20,6,6,0.14) 55%, rgba(20,6,6,0.18) 100%)",
        }}
      />

      <TopNav brandName="Met Club" />

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-12 pb-12">
        {/* Header */}
        <div className="header-anim text-center mb-10">
          <h1
            className="text-3xl md:text-5xl font-black mb-2"
            style={{
              color: "#9A3324",
              textShadow:
                "-1px -1px 0 rgba(255,255,255,0.96), 1px -1px 0 rgba(255,255,255,0.96), -1px 1px 0 rgba(255,255,255,0.96), 1px 1px 0 rgba(255,255,255,0.96), 0 2px 0 rgba(185,28,28,0.20), 0 8px 20px rgba(127,29,29,0.24)",
            }}
          >
            Learning Zone
          </h1>
          <p
            className="text-lg md:text-xl mt-4"
            style={{
              color: "#1f2937",
              fontWeight: 600,
              textShadow: "0 1px 6px rgba(255,255,255,0.28)",
            }}
          >
            Choose your preferred learning method
          </p>
        </div>

        {/* Selection Cards Grid */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
          
          {/* Card 1: Anticipatory Action */}
          <div className="card1 h-full">
            <ZoneCard
              title="Anticipatory Action"
              titleColor="#991b1b"
              borderColor="#FC4C02"
              btnBg="linear-gradient(135deg, #DA291C, #DA291C)"
              btnShadow="rgba(239,68,68,0.42)"
              btnLabel="Start Learning"
              link="/met-club-module-2"
              description={
                <>
                  <strong>Anticipatory Action & Impact Based Forecasting</strong>
                  <br />
                  Learn strategies for early preparation and response based on weather forecasts.
                </>
              }
              blobColor="#D1CCBD"
              illustration={
                <img
                  src={forecastImg}
                  alt="Anticipatory Action"
                  className="w-40 h-40 object-contain"
                />
              }
            />
          </div>

          {/* Card 2: Story Based Learning */}
          <div className="card2 h-full">
            <ZoneCard
              title="Story-Based Learning"
              titleColor="#991b1b"
              borderColor="#FC4C02"
              btnBg="linear-gradient(135deg, #DA291C, #DA291C)"
              btnShadow="rgba(239,68,68,0.42)"
              btnLabel="Start Learning"
              link="/en/learning-zone"
              description={
                <>
                  <strong>Story Based Assessment</strong>
                  <br />
                  Learn with fun through engaging weather stories and simple interactive assessments.
                </>
              }
              blobColor="#D1CCBD"
              illustration={
                <img
                  src={storyLearningImg}
                  alt="Story Based Learning"
                  className="w-40 h-40 object-contain"
                />
              }
            />
          </div>

        </div>

        {/* Back Button */}
        <div className="mt-10">
          <Link to="/en/start-journey">
            <button 
              className="px-6 py-2.5 rounded-full border border-[#FC4C02]/50 bg-white/20 hover:bg-white/40 text-red-950 font-bold transition duration-200 backdrop-blur-md active:scale-95 shadow-md flex items-center gap-2 cursor-pointer"
              style={{
                textShadow: "0 1px 2px rgba(255,255,255,0.4)"
              }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Go Back
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
