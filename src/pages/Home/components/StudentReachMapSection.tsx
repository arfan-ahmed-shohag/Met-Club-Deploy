import { useEffect, useMemo, useRef, useState, type JSX } from "react";
import { GraduationCap, Landmark, MapPinned, School } from "lucide-react";
import axiosPublic from "../../../hooks/axiosPublic";
import { BD_DISTRICTS, BD_MAP_VIEWBOX } from "./bdDistrictMap";

type StudentReach = {
  totalStudents: number;
  totalDistricts: number;
  districtsReached: number;
  divisionsReached: number;
  institutions: number;
  districts: { district: string; students: number }[];
};

const TOTAL_DIVISIONS = 8;

function useCountUp(target: number, start: boolean): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frame = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(frame);
    }
    let frame = 0;
    let startedAt: number | null = null;
    const tick = (time: number) => {
      startedAt ??= time;
      const progress = Math.min((time - startedAt) / 1400, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, start]);
  return value;
}

function StatCard({
  icon,
  value,
  total,
  label,
  note,
  start,
  format,
  className = "",
}: {
  className?: string;
  icon: JSX.Element;
  value: number;
  total?: number;
  label: string;
  note?: string;
  start: boolean;
  format: (n: number) => string;
}): JSX.Element {
  const shown = useCountUp(value, start);
  const percent = total ? Math.min(100, (value / total) * 100) : 0;
  return (
    <div
      className={`flex flex-col rounded-2xl bg-white p-4 shadow-[0_10px_28px_rgba(127,29,29,.07)] ring-1 ring-red-100 sm:p-5 ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-slate-600">{label}</p>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-50 text-red-700">
          {icon}
        </span>
      </div>
      <p className="mt-3 text-4xl font-black leading-none text-red-950">
        {format(shown)}
        {total !== undefined && (
          <span className="ml-1 text-lg font-bold text-slate-400">
            / {format(total)}
          </span>
        )}
      </p>
      {total !== undefined ? (
        <div className="mt-4">
          <div className="h-2 overflow-hidden rounded-full bg-red-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-700 transition-[width] duration-[1400ms] ease-out motion-reduce:transition-none"
              style={{ width: start ? `${Math.max(percent, value ? 3 : 0)}%` : 0 }}
            />
          </div>
          {note && <p className="mt-2 text-xs text-slate-500">{note}</p>}
        </div>
      ) : (
        note && <p className="mt-4 text-xs text-slate-500">{note}</p>
      )}
    </div>
  );
}

function HeroStat({
  value,
  label,
  note,
  start,
  format,
}: {
  value: number;
  label: string;
  note: string;
  start: boolean;
  format: (n: number) => string;
}): JSX.Element {
  const shown = useCountUp(value, start);
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 via-red-700 to-red-900 p-6 text-white shadow-[0_18px_40px_rgba(127,29,29,.25)] sm:p-7">
      <div
        aria-hidden="true"
        className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-16 right-16 h-32 w-32 rounded-full bg-orange-300/20"
      />
      <div className="relative flex items-center gap-5">
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25">
          <GraduationCap size={34} aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-bold text-red-100">{label}</p>
          <p className="text-5xl font-black leading-tight sm:text-6xl">
            {format(shown)}
          </p>
        </div>
      </div>
      <p className="relative mt-3 text-sm text-red-100">{note}</p>
    </div>
  );
}

export default function StudentReachMapSection({
  isEnglish,
}: {
  isEnglish: boolean;
}): JSX.Element | null {
  const [data, setData] = useState<StudentReach | null>(null);
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let active = true;
    axiosPublic()
      .get<{ data?: StudentReach }>("/stats/student-reach")
      .then(({ data: body }) => {
        if (active && body?.data) setData(body.data);
        else if (active) setFailed(true);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const counts = useMemo(
    () => new Map(data?.districts.map((d) => [d.district, d.students]) ?? []),
    [data],
  );
  const maxCount = Math.max(1, ...counts.values());
  const shapeNames = useMemo(
    () => new Map(BD_DISTRICTS.map((d) => [d.bn, d.en])),
    [],
  );

  if (failed) return null;

  const format = (n: number) =>
    n.toLocaleString(isEnglish ? "en-IN" : "bn-BD");
  const t = (bn: string, en: string) => (isEnglish ? en : bn);
  const ready = visible && data !== null;
  const hoveredShape = BD_DISTRICTS.find((d) => d.bn === hovered);
  const hoveredCount = hovered ? (counts.get(hovered) ?? 0) : 0;
  const topDistricts = data?.districts.slice(0, 5) ?? [];

  return (
    <section
      ref={sectionRef}
      id="student-reach"
      className="relative overflow-hidden bg-red-50/70 py-[60px] lg:py-[80px]"
      aria-labelledby="student-reach-title"
    >
      <div className="site-container grid items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_minmax(0,460px)] lg:gap-16 lg:px-8">
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-[.16em] text-red-600">
            {t("সারা দেশে মেট ক্লাব", "MET CLUB ACROSS BANGLADESH")}
          </p>
          <h2
            id="student-reach-title"
            className="border-l-4 border-red-600 pl-4 text-[32px] font-black leading-tight text-red-950 sm:text-[40px]"
          >
            {t("সংখ্যায় আমাদের বিস্তার", "Our Reach in Numbers")}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {t(
              "মানচিত্রের লাল জেলাগুলো থেকে শিক্ষার্থীরা মেট ক্লাবে যুক্ত হয়েছে। প্রতিটি নতুন নিবন্ধনে মানচিত্রটি আরও রঙিন হয়ে ওঠে।",
              "Students have joined MET Club from every district shown in red. Each new registration colours in more of the map.",
            )}
          </p>

          <div
            className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4"
            aria-busy={!data}
          >
            <div className="col-span-2 sm:col-span-3">
              <HeroStat
                value={data?.totalStudents ?? 0}
                label={t("মোট নিবন্ধিত শিক্ষার্থী", "Registered students")}
                note={t(
                  "সারা বাংলাদেশ থেকে মেট ক্লাবে যুক্ত হয়েছে",
                  "have joined MET Club from across Bangladesh",
                )}
                start={ready}
                format={format}
              />
            </div>
            <StatCard
              icon={<MapPinned size={20} aria-hidden="true" />}
              value={data?.districtsReached ?? 0}
              total={data?.totalDistricts ?? 64}
              label={t("জেলা", "Districts")}
              note={t("জেলায় পৌঁছেছি", "districts reached")}
              start={ready}
              format={format}
            />
            <StatCard
              icon={<Landmark size={20} aria-hidden="true" />}
              value={data?.divisionsReached ?? 0}
              total={TOTAL_DIVISIONS}
              label={t("বিভাগ", "Divisions")}
              note={t("বিভাগে পৌঁছেছি", "divisions reached")}
              start={ready}
              format={format}
            />
            <StatCard
              className="col-span-2 sm:col-span-1"
              icon={<School size={20} aria-hidden="true" />}
              value={data?.institutions ?? 0}
              label={t("শিক্ষা প্রতিষ্ঠান", "Schools")}
              note={t("স্কুল ও প্রতিষ্ঠানের শিক্ষার্থী", "schools and institutions")}
              start={ready}
              format={format}
            />
          </div>

          {topDistricts.length > 0 && (
            <div className="mt-4 rounded-2xl bg-white p-5 shadow-[0_10px_28px_rgba(127,29,29,.07)] ring-1 ring-red-100">
              <p className="text-sm font-bold text-slate-600">
                {t("সবচেয়ে বেশি শিক্ষার্থী যেসব জেলায়", "Top districts")}
              </p>
              <ol className="mt-4 space-y-3">
                {topDistricts.map((d, index) => (
                  <li
                    key={d.district}
                    onMouseEnter={() => setHovered(d.district)}
                    onMouseLeave={() => setHovered(null)}
                    className="grid cursor-default grid-cols-[1.75rem_minmax(5rem,8rem)_1fr_auto] items-center gap-3 text-sm"
                  >
                    <span
                      className={`grid h-7 w-7 place-items-center rounded-full text-xs font-black ${index === 0 ? "bg-red-700 text-white" : "bg-red-50 text-red-800"}`}
                    >
                      {format(index + 1)}
                    </span>
                    <span className="truncate font-semibold text-slate-800">
                      {isEnglish
                        ? (shapeNames.get(d.district) ?? d.district)
                        : d.district}
                    </span>
                    <span className="h-2 overflow-hidden rounded-full bg-red-50">
                      <span
                        className="block h-full rounded-full bg-red-500 transition-[width] duration-[1400ms] ease-out motion-reduce:transition-none"
                        style={{
                          width: ready ? `${(d.students / maxCount) * 100}%` : 0,
                        }}
                      />
                    </span>
                    <span className="min-w-8 text-right font-bold text-red-900">
                      {format(d.students)}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <figure className="relative mx-auto w-full max-w-[460px]">
          <svg
            viewBox={BD_MAP_VIEWBOX}
            className="h-auto w-full drop-shadow-[0_18px_30px_rgba(127,29,29,.12)]"
            role="img"
            aria-label={t(
              "বাংলাদেশের জেলাভিত্তিক মানচিত্র; লাল জেলাগুলোতে মেট ক্লাবের শিক্ষার্থী আছে",
              "Map of Bangladesh by district; districts in red have MET Club students",
            )}
            onMouseLeave={() => setHovered(null)}
          >
            {BD_DISTRICTS.map((d) => {
              const count = counts.get(d.bn) ?? 0;
              const isHovered = hovered === d.bn;
              const fill = count
                ? `rgba(220, 38, 38, ${0.62 + 0.38 * (count / maxCount)})`
                : "#9ca3af";
              return (
                <path
                  key={d.bn}
                  d={d.d}
                  fill={isHovered ? (count ? "#991b1b" : "#6b7280") : fill}
                  stroke="#fff"
                  strokeWidth={isHovered ? 1.4 : 0.7}
                  strokeLinejoin="round"
                  className="cursor-pointer transition-[fill] duration-200"
                  onMouseEnter={() => setHovered(d.bn)}
                >
                  <title>
                    {`${isEnglish ? d.en : d.bn}: ${format(count)} ${t("জন শিক্ষার্থী", count === 1 ? "student" : "students")}`}
                  </title>
                </path>
              );
            })}
            {BD_DISTRICTS.filter((d) => counts.has(d.bn)).map((d) => (
              <text
                key={`label-${d.bn}`}
                x={d.cx}
                y={d.cy}
                textAnchor="middle"
                dominantBaseline="middle"
                className="pointer-events-none select-none fill-white font-bold"
                style={{ fontSize: 8 }}
              >
                {isEnglish ? d.en : d.bn}
              </text>
            ))}
          </svg>

          {hoveredShape && (
            <div
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg bg-slate-900 px-3 py-1.5 text-center text-xs font-semibold whitespace-nowrap text-white shadow-lg"
              style={{
                left: `${(hoveredShape.cx / 400) * 100}%`,
                top: `calc(${(hoveredShape.cy / Number(BD_MAP_VIEWBOX.split(" ")[3])) * 100}% - 10px)`,
              }}
            >
              {isEnglish ? hoveredShape.en : hoveredShape.bn}
              <span className="block text-red-300">
                {format(hoveredCount)} {t("জন শিক্ষার্থী", hoveredCount === 1 ? "student" : "students")}
              </span>
            </div>
          )}

          <figcaption className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2">
              <span className="h-3.5 w-3.5 rounded-sm bg-red-600" />
              {t("শিক্ষার্থী আছে", "Has students")}
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-3.5 w-3.5 rounded-sm bg-gray-400" />
              {t("এখনো কেউ যুক্ত হয়নি", "No students yet")}
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
