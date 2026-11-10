import { useEffect, useState, useRef } from "react";
import bgImage from "../../../assets/images/start-journey-page-bg.jpeg";
import { useNavigate, useParams } from "react-router";
import TopNav from "../../../components/Shared/TopBar";
import BottomNav from "../../../components/Shared/BottomNav";
import CompletionModal from "../../../components/banglaVersion/Modal/CompletionModal";
import { resolveMediaUrl } from "../../../utils/media";
import useAxiosProtected from "../../../hooks/axiosProtected";
import { getStoredLocale } from "../../../utils/language";

type LessonSection = {
  id: number;
  title: string;
  image: string;
  htmlContent: string;
  chapterId: number;
};

export default function Section() {
  const [current, setCurrent] = useState(0);
  const [animDir, setAnimDir] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [lessonTitle, setLessonTitle] = useState("");
  const [sections, setSections] = useState<LessonSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const axios = useAxiosProtected();
  const navigateToQuiz = useNavigate();
  const { chapterId } = useParams();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [current]);

  useEffect(() => {
    let cancelled = false;

    const loadLesson = async () => {
      if (!chapterId) return;

      setIsLoading(true);
      try {
        const locale = getStoredLocale();
        const chapterFile = locale === "en" ? "/chapter.en.json" : "/chapter.json";

        const [chapterResponse, contentResponse] = await Promise.all([
          fetch(chapterFile),
          axios.get(`/content/chapter/${chapterId}`),
        ]);

        const chapters = (await chapterResponse.json()) as Array<{
          id: number;
          title: string;
          image?: string;
        }>;

        const chapter = chapters.find((item) => item.id === Number(chapterId));
        if (!chapter || cancelled) return;

        const backendSections = (contentResponse.data?.data?.sections || []) as Array<{
          image?: string | null;
          content?: string;
        }>;

        const mappedSections = backendSections.map((item, index) => ({
          id: index + 1,
          title: chapter.title,
          image: resolveMediaUrl(item.image),
          htmlContent: item.content || "",
          chapterId: Number(chapterId),
        }));

        setLessonTitle(chapter.title);
        setSections(mappedSections);
        setCurrent(0);
      } catch (error) {
        console.error("Failed to load lesson content:", error);
        if (!cancelled) {
          setLessonTitle("");
          setSections([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadLesson();

    return () => {
      cancelled = true;
    };
  }, [axios, chapterId]);

  useEffect(() => {
    const isChapterFinished = async () => {
      if (!chapterId) return;
      const res = await axios.get(`/user/chapter-completion-status/${chapterId}`);
      if (res.data.data) {
        setIsCompleted(true);
        setShowModal(true);
      }
    };

    isChapterFinished();
  }, [axios, chapterId]);

  const TOTAL = sections.length;
  const section = sections[current];
  const navigate = (dir: number) => {
    if (animating) return;
    const next = current + dir;
    if (next < 0 || next >= TOTAL) return;
    setAnimDir(dir === 1 ? "left" : "right");
    setAnimating(true);
    setTimeout(() => {
      setCurrent(next);
      setAnimDir(null);
      setAnimating(false);
    }, 280);
  };

  const handleNext = async () => {
    if (isPending) return;

    if (current < TOTAL - 1) {
      navigate(1);
    } else {
      if (isCompleted) {
        navigateToQuiz(`/start-quiz/${chapterId}`);
        return;
      }
      setIsPending(true);
      try {
        const res = await axios.patch(`/user/update-chapter-completion/${chapterId}`);

        if (res.data.success) {
          navigateToQuiz(`/start-quiz/${chapterId}`);
        }
      } finally {
        setIsPending(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white px-4 text-center">
        <div className="max-w-lg rounded-3xl border border-red-100 bg-white p-8 shadow-xl">
          <h1 className="text-3xl font-black text-red-700">লোড হচ্ছে...</h1>
          <p className="mt-3 text-slate-600">কন্টেন্ট আনা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন।</p>
        </div>
      </div>
    );
  }

  if (!section) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white px-4 text-center">
        <div className="max-w-lg rounded-3xl border border-red-100 bg-white p-8 shadow-xl">
          <h1 className="text-3xl font-black text-red-700">এই অংশে কন্টেন্ট নেই</h1>
          <p className="mt-3 text-slate-600">
            এই চ্যাপ্টারের জন্য এখনও কোনো কন্টেন্ট যোগ করা হয়নি।
          </p>
          <button
            className="mt-6 rounded-2xl bg-red-600 px-5 py-3 font-bold text-white"
            onClick={() => navigateToQuiz(-1)}
          >
            ফিরে যান
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex flex-col"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom,rgba(255,244,242,0.56) 0%,rgba(255,230,226,0.22) 55%,rgba(255,214,210,0.08) 100%)",
          }}
        />

        <TopNav title={lessonTitle || section.title || "Lesson"} tone="red" brandName="মেট ক্লাব" />

        <div className="px-4 py-4 flex flex-col items-center justify-start lg:justify-center min-h-[calc(100%-150px)] custom-scrollbar overflow-auto custom-scrollbar">
          <div
            className={`relative z-10 w-full max-w-5xl mt-6 lg:max-h-100 rounded-2xl bg-white/82 backdrop-blur-md flex flex-col lg:flex-row items-stretch lg:overflow-hidden ${animating
              ? animDir === "left"
                ? "content-exit-left"
                : "content-exit-right"
              : "content-enter"
              }`}
            style={{
              border: "1px solid #D1CCBD",
              boxShadow: "0 8px 48px rgba(239,68,68,0.22), 0 2px 16px rgba(0,0,0,0.08)",
            }}
          >
            <div className="w-full lg:w-[50%] relative overflow-hidden bg-red-50/55 shrink-0 rounded-t-2xl lg:rounded-t-none">
              {section.image ? (
                <>
                  <img
                    src={section.image}
                    alt="story-illustration"
                    className="w-full object-cover hidden lg:block"
                    style={{
                      height: "100%",
                      minHeight: "280px",
                      aspectRatio: "16/10",
                    }}
                  />

                  <img
                    src={section.image}
                    alt="story-illustration"
                    className="w-full block lg:hidden"
                    style={{
                      aspectRatio: "16/9",
                      objectFit: "contain",
                    }}
                  />
                </>
              ) : (
                <div className="flex min-h-70 items-center justify-center bg-red-50/55 p-6 text-center text-slate-500">
                  ছবি পাওয়া যায়নি
                </div>
              )}
            </div>

            <div ref={scrollRef} className="w-full text-sm lg:w-[50%] p-4 flex flex-col justify-start text-left overflow-y-auto custom-scrollbar min-w-0">
              <div
                className="lesson-content max-w-none text-slate-700"
                dangerouslySetInnerHTML={{ __html: section.htmlContent }}
              />

              <style>{`
                .lesson-content {
                  width: 100%;
                  max-width: 100%;
                }
                .lesson-content * {
                  max-width: 100%;
                  overflow-wrap: break-word;
                  word-break: break-word;
                }
                .lesson-content p {
                  margin: 0.75rem 0;
                  line-height: 1.8;
                  white-space: normal;
                  color: #374151;
                }
                .lesson-content li {
                  margin: 0.5rem 0;
                  line-height: 1.8;
                  color: #374151;
                }
                .lesson-content h1,
                .lesson-content h2,
                .lesson-content h3,
                .lesson-content h4,
                .lesson-content h5,
                .lesson-content h6 {
                  margin: 1rem 0 0.75rem 0;
                  line-height: 1.6;
                  font-weight: 600;
                  color: #1f2937;
                }
                .lesson-content ul,
                .lesson-content ol {
                  padding-left: 2rem;
                  margin: 0.75rem 0;
                }
                .lesson-content ul li {
                  list-style-type: disc;
                  margin-left: 0;
                }
                .lesson-content ol li {
                  list-style-type: decimal;
                  margin-left: 0;
                }
                .lesson-content img {
                  height: auto;
                  max-width: 100%;
                  display: block;
                  margin: 0.75rem 0;
                  border-radius: 0.5rem;
                }
                .lesson-content a {
                  color: #DA291C;
                  text-decoration: underline;
                  cursor: pointer;
                  font-weight: 500;
                }
                .lesson-content a:hover {
                  text-decoration-thickness: 2px;
                }
                .lesson-content strong,
                .lesson-content b {
                  font-weight: 700;
                  color: #1f2937;
                }
                .lesson-content em,
                .lesson-content i {
                  font-style: italic;
                }
                .lesson-content u {
                  text-decoration: underline;
                }
                .lesson-content blockquote {
                  margin: 1rem 0;
                  padding: 0.75rem 1rem;
                  border-left: 4px solid #D1CCBD;
                  color: #475569;
                  background-color: #fef5f5;
                  border-radius: 0.25rem;
                }
                .lesson-content code {
                  background-color: #f3f4f6;
                  padding: 0.2rem 0.4rem;
                  border-radius: 0.25rem;
                  font-family: 'Courier New', monospace;
                  font-size: 0.9em;
                }
                .lesson-content pre {
                  background-color: #f3f4f6;
                  padding: 1rem;
                  border-radius: 0.5rem;
                  overflow-x: auto;
                  white-space: pre-wrap;
                  word-wrap: break-word;
                  margin: 0.75rem 0;
                  font-family: 'Courier New', monospace;
                  font-size: 0.9em;
                  color: #1f2937;
                }
              `}</style>

              <style>{`
                .lesson-content {
                  width: 100%;
                  max-width: 100%;
                  font-family: inherit;
                  font-size: inherit;
                  color: inherit;
                }
                .lesson-content * {
                  max-width: 100%;
                  overflow-wrap: break-word;
                  word-break: break-word;
                }
                .lesson-content p {
                  margin: 0.75rem 0;
                  line-height: 1.8;
                  white-space: normal;
                  color: #374151;
                }
                .lesson-content li {
                  margin: 0.5rem 0;
                  line-height: 1.8;
                  color: #374151;
                }
                .lesson-content h1,
                .lesson-content h2,
                .lesson-content h3,
                .lesson-content h4,
                .lesson-content h5,
                .lesson-content h6 {
                  margin: 1rem 0 0.75rem 0;
                  line-height: 1.6;
                  font-weight: 600;
                  color: #1f2937;
                }
                .lesson-content ul,
                .lesson-content ol {
                  padding-left: 2rem;
                  margin: 0.75rem 0;
                }
                .lesson-content ul li {
                  list-style-type: disc;
                  margin-left: 0;
                }
                .lesson-content ol li {
                  list-style-type: decimal;
                  margin-left: 0;
                }
                .lesson-content img {
                  height: auto;
                  max-width: 100%;
                  display: block;
                  margin: 0.75rem 0;
                  border-radius: 0.5rem;
                }
                .lesson-content a {
                  color: #DA291C;
                  text-decoration: underline;
                  cursor: pointer;
                  font-weight: 500;
                }
                .lesson-content a:hover {
                  text-decoration-thickness: 2px;
                }
                .lesson-content strong,
                .lesson-content b {
                  font-weight: 700;
                  color: #1f2937;
                }
                .lesson-content em,
                .lesson-content i {
                  font-style: italic;
                }
                .lesson-content u {
                  text-decoration: underline;
                }
                .lesson-content blockquote {
                  margin: 1rem 0;
                  padding: 0.75rem 1rem;
                  border-left: 4px solid #D1CCBD;
                  color: #475569;
                  background-color: #fef5f5;
                  border-radius: 0.25rem;
                }
                .lesson-content code {
                  background-color: #f3f4f6;
                  padding: 0.2rem 0.4rem;
                  border-radius: 0.25rem;
                  font-family: 'Courier New', monospace;
                  font-size: 0.9em;
                }
                .lesson-content pre {
                  background-color: #f3f4f6;
                  padding: 1rem;
                  border-radius: 0.5rem;
                  overflow-x: auto;
                  white-space: pre-wrap;
                  word-wrap: break-word;
                  margin: 0.75rem 0;
                  font-family: 'Courier New', monospace;
                  font-size: 0.9em;
                  color: #1f2937;
                }
              `}</style>
            </div>
          </div>
        </div>

        <BottomNav
          current={current}
          total={TOTAL}
          onPrev={() => navigate(-1)}
          onNext={handleNext}
          variant="section"
          isPending={isPending}
        />

        {showModal && (
          <CompletionModal chapterId={String(chapterId || "")} setShowModal={setShowModal} />
        )}
      </div>
    </>
  );
}
