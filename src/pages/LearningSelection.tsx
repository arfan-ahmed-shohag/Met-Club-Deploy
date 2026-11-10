import { useLocaleRouteSync } from "../hooks/useLocaleRouteSync";
import bgImage from "../assets/images/start-journey-page-bg.jpeg";
import forecastImg from "../assets/images/anticipatory_forecast.webp";
import storyLearningImg from "../assets/images/story_learning.webp";
import TopNav from "../components/Shared/TopBar";
import ZoneCard from "../components/StartJourney/ZoneCard";

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

      <TopNav brandName="মেট ক্লাব" />

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
            লার্ন উইথ ফান
          </h1>
          <p
            className="text-lg md:text-xl mt-4"
            style={{
              color: "#1f2937",
              fontWeight: 600,
              textShadow: "0 1px 6px rgba(255,255,255,0.28)",
            }}
          >
            আপনার পছন্দের শেখার মাধ্যমটি নির্বাচন করুন
          </p>
        </div>

        {/* Selection Cards Grid */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">

          {/* Card 1: Anticipatory Action */}
          <div className="card1 h-full">
            <ZoneCard
              title="আগাম কার্যক্রম"
              titleColor="#991b1b"
              borderColor="#FC4C02"
              btnBg="linear-gradient(135deg, #DA291C, #DA291C)"
              btnShadow="rgba(239,68,68,0.42)"
              btnLabel="পড়া শুরু করুন"
              link="/met-club-module-2"
              description={
                <>
                  <strong>এন্টিসিপাটরি একশন এন্ড ইমপ্যাক্ট বেইজড ফোরকাস্টিং</strong>
                  <br />
                  দুর্যোগের পূর্বাভাস জেনে আগাম প্রস্তুতি গ্রহণের নানা কৌশল শিখুন।
                </>
              }
              blobColor="#D1CCBD"
              illustration={
                <img
                  src={forecastImg}
                  alt="Story Zone"
                  className="w-40 h-40 object-contain"
                />
              }
            />
          </div>

          {/* Card 2: Story Based Learning */}
          <div className="card2 h-full">
            <ZoneCard
              title="গল্পের ছলে শেখা"
              titleColor="#9a3412"
              borderColor="#fb923c"
              btnBg="linear-gradient(135deg, #fb923c, #FC4C02)"
              btnShadow="rgba(249,115,22,0.42)"
              btnLabel="পড়া শুরু করুন"
              link="/learning-zone"
              description={
                <>
                  <strong>স্টোরি বেইজড অ্যাসিসমেন্ট</strong>
                  <br />
                  আকর্ষণীয় আবহাওয়ার গল্প এবং সহজ পরীক্ষার মাধ্যমে মজার সাথে শিখুন।
                </>
              }
              blobColor="#fdba74"
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
      </div>
    </div>
  );
}
