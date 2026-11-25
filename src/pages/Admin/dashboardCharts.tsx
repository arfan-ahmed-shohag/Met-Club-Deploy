import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import "./dashboard.css";

// Hand-drawn SVG charts for the admin overview (no chart library).
// Each chart uses theme colours from dashboardFormat; text always uses ink
// colours, never the series colour.
import {
  CHART_RED,
  DONUT_RAMP,
  DONUT_REST,
  bn,
  formatBucket,
  type Bucket,
  type TrendPoint,
} from "./dashboardFormat";

const GRID = "rgba(15,23,42,0.08)";
const AXIS_TEXT = "#64748b";
const EMPTY = (
  <p className="py-6 text-center text-sm text-slate-500">এখনও কোনো তথ্য নেই।</p>
);

// Staggered entrance for the i-th mark (capped so long lists don't drag).
const delay = (i: number, step = 45): CSSProperties => ({
  animationDelay: `${Math.min(i, 12) * step}ms`,
});

// Round the axis maximum up to a readable number and return ~4 ticks.
function niceTicks(max: number) {
  if (max <= 4) return [0, 1, 2, 3, 4].slice(0, Math.max(max, 1) + 1);
  const rough = max / 4;
  const power = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 2.5, 5, 10]
    .map((m) => m * power)
    .find((s) => s >= rough)!;
  const top = Math.ceil(max / step) * step;
  return Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step);
}

/**
 * Smooth SVG path through the points (monotone cubic, like d3's
 * curveMonotoneX). Unlike a plain spline it never overshoots: the curve
 * stays between neighbouring values, so counts never dip below 0 and
 * peaks are drawn at their real height.
 */
function smoothPath(xs: number[], ys: number[]) {
  const n = xs.length;
  if (n === 0) return "";
  if (n === 1) return `M${xs[0]},${ys[0]}`;
  if (n === 2) return `M${xs[0]},${ys[0]}L${xs[1]},${ys[1]}`;

  const slope = (i: number) => (ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i] || 1);
  const secants = Array.from({ length: n - 1 }, (_, i) => slope(i));
  const tangents = xs.map((_, i) => {
    if (i === 0) return secants[0];
    if (i === n - 1) return secants[n - 2];
    const a = secants[i - 1];
    const b = secants[i];
    // Flat at local peaks/valleys; otherwise a weighted harmonic mean.
    if (a * b <= 0) return 0;
    const h0 = xs[i] - xs[i - 1];
    const h1 = xs[i + 1] - xs[i];
    return (3 * (h0 + h1)) / ((2 * h1 + h0) / a + (h1 + 2 * h0) / b);
  });

  let d = `M${xs[0]},${ys[0]}`;
  for (let i = 0; i < n - 1; i++) {
    const dx = (xs[i + 1] - xs[i]) / 3;
    d += `C${xs[i] + dx},${ys[i] + dx * tangents[i]} ${xs[i + 1] - dx},${ys[i + 1] - dx * tangents[i + 1]} ${xs[i + 1]},${ys[i + 1]}`;
  }
  return d;
}

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.floor(entry.contentRect.width)),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return [ref, width] as const;
}

function Tooltip({
  x,
  y,
  width,
  value,
  label,
}: {
  x: number;
  y: number;
  width: number;
  value: string;
  label: string;
}) {
  // Keep the box inside the chart: flip to the left near the right edge.
  const flip = x > width - 150;
  return (
    <div
      className="pointer-events-none absolute z-10 rounded-lg bg-white px-3 py-2 text-left shadow-lg ring-1 ring-slate-200"
      style={{
        left: flip ? x - 12 : x + 12,
        top: Math.max(y - 20, 0),
        transform: flip ? "translateX(-100%)" : undefined,
      }}
    >
      <p className="text-base font-black text-slate-900">{value}</p>
      <p className="whitespace-nowrap text-xs font-medium text-slate-500">
        {label}
      </p>
    </div>
  );
}

