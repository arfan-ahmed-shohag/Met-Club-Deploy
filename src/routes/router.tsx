import { createBrowserRouter, redirect, ScrollRestoration, Outlet } from "react-router";
import type { RouteObject } from "react-router";
import { lazy } from "react";
import LoginPage from "../App";
import { SuspenseWrapper } from "./SuspenseWrapper";
import { getStoredLocale, setStoredLocale } from "../utils/language";
import ProtectedRoute from "../components/Layouts/ProtectedRoute";

// Lazy load page components
const StartJourney = lazy(() => import("../pages/StartJourney"));
const Chapter = lazy(() => import("../pages/LearnignZone/Index/Chapter"));
const Deficulty = lazy(() => import("../pages/LearnignZone/Deficulty/Deficulty"));
const StartInterface = lazy(() => import("../pages/LearnignZone/quiz/StartInterface"));
const Quiz = lazy(() => import("../pages/LearnignZone/quiz/quiz"));
const Registration = lazy(() => import("../pages/Registration/Registration"));
const HomePage = lazy(() => import("../pages/Home/Home"));
const About = lazy(() => import("../pages/About/About"));
const Profile = lazy(() => import("../pages/Profile/Profile"));
const AdminLayout = lazy(() => import("../components/banglaVersion/Admin/AdminLayout"));
const Overview = lazy(() => import("../pages/Admin/Overview"));
const ManageChapters = lazy(() => import("../pages/Admin/ManageChapters"));
const CreateContent = lazy(() => import("../pages/Admin/CreateContent"));
const ManageContent = lazy(() => import("../pages/Admin/ManageContent"));
const ManageTutorials = lazy(() => import("../pages/Admin/ManageTutorials"));
const CreateTutorial = lazy(() => import("../pages/Admin/CreateTutorial"));
const ManageSchools = lazy(() => import("../pages/Admin/ManageSchools"));
const CreateSchool = lazy(() => import("../pages/Admin/CreateSchool"));
const Section = lazy(() => import("../pages/LearnignZone/LessionSection/Section"));
const Tutorials = lazy(() => import("../pages/Tutorials/Tutorials"));
const Blogs = lazy(() => import("../pages/Blogs/Blogs"));
const BlogDetails = lazy(() => import("../pages/Blogs/BlogDetails"));
const WriteBlog = lazy(() => import("../pages/Blogs/WriteBlog"));
const ManageBlogs = lazy(() => import("../pages/Admin/ManageBlogs"));
const EnglishLoginPage = lazy(() => import("../pages/EnglishVersion/Home"));
const EnglishAbout = lazy(() => import("../pages/EnglishVersion/About/About"));
const EnglishStartJourney = lazy(() => import("../pages/EnglishVersion/StartJourney/StartJourney"));
const EnglishChapter = lazy(() => import("../pages/EnglishVersion/Chapter/Chapter"));
const EnglishStartInterface = lazy(() => import("../pages/EnglishVersion/QuizStartInterface/StartInterface"));
const EnglishQuizDeficultyLevel = lazy(()=>import("../pages/EnglishVersion/Deficulty/Deficulty"))
const EnglishProfile = lazy(() => import("../pages/EnglishVersion/Profile/Profile"));
const MetClubModule = lazy(()=> import("../pages/MET_Club_Module"));
const MetClubModule2 = lazy(()=> import("../pages/Met_Club"));
const LearningSelection = lazy(() => import("../pages/LearningSelection"));
const EnglishLearningSelection = lazy(() => import("../pages/EnglishVersion/LearningSelection/LearningSelection"));
const LocationDetails = lazy(() => import("../pages/Location/LocationDetails"));
const EnglishLocationDetails = lazy(() => import("../pages/EnglishVersion/Location/EnglishLocationDetails"));

type QuizRouteData = {
  chapterId: number;
  difficulty: string;
};

