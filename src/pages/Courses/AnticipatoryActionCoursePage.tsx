import type { JSX } from "react";
import { useCallback, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import TopNav from "../../components/Shared/TopBar";
import useAuth from "../../hooks/useAuth";
import SiteFooter from "../../components/Shared/SiteFooter";
import { getStoredLocale } from "../../utils/language";
import CourseLoadingState from "./components/CourseLoadingState";
import CoursePlayerFrame, {
  type CourseStatus,
} from "./components/CoursePlayerFrame";

export default function AnticipatoryActionCoursePage(): JSX.Element {
  const { user, isLoading, reloadUser } = useAuth();
  const isEnglish = getStoredLocale() === "en";
  const [courseStatus, setCourseStatus] = useState<CourseStatus>({
    xp: "0",
    soundEnabled: true,
  });
  const [soundToggleRequest, setSoundToggleRequest] = useState(0);
  const handleCourseStatus = useCallback(
    (status: CourseStatus) => setCourseStatus(status),
    [],
  );
  const courseTitle = isEnglish
    ? "Anticipatory Action Course"
    : "আগাম পদক্ষেপ কোর্স";
  const courseControls = (
    <div className="flex shrink-0 items-center gap-2">
      <span
        aria-label={`${isEnglish ? "Points" : "পয়েন্ট"}: ${courseStatus.xp}`}
        className="rounded-full bg-red-50 px-3 py-2 text-sm font-bold tabular-nums text-red-700"
      >
        ★ {courseStatus.xp}
      </span>
      <button
        type="button"
        onClick={() => setSoundToggleRequest((request) => request + 1)}
        aria-label={
          courseStatus.soundEnabled
            ? isEnglish
              ? "Turn course sound off"
              : "কোর্সের শব্দ বন্ধ করো"
            : isEnglish
              ? "Turn course sound on"
              : "কোর্সের শব্দ চালু করো"
        }
        className="grid h-10 w-10 cursor-pointer place-items-center rounded-xl bg-red-50 text-red-700 transition-colors hover:bg-red-100"
      >
        {courseStatus.soundEnabled ? (
          <Volume2 size={19} aria-hidden="true" />
        ) : (
          <VolumeX size={19} aria-hidden="true" />
        )}
      </button>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <TopNav title={courseTitle} />
      {/* Course toolbar: stays under the fixed navbar (73px) while the course scrolls. */}
      <div className="sticky top-[73px] z-30 border-b border-red-100 bg-gray-50/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-3 px-5 py-2.5 sm:px-6 lg:px-8">
          <h1 className="truncate text-base font-black text-red-900 sm:text-lg">
            {courseTitle}
          </h1>
          {courseControls}
        </div>
      </div>
      {user ? (
        <CoursePlayerFrame
          // a new language loads a new course document, so start the frame over
          key={isEnglish ? "en" : "bn"}
          user={user}
          isEnglish={isEnglish}
          soundToggleRequest={soundToggleRequest}
          onCourseStatus={handleCourseStatus}
        />
      ) : isLoading ? (
        <CourseLoadingState isEnglish={isEnglish} />
      ) : (
        <main className="grid min-h-[70vh] place-content-center px-5 text-center">
          <p role="alert" className="font-semibold text-slate-700">
            {isEnglish
              ? "We couldn’t load your details. Please try again."
              : "আপনার তথ্য আনা যায়নি। আবার চেষ্টা করুন।"}
          </p>
          <button
            type="button"
            onClick={() => void reloadUser()}
            className="mx-auto mt-4 cursor-pointer rounded-xl bg-red-700 px-5 py-3 font-bold text-white hover:bg-red-800"
          >
            {isEnglish ? "Try again" : "আবার চেষ্টা করুন"}
          </button>
        </main>
      )}
      <SiteFooter isEnglish={isEnglish} />
    </div>
  );
}
