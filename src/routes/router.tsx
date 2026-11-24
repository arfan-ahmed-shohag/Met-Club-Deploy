import {
  createBrowserRouter,
  redirect,
  ScrollRestoration,
  Outlet,
} from "react-router";
import type { RouteObject } from "react-router";
import { lazy } from "react";
import { SuspenseWrapper } from "./SuspenseWrapper";
import { getStoredLocale } from "../utils/language";
import ProtectedRoute from "../components/Layouts/ProtectedRoute";
const Registration = lazy(() => import("../pages/Registration/Registration"));
const HomePage = lazy(() => import("../pages/Home/Home"));
const AnticipatoryActionCoursePage = lazy(
  () => import("../pages/Courses/AnticipatoryActionCoursePage"),
);
const Section = lazy(
  () => import("../pages/LearnignZone/LessionSection/Section"),
);
const About = lazy(() => import("../pages/About/About"));
const Profile = lazy(() => import("../pages/Profile/Profile"));
const AdminLayout = lazy(
  () => import("../components/banglaVersion/Admin/AdminLayout"),
);
const Overview = lazy(() => import("../pages/Admin/Overview"));
const AdminProfile = lazy(() => import("../pages/Admin/AdminProfile"));
const ManageSchools = lazy(() => import("../pages/Admin/ManageSchools"));
const CreateSchool = lazy(() => import("../pages/Admin/CreateSchool"));
const Blogs = lazy(() => import("../pages/Blogs/Blogs"));
const BlogDetails = lazy(() => import("../pages/Blogs/BlogDetails"));
const WriteBlog = lazy(() => import("../pages/Blogs/WriteBlog"));
const ManageBlogs = lazy(() => import("../pages/Admin/ManageBlogs"));
const ManageGallery = lazy(() => import("../pages/Admin/ManageGallery"));
const ManageHomeVideos = lazy(() => import("../pages/Admin/ManageHomeVideos"));
const ManageStories = lazy(() => import("../pages/Admin/ManageStories"));
const ManageComics = lazy(() =>
  import("../pages/Admin/ManagePublications").then((module) => ({
    default: module.ManageComics,
  })),
);
const ManageFlyers = lazy(() =>
  import("../pages/Admin/ManagePublications").then((module) => ({
    default: module.ManageFlyers,
  })),
);
const ManagePressReleases = lazy(() =>
  import("../pages/Admin/ManagePublications").then((module) => ({
    default: module.ManagePressReleases,
  })),
);
const VideoLibraryPage = lazy(() =>
  import("../pages/Media/MediaLibraryPage").then((module) => ({
    default: module.VideoLibraryPage,
  })),
);
const PhotoGalleryPage = lazy(() =>
  import("../pages/Media/MediaLibraryPage").then((module) => ({
    default: module.PhotoGalleryPage,
  })),
);
const StoriesPage = lazy(() => import("../pages/Media/StoriesPage"));
const ComicsPage = lazy(() =>
  import("../pages/Publications/PublicationsPage").then((module) => ({
    default: module.ComicsPage,
  })),
);
const FlyersPage = lazy(() =>
  import("../pages/Publications/PublicationsPage").then((module) => ({
    default: module.FlyersPage,
  })),
);
const PressReleasePage = lazy(() =>
  import("../pages/Publications/PublicationsPage").then((module) => ({
    default: module.PressReleasePage,
  })),
);
const LoginModalPage = lazy(() => import("../pages/Login/LoginModalPage"));
const EnglishAbout = lazy(() => import("../pages/EnglishVersion/About/About"));
const EnglishProfile = lazy(
  () => import("../pages/EnglishVersion/Profile/Profile"),
);
const LocationDetails = lazy(() => import("../pages/Location/LocationDetails"));
const EnglishLocationDetails = lazy(
  () => import("../pages/EnglishVersion/Location/EnglishLocationDetails"),
);

