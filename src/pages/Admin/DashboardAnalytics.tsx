import { useMemo, useState, type ReactNode } from "react";
import { FiTrendingDown, FiTrendingUp, FiX } from "react-icons/fi";
import {
  BarList,
  ColumnChart,
  DonutChart,
  LollipopChart,
  TrendChart,
} from "./dashboardCharts";
import {
  CHART_BRICK,
  CHART_RED,
  CHART_TEAL,
  bn,
  formatBucket,
  glass,
  headingStyle,
  type Bucket,
  type TrendPoint,
} from "./dashboardFormat";

export type DashboardAnalyticsData = {
  trend: {
    registrations: TrendPoint[];
    visitors: TrendPoint[];
    blogs: TrendPoint[];
  };
  byDivision: { division: string | null; students: number }[];
  byClass: { class: number; students: number }[];
  byDistrict: { district: string; division: string | null; students: number }[];
  gameScores: { from: number; to: number; students: number }[];
};

type Metric = keyof DashboardAnalyticsData["trend"];

const metrics: { key: Metric; label: string; unit: string }[] = [
  { key: "registrations", label: "নতুন নিবন্ধন", unit: "জন" },
  { key: "visitors", label: "দর্শনার্থী", unit: "জন" },
  { key: "blogs", label: "ব্লগ জমা", unit: "টি" },
];

const ranges: { days: number; label: string; bucket: Bucket }[] = [
  { days: 7, label: "৭ দিন", bucket: "day" },
  { days: 30, label: "৩০ দিন", bucket: "day" },
  { days: 90, label: "৯০ দিন", bucket: "day" },
  { days: 365, label: "১২ মাস", bucket: "month" },
];

const OTHERS = "Others";
const NO_DIVISION = "__none";
const placeName = (name: string | null) =>
  name === OTHERS ? "অন্যান্য দেশ" : (name ?? "উল্লেখ নেই");

const toMonths = (points: TrendPoint[]) => {
  const months = new Map<string, number>();
  for (const p of points)
    months.set(
      p.date.slice(0, 7),
      (months.get(p.date.slice(0, 7)) ?? 0) + p.count,
    );
  return [...months].map(([date, count]) => ({ date, count }));
};

const sum = (points: TrendPoint[]) =>
  points.reduce((total, p) => total + p.count, 0);

