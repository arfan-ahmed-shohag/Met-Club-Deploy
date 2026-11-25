import { useMemo, useState, type ReactNode } from "react";
import { FiTrendingDown, FiTrendingUp } from "react-icons/fi";
import { BarList, ColumnChart, TrendChart } from "./dashboardCharts";
import {
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
  topInstitutions: { institution: string; students: number }[];
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
      className="inline-flex rounded-xl bg-white/50 p-1 ring-1 ring-white/60"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
          className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
            option.value === value
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
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
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl p-6 ${className}`} style={glass}>
      <h2 className="text-xl font-bold" style={headingStyle}>
        {title}
      </h2>
      {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function TrendPanel({ trend }: { trend: DashboardAnalyticsData["trend"] }) {
  const [metric, setMetric] = useState<Metric>("registrations");
  const [days, setDays] = useState(30);
  const range = ranges.find((r) => r.days === days)!;
  const { unit, label } = metrics.find((m) => m.key === metric)!;

  const { points, total, previous } = useMemo(() => {
    const series = trend[metric];
    const current = series.slice(-days);
    return {
      points: range.bucket === "month" ? toMonths(current) : current,
      total: sum(current),
      // Same-length period right before this one (not available for 12 months).
      previous:
        days * 2 <= series.length ? sum(series.slice(-days * 2, -days)) : null,
    };
  }, [trend, metric, days, range.bucket]);

  const change =
    previous === null || previous === 0
      ? null
      : Math.round(((total - previous) / previous) * 100);

  return (
    <Panel
      title="প্রবণতা"
      subtitle="সময়ের সাথে কার্যকলাপ — চার্টের উপর মাউস রাখুন বা অ্যারো কী ব্যবহার করুন"
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

      <div className="mt-5 flex flex-wrap items-end gap-x-4 gap-y-1">
        <p className="text-4xl font-black text-slate-900">
          {bn(total)}{" "}
          <span className="text-base font-semibold text-slate-600">{unit}</span>
        </p>
        <p className="pb-1 text-sm text-slate-600">
          {label} · গত {range.label}
        </p>
        {previous !== null && (
          <p className="flex items-center gap-1 pb-1 text-sm font-semibold text-slate-700">
            {change !== null &&
              change !== 0 &&
              (change > 0 ? (
                <FiTrendingUp className="text-emerald-600" aria-hidden="true" />
              ) : (
                <FiTrendingDown className="text-red-600" aria-hidden="true" />
              ))}
            {change === null
              ? `আগের ${range.label}: ${bn(previous)} ${unit}`
              : `আগের ${range.label}ের তুলনায় ${change > 0 ? "+" : ""}${bn(change)}%`}
          </p>
        )}
      </div>

      <div className="mt-4">
        <TrendChart
          points={points}
          bucket={range.bucket}
          unit={unit}
          label={`${label}, গত ${range.label}: মোট ${bn(total)} ${unit}`}
        />
      </div>

      {metric === "visitors" && (
        <p className="mt-2 text-xs text-slate-500">
          দৈনিক দর্শনার্থীর হিসাব এই ফিচার চালু হওয়ার দিন থেকে শুরু; এর আগের দিনগুলো ০
          দেখাবে।
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
  const divisions = analytics.byDivision.map((row) => ({
    label:
      row.division === "Others" ? "অন্যান্য দেশ" : (row.division ?? "উল্লেখ নেই"),
    value: row.students,
  }));
  const classes = analytics.byClass.map((row) => ({
    label: bn(row.class),
    full: `শ্রেণি ${bn(row.class)}`,
    value: row.students,
  }));
  const institutions = analytics.topInstitutions.map((row) => ({
    label: row.institution,
    value: row.students,
  }));
  const scores = analytics.gameScores.map((row) => ({
    label: bn(row.from),
    full: `স্কোর ${bn(row.from)}–${bn(row.to)}`,
    value: row.students,
  }));
  const playedGame = scores.some((s) => s.value > 0);

  return (
    <div className="space-y-6">
      <TrendPanel trend={analytics.trend} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel
          title="বিভাগ অনুযায়ী শিক্ষার্থী"
          subtitle="সক্রিয় শিক্ষার্থী, বেশি থেকে কম"
        >
          <BarList rows={divisions} unit="জন" />
        </Panel>
        <Panel
          title="শ্রেণি অনুযায়ী শিক্ষার্থী"
          subtitle="কোন শ্রেণির শিক্ষার্থী কতজন"
        >
          {classes.length ? (
            <ColumnChart
              columns={classes}
              unit="জন"
              label="শ্রেণি অনুযায়ী শিক্ষার্থী"
            />
          ) : (
            <p className="py-6 text-center text-sm text-slate-500">
              এখনও কোনো তথ্য নেই।
            </p>
          )}
        </Panel>
        <Panel
          title="শীর্ষ প্রতিষ্ঠান"
          subtitle="সবচেয়ে বেশি শিক্ষার্থী যে প্রতিষ্ঠানগুলো থেকে"
        >
          <BarList rows={institutions} unit="জন" />
        </Panel>
        <Panel
          title="গেম স্কোর বণ্টন"
          subtitle="প্রতি ১০ স্কোরে কতজন শিক্ষার্থী (০–১০০)"
        >
          {playedGame ? (
            <ColumnChart columns={scores} unit="জন" label="গেম স্কোর বণ্টন" />
          ) : (
            <p className="py-6 text-center text-sm text-slate-500">
              এখনও কেউ গেম শেষ করেনি।
            </p>
          )}
        </Panel>
      </div>
    </div>
  );
}
