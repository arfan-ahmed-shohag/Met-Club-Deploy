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

function StatItem({
  icon,
  value,
  suffix,
  label,
  start,
  format,
}: {
  icon: JSX.Element;
  value: number;
  suffix?: string;
  label: string;
  start: boolean;
  format: (n: number) => string;
}): JSX.Element {
  const shown = useCountUp(value, start);
  return (
    <div className="flex flex-col items-center text-center">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white text-red-700 shadow-[0_10px_24px_rgba(127,29,29,.10)] ring-1 ring-red-100">
        {icon}
      </span>
      <p className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">
        {format(shown)}
        {suffix && (
          <span className="text-lg font-bold text-slate-400 sm:text-xl">
            {suffix}
          </span>
        )}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-600 sm:text-base">
        {label}
      </p>
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
            className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4"
            aria-busy={!data}
          >
            <StatItem
              icon={<GraduationCap size={30} aria-hidden="true" />}
              value={data?.totalStudents ?? 0}
              label={t("মোট শিক্ষার্থী", "Students")}
              start={ready}
              format={format}
            />
            <StatItem
              icon={<MapPinned size={30} aria-hidden="true" />}
              value={data?.districtsReached ?? 0}
              suffix={` / ${format(data?.totalDistricts ?? 64)}`}
              label={t("জেলা", "Districts")}
              start={ready}
              format={format}
            />
            <StatItem
              icon={<School size={30} aria-hidden="true" />}
              value={data?.institutions ?? 0}
              label={t("শিক্ষা প্রতিষ্ঠান", "Schools")}
              start={ready}
              format={format}
            />
            <StatItem
              icon={<Landmark size={30} aria-hidden="true" />}
              value={data?.divisionsReached ?? 0}
              suffix={` / ${format(TOTAL_DIVISIONS)}`}
              label={t("বিভাগ", "Divisions")}
              start={ready}
              format={format}
            />
          </div>

          {topDistricts.length > 0 && (
            <div className="mt-10">
              <p className="text-sm font-bold text-slate-700">
                {t("সবচেয়ে বেশি শিক্ষার্থী যেসব জেলায়", "Top districts")}
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {topDistricts.map((d) => (
                  <li
                    key={d.district}
                    onMouseEnter={() => setHovered(d.district)}
                    onMouseLeave={() => setHovered(null)}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-slate-800 ring-1 ring-red-100"
                  >
                    {isEnglish
                      ? (shapeNames.get(d.district) ?? d.district)
                      : d.district}
                    <span className="rounded-full bg-red-600 px-2 text-xs font-bold text-white">
                      {format(d.students)}
                    </span>
                  </li>
                ))}
              </ul>
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
