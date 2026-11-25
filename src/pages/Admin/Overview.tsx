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

type ActivityKind = "student" | "blog";
type Activity = {
  key: string;
  kind: ActivityKind;
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
    kind: "student",
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
    kind: "blog",
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

// Counts from 0 up to `value` (skipped under reduced motion).
function useCountUp(value: number, duration = 1100) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(value);
      return;
    }
    let frame = 0;
    let start: number | null = null;
    const tick = (time: number) => {
      start ??= time;
      const progress = Math.min((time - start) / duration, 1);
      setShown(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);
  return shown;
}

function StatCard({
  title,
  value,
  note,
  icon: Icon,
  color,
  link,
  index,
}: {
  title: string;
  value: number;
  note: string;
  icon: IconType;
  color: string;
  link?: string;
  index: number;
}) {
  const shown = useCountUp(value);
  const body = (
    <div className="relative z-10 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-700">{title}</p>
        <p className="mt-1 text-3xl font-black tabular-nums text-gray-900">
          {bn(shown)}
        </p>
        <p className="mt-1 truncate text-xs font-medium text-gray-600">
          {note}
        </p>
      </div>
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${color} text-white shadow-lg transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110 motion-reduce:transition-none`}
      >
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
    </div>
  );
  const className =
    "dash-rise group relative block overflow-hidden rounded-2xl p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(154,51,36,0.16)] motion-reduce:hover:translate-y-0";
  const decoration = (
    <span
      className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${color} opacity-10 transition-transform duration-700 group-hover:scale-150`}
    />
  );
  const style = { ...glass, animationDelay: `${index * 70}ms` };
  return link ? (
    <Link to={link} className={className} style={style}>
      {decoration}
      {body}
    </Link>
  ) : (
    <div className={className} style={style}>
      {decoration}
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
  const [activityFilter, setActivityFilter] = useState<ActivityKind | null>(
    null,
  );

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
  const shownActivities = activityFilter
    ? activities.filter((activity) => activity.kind === activityFilter)
    : activities;
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
          color="from-red-600 to-red-800"
          index={0}
        />
        <StatCard
          title="মোট দর্শনার্থী"
          value={stats.visitors}
          note={`বাংলাদেশ ${bn(students.bangladesh)} · অন্যান্য দেশ ${bn(students.otherCountries)} শিক্ষার্থী`}
          icon={FiEye}
          color="from-teal-500 to-teal-600"
          index={1}
        />
        <StatCard
          title="প্রকাশিত ব্লগ"
          value={blogs.published}
          note={`${bn(blogs.pending)}টি পর্যালোচনার অপেক্ষায়`}
          icon={FiBookOpen}
          color="from-orange-500 to-red-600"
          index={2}
          link="/admin/blogs"
        />
        <StatCard
          title="গেম খেলেছে"
          value={stats.gamePlayers}
          note="গেম শেষ করা শিক্ষার্থী"
          icon={FiPlay}
          color="from-red-800 to-red-900"
          index={3}
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
              className="group rounded-xl border border-white/40 bg-white/30 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-red-200 hover:bg-white/70 hover:shadow-md motion-reduce:hover:translate-y-0"
            >
              <Icon
                className="h-4 w-4 text-red-600 transition-transform duration-300 group-hover:scale-125"
                aria-hidden="true"
              />
              <p className="mt-2 text-2xl font-black text-gray-900">
                {bn(value)}
              </p>
              <p className="text-xs font-semibold text-gray-600">{label}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-2xl p-6" style={glass}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold" style={headingStyle}>
            সাম্প্রতিক কার্যকলাপ
          </h2>
          <div
            role="group"
            aria-label="কার্যকলাপ ফিল্টার"
            className="inline-flex rounded-xl bg-white/50 p-1 ring-1 ring-white/60"
          >
            {(
              [
                [null, "সব"],
                ["student", "নিবন্ধন"],
                ["blog", "ব্লগ"],
              ] as const
            ).map(([kind, label]) => (
              <button
                key={label}
                type="button"
                aria-pressed={activityFilter === kind}
                onClick={() => setActivityFilter(kind)}
                className={`rounded-lg px-3 py-1 text-sm font-semibold transition-all duration-200 ${
                  activityFilter === kind
                    ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                    : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        {shownActivities.length === 0 ? (
          <p className="text-sm text-gray-600">এখনও কোনো কার্যকলাপ নেই।</p>
        ) : (
          <ul key={activityFilter ?? "all"} className="space-y-3">
            {shownActivities.map(
              ({ key, icon: Icon, title, detail, createdAt, link }, index) => (
                <li
                  key={key}
                  className="dash-rise flex items-center justify-between gap-3 rounded-xl border border-white/40 bg-white/30 p-4 transition-colors duration-200 hover:border-red-200 hover:bg-white/70"
                  style={{ animationDelay: `${index * 60}ms` }}
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