function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex flex-wrap rounded-xl bg-white/50 p-1 ring-1 ring-white/60"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
          className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-all duration-200 ${
            option.value === value
              ? "bg-red-600 text-white shadow-md shadow-red-600/20"
              : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function Panel({
  title,
  subtitle,
  children,
  index = 0,
}: {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
  index?: number;
}) {
  return (
    <section
      className="dash-rise rounded-2xl p-6 transition-shadow duration-300 hover:shadow-[0_16px_40px_rgba(154,51,36,0.12)]"
      style={{ ...glass, animationDelay: `${index * 90}ms` }}
    >
      <h2 className="text-xl font-bold" style={headingStyle}>
        {title}
      </h2>
      {subtitle && <div className="mt-1 text-sm text-slate-600">{subtitle}</div>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return <p className="py-6 text-center text-sm text-slate-500">{children}</p>;
}

function TrendPanel({ trend }: { trend: DashboardAnalyticsData["trend"] }) {
  const [metric, setMetric] = useState<Metric>("registrations");
  const [days, setDays] = useState(30);
  const range = ranges.find((r) => r.days === days)!;
  const { unit, label } = metrics.find((m) => m.key === metric)!;

  const { points, total, previous, best } = useMemo(() => {
    const series = trend[metric];
    const current = series.slice(-days);
    const points = range.bucket === "month" ? toMonths(current) : current;
    return {
      points,
      total: sum(current),
      // Same-length period right before this one (not available for 12 months).
      previous:
        days * 2 <= series.length ? sum(series.slice(-days * 2, -days)) : null,
      best: points.reduce<TrendPoint | null>(
        (top, p) => (p.count > (top?.count ?? 0) ? p : top),
        null,
      ),
    };
  }, [trend, metric, days, range.bucket]);

  const change =
    previous === null || previous === 0
      ? null
      : Math.round(((total - previous) / previous) * 100);
  const average = total / Math.max(points.length, 1);

  return (
    <Panel
      title="প্রবণতা"
      subtitle="চার্টের উপর মাউস রাখুন, অথবা চার্টে ক্লিক করে অ্যারো কী দিয়ে দিন বদলান"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          label="মেট্রিক"
          options={metrics.map((m) => ({ value: m.key, label: m.label }))}
          value={metric}
          onChange={setMetric}
        />
        <Segmented
          label="সময়সীমা"
          options={ranges.map((r) => ({ value: r.days, label: r.label }))}
          value={days}
          onChange={setDays}
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-white/45 p-4 ring-1 ring-white/60">
          <p className="text-xs font-semibold text-slate-500">
            {label} · গত {range.label}
          </p>
          <p className="mt-1 text-3xl font-black text-slate-900">
            {bn(total)}{" "}
            <span className="text-sm font-semibold text-slate-500">{unit}</span>
          </p>
          {previous !== null && (
            <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-600">
              {change !== null &&
                change !== 0 &&
                (change > 0 ? (
                  <FiTrendingUp className="text-emerald-600" aria-hidden="true" />
                ) : (
                  <FiTrendingDown className="text-red-600" aria-hidden="true" />
                ))}
              {change === null
                ? `আগের ${range.label}: ${bn(previous)}`
                : `আগের ${range.label}ের তুলনায় ${change > 0 ? "+" : ""}${bn(change)}%`}
            </p>
          )}
        </div>
        <div className="rounded-xl bg-white/45 p-4 ring-1 ring-white/60">
          <p className="text-xs font-semibold text-slate-500">
            {range.bucket === "month" ? "মাসিক গড়" : "দৈনিক গড়"}
          </p>
          <p className="mt-1 text-3xl font-black text-slate-900">
            {average.toLocaleString("bn-BD", { maximumFractionDigits: 1 })}
          </p>
        </div>
        <div className="rounded-xl bg-white/45 p-4 ring-1 ring-white/60">
          <p className="text-xs font-semibold text-slate-500">
            {range.bucket === "month" ? "সবচেয়ে ব্যস্ত মাস" : "সবচেয়ে ব্যস্ত দিন"}
          </p>
          <p className="mt-1 truncate text-lg font-black text-slate-900">
            {best ? formatBucket(best.date, range.bucket).full : "—"}
          </p>
          {best && (
            <p className="text-xs font-semibold text-slate-600">
              {bn(best.count)} {unit}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <TrendChart
          // Remount on change so the line draws in again.
          key={`${metric}-${days}`}
          points={points}
          bucket={range.bucket}
          unit={unit}
          color={CHART_RED}
          label={`${label}, গত ${range.label}: মোট ${bn(total)} ${unit}`}
        />
      </div>

      {metric === "visitors" && (
        <p className="mt-2 text-xs text-slate-500">
          দৈনিক দর্শনার্থীর হিসাব এই ফিচার চালু হওয়ার দিন থেকে শুরু; এর আগের
          দিনগুলো ০ দেখাবে।
        </p>
      )}

      <details className="mt-3 text-sm">
        <summary className="cursor-pointer font-semibold text-slate-600 hover:text-slate-900">
          টেবিল হিসেবে দেখুন
        </summary>
        <div className="mt-2 max-h-64 overflow-y-auto rounded-xl bg-white/50">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-white/90 text-xs text-slate-500">
              <tr>
                <th className="px-4 py-2 font-semibold">
                  {range.bucket === "month" ? "মাস" : "তারিখ"}
                </th>
                <th className="px-4 py-2 text-right font-semibold">{label}</th>
              </tr>
            </thead>
            <tbody>
              {[...points].reverse().map((p) => (
                <tr key={p.date} className="border-t border-slate-200/60">
                  <td className="px-4 py-1.5 text-slate-700">
                    {formatBucket(p.date, range.bucket).full}
                  </td>
                  <td className="px-4 py-1.5 text-right font-semibold text-slate-900">
                    {bn(p.count)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </Panel>
  );
}

export default function DashboardAnalytics({
  analytics,
}: {
  analytics: DashboardAnalyticsData;
}) {
  // Clicking a division in the donut filters the district list.
  const [division, setDivision] = useState<string | null>(null);

  const divisions = analytics.byDivision.map((row) => ({
    key: row.division ?? NO_DIVISION,
    label: placeName(row.division),
    value: row.students,
  }));
  const districts = analytics.byDistrict
    .filter((row) => !division || (row.division ?? NO_DIVISION) === division)
    .map((row) => ({
      label: placeName(row.district),
      note:
        row.district === OTHERS ? undefined : `${placeName(row.division)} বিভাগ`,
      value: row.students,
    }));
  const classes = analytics.byClass.map((row) => ({
    label: bn(row.class),
    full: `শ্রেণি ${bn(row.class)}`,
    value: row.students,
  }));
  const scores = analytics.gameScores.map((row) => ({
    label: bn(row.from),
    full: `স্কোর ${bn(row.from)}–${bn(row.to)}`,
    value: row.students,
  }));
  const players = scores.reduce((total, s) => total + s.value, 0);
  const topClass = classes.reduce<(typeof classes)[number] | null>(
    (top, c) => (c.value > (top?.value ?? 0) ? c : top),
    null,
  );
  const divisionName = divisions.find((d) => d.key === division)?.label;

  return (
    <div className="space-y-6">
      <TrendPanel trend={analytics.trend} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel
          index={1}
          title="বিভাগ অনুযায়ী শিক্ষার্থী"
          subtitle="কোনো বিভাগে ক্লিক করলে জেলার তালিকায় শুধু সেই বিভাগ দেখাবে"
        >
          <DonutChart
            slices={divisions}
            unit="শিক্ষার্থী"
            label="বিভাগ অনুযায়ী শিক্ষার্থী"
            selected={division}
            onSelect={setDivision}
          />
        </Panel>
        <Panel
          index={2}
          title="জেলা অনুযায়ী শিক্ষার্থী"
          subtitle={
            division ? (
              <span className="inline-flex items-center gap-1.5">
                ফিল্টার:
                <button
                  type="button"
                  onClick={() => setDivision(null)}
                  className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-semibold text-white transition-colors hover:bg-red-700"
                  aria-label={`${divisionName} ফিল্টার সরান`}
                >
                  {divisionName} <FiX aria-hidden="true" />
                </button>
              </span>
            ) : (
              "সক্রিয় শিক্ষার্থী, বেশি থেকে কম"
            )
          }
        >
          {districts.length ? (
            <BarList
              // Remount on filter change so the bars grow in again.
              key={division ?? "all"}
              rows={districts}
              unit="জন"
              color={CHART_RED}
              limit={8}
            />
          ) : (
            <Empty>এই বিভাগের কোনো জেলার তথ্য নেই।</Empty>
          )}
        </Panel>
        <Panel
          index={3}
          title="শ্রেণি অনুযায়ী শিক্ষার্থী"
          subtitle={
            topClass
              ? `সবচেয়ে বেশি ${topClass.full}-এ (${bn(topClass.value)} জন)`
              : "কোন শ্রেণির শিক্ষার্থী কতজন"
          }
        >
          {classes.length ? (
            <ColumnChart
              columns={classes}
              unit="জন"
              color={CHART_BRICK}
              label="শ্রেণি অনুযায়ী শিক্ষার্থী"
            />
          ) : (
            <Empty>এখনও কোনো তথ্য নেই।</Empty>
          )}
        </Panel>
        <Panel
          index={4}
          title="গেম স্কোর বণ্টন"
          subtitle={
            players
              ? `${bn(players)} জন খেলোয়াড় · প্রতি ১০ স্কোরে কতজন (০–১০০)`
              : "প্রতি ১০ স্কোরে কতজন শিক্ষার্থী (০–১০০)"
          }
        >
          {players ? (
            <LollipopChart
              columns={scores}
              unit="জন"
              color={CHART_TEAL}
              label="গেম স্কোর বণ্টন"
            />
          ) : (
            <Empty>এখনও কেউ গেম শেষ করেনি।</Empty>
          )}
        </Panel>
      </div>
    </div>
  );
}
