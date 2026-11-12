import type { JSX } from "react";
import { useCallback, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import TopNav from "../../components/Shared/TopBar";
import useAuth from "../../hooks/useAuth";
import AboutFooter from "../Home/components/AboutFooter";
import CreditsFooter from "../Home/components/CreditsFooter";
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
  const courseControls = (
    <div className="flex shrink-0 items-center gap-2">
      <span
        aria-label={`Points: ${courseStatus.xp}`}
        className="rounded-full bg-red-50 px-3 py-2 text-sm font-bold tabular-nums text-red-700"
      >
        ★ {courseStatus.xp}
      </span>
      <button
        type="button"
        onClick={() => setSoundToggleRequest((request) => request + 1)}
        aria-label={
          courseStatus.soundEnabled
            ? "Turn course sound off"
            : "Turn course sound on"
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
      <TopNav
        title="আগাম পদক্ষেপ কোর্স"
        brandName="MET Club"
        rightContent={courseControls}
      />
      {user ? (
        <CoursePlayerFrame
          user={user}
          soundToggleRequest={soundToggleRequest}
          onCourseStatus={handleCourseStatus}
        />
      ) : isLoading ? (
        <CourseLoadingState />
      ) : (
        <main className="grid min-h-[70vh] place-content-center px-5 text-center">
          <p role="alert" className="font-semibold text-slate-700">
            আপনার তথ্য আনা যায়নি। আবার চেষ্টা করুন।
          </p>
          <button
            type="button"
            onClick={() => void reloadUser()}
            className="mx-auto mt-4 cursor-pointer rounded-xl bg-red-700 px-5 py-3 font-bold text-white hover:bg-red-800"
          >
            আবার চেষ্টা করুন
          </button>
        </main>
      )}
      <AboutFooter isEnglish={isEnglish} />
      <CreditsFooter isEnglish={isEnglish} />
    </div>
  );
}
