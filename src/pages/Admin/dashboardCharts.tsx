import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

// Hand-drawn SVG charts for the admin overview (no chart library).
// Colours follow one hue per chart; text always uses ink colours.
import {
  CHART_BLUE,
  bn,
  formatBucket,
  type Bucket,
  type TrendPoint,
} from "./dashboardFormat";
const GRID = "rgba(15,23,42,0.08)";
const AXIS_TEXT = "#64748b";

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
  const left = x > width - 150 ? x - 12 : x + 12;
  return (
    <div
      className="pointer-events-none absolute z-10 rounded-lg bg-white px-3 py-2 text-left shadow-lg ring-1 ring-slate-200"
      style={{
        left,
        top: Math.max(y - 20, 0),
        transform: x > width - 150 ? "translateX(-100%)" : undefined,
      }}
    >
      <p className="text-base font-black text-slate-900">{value}</p>
      <p className="whitespace-nowrap text-xs font-medium text-slate-500">
        {label}
      </p>
    </div>
  );
}

/** Area + line chart with a crosshair and tooltip (pointer and arrow keys). */
export function TrendChart({
  points,
  bucket,
  unit,
  label,
}: {
  points: TrendPoint[];
  bucket: Bucket;
  unit: string;
  label: string;
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

  const line = points
    .map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p.count)}`)
    .join("");
  const area = points.length
    ? `${line}L${x(points.length - 1)},${y(0)}L${x(0)},${y(0)}Z`
    : "";
  const labelEvery = Math.max(
    1,
    Math.ceil(points.length / Math.max(2, Math.floor(innerWidth / 80))),
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
              <stop offset="0%" stopColor={CHART_BLUE} stopOpacity={0.22} />
              <stop offset="100%" stopColor={CHART_BLUE} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          {ticks.map((tick) => (
            <g key={tick}>
              <line
                x1={pad.left}
                x2={width - pad.right}
                y1={y(tick)}
                y2={y(tick)}
                stroke={GRID}
              />
              <text
                x={pad.left - 8}
                y={y(tick)}
                dy="0.32em"
                textAnchor="end"
                fontSize={11}
                fill={AXIS_TEXT}
              >
                {bn(tick)}
              </text>
            </g>
          ))}
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
          <path d={area} fill={`url(#${gradientId})`} />
          <path
            d={line}
            fill="none"
            stroke={CHART_BLUE}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
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
                fill={CHART_BLUE}
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
}: {
  rows: { label: string; value: number }[];
  unit: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(1, ...rows.map((row) => row.value));
  const total = rows.reduce((sum, row) => sum + row.value, 0) || 1;

  if (!rows.length)
    return (
      <p className="py-6 text-center text-sm text-slate-500">
        এখনও কোনো তথ্য নেই।
      </p>
    );

  return (
    <ul className="space-y-2.5">
      {rows.map((row, i) => (
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
            className="grid w-full grid-cols-[minmax(0,10rem)_1fr_auto] items-center gap-3 rounded-md text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            aria-label={`${row.label}: ${bn(row.value)} ${unit}`}
          >
            <span className="truncate text-sm font-semibold text-slate-700">
              {row.label}
            </span>
            <span className="h-3 rounded-full bg-slate-900/5">
              <span
                className="block h-full rounded-full transition-[width,opacity] duration-500 motion-reduce:transition-none"
                style={{
                  width: `${Math.max((row.value / max) * 100, row.value ? 2 : 0)}%`,
                  background: CHART_BLUE,
                  opacity: active === null || active === i ? 1 : 0.45,
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
              <span className="block truncate">{row.label}</span>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

/** Vertical bars (distribution) with a per-bar hover/focus tooltip. */
export function ColumnChart({
  columns,
  unit,
  label,
}: {
  columns: { label: string; full: string; value: number }[];
  unit: string;
  label: string;
}) {
  const [containerRef, width] = useWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const height = 220;
  const pad = { top: 12, right: 8, bottom: 26, left: 36 };
  const innerWidth = Math.max(width - pad.left - pad.right, 0);
  const innerHeight = height - pad.top - pad.bottom;
  const ticks = niceTicks(Math.max(0, ...columns.map((c) => c.value)));
  const top = ticks[ticks.length - 1] || 1;
  const slot = columns.length ? innerWidth / columns.length : 0;
  const barWidth = Math.max(Math.min(slot - 2, 36), 2);
  const y = (value: number) =>
    pad.top + innerHeight - (value / top) * innerHeight;

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
          {ticks.map((tick) => (
            <g key={tick}>
              <line
                x1={pad.left}
                x2={width - pad.right}
                y1={y(tick)}
                y2={y(tick)}
                stroke={GRID}
              />
              <text
                x={pad.left - 8}
                y={y(tick)}
                dy="0.32em"
                textAnchor="end"
                fontSize={11}
                fill={AXIS_TEXT}
              >
                {bn(tick)}
              </text>
            </g>
          ))}
          {columns.map((c, i) => {
            const cx = pad.left + slot * i + slot / 2;
            const barHeight = Math.max(y(0) - y(c.value), c.value ? 2 : 0);
            const r = Math.min(4, barWidth / 2, barHeight);
            const x0 = cx - barWidth / 2;
            const y0 = y(0) - barHeight;
            return (
              <g
                key={c.label}
                tabIndex={0}
                role="button"
                aria-label={`${c.full}: ${bn(c.value)} ${unit}`}
                onPointerEnter={() => setActive(i)}
                onPointerLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="focus:outline-none"
              >
                {/* Hit target spans the whole slot, taller than the bar. */}
                <rect
                  x={pad.left + slot * i}
                  y={pad.top}
                  width={slot}
                  height={innerHeight}
                  fill="transparent"
                />
                {barHeight > 0 && (
                  <path
                    d={`M${x0},${y(0)}V${y0 + r}Q${x0},${y0} ${x0 + r},${y0}H${x0 + barWidth - r}Q${x0 + barWidth},${y0} ${x0 + barWidth},${y0 + r}V${y(0)}Z`}
                    fill={CHART_BLUE}
                    opacity={active === null || active === i ? 1 : 0.45}
                  />
                )}
                <text
                  x={cx}
                  y={height - 8}
                  textAnchor="middle"
                  fontSize={11}
                  fill={AXIS_TEXT}
                >
                  {c.label}
                </text>
              </g>
            );
          })}
        </svg>
      )}
      {column && active !== null && (
        <Tooltip
          x={pad.left + slot * active + slot / 2}
          y={y(column.value)}
          width={width}
          value={`${bn(column.value)} ${unit}`}
          label={column.full}
        />
      )}
    </div>
  );
}