function redirectToStoredLocale(requestUrl: string, bnPath: string, enPath: string) {
  const storedLocale = getStoredLocale();
  const url = new URL(requestUrl);
  const pathname = url.pathname;

  const matchesBnPath = pathname === bnPath || (bnPath !== "/" && pathname.startsWith(`${bnPath}/`));
  const matchesEnPath = pathname === enPath || (enPath !== "/" && pathname.startsWith(`${enPath}/`));

  if (!matchesBnPath && !matchesEnPath) {
    return null;
  }

  const currentBase = matchesEnPath ? enPath : bnPath;
  const targetBase = storedLocale === "en" ? enPath : bnPath;
  const suffix = pathname.slice(currentBase.length);

  if (targetBase === currentBase) {
    return null;
  }

  return redirect(`${targetBase}${suffix}${url.search}`);
}

function syncStartJourneyLocale(requestUrl: string) {
  const pathname = new URL(requestUrl).pathname;
  setStoredLocale(pathname.startsWith("/en/") ? "en" : "bn");
  return null;
}

const routes: RouteObject[] = [

  {
    path: "/",
    element: <SuspenseWrapper><HomePage /></SuspenseWrapper>,
    loader: () => {
      if (getStoredLocale() === "en") {
        return redirect("/en");
      }

      return null;
    },
  },
  {
    path: "/en",
    element: <SuspenseWrapper><HomePage /></SuspenseWrapper>,
    loader: () => {
      if (getStoredLocale() === "bn") {
        return redirect("/");
      }

      return null;
    },
  },
  {
    path: "/login",
    element: <LoginPage />,
    loader: ({ request }) => redirectToStoredLocale(request.url, "/login", "/en/login"),
  },
  {
    path: "/en/login",
    element: <SuspenseWrapper><EnglishLoginPage /></SuspenseWrapper>,
    loader: ({ request }) => redirectToStoredLocale(request.url, "/login", "/en/login"),
  },
  {
    path: "/start-journey",
    element: <SuspenseWrapper><StartJourney /></SuspenseWrapper>,
    loader: ({ request }) => syncStartJourneyLocale(request.url),
  },
  {
    path: "/en/start-journey",
    element: <SuspenseWrapper><EnglishStartJourney /></SuspenseWrapper>,
    loader: ({ request }) => syncStartJourneyLocale(request.url),
  },
  {
    path: "/learning-selection",
    element: <SuspenseWrapper><LearningSelection /></SuspenseWrapper>,
    loader: ({ request }) => redirectToStoredLocale(request.url, "/learning-selection", "/en/learning-selection"),
  },
  {
    path: "/en/learning-selection",
    element: <SuspenseWrapper><EnglishLearningSelection /></SuspenseWrapper>,
    loader: ({ request }) => redirectToStoredLocale(request.url, "/learning-selection", "/en/learning-selection"),
  },
  {
    path: "/registration",
    element: <SuspenseWrapper><Registration /></SuspenseWrapper>,
    loader: ({ request }) => redirectToStoredLocale(request.url, "/registration", "/en/registration"),
  },
  {
    path: "/en/registration",
    element: <SuspenseWrapper><Registration /></SuspenseWrapper>,
    loader: ({ request }) => redirectToStoredLocale(request.url, "/registration", "/en/registration"),
  },
  {
    path: "/learning-zone",
    element: <SuspenseWrapper><Chapter /></SuspenseWrapper>
    ,loader: ({ request }) => redirectToStoredLocale(request.url, "/learning-zone", "/en/learning-zone"),
  },
  {
    path: "/en/learning-zone",
    element: <SuspenseWrapper><EnglishChapter /></SuspenseWrapper>
    ,loader: ({ request }) => redirectToStoredLocale(request.url, "/learning-zone", "/en/learning-zone"),
  },
  {
    path: "/lesson/:chapterId?",
    element: <SuspenseWrapper><Section /></SuspenseWrapper>,
    loader: ({ request }) => redirectToStoredLocale(request.url, "/lesson", "/en/lesson"),
  },
  {
    path: "/en/lesson/:chapterId?",
    element: <SuspenseWrapper><Section /></SuspenseWrapper>,
    loader: ({ request }) => redirectToStoredLocale(request.url, "/lesson", "/en/lesson"),
  },
  {
    path: '/start-quiz/:chapterId',
    element: <SuspenseWrapper><StartInterface /></SuspenseWrapper>
    ,loader: ({ request }) => redirectToStoredLocale(request.url, "/start-quiz", "/en/start-quiz"),
  },
  {
    path: '/en/start-quiz/:chapterId',
    element: <SuspenseWrapper><EnglishStartInterface /></SuspenseWrapper>
    ,loader: ({ request }) => redirectToStoredLocale(request.url, "/start-quiz", "/en/start-quiz"),
  },
  {
    path: "/select-difficulty/:chapterId",
    element: <SuspenseWrapper><Deficulty /></SuspenseWrapper>
    ,loader: ({ request }) => redirectToStoredLocale(request.url, "/select-difficulty", "/en/select-difficulty"),
  },
  {
    path: "/en/select-difficulty/:chapterId",
    element: <SuspenseWrapper><EnglishQuizDeficultyLevel /></SuspenseWrapper>
    ,loader: ({ request }) => redirectToStoredLocale(request.url, "/select-difficulty", "/en/select-difficulty"),
  },
  {
    path: "/quiz/:chapterId/:difficulty",
    element: <SuspenseWrapper><Quiz /></SuspenseWrapper>,
    loader: async ({ request, params }) => {
      const localeRedirect = redirectToStoredLocale(request.url, "/quiz", "/en/quiz");
      if (localeRedirect) return localeRedirect;
      const response = await fetch('/quiz.json');

      const { chapterId, difficulty } = params;
      const targetChapterId = Number(chapterId);
      const quizData = await response.json() as QuizRouteData[];
      const filteredQuizData = quizData.filter((quiz) => {
        return (
          quiz.chapterId === targetChapterId &&
          quiz.difficulty === difficulty
        );
      });

      return filteredQuizData;
    }
  },
  {
    path: "/en/quiz/:chapterId/:difficulty",
    element: <SuspenseWrapper><Quiz /></SuspenseWrapper>,
    loader: async ({ request, params }) => {
      const localeRedirect = redirectToStoredLocale(request.url, "/quiz", "/en/quiz");
      if (localeRedirect) return localeRedirect;

      const { chapterId, difficulty } = params;
      const targetChapterId = Number(chapterId);
      const response = await fetch('/quiz.en.json');
      const quizData = await response.json() as QuizRouteData[];
      const filteredQuizData = quizData.filter((quiz) => {
        return (
          quiz.chapterId === targetChapterId &&
          quiz.difficulty === difficulty
        );
      });

      return filteredQuizData;
    }
  },
  {
    path: "/about",
    element: <SuspenseWrapper><About /></SuspenseWrapper>,
    loader: ({ request }) => redirectToStoredLocale(request.url, "/about", "/en/about"),
  },
  {
    path: "/en/about",
    element: <SuspenseWrapper><EnglishAbout /></SuspenseWrapper>,
    loader: ({ request }) => redirectToStoredLocale(request.url, "/about", "/en/about"),
  },
  {
    path: "/location/:id",
    element: <SuspenseWrapper><LocationDetails /></SuspenseWrapper>,
    loader: ({ request }) => redirectToStoredLocale(request.url, "/location", "/en/location"),
  },
  {
    path: "/en/location/:id",
    element: <SuspenseWrapper><EnglishLocationDetails /></SuspenseWrapper>,
    loader: ({ request }) => redirectToStoredLocale(request.url, "/location", "/en/location"),
  },
  {
    path: "/tutorials",
    element: <SuspenseWrapper><Tutorials /></SuspenseWrapper>,
    loader: ({ request }) => redirectToStoredLocale(request.url, "/tutorials", "/en/tutorials"),
  },
  {
    path: "/en/tutorials",
    element: <SuspenseWrapper><Tutorials /></SuspenseWrapper>,
    loader: ({ request }) => redirectToStoredLocale(request.url, "/tutorials", "/en/tutorials"),
  },
  {
    path: "/blogs",
    element: <SuspenseWrapper><Blogs /></SuspenseWrapper>,
    loader: ({ request }) => redirectToStoredLocale(request.url, "/blogs", "/en/blogs"),
  },
  {
    path: "/en/blogs",
    element: <SuspenseWrapper><Blogs /></SuspenseWrapper>,
    loader: ({ request }) => redirectToStoredLocale(request.url, "/blogs", "/en/blogs"),
  },
  {
    path: "/blogs/write",
    element: <SuspenseWrapper><ProtectedRoute><WriteBlog /></ProtectedRoute></SuspenseWrapper>,
    loader: ({ request }) => redirectToStoredLocale(request.url, "/blogs", "/en/blogs"),
  },
  {
    path: "/en/blogs/write",
    element: <SuspenseWrapper><ProtectedRoute><WriteBlog /></ProtectedRoute></SuspenseWrapper>,
    loader: ({ request }) => redirectToStoredLocale(request.url, "/blogs", "/en/blogs"),
  },
  {
    path: "/blogs/:id",
    element: <SuspenseWrapper><BlogDetails /></SuspenseWrapper>,
    loader: ({ request }) => redirectToStoredLocale(request.url, "/blogs", "/en/blogs"),
  },
  {
    path: "/en/blogs/:id",
    element: <SuspenseWrapper><BlogDetails /></SuspenseWrapper>,
    loader: ({ request }) => redirectToStoredLocale(request.url, "/blogs", "/en/blogs"),
  },
  {
    path: "/profile",
    element: <SuspenseWrapper><Profile /></SuspenseWrapper>,
    loader: ({ request }) => redirectToStoredLocale(request.url, "/profile", "/en/profile"),
  },
  {
    path: "/en/profile",
    element: <SuspenseWrapper><EnglishProfile /></SuspenseWrapper>,
    loader: ({ request }) => redirectToStoredLocale(request.url, "/profile", "/en/profile"),
  },
  {
    path: "/met-club-module",
    element: <SuspenseWrapper><MetClubModule /></SuspenseWrapper>
    ,loader: ({ request }) => redirectToStoredLocale(request.url, "/select-difficulty", "/en/select-difficulty"),
  },
  {
    path: "/met-club-module-2",
    element: <SuspenseWrapper><MetClubModule2 /></SuspenseWrapper>
    ,loader: ({ request }) => redirectToStoredLocale(request.url, "/select-difficulty", "/en/select-difficulty"),
  },
  {
    path: "/admin",
    element: <SuspenseWrapper><AdminLayout /></SuspenseWrapper>,
    children: [
      {
        index: true,
        element: <SuspenseWrapper><Overview /></SuspenseWrapper>,
      },
      {
        path: "overview",
        element: <SuspenseWrapper><Overview /></SuspenseWrapper>,
      },
      {
        path: "chapters",
        element: <SuspenseWrapper><ManageChapters /></SuspenseWrapper>,
      },
      {
        path: "content",
        element: <SuspenseWrapper><ManageContent /></SuspenseWrapper>,
      },
      {
        path: "create-content",
        element: <SuspenseWrapper><CreateContent /></SuspenseWrapper>,
      },
      {
        path: "tutorials",
        element: <SuspenseWrapper><ManageTutorials /></SuspenseWrapper>,
      },
      {
        path: "blogs",
        element: <SuspenseWrapper><ManageBlogs /></SuspenseWrapper>,
      },
      {
        path: "create-tutorial",
        element: <SuspenseWrapper><CreateTutorial /></SuspenseWrapper>,
      },
      {
        path: "schools",
        element: <SuspenseWrapper><ManageSchools /></SuspenseWrapper>,
      },
      {
        path: "create-school",
        element: <SuspenseWrapper><CreateSchool /></SuspenseWrapper>,
      },
    ],
  }
];

const router = createBrowserRouter([
  {
    element: (
      <>
        <ScrollRestoration />
        <Outlet />
      </>
    ),
    children: routes
  }
]);

export default router;