function YGrid({
  ticks,
  y,
  left,
  right,
}: {
  ticks: number[];
  y: (value: number) => number;
  left: number;
  right: number;
}) {
  return ticks.map((tick) => (
    <g key={tick}>
      <line x1={left} x2={right} y1={y(tick)} y2={y(tick)} stroke={GRID} />
      <text
        x={left - 8}
        y={y(tick)}
        dy="0.32em"
        textAnchor="end"
        fontSize={11}
        fill={AXIS_TEXT}
      >
        {bn(tick)}
      </text>
    </g>
  ));
}

/** Area + line chart with a crosshair and tooltip (pointer and arrow keys). */
export function TrendChart({
  points,
  bucket,
  unit,
  label,
  color = CHART_RED,
}: {
  points: TrendPoint[];
  bucket: Bucket;
  unit: string;
  label: string;
  color?: string;
}) {
  const [containerRef, width] = useWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const gradientId = useId();
  const height = 260;
  const pad = { top: 16, right: 16, bottom: 30, left: 40 };
  const innerWidth = Math.max(width - pad.left - pad.right, 0);
  const innerHeight = height - pad.top - pad.bottom;

  const ticks = useMemo(
    () => niceTicks(Math.max(0, ...points.map((p) => p.count))),
    [points],
  );
  const top = ticks[ticks.length - 1] || 1;
  const x = (i: number) =>
    pad.left +
    (points.length > 1
      ? (i / (points.length - 1)) * innerWidth
      : innerWidth / 2);
  const y = (value: number) =>
    pad.top + innerHeight - (value / top) * innerHeight;

  const line = smoothPath(
    points.map((_, i) => x(i)),
    points.map((p) => y(p.count)),
  );
  const area = points.length
    ? `${line}L${x(points.length - 1)},${y(0)}L${x(0)},${y(0)}Z`
    : "";
  const labelEvery = Math.max(
    1,
    Math.ceil(points.length / Math.max(2, Math.floor(innerWidth / 80))),
  );
  // The busiest point gets a small marker so the peak is easy to spot.
  const peak = points.reduce(
    (best, p, i) => (p.count > (points[best]?.count ?? -1) ? i : best),
    0,
  );

  const pick = (event: PointerEvent<SVGRectElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / Math.max(rect.width, 1);
    setActive(Math.round(ratio * (points.length - 1)));
  };
  const onKey = (event: KeyboardEvent<SVGSVGElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const step = event.key === "ArrowRight" ? 1 : -1;
    setActive((current) =>
      Math.min(
        Math.max((current ?? points.length - 1) + step, 0),
        points.length - 1,
      ),
    );
  };

  const point = active === null ? null : points[active];

  return (
    <div ref={containerRef} className="relative w-full">
      {width > 0 && (
        <svg
          width={width}
          height={height}
          role="img"
          aria-label={label}
          tabIndex={0}
          onKeyDown={onKey}
          onFocus={() => setActive((current) => current ?? points.length - 1)}
          onBlur={() => setActive(null)}
          className="block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.24} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <YGrid
            ticks={ticks}
            y={y}
            left={pad.left}
            right={width - pad.right}
          />
          {points.map((p, i) =>
            i % labelEvery === 0 ? (
              <text
                key={p.date}
                x={x(i)}
                y={height - 8}
                // Keep the first and last labels inside the chart.
                textAnchor={
                  i === 0
                    ? "start"
                    : x(i) > width - pad.right - 30
                      ? "end"
                      : "middle"
                }
                fontSize={11}
                fill={AXIS_TEXT}
              >
                {formatBucket(p.date, bucket).short}
              </text>
            ) : null,
          )}
          <path d={area} fill={`url(#${gradientId})`} className="dash-fade" />
          <path
            d={line}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            pathLength={1}
            className="dash-draw"
          />
          {points[peak]?.count > 0 && active === null && (
            <circle
              cx={x(peak)}
              cy={y(points[peak].count)}
              r={4}
              fill="white"
              stroke={color}
              strokeWidth={2}
              className="dash-pop"
              style={{ animationDelay: "700ms" }}
            />
          )}
          {point && active !== null && (
            <g>
              <line
                x1={x(active)}
                x2={x(active)}
                y1={pad.top}
                y2={pad.top + innerHeight}
                stroke="#94a3b8"
                strokeDasharray="3 3"
              />
              <circle
                cx={x(active)}
                cy={y(point.count)}
                r={5}
                fill={color}
                stroke="white"
                strokeWidth={2}
              />
            </g>
          )}
          <rect
            x={pad.left}
            y={pad.top}
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            onPointerMove={pick}
            onPointerDown={pick}
            onPointerLeave={() => setActive(null)}
          />
        </svg>
      )}
      {point && active !== null && (
        <Tooltip
          x={x(active)}
          y={y(point.count)}
          width={width}
          value={`${bn(point.count)} ${unit}`}
          label={formatBucket(point.date, bucket).full}
        />
      )}
    </div>
  );
}

