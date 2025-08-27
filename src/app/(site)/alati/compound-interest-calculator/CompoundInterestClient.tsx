// src/app/(site)/alati/compound-interest/CompoundInterestClient.tsx
"use client";

import * as React from "react";
import Container from "@/components/Container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Row = {
  year: number;
  total: number;
  principal: number;
  interest: number;
};

const fmt = new Intl.NumberFormat("hr-HR", { style: "currency", currency: "EUR" });

export default function CompoundInterestClient() {
  const [principal, setPrincipal] = React.useState(1000);
  const [monthly, setMonthly] = React.useState(100);
  const [years, setYears] = React.useState(10);
  const [rate, setRate] = React.useState(5);
  const [results, setResults] = React.useState<Row[]>([]);
  const [ran, setRan] = React.useState(false);

  function calculate() {
    const rMonthly = rate / 100 / 12; // mjesečna stopa
    let balance = principal;
    let paidPrincipal = principal;
    const rows: Row[] = [];

    for (let y = 1; y <= years; y++) {
      for (let m = 0; m < 12; m++) {
        balance = balance * (1 + rMonthly) + monthly;
        paidPrincipal += monthly;
      }
      rows.push({
        year: y,
        total: balance,
        principal: paidPrincipal,
        interest: balance - paidPrincipal,
      });
    }
    setResults(rows);
    setRan(true);
  }

  // auto-calc on first mount
  React.useEffect(() => {
    calculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const last = results.at(-1);
  const summary = last
    ? { total: last.total, principal: last.principal, interest: last.interest }
    : null;

  return (
    <Container className="py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Kalkulator složene kamate
          </h1>
          <p className="text-sm text-gray-500">
            Prikaži rast štednje ili investicija kroz vrijeme (mjesečno kapitaliziranje).
          </p>
        </div>

        {/* Form */}
        <Card className="p-6 md:p-8 bg-white/60 dark:bg-black/40 backdrop-blur border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Početni iznos (€)" value={principal} min={0} step={100} onChange={setPrincipal} />
            <Field label="Mjesečna uplata (€)" value={monthly} min={0} step={10} onChange={setMonthly} />
            <Field label="Godine" value={years} min={1} max={60} step={1} onChange={setYears} />
            <Field label="Godišnja kamata (%)" value={rate} min={0} max={50} step={0.1} onChange={setRate} />
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={calculate} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
              Izračunaj
            </Button>
          </div>
        </Card>

        {/* Summary */}
        {summary && (
          <Card className="mt-6 p-6 bg-white/60 dark:bg-black/40 backdrop-blur border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
              Sažetak nakon {years} {years === 1 ? "godine" : "godina"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <Stat label="Ukupno" value={fmt.format(summary.total)} />
              <Stat label="Uplaćeno (glavnica)" value={fmt.format(summary.principal)} />
              <Stat label="Zarađena kamata" value={fmt.format(summary.interest)} positive />
            </div>
          </Card>
        )}

        {/* Visualization */}
        {ran && results.length > 0 && (
          <Card className="mt-6 p-6 bg-white/60 dark:bg-black/40 backdrop-blur border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Vizualizacija rasta (godišnje)
            </h3>
            <StackedAreaChart
              data={results.map((r) => ({
                x: r.year,
                principal: r.principal,
                interest: r.interest,
                total: r.total,
              }))}
              height={280}
            />
            <Legend />
          </Card>
        )}

        {/* Table */}
        {ran && results.length > 0 && (
          <Card className="mt-6 p-6 bg-white/60 dark:bg-black/40 backdrop-blur border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-200 dark:border-gray-800">
                  <th className="py-2 pr-3">Godina</th>
                  <th className="py-2 pr-3">Ukupno</th>
                  <th className="py-2 pr-3">Glavnica</th>
                  <th className="py-2">Kamata</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.year} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 pr-3">{r.year}</td>
                    <td className="py-2 pr-3 font-medium">{fmt.format(r.total)}</td>
                    <td className="py-2 pr-3 text-gray-600">{fmt.format(r.principal)}</td>
                    <td className="py-2 text-emerald-600">{fmt.format(r.interest)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </Container>
  );
}

/* --------------------------------- UI bits -------------------------------- */

function Field({
  label,
  value,
  onChange,
  min,
  max,
  step,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1">{label}</span>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
      />
    </label>
  );
}

function Stat({ label, value, positive = false }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 p-3">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className={`mt-1 text-base font-medium ${positive ? "text-emerald-600" : ""}`}>{value}</div>
    </div>
  );
}

/* --------------------------- SVG Chart (no deps) --------------------------- */

type ChartPoint = { x: number; principal: number; interest: number; total: number };

function StackedAreaChart({ data, height = 280 }: { data: ChartPoint[]; height?: number }) {
  const [hoverIdx, setHoverIdx] = React.useState<number | null>(null);

  // padding around plot area
  const PAD = { t: 16, r: 16, b: 28, l: 44 };
  const width = 760; // will scale with container via viewBox + CSS
  const plotW = width - PAD.l - PAD.r;
  const plotH = height - PAD.t - PAD.b;

  const xs = data.map((d) => d.x);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);

  const maxY = Math.max(...data.map((d) => d.total)) * 1.05; // headroom

  const xScale = (x: number) => PAD.l + ((x - minX) / (maxX - minX || 1)) * plotW;
  const yScale = (y: number) => PAD.t + plotH - (y / (maxY || 1)) * plotH;

  // Build stacked areas: principal (bottom), interest (above principal), and a total line
  const principalPath = pathFromPoints(data.map((d) => [xScale(d.x), yScale(d.principal)]), plotH, PAD, "area");
  const interestTop = data.map((d) => [xScale(d.x), yScale(d.principal + d.interest)] as const);
  const interestBase = data.map((d) => [xScale(d.x), yScale(d.principal)] as const);
  const interestPath = stackedAreaPath(interestTop, interestBase, PAD);

  const totalLine = pathFromPoints(data.map((d) => [xScale(d.x), yScale(d.total)]), plotH, PAD, "line");

  // ticks
  const yTicks = 4;
  const yTickVals = Array.from({ length: yTicks + 1 }, (_, i) => (i * maxY) / yTicks);

  // hover (nearest x)
  function onMove(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    const rect = (e.target as SVGElement).closest("svg")!.getBoundingClientRect();
    const xPx = e.clientX - rect.left;
    // find nearest x
    let nearest = 0;
    let best = Infinity;
    data.forEach((d, i) => {
      const dx = Math.abs(xScale(d.x) - xPx);
      if (dx < best) {
        best = dx;
        nearest = i;
      }
    });
    setHoverIdx(nearest);
  }

  const hover = hoverIdx != null ? data[hoverIdx] : null;

  return (
    <div className="relative w-full">
      {/* Tooltip */}
      {hover && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-xs shadow"
          style={{
            left: `${((xScale(hover.x) / width) * 100).toFixed(3)}%`,
            top: 0,
          }}
        >
          <div className="font-medium">Godina {hover.x}</div>
          <div className="text-gray-600 dark:text-gray-300">Ukupno: {fmt.format(hover.total)}</div>
          <div className="text-indigo-600">Glavnica: {fmt.format(hover.principal)}</div>
          <div className="text-emerald-600">Kamata: {fmt.format(hover.interest)}</div>
        </div>
      )}

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        onMouseMove={onMove}
        onMouseLeave={() => setHoverIdx(null)}
      >
        {/* axes grid */}
        {yTickVals.map((v, i) => (
          <g key={i}>
            <line
              x1={PAD.l}
              x2={width - PAD.r}
              y1={yScale(v)}
              y2={yScale(v)}
              className="stroke-gray-200 dark:stroke-gray-800"
              strokeDasharray="3 3"
            />
            <text
              x={PAD.l - 8}
              y={yScale(v)}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-gray-500 text-[10px]"
            >
              {fmt.format(v)}
            </text>
          </g>
        ))}

        {/* areas */}
        <path d={principalPath} fill="rgba(79,70,229,0.18)" stroke="none" />
        <path d={interestPath} fill="rgba(16,185,129,0.18)" stroke="none" />

        {/* total line */}
        <path d={totalLine} fill="none" stroke="currentColor" className="text-gray-700 dark:text-gray-200" strokeWidth={2} />

        {/* hover crosshair */}
        {hover && (
          <>
            <line
              x1={xScale(hover.x)}
              x2={xScale(hover.x)}
              y1={PAD.t}
              y2={PAD.t + plotH}
              className="stroke-gray-400/60"
            />
            <circle cx={xScale(hover.x)} cy={yScale(hover.total)} r={3} className="fill-gray-700 dark:fill-gray-200" />
          </>
        )}

        {/* X axis (years) */}
        <line x1={PAD.l} x2={width - PAD.r} y1={PAD.t + plotH} y2={PAD.t + plotH} className="stroke-gray-300 dark:stroke-gray-700" />
        {/* x ticks (every year, but decimate if long) */}
        {data.map((d, i) => {
          const show = data.length <= 14 || i % Math.ceil(data.length / 14) === 0;
          if (!show) return null;
          return (
            <text
              key={d.x}
              x={xScale(d.x)}
              y={PAD.t + plotH + 14}
              textAnchor="middle"
              className="fill-gray-500 text-[10px]"
            >
              {d.x}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function Legend() {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
      <LegendItem color="bg-indigo-500/70" label="Glavnica" />
      <LegendItem color="bg-emerald-500/70" label="Kamata" />
      <LegendItem color="bg-gray-700 dark:bg-gray-200" label="Ukupno (linija)" line />
    </div>
  );
}

function LegendItem({ color, label, line = false }: { color: string; label: string; line?: boolean }) {
  return (
    <div className="inline-flex items-center gap-2">
      {line ? (
        <span className={`h-0.5 w-6 rounded ${color}`} />
      ) : (
        <span className={`h-3 w-3 rounded-sm ${color}`} />
      )}
      <span className="text-gray-600 dark:text-gray-300">{label}</span>
    </div>
  );
}

/* ------------------------------- path utils ------------------------------- */

function pathFromPoints(
  pts: ReadonlyArray<readonly [number, number]>,
  plotH: number,
  PAD: { t: number; r: number; b: number; l: number },
  kind: "line" | "area"
) {
  if (pts.length === 0) return "";
  // simple cardinal-like smoothing (Catmull-Rom to Bezier) would be overkill; straight lines are crisp for finance
  const d = ["M", pts[0][0], pts[0][1], ...pts.slice(1).flatMap(([x, y]) => ["L", x, y])].join(" ");
  if (kind === "line") return d;
  // close to x-last, bottom, x-first, bottom
  const last = pts[pts.length - 1];
  const first = pts[0];
  return `${d} L ${last[0]} ${PAD.t + plotH} L ${first[0]} ${PAD.t + plotH} Z`;
}

function stackedAreaPath(
  topPts: ReadonlyArray<readonly [number, number]>,
  basePts: ReadonlyArray<readonly [number, number]>,
  PAD: { t: number; r: number; b: number; l: number }
) {
  if (topPts.length === 0) return "";
  const dTop = ["M", topPts[0][0], topPts[0][1], ...topPts.slice(1).flatMap(([x, y]) => ["L", x, y])].join(" ");
  const dBase = basePts
    .slice()
    .reverse()
    .flatMap(([x, y], i) => (i === 0 ? ["L", x, y] : ["L", x, y]))
    .join(" ");
  return `${dTop} ${dBase} Z`;
}
