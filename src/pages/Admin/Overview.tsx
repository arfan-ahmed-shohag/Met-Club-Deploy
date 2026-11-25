import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import type { IconType } from "react-icons";
import {
  FiAlertCircle,
  FiBookOpen,
  FiEye,
  FiFileText,
  FiImage,
  FiMapPin,
  FiMessageSquare,
  FiPlay,
  FiRefreshCw,
  FiUserPlus,
  FiUsers,
  FiVideo,
} from "react-icons/fi";
import useAxiosProtected from "../../hooks/axiosProtected";
import { getApiErrorMessage } from "../../utils/apiError";
import DashboardAnalytics, {
  type DashboardAnalyticsData,
} from "./DashboardAnalytics";
import { bn, glass, headingStyle } from "./dashboardFormat";

type DashboardStats = {
  students: {
    active: number;
    blocked: number;
    newThisWeek: number;
    bangladesh: number;
    otherCountries: number;
  };
  visitors: number;
  blogs: { published: number; pending: number };
  gamePlayers: number;
  content: {
    stories: number;
    homeVideos: number;
    galleryImages: number;
    comics: number;
    flyers: number;
    news: number;
    schools: number;
  };
  recentStudents: {
    id: string;
    fullName: string;
    institution: string;
    district: string | null;
    createdAt: string;
  }[];
  recentBlogs: {
    id: string;
    title: string;
    status: "pending" | "published";
    authorName: string;
    createdAt: string;
  }[];
  analytics: DashboardAnalyticsData;
};

type Activity = {
  key: string;
  icon: IconType;
  title: string;
  detail: string;
  createdAt: string;
  link?: string;
};

const relativeTime = new Intl.RelativeTimeFormat("bn", { numeric: "auto" });
const timeUnits: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 60 * 60],
  ["month", 30 * 24 * 60 * 60],
  ["week", 7 * 24 * 60 * 60],
  ["day", 24 * 60 * 60],
  ["hour", 60 * 60],
  ["minute", 60],
];

function timeAgo(date: string) {
  const seconds = (new Date(date).getTime() - Date.now()) / 1000;
  for (const [unit, size] of timeUnits) {
    if (Math.abs(seconds) >= size)
      return relativeTime.format(Math.round(seconds / size), unit);
  }
  return "এইমাত্র";
}

function toActivities(stats: DashboardStats): Activity[] {
  const students: Activity[] = stats.recentStudents.map((student) => ({
    key: `student-${student.id}`,
    icon: FiUserPlus,
    title: `${student.fullName} নিবন্ধিত হয়েছেন`,
    detail: [
      student.institution,
      student.district === "Others" ? "অন্যান্য দেশ" : student.district,
    ]
      .filter(Boolean)
      .join(" · "),
    createdAt: student.createdAt,
  }));
  const blogs: Activity[] = stats.recentBlogs.map((blog) => ({
    key: `blog-${blog.id}`,
    icon: FiBookOpen,
    title: `নতুন ব্লগ: ${blog.title}`,
    detail: `${blog.authorName || "অজানা লেখক"} · ${blog.status === "pending" ? "পর্যালোচনার অপেক্ষায়" : "প্রকাশিত"}`,
    createdAt: blog.createdAt,
    link: "/admin/blogs",
  }));
  return [...students, ...blogs]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 6);
}

