import { useEffect, useRef, useState } from "react";
import type { CurrentUser } from "../../../types/auth";
import CourseLoadingState from "./CourseLoadingState";

export interface CourseStatus {
  xp: string;
  soundEnabled: boolean;
}

export default function CoursePlayerFrame({
  user,
  soundToggleRequest,
  onCourseStatus,
}: {
  user: CurrentUser;
  soundToggleRequest: number;
  onCourseStatus: (status: CourseStatus) => void;
}) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [frameLoaded, setFrameLoaded] = useState(false);

  useEffect(() => {
    if (!frameLoaded) return;
    frameRef.current?.contentWindow?.postMessage(
      {
        type: "met-club-course-auth",
        user: {
          id: user.id,
          fullName: user.fullName,
          institution: user.institution,
          class: user.class,
          district: user.district,
        },
      },
      window.location.origin,
    );
  }, [frameLoaded, user]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        event.source !== frameRef.current?.contentWindow
      )
        return;
      const message = event.data;
      if (
        message?.type === "met-club-course-status" &&
        typeof message.xp === "string" &&
        typeof message.soundEnabled === "boolean"
      ) {
        onCourseStatus({ xp: message.xp, soundEnabled: message.soundEnabled });
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onCourseStatus]);

  useEffect(() => {
    if (!frameLoaded || soundToggleRequest === 0) return;
    frameRef.current?.contentWindow?.postMessage(
      { type: "met-club-course-toggle-sound" },
      window.location.origin,
    );
  }, [frameLoaded, soundToggleRequest]);

  return (
    <div className="relative min-h-[70vh] bg-gray-50">
      {!frameLoaded && (
        <div className="pointer-events-none absolute inset-0 z-10 bg-gray-50">
          <CourseLoadingState />
        </div>
      )}
      <iframe
        ref={frameRef}
        id="anticipatory-action-course-frame"
        title="শিশু-কেন্দ্রিক আগাম পদক্ষেপ ও প্রভাব-ভিত্তিক পূর্বাভাস কোর্স"
        src="/courses/anticipatory-action/index.html"
        onLoad={() => setFrameLoaded(true)}
        className="block h-[calc(100svh-4.5rem)] min-h-[680px] w-full border-0 bg-gray-50"
        allow="clipboard-write"
      />
    </div>
  );
}