/** Ranked horizontal bars with the value at the end and a share tooltip. */
export function BarList({
  rows,
  unit,
  color = CHART_RED,
  limit = rows.length,
}: {
  rows: { label: string; value: number; note?: string }[];
  unit: string;
  color?: string;
  limit?: number;
}) {
  const [active, setActive] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const max = Math.max(1, ...rows.map((row) => row.value));
  const total = rows.reduce((sum, row) => sum + row.value, 0) || 1;
  const visible = showAll ? rows : rows.slice(0, limit);

  if (!rows.length) return EMPTY;

  return (
    <div>
      <ul className="space-y-2.5">
        {visible.map((row, i) => (
          <li
            key={row.label}
            className="relative"
            onPointerEnter={() => setActive(i)}
            onPointerLeave={() => setActive(null)}
          >
            <button
              type="button"
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="grid w-full grid-cols-[1.25rem_minmax(0,6rem)_1fr_auto] items-center gap-2 sm:grid-cols-[1.5rem_minmax(0,8.5rem)_1fr_auto] sm:gap-2.5 rounded-md text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              aria-label={`${row.label}: ${bn(row.value)} ${unit}`}
            >
              <span className="text-right text-xs font-bold text-slate-400">
                {bn(i + 1)}
              </span>
              <span className="truncate text-sm font-semibold text-slate-700">
                {row.label}
              </span>
              <span className="h-3 overflow-hidden rounded-full bg-slate-900/5">
                <span
                  className="dash-grow-x block h-full rounded-full transition-opacity duration-300"
                  style={{
                    width: `${Math.max((row.value / max) * 100, row.value ? 2 : 0)}%`,
                    background: color,
                    opacity: active === null || active === i ? 1 : 0.4,
                    ...delay(i),
                  }}
                />
              </span>
              <span className="min-w-8 text-right text-sm font-bold text-slate-900">
                {bn(row.value)}
              </span>
            </button>
            {active === i && (
              <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 max-w-[90%] -translate-x-1/2 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-lg ring-1 ring-slate-200">
                <strong className="text-slate-900">
                  {bn(row.value)} {unit}
                </strong>{" "}
                · মোটের {bn(Math.round((row.value / total) * 100))}%
                <span className="block truncate">
                  {row.label}
                  {row.note ? ` · ${row.note}` : ""}
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>
      {rows.length > limit && (
        <button
          type="button"
          onClick={() => setShowAll((value) => !value)}
          className="mt-4 w-full rounded-xl bg-white/50 py-2 text-sm font-semibold text-red-700 ring-1 ring-white/60 transition-colors hover:bg-white/80"
        >
          {showAll
            ? "কম দেখুন"
            : `সব ${bn(rows.length)}টি দেখুন (আরও ${bn(rows.length - limit)}টি)`}
        </button>
      )}
    </div>
  );
}

type Column = { label: string; full: string; value: number };

function useColumns(columns: Column[], width: number, height: number) {
  const pad = { top: 16, right: 8, bottom: 26, left: 36 };
  const innerWidth = Math.max(width - pad.left - pad.right, 0);
  const innerHeight = height - pad.top - pad.bottom;
  const ticks = niceTicks(Math.max(0, ...columns.map((c) => c.value)));
  const top = ticks[ticks.length - 1] || 1;
  const slot = columns.length ? innerWidth / columns.length : 0;
  const y = (value: number) =>
    pad.top + innerHeight - (value / top) * innerHeight;
  const cx = (i: number) => pad.left + slot * i + slot / 2;
  return { pad, innerHeight, ticks, slot, y, cx };
}

// Hover/focus wrapper for one column: the whole slot is the hit target.
function ColumnSlot({
  column,
  unit,
  index,
  setActive,
  x,
  y,
  width,
  height,
  children,
}: {
  column: Column;
  unit: string;
  index: number;
  setActive: (index: number | null) => void;
  x: number;
  y: number;
  width: number;
  height: number;
  children: ReactNode;
}) {
  return (
    <g
      tabIndex={0}
      role="button"
      aria-label={`${column.full}: ${bn(column.value)} ${unit}`}
      onPointerEnter={() => setActive(index)}
      onPointerLeave={() => setActive(null)}
      onFocus={() => setActive(index)}
      onBlur={() => setActive(null)}
      className="cursor-pointer focus:outline-none"
    >
      <rect x={x} y={y} width={width} height={height} fill="transparent" />
      {children}
    </g>
  );
}

/** Vertical bars (distribution) with a per-bar hover/focus tooltip. */
export function ColumnChart({
  columns,
  unit,
  label,
  color = CHART_RED,
}: {
  columns: Column[];
  unit: string;
  label: string;
  color?: string;
}) {
  const [containerRef, width] = useWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const height = 230;
  const { pad, innerHeight, ticks, slot, y, cx } = useColumns(
    columns,
    width,
    height,
  );
  const barWidth = Math.max(Math.min(slot - 6, 40), 2);
  const column = active === null ? null : columns[active];

  return (
    <div ref={containerRef} className="relative w-full">
      {width > 0 && (
        <svg
          width={width}
          height={height}
          role="img"
          aria-label={label}
          className="block"
        >
          <YGrid
            ticks={ticks}
            y={y}
            left={pad.left}
            right={width - pad.right}
          />
          {columns.map((c, i) => {
            const barHeight = Math.max(y(0) - y(c.value), c.value ? 2 : 0);
            const r = Math.min(5, barWidth / 2, barHeight);
            const x0 = cx(i) - barWidth / 2;
            const y0 = y(0) - barHeight;
            return (
              <ColumnSlot
                key={c.label}
                column={c}
                unit={unit}
                index={i}
                setActive={setActive}
                x={pad.left + slot * i}
                y={pad.top}
                width={slot}
                height={innerHeight}
              >
                {active === i && (
                  <rect
                    x={pad.left + slot * i + 1}
                    y={pad.top}
                    width={slot - 2}
                    height={innerHeight}
                    rx={6}
                    fill={color}
                    opacity={0.06}
                  />
                )}
                {barHeight > 0 && (
                  <path
                    d={`M${x0},${y(0)}V${y0 + r}Q${x0},${y0} ${x0 + r},${y0}H${x0 + barWidth - r}Q${x0 + barWidth},${y0} ${x0 + barWidth},${y0 + r}V${y(0)}Z`}
                    fill={color}
                    opacity={active === null || active === i ? 1 : 0.4}
                    className="dash-grow-y transition-opacity duration-300"
                    style={delay(i, 60)}
                  />
                )}
                <text
                  x={cx(i)}
                  y={height - 8}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={active === i ? 700 : 400}
                  fill={active === i ? "#0f172a" : AXIS_TEXT}
                >
                  {c.label}
                </text>
              </ColumnSlot>
            );
          })}
        </svg>
      )}
      {column && active !== null && (
        <Tooltip
          x={cx(active)}
          y={y(column.value)}
          width={width}
          value={`${bn(column.value)} ${unit}`}
          label={column.full}
        />
      )}
    </div>
  );
}

/** Lollipop chart: a thin stem and a round head per bucket. */
export function LollipopChart({
  columns,
  unit,
  label,
  color = CHART_RED,
}: {
  columns: Column[];
  unit: string;
  label: string;
  color?: string;
}) {
  const [containerRef, width] = useWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const height = 230;
  const { pad, innerHeight, ticks, slot, y, cx } = useColumns(
    columns,
    width,
    height,
  );
  const column = active === null ? null : columns[active];

  return (
    <div ref={containerRef} className="relative w-full">
      {width > 0 && (
        <svg
          width={width}
          height={height}
          role="img"
          aria-label={label}
          className="block"
        >
          <YGrid
            ticks={ticks}
            y={y}
            left={pad.left}
            right={width - pad.right}
          />
          {columns.map((c, i) => {
            const isActive = active === i;
            return (
              <ColumnSlot
                key={c.label}
                column={c}
                unit={unit}
                index={i}
                setActive={setActive}
                x={pad.left + slot * i}
                y={pad.top}
                width={slot}
                height={innerHeight}
              >
                {c.value > 0 && (
                  <>
                    <line
                      x1={cx(i)}
                      x2={cx(i)}
                      y1={y(0)}
                      y2={y(c.value)}
                      stroke={color}
                      strokeWidth={isActive ? 3 : 2}
                      strokeLinecap="round"
                      opacity={active === null || isActive ? 1 : 0.35}
                      className="dash-grow-y"
                      style={delay(i, 60)}
                    />
                    <circle
                      cx={cx(i)}
                      cy={y(c.value)}
                      r={isActive ? 9 : 7}
                      fill={color}
                      stroke="white"
                      strokeWidth={2}
                      opacity={active === null || isActive ? 1 : 0.35}
                      className="dash-pop transition-[r] duration-200"
                      style={{
                        animationDelay: `${300 + Math.min(i, 12) * 60}ms`,
                      }}
                    />
                  </>
                )}
                {c.value === 0 && (
                  <circle cx={cx(i)} cy={y(0)} r={3} fill="#cbd5e1" />
                )}
                <text
                  x={cx(i)}
                  y={height - 8}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={isActive ? 700 : 400}
                  fill={isActive ? "#0f172a" : AXIS_TEXT}
                >
                  {c.label}
                </text>
              </ColumnSlot>
            );
          })}
        </svg>
      )}
      {column && active !== null && (
        <Tooltip
          x={cx(active)}
          y={y(column.value)}
          width={width}
          value={`${bn(column.value)} ${unit}`}
          label={column.full}
        />
      )}
    </div>
  );
}

const TAU = Math.PI * 2;

// SVG path for a ring segment from angle a0 to a1 (radians, 0 = 12 o'clock).
function arcPath(a0: number, a1: number, outer: number, inner: number): string {
  const point = (angle: number, radius: number) =>
    `${radius * Math.sin(angle)},${-radius * Math.cos(angle)}`;
  // A full circle can't be one arc: split it in two halves.
  if (a1 - a0 >= TAU - 1e-6)
    return `${arcPath(0, Math.PI, outer, inner)}${arcPath(Math.PI, TAU, outer, inner)}`;
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M${point(a0, outer)}A${outer},${outer} 0 ${large} 1 ${point(a1, outer)}L${point(a1, inner)}A${inner},${inner} 0 ${large} 0 ${point(a0, inner)}Z`;
}

export type DonutSlice = { key: string; label: string; value: number };

/**
 * Donut with a synced legend. Shows the top slices in the theme ramp and
 * folds the rest into one sand slice. Hover/focus highlights a slice and
 * shows it in the centre; clicking selects it (onSelect).
 */
export function DonutChart({
  slices,
  unit,
  label,
  maxSlices = DONUT_RAMP.length,
  selected,
  onSelect,
}: {
  slices: DonutSlice[];
  unit: string;
  label: string;
  maxSlices?: number;
  selected?: string | null;
  onSelect?: (key: string | null) => void;
}) {
  const [active, setActive] = useState<string | null>(null);
  const shown = useMemo(() => {
    const sorted = [...slices].sort((a, b) => b.value - a.value);
    if (sorted.length <= maxSlices)
      return sorted.map((s, i) => ({
        ...s,
        color: DONUT_RAMP[i],
        rest: false,
      }));
    const top = sorted.slice(0, maxSlices - 1);
    const rest = sorted.slice(maxSlices - 1);
    return [
      ...top.map((s, i) => ({ ...s, color: DONUT_RAMP[i], rest: false })),
      {
        key: "__rest",
        label: `বাকি ${bn(rest.length)}টি`,
        value: rest.reduce((sum, s) => sum + s.value, 0),
        color: DONUT_REST,
        rest: true,
      },
    ];
  }, [slices, maxSlices]);
  const total = shown.reduce((sum, s) => sum + s.value, 0);

  if (!total) return EMPTY;

  const focus = active ?? selected ?? null;
  const focused = shown.find((s) => s.key === focus);
  const size = 210;
  const outer = size / 2 - 8;
  const inner = outer * 0.62;
  // Each slice starts where the previous ones end.
  const arcs = shown.map((s, i) => {
    const before = shown.slice(0, i).reduce((acc, p) => acc + p.value, 0);
    return {
      ...s,
      a0: (before / total) * TAU,
      a1: ((before + s.value) / total) * TAU,
    };
  });
  const toggle = (key: string, rest: boolean) =>
    !rest && onSelect?.(selected === key ? null : key);

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg
          viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}
          width={size}
          height={size}
          role="img"
          aria-label={label}
          className="dash-pop"
        >
          {arcs.map((s) => {
            const mid = (s.a0 + s.a1) / 2;
            const lift = focus === s.key ? 6 : 0;
            return (
              <path
                key={s.key}
                d={arcPath(s.a0, s.a1, outer, inner)}
                fill={s.color}
                stroke="white"
                strokeWidth={2}
                opacity={focus === null || focus === s.key ? 1 : 0.35}
                transform={`translate(${lift * Math.sin(mid)},${-lift * Math.cos(mid)})`}
                className={`transition-[transform,opacity] duration-300 ${s.rest ? "" : "cursor-pointer"}`}
                onPointerEnter={() => setActive(s.key)}
                onPointerLeave={() => setActive(null)}
                onClick={() => toggle(s.key, s.rest)}
              />
            );
          })}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-3xl font-black text-slate-900">
            {bn(focused ? focused.value : total)}
          </p>
          <p className="max-w-[7.5rem] truncate text-xs font-semibold text-slate-600">
            {focused
              ? `${focused.label} · ${bn(Math.round((focused.value / total) * 100))}%`
              : `মোট ${unit}`}
          </p>
        </div>
      </div>
      <ul className="w-full min-w-0 flex-1 space-y-1.5">
        {arcs.map((s) => (
          <li key={s.key}>
            <button
              type="button"
              disabled={s.rest || !onSelect}
              aria-pressed={selected === s.key}
              onPointerEnter={() => setActive(s.key)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(s.key)}
              onBlur={() => setActive(null)}
              onClick={() => toggle(s.key, s.rest)}
              className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors enabled:hover:bg-white/60 disabled:cursor-default ${
                selected === s.key ? "bg-white/80 ring-1 ring-red-200" : ""
              }`}
            >
              <span
                className="h-3 w-3 shrink-0 rounded-sm"
                style={{ background: s.color }}
              />
              <span className="min-w-0 flex-1 truncate font-semibold text-slate-700">
                {s.label}
              </span>
              <span className="font-bold text-slate-900">{bn(s.value)}</span>
              <span className="w-10 text-right text-xs text-slate-500">
                {bn(Math.round((s.value / total) * 100))}%
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