function redirectToStoredLocale(
  requestUrl: string,
  bnPath: string,
  enPath: string,
) {
  const storedLocale = getStoredLocale();
  const url = new URL(requestUrl);
  const pathname = url.pathname;

  const matchesBnPath =
    pathname === bnPath ||
    (bnPath !== "/" && pathname.startsWith(`${bnPath}/`));
  const matchesEnPath =
    pathname === enPath ||
    (enPath !== "/" && pathname.startsWith(`${enPath}/`));

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

const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <SuspenseWrapper>
        <HomePage />
      </SuspenseWrapper>
    ),
    loader: () => {
      if (getStoredLocale() === "en") {
        return redirect("/en");
      }

      return null;
    },
  },
  {
    path: "/en",
    element: (
      <SuspenseWrapper>
        <HomePage />
      </SuspenseWrapper>
    ),
    loader: () => {
      if (getStoredLocale() === "bn") {
        return redirect("/");
      }

      return null;
    },
  },
  {
    path: "/videos",
    element: (
      <SuspenseWrapper>
        <VideoLibraryPage />
      </SuspenseWrapper>
    ),
    loader: ({ request }) =>
      redirectToStoredLocale(request.url, "/videos", "/en/videos"),
  },
  {
    path: "/en/videos",
    element: (
      <SuspenseWrapper>
        <VideoLibraryPage />
      </SuspenseWrapper>
    ),
    loader: ({ request }) =>
      redirectToStoredLocale(request.url, "/videos", "/en/videos"),
  },
  {
    path: "/gallery",
    element: (
      <SuspenseWrapper>
        <PhotoGalleryPage />
      </SuspenseWrapper>
    ),
    loader: ({ request }) =>
      redirectToStoredLocale(request.url, "/gallery", "/en/gallery"),
  },
  {
    path: "/en/gallery",
    element: (
      <SuspenseWrapper>
        <PhotoGalleryPage />
      </SuspenseWrapper>
    ),
    loader: ({ request }) =>
      redirectToStoredLocale(request.url, "/gallery", "/en/gallery"),
  },
  {
    path: "/stories",
    element: (
      <SuspenseWrapper>
        <StoriesPage />
      </SuspenseWrapper>
    ),
    loader: ({ request }) =>
      redirectToStoredLocale(request.url, "/stories", "/en/stories"),
  },
  {
    path: "/en/stories",
    element: (
      <SuspenseWrapper>
        <StoriesPage />
      </SuspenseWrapper>
    ),
    loader: ({ request }) =>
      redirectToStoredLocale(request.url, "/stories", "/en/stories"),
  },
  {
    path: "/anticipatory-action",
    element: (
      <SuspenseWrapper>
        <ProtectedRoute>
          <AnticipatoryActionCoursePage />
        </ProtectedRoute>
      </SuspenseWrapper>
    ),
    loader: ({ request }) =>
      redirectToStoredLocale(
        request.url,
        "/anticipatory-action",
        "/en/anticipatory-action",
      ),
  },
  {
    path: "/en/anticipatory-action",
    element: (
      <SuspenseWrapper>
        <ProtectedRoute>
          <AnticipatoryActionCoursePage />
        </ProtectedRoute>
      </SuspenseWrapper>
    ),
    loader: ({ request }) =>
      redirectToStoredLocale(
        request.url,
        "/anticipatory-action",
        "/en/anticipatory-action",
      ),
  },
  {
    path: "/chapter-story-preview",
    element: (
      <SuspenseWrapper>
        <Section />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/comics",
    element: (
      <SuspenseWrapper>
        <ComicsPage />
      </SuspenseWrapper>
    ),
    loader: ({ request }) =>
      redirectToStoredLocale(request.url, "/comics", "/en/comics"),
  },
  {
    path: "/en/comics",
    element: (
      <SuspenseWrapper>
        <ComicsPage />
      </SuspenseWrapper>
    ),
    loader: ({ request }) =>
      redirectToStoredLocale(request.url, "/comics", "/en/comics"),
  },
  {
    path: "/flyers",
    element: (
      <SuspenseWrapper>
        <FlyersPage />
      </SuspenseWrapper>
    ),
    loader: ({ request }) =>
      redirectToStoredLocale(request.url, "/flyers", "/en/flyers"),
  },
  {
    path: "/en/flyers",
    element: (
      <SuspenseWrapper>
        <FlyersPage />
      </SuspenseWrapper>
    ),
    loader: ({ request }) =>
      redirectToStoredLocale(request.url, "/flyers", "/en/flyers"),
  },
  {
    path: "/press-releases",
    element: (
      <SuspenseWrapper>
        <PressReleasePage />
      </SuspenseWrapper>
    ),
    loader: ({ request }) =>
      redirectToStoredLocale(
        request.url,
        "/press-releases",
        "/en/press-releases",
      ),
  },
  {
    path: "/en/press-releases",
    element: (
      <SuspenseWrapper>
        <PressReleasePage />
      </SuspenseWrapper>
    ),
    loader: ({ request }) =>
      redirectToStoredLocale(
        request.url,
        "/press-releases",
        "/en/press-releases",
      ),
  },
  {
    path: "/login",
    element: (
      <SuspenseWrapper>
        <LoginModalPage />
      </SuspenseWrapper>
    ),
    loader: ({ request }) =>
      redirectToStoredLocale(request.url, "/login", "/en/login"),
  },
  {
    path: "/en/login",
    element: (
      <SuspenseWrapper>
        <LoginModalPage />
      </SuspenseWrapper>
    ),
    loader: ({ request }) =>
      redirectToStoredLocale(request.url, "/login", "/en/login"),
  },
  {
    path: "/registration",
    element: (
      <SuspenseWrapper>
        <Registration />
      </SuspenseWrapper>
    ),
    loader: ({ request }) =>
      redirectToStoredLocale(request.url, "/registration", "/en/registration"),
  },
  {
    path: "/en/registration",
    element: (
      <SuspenseWrapper>
        <Registration />
      </SuspenseWrapper>
    ),
    loader: ({ request }) =>
      redirectToStoredLocale(request.url, "/registration", "/en/registration"),
  },
  {
    path: "/lesson/1",
    element: (
      <SuspenseWrapper>
        <Section />
      </SuspenseWrapper>
    ),
    loader: ({ request }) =>
      redirectToStoredLocale(request.url, "/lesson/1", "/en/lesson/1"),
  },
  {
    path: "/en/lesson/1",
    element: (
      <SuspenseWrapper>
        <Section />
      </SuspenseWrapper>
    ),
    loader: ({ request }) =>
      redirectToStoredLocale(request.url, "/lesson/1", "/en/lesson/1"),
  },
  {
    path: "/lesson/:chapterId?",
    loader: () =>
      redirect(
        getStoredLocale() === "en"
          ? "/en#chapter-overview"
          : "/#chapter-overview",
      ),
  },
  {
    path: "/en/lesson/:chapterId?",
    loader: () =>
      redirect(
        getStoredLocale() === "en"
          ? "/en#chapter-overview"
          : "/#chapter-overview",
      ),
  },
  {
    path: "/about",
    element: (
      <SuspenseWrapper>
        <About />
      </SuspenseWrapper>
    ),
    loader: ({ request }) =>
      redirectToStoredLocale(request.url, "/about", "/en/about"),
  },
  {
    path: "/en/about",
    element: (
      <SuspenseWrapper>
        <EnglishAbout />
      </SuspenseWrapper>
    ),
    loader: ({ request }) =>
      redirectToStoredLocale(request.url, "/about", "/en/about"),
  },
  {
    path: "/location/:id",
    element: (
      <SuspenseWrapper>
        <LocationDetails />
      </SuspenseWrapper>
    ),
    loader: ({ request }) =>
      redirectToStoredLocale(request.url, "/location", "/en/location"),
  },
  {
    path: "/en/location/:id",
    element: (
      <SuspenseWrapper>
        <EnglishLocationDetails />
      </SuspenseWrapper>
    ),
    loader: ({ request }) =>
      redirectToStoredLocale(request.url, "/location", "/en/location"),
  },
  {
    path: "/blogs",
    element: (
      <SuspenseWrapper>
        <Blogs />
      </SuspenseWrapper>
    ),
    loader: ({ request }) =>
      redirectToStoredLocale(request.url, "/blogs", "/en/blogs"),
  },
  {
    path: "/en/blogs",
    element: (
      <SuspenseWrapper>
        <Blogs />
      </SuspenseWrapper>
    ),
    loader: ({ request }) =>
      redirectToStoredLocale(request.url, "/blogs", "/en/blogs"),
  },
  {
    path: "/blogs/write",
    element: (
      <SuspenseWrapper>
        <ProtectedRoute>
          <WriteBlog />
        </ProtectedRoute>
      </SuspenseWrapper>
    ),
    loader: ({ request }) =>
      redirectToStoredLocale(request.url, "/blogs", "/en/blogs"),
  },
  {
    path: "/en/blogs/write",
    element: (
      <SuspenseWrapper>
        <ProtectedRoute>
          <WriteBlog />
        </ProtectedRoute>
      </SuspenseWrapper>
    ),
    loader: ({ request }) =>
      redirectToStoredLocale(request.url, "/blogs", "/en/blogs"),
  },
  {
    path: "/blogs/:id",
    element: (
      <SuspenseWrapper>
        <BlogDetails />
      </SuspenseWrapper>
    ),
    loader: ({ request }) =>
      redirectToStoredLocale(request.url, "/blogs", "/en/blogs"),
  },
  {
    path: "/en/blogs/:id",
    element: (
      <SuspenseWrapper>
        <BlogDetails />
      </SuspenseWrapper>
    ),
    loader: ({ request }) =>
      redirectToStoredLocale(request.url, "/blogs", "/en/blogs"),
  },
  {
    path: "/profile",
    element: (
      <SuspenseWrapper>
        <Profile />
      </SuspenseWrapper>
    ),
    loader: ({ request }) =>
      redirectToStoredLocale(request.url, "/profile", "/en/profile"),
  },
  {
    path: "/en/profile",
    element: (
      <SuspenseWrapper>
        <EnglishProfile />
      </SuspenseWrapper>
    ),
    loader: ({ request }) =>
      redirectToStoredLocale(request.url, "/profile", "/en/profile"),
  },
  {
    path: "/admin",
    element: (
      <SuspenseWrapper>
        <AdminLayout />
      </SuspenseWrapper>
    ),
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <Overview />
          </SuspenseWrapper>
        ),
      },
      {
        path: "overview",
        element: (
          <SuspenseWrapper>
            <Overview />
          </SuspenseWrapper>
        ),
      },
      {
        path: "blogs",
        element: (
          <SuspenseWrapper>
            <ManageBlogs />
          </SuspenseWrapper>
        ),
      },
      {
        path: "gallery",
        element: (
          <SuspenseWrapper>
            <ManageGallery />
          </SuspenseWrapper>
        ),
      },
      {
        path: "videos",
        element: (
          <SuspenseWrapper>
            <ManageHomeVideos />
          </SuspenseWrapper>
        ),
      },
      {
        path: "stories",
        element: (
          <SuspenseWrapper>
            <ManageStories />
          </SuspenseWrapper>
        ),
      },
      {
        path: "comics",
        element: (
          <SuspenseWrapper>
            <ManageComics />
          </SuspenseWrapper>
        ),
      },
      {
        path: "flyers",
        element: (
          <SuspenseWrapper>
            <ManageFlyers />
          </SuspenseWrapper>
        ),
      },
      {
        path: "press-releases",
        element: (
          <SuspenseWrapper>
            <ManagePressReleases />
          </SuspenseWrapper>
        ),
      },
      {
        path: "profile",
        element: (
          <SuspenseWrapper>
            <AdminProfile />
          </SuspenseWrapper>
        ),
      },
      {
        path: "schools",
        element: (
          <SuspenseWrapper>
            <ManageSchools />
          </SuspenseWrapper>
        ),
      },
      {
        path: "create-school",
        element: (
          <SuspenseWrapper>
            <CreateSchool />
          </SuspenseWrapper>
        ),
      },
    ],
  },
];

const router = createBrowserRouter([
  {
    element: (
      <>
        <ScrollRestoration />
        <Outlet />
      </>
    ),
    children: routes,
  },
]);

export default router;
