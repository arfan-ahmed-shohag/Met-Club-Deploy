import { useState, useEffect } from "react";
import ZoneCard from "../components/StartJourney/ZoneCard";
import storyImg from "../assets/images/learning-zone-cutout-cutout.webp";
import simulationImg from "../assets/images/practice-zone-new-cutout.webp";
import nasaResourceImg from "../assets/images/nasa_resource_img-cutout.webp";
import citizenScienceImg from "../assets/images/citizen_science_img-cutout.webp";
import bgImage from "../assets/images/start-journey-page-bg.jpeg";
import TopNav from "../components/Shared/TopBar";
import useAxiosProtected from "../hooks/axiosProtected";
import { getStoredLocale } from "../utils/language";



export default function StartJourney() {

  const isEnglish = getStoredLocale() === "en";


  const axios = useAxiosProtected();

  const [isChapterOneCompleted, setIsChapterOneCompleted] = useState(false);

  useEffect(() => {
    const checkChapterOneCompletion = async () => {
      const res = await axios.get("/user/chapter-one-completion-status");
      setIsChapterOneCompleted(res.data.data);
    }
    checkChapterOneCompletion();
  }, [axios]);



  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden" style={{
      backgroundImage: `url(${bgImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    }}>

      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "linear-gradient(180deg, rgba(20,6,6,0.22) 0%, rgba(20,6,6,0.14) 55%, rgba(20,6,6,0.18) 100%)",
        }}
      />

      <TopNav brandName={isEnglish ? "Met Club" : "মেট ক্লাব"} />

      {/* ── Main Content ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-12 pb-12">
        {/* Header */}
        <div className="header-anim text-center mb-10">
          <h1
            className="text-3xl md:text-5xl font-black mb-2"
            style={{
              color: "#b91c1c",
              textShadow:
                "-1px -1px 0 rgba(255,255,255,0.96), 1px -1px 0 rgba(255,255,255,0.96), -1px 1px 0 rgba(255,255,255,0.96), 1px 1px 0 rgba(255,255,255,0.96), 0 2px 0 rgba(185,28,28,0.20), 0 8px 20px rgba(127,29,29,0.24)",
            }}
          >
            {isEnglish ? "Welcome to the Met Club!" : "মেট ক্লাবে স্বাগতম!"}
          </h1>
          <p
            className="text-lg md:text-xl mt-4"
            style={{
              color: "#1f2937",
              fontWeight: 600,
              textShadow: "0 1px 6px rgba(255,255,255,0.28)",
            }}
          >
            {isEnglish ? "Choose your path to preparation." : "প্রস্তুতির জন্য আপনার পথ নির্বাচন করুন।"}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
          <div className="card1 h-full">
            <ZoneCard
              title={isEnglish ? "Learn with Fun" : "লার্ন উইথ ফান"}
              titleColor="#991b1b"
              borderColor="#f87171"
              btnBg="linear-gradient(135deg, #ef4444, #dc2626)"
              btnShadow="rgba(239,68,68,0.42)"
              btnLabel={isEnglish ? "Start Learning" : "পড়া শুরু করুন"}
              link={isEnglish ? "/en/learning-selection" : "/learning-selection"}
              description={
                <>
                  <strong>{isEnglish ? "Enhance your knowledge!" : "আপনার জ্ঞান বৃদ্ধি করুন!"}</strong>
                  <br />
                  {isEnglish ? "Learn about weather, climate, and disasters." : "আবহাওয়া, জলবায়ু এবং দুর্যোগ সম্পর্কে জানুন।"}
                </>
              }
              blobColor="#fca5a5"
              illustration={
                <img
                  src={storyImg}
                  alt={isEnglish ? "Learn with Fun" : "লার্নিং জোন"}
                  className="w-36 h-36 md:w-40 md:h-40 object-contain mx-auto drop-shadow-[0_10px_15px_rgba(0,0,0,0.15)]"
                />
              }
            />
          </div>

          <div className="card2 h-full">
            <ZoneCard
              title={isEnglish ? "Community Rescue Mission" : "কমিউনিটি রেসকিউ মিশন"}
              titleColor="#9a3412"
              borderColor="#fb923c"
              btnBg="linear-gradient(135deg, #fb923c, #f97316)"
              btnShadow="rgba(249,115,22,0.42)"
              btnLabel={isEnglish ? (isChapterOneCompleted ? "Enter Simulation" : "Complete First Chapter") : (isChapterOneCompleted ? "সিমুলেশনে প্রবেশ করুন" : "প্রথম অধ্যায় সম্পন্ন করুন")}
              // disabled={!isChapterOneCompleted}
              link="https://game.meteorologyclub.com/"
              description={
                <>
                  <strong>{isEnglish ? "Test your skills!" : "আপনার দক্ষতা পরীক্ষা করুন!"}</strong>
                  <br />
                  {isEnglish ? "Make decisions in real-life simulations." : "বাস্তব জীবনের সিমুলেশনে সিদ্ধান্ত নিন।"}
                </>
              }
              blobColor="#fdba74"
              illustration={
                <img
                  src={simulationImg}
                  alt={isEnglish ? "Simulation Zone" : "সিমুলেশন জোন"}
                  className="w-36 h-36 md:w-40 md:h-40 object-contain mx-auto drop-shadow-[0_10px_15px_rgba(0,0,0,0.15)]"
                />
              }
            />
          </div>
        </div>

        {/* Resource Cards */}
        <div className="mt-8 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 px-2 animate-[dropIn_0.5s_ease-out]">
          <div className="card3 h-full">
            <ZoneCard
              title={isEnglish ? "NASA Learning Resources" : "নাসা লার্নিং রিসোর্স"}
              titleColor="#7f1d1d"
              borderColor="#f87171"
              btnBg="linear-gradient(135deg, #ef4444, #dc2626)"
              btnShadow="rgba(220, 38, 38, 0.42)"
              btnLabel={isEnglish ? "Access Resources" : "রিসোর্সে প্রবেশ করুন"}
              link="https://www.nasa.gov/learning-resources/"
              description={
                <>
                  <strong>{isEnglish ? "Explore interesting facts!" : "আকর্ষণীয় তথ্য এক্সপ্লোর করুন!"}</strong>
                  <br />
                  {isEnglish ? "Learn about space, climate, and disasters." : "মহাকাশ, জলবায়ু ও দুর্যোগ সম্পর্কে জানুন।"}
                </>
              }
              blobColor="#fca5a5"
              illustration={
                <img
                  src={nasaResourceImg}
                  alt={isEnglish ? "NASA Learning Resources" : "নাসা লার্নিং রিসোর্স"}
                  className="w-36 h-36 md:w-40 md:h-40 object-contain mx-auto drop-shadow-[0_10px_15px_rgba(0,0,0,0.15)]"
                />
              }
            />
          </div>

          <div className="card4 h-full">
            <ZoneCard
              title={isEnglish ? "Citizen Science Portal" : "সিটিজেন সায়েন্স পোর্টাল"}
              titleColor="#14532d"
              borderColor="#4ade80"
              btnBg="linear-gradient(135deg, #16a34a, #15803d)"
              btnShadow="rgba(21, 128, 61, 0.42)"
              btnLabel={isEnglish ? "Enter Portal" : "পোর্টালে প্রবেশ করুন"}
              link="https://ee.kobotoolbox.org/x/HtTB5kOn"
              description={
                <>
                  <strong>{isEnglish ? "Take part in research!" : "গবেষণায় অংশ নিন!"}</strong>
                  <br />
                  {isEnglish ? "Submit your data to our portal." : "আমাদের পোর্টালে আপনার ডেটা প্রদান করুন।"}
                </>
              }
              blobColor="#86efac"
              illustration={
                <img
                  src={citizenScienceImg}
                  alt={isEnglish ? "Citizen Science Portal" : "সিটিজেন সায়েন্স পোর্টাল"}
                  className="w-36 h-36 md:w-40 md:h-40 object-contain mx-auto drop-shadow-[0_10px_15px_rgba(0,0,0,0.15)]"
                />
              }
            />
          </div>
        </div>
      </div>

      {/* Dropdown animation keyframe */}
      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
      `}</style>
    </div>
  );
}
