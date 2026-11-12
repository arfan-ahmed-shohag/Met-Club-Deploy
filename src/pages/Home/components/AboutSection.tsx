import { Link } from "react-router";
import childrenLearningImage from "../../../assets/images/home-about.jpeg";
import weatherCloudSunSticker from "../../../assets/images/weather-cloud-sun-sticker.png";

export default function AboutSection({ isEnglish }: { isEnglish: boolean }) {
  return (
    <section
      className="relative overflow-hidden bg-linear-to-b from-white to-red-50/70 py-[60px] lg:py-[80px]"
      aria-labelledby="about-met-club-title"
    >
      <div className="site-container relative grid items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="relative mx-auto flex min-h-[300px] w-full max-w-[760px] items-center justify-center sm:min-h-[390px] lg:max-w-[660px]">
          <img
            src={childrenLearningImage}
            alt={
              isEnglish
                ? "Children learning through weather observation"
                : "আবহাওয়া পর্যবেক্ষণের মাধ্যমে শিশুদের শেখা"
            }
            className="relative z-10 w-full object-contain drop-shadow-[0_20px_24px_rgba(127,29,29,0.12)] rounded-xl"
          />
          <img
            src={weatherCloudSunSticker}
            alt=""
            aria-hidden="true"
            className="absolute right-[2%] top-[3%] z-20 w-28 animate-float-delayed object-contain sm:right-[5%] sm:top-[5%] sm:w-40"
          />
          <img
            src={weatherCloudSunSticker}
            alt=""
            aria-hidden="true"
            className="absolute bottom-[5%] left-[1%] z-20 w-20 animate-float object-contain sm:bottom-[8%] sm:left-[4%] sm:w-28"
          />
        </div>
        <div className="max-w-xl text-center lg:text-left mx-auto lg:mx-0">
          <p className="mb-3 text-sm font-bold uppercase tracking-[.16em] text-red-600">
            {isEnglish ? "ABOUT MET CLUB" : "মেট ক্লাব কী"}
          </p>
          <h2
            id="about-met-club-title"
            className="title-anim text-[36px] font-black leading-tight text-red-950"
          >
            {isEnglish
              ? "Curiosity today. Safer communities tomorrow."
              : "কৌতূহলী শিশুরাই গড়বে নিরাপদ আগামী"}
          </h2>
          <p className="sub-anim mt-5 text-base font-normal leading-relaxed text-slate-700 sm:text-lg text-justify">
            {isEnglish
              ? "At MET Club, children explore changing weather, understand early warnings, and practice what to do during disasters. Through hands-on activities, stories, and quizzes, they turn curiosity into confidence. They take what they learn back to their families and friends, helping their whole community become more aware and prepared."
              : "মেট ক্লাবে শিশুরা খেলার ছলে আবহাওয়ার পরিবর্তন পর্যবেক্ষণ করে, আগাম সতর্কতার অর্থ বোঝে এবং দুর্যোগের সময় কীভাবে নিরাপদ থাকতে হয় তা অনুশীলন করে। হাতে-কলমে কাজ, গল্প ও কুইজের মাধ্যমে তারা শেখাকে আত্মবিশ্বাসে বদলে নেয়। শেখা বিষয়গুলো পরিবার ও বন্ধুদের সঙ্গে ভাগ করে নিয়ে তারা নিজেদের কমিউনিটিকে আরও সচেতন ও প্রস্তুত করতে ভূমিকা রাখে।"}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-bold text-red-800 lg:justify-start">
            {[
              isEnglish ? "Weather learning" : "আবহাওয়া শিক্ষা",
              isEnglish ? "Early warnings" : "আগাম সতর্কতা",
              isEnglish ? "Community safety" : "কমিউনিটির নিরাপত্তা",
            ].map((item, index) => (
              <span key={item} className="inline-flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="hero-feature-dot h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,.45)]"
                  style={{ animationDelay: `${index * 220}ms` }}
                />
                {item}
              </span>
            ))}
          </div>
          <Link
            to={isEnglish ? "/en/about" : "/about"}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-bold text-white shadow-lg shadow-red-900/15 transition hover:-translate-y-0.5 hover:bg-red-800"
          >
            {isEnglish ? "Learn more" : "আরও জানুন"}
            <span aria-hidden="true">{String.fromCodePoint(0x2192)}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