function StatCard({
  title,
  value,
  note,
  icon: Icon,
  color,
  link,
}: {
  title: string;
  value: number;
  note: string;
  icon: IconType;
  color: string;
  link?: string;
}) {
  const body = (
    <div className="relative z-10 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-700">{title}</p>
        <p className="mt-1 text-3xl font-black text-gray-900">{bn(value)}</p>
        <p className="mt-1 truncate text-xs font-medium text-gray-600">
          {note}
        </p>
      </div>
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${color} text-white shadow-lg`}
      >
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
    </div>
  );
  const className = "relative block overflow-hidden rounded-2xl p-6";
  return link ? (
    <Link
      to={link}
      className={`${className} transition-transform hover:-translate-y-0.5`}
      style={glass}
    >
      {body}
    </Link>
  ) : (
    <div className={className} style={glass}>
      {body}
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="ড্যাশবোর্ড লোড হচ্ছে">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="h-[124px] animate-pulse rounded-2xl motion-reduce:animate-none"
            style={glass}
          />
        ))}
      </div>
      <div
        className="h-28 animate-pulse rounded-2xl motion-reduce:animate-none"
        style={glass}
      />
      <div
        className="h-72 animate-pulse rounded-2xl motion-reduce:animate-none"
        style={glass}
      />
    </div>
  );
}

export default function Overview() {
  const axios = useAxiosProtected();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadStats = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const { data } = await axios.get<{ data?: DashboardStats }>(
        "/stats/dashboard",
      );
      if (!data?.data) throw new Error("Missing dashboard data");
      setStats(data.data);
    } catch (err) {
      setError(getApiErrorMessage(err, "ড্যাশবোর্ডের তথ্য লোড করা যায়নি।"));
    } finally {
      setIsLoading(false);
    }
  }, [axios]);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  if (isLoading && !stats) return <OverviewSkeleton />;

  if (!stats)
    return (
      <div
        className="flex flex-col items-center gap-4 rounded-2xl p-8 text-center"
        style={glass}
        role="alert"
      >
        <FiAlertCircle className="h-10 w-10 text-red-500" aria-hidden="true" />
        <p className="font-semibold text-gray-800">{error}</p>
        <button
          type="button"
          onClick={() => void loadStats()}
          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
        >
          <FiRefreshCw aria-hidden="true" /> আবার চেষ্টা করুন
        </button>
      </div>
    );

  const { students, blogs, content } = stats;
  const activities = toActivities(stats);
  const contentTiles: {
    label: string;
    value: number;
    icon: IconType;
    link: string;
  }[] = [
    {
      label: "গল্প",
      value: content.stories,
      icon: FiMessageSquare,
      link: "/admin/stories",
    },
    {
      label: "হোম ভিডিও",
      value: content.homeVideos,
      icon: FiVideo,
      link: "/admin/videos",
    },
    {
      label: "গ্যালারির ছবি",
      value: content.galleryImages,
      icon: FiImage,
      link: "/admin/gallery",
    },
    {
      label: "Comics",
      value: content.comics,
      icon: FiFileText,
      link: "/admin/comics",
    },
    {
      label: "Flyers",
      value: content.flyers,
      icon: FiFileText,
      link: "/admin/flyers",
    },
    {
      label: "News",
      value: content.news,
      icon: FiFileText,
      link: "/admin/press-releases",
    },
    {
      label: "স্কুল",
      value: content.schools,
      icon: FiMapPin,
      link: "/admin/schools",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => void loadStats()}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-xl bg-white/50 px-3 py-2 text-sm font-semibold text-gray-700 ring-1 ring-white/60 hover:bg-white/70 disabled:opacity-60"
        >
          <FiRefreshCw
            className={
              isLoading ? "animate-spin motion-reduce:animate-none" : ""
            }
            aria-hidden="true"
          />
          রিফ্রেশ
        </button>
      </div>

      {error && (
        <p
          className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          role="alert"
        >
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="মোট শিক্ষার্থী"
          value={students.active}
          note={`এই সপ্তাহে নতুন ${bn(students.newThisWeek)} জন · ব্লকড ${bn(students.blocked)}`}
          icon={FiUsers}
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          title="মোট দর্শনার্থী"
          value={stats.visitors}
          note={`বাংলাদেশ ${bn(students.bangladesh)} · অন্যান্য দেশ ${bn(students.otherCountries)} শিক্ষার্থী`}
          icon={FiEye}
          color="from-green-500 to-green-600"
        />
        <StatCard
          title="প্রকাশিত ব্লগ"
          value={blogs.published}
          note={`${bn(blogs.pending)}টি পর্যালোচনার অপেক্ষায়`}
          icon={FiBookOpen}
          color="from-orange-500 to-orange-600"
          link="/admin/blogs"
        />
        <StatCard
          title="গেম খেলেছে"
          value={stats.gamePlayers}
          note="গেম শেষ করা শিক্ষার্থী"
          icon={FiPlay}
          color="from-purple-500 to-purple-600"
        />
      </div>

      <DashboardAnalytics analytics={stats.analytics} />

      <div className="rounded-2xl p-6" style={glass}>
        <h2 className="mb-4 text-xl font-bold" style={headingStyle}>
          কন্টেন্ট
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {contentTiles.map(({ label, value, icon: Icon, link }) => (
            <Link
              key={link}
              to={link}
              className="rounded-xl border border-white/40 bg-white/30 p-3 transition-colors hover:bg-white/50"
            >
              <Icon className="h-4 w-4 text-red-600" aria-hidden="true" />
              <p className="mt-2 text-2xl font-black text-gray-900">
                {bn(value)}
              </p>
              <p className="text-xs font-semibold text-gray-600">{label}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-2xl p-6" style={glass}>
        <h2 className="mb-4 text-xl font-bold" style={headingStyle}>
          সাম্প্রতিক কার্যকলাপ
        </h2>
        {activities.length === 0 ? (
          <p className="text-sm text-gray-600">এখনও কোনো কার্যকলাপ নেই।</p>
        ) : (
          <ul className="space-y-3">
            {activities.map(
              ({ key, icon: Icon, title, detail, createdAt, link }) => (
                <li
                  key={key}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/40 bg-white/30 p-4"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                      <Icon aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-gray-800">
                        {title}
                      </p>
                      <p className="truncate text-sm text-gray-600">
                        {detail ? `${detail} · ` : ""}
                        <time dateTime={createdAt}>{timeAgo(createdAt)}</time>
                      </p>
                    </div>
                  </div>
                  {link && (
                    <Link
                      to={link}
                      className="shrink-0 text-sm font-semibold text-red-600 hover:text-red-800"
                    >
                      দেখুন
                    </Link>
                  )}
                </li>
              ),
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
