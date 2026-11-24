import { useEffect, useRef, useState } from "react";
import type { CurrentUser } from "../../../types/auth";
import CourseLoadingState from "./CourseLoadingState";

export interface CourseStatus {
  xp: string;
  soundEnabled: boolean;
}

export default function CoursePlayerFrame({
  user,
  isEnglish,
  soundToggleRequest,
  onCourseStatus,
}: {
  user: CurrentUser;
  isEnglish: boolean;
  soundToggleRequest: number;
  onCourseStatus: (status: CourseStatus) => void;
}) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [frameLoaded, setFrameLoaded] = useState(false);
  // true once the course app has rendered its first screen (it posts "met-club-course-ready")
  const [courseReady, setCourseReady] = useState(false);
  const [frameHeight, setFrameHeight] = useState(1);

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
      if (message?.type === "met-club-course-ready") {
        setCourseReady(true);
        return;
      }
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

  useEffect(() => {
    if (!frameLoaded) return;

    const frame = frameRef.current;
    const document = frame?.contentDocument;
    const window = frame?.contentWindow;
    if (!document || !window) return;

    let animationFrame = 0;
    const updateHeight = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        const contentHeight = Math.max(
          document.documentElement.scrollHeight,
          document.body?.scrollHeight ?? 0,
        );
        setFrameHeight(contentHeight);
      });
    };

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(document.documentElement);
    if (document.body) resizeObserver.observe(document.body);

    const mutationObserver = new MutationObserver(updateHeight);
    mutationObserver.observe(document.body ?? document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });
    window.addEventListener("resize", updateHeight);
    updateHeight();

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [frameLoaded]);

  return (
    <div className="relative bg-gray-50">
      {/* The skeleton holds the space until the course is on screen, so the page does not jump. */}
      {!courseReady && <CourseLoadingState isEnglish={isEnglish} />}
      <iframe
        ref={frameRef}
        id="anticipatory-action-course-frame"
        title={
          isEnglish
            ? "Child-centred anticipatory action and impact-based forecasting course"
            : "শিশু-কেন্দ্রিক আগাম পদক্ষেপ ও প্রভাব-ভিত্তিক পূর্বাভাস কোর্স"
        }
        src={`/courses/anticipatory-action/index.html${isEnglish ? "?lang=en" : ""}`}
        onLoad={() => setFrameLoaded(true)}
        style={{ height: `${frameHeight}px` }}
        aria-hidden={!courseReady}
        className={`block w-full border-0 bg-gray-50 ${
          courseReady
            ? ""
            : "pointer-events-none invisible absolute inset-x-0 top-0"
        }`}
        allow="clipboard-write"
      />
    </div>
  );
}
