"use client";

import * as React from "react";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function cn(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

type Postavke = {
  autoKrugSek: number | null; // npr. 60 = krug svake minute; null = isključeno
};

const DEFAULTS: Postavke = {
  autoKrugSek: null,
};

const STORAGE_KEY = "stopwatch.postavke.v2";

const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const pad3 = (n: number) =>
  n < 10 ? `00${n}` : n < 100 ? `0${n}` : `${n}`;

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milli = Math.floor(ms % 1000);
  return `${pad2(minutes)}:${pad2(seconds)}.${pad3(milli)}`;
}

export default function StopwatchPage() {
  const [isRunning, setIsRunning] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0); // ms
  const [laps, setLaps] = React.useState<number[]>([]);
  const [openSettings, setOpenSettings] = React.useState(false);

  const [postavke, setPostavke] = React.useState<Postavke>(() => {
    if (typeof window === "undefined") return DEFAULTS;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
    } catch {
      return DEFAULTS;
    }
  });

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(postavke));
  }, [postavke]);

  // refs
  const startRef = React.useRef<number | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const lastAutoLapAt = React.useRef<number>(0);

  function handleStart() {
    if (isRunning) return;
    setIsRunning(true);
    startRef.current = performance.now() - elapsed;
    rafRef.current = requestAnimationFrame(tick);
  }

  function handlePause() {
    if (!isRunning) return;
    setIsRunning(false);
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }

  function handleReset() {
    setIsRunning(false);
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    startRef.current = null;
    rafRef.current = null;
    setElapsed(0);
    setLaps([]);
    lastAutoLapAt.current = 0;
  }

  function handleLap() {
    setLaps((prev) => [elapsed, ...prev]);
    lastAutoLapAt.current = elapsed;
  }

  function tick(now: number) {
    if (startRef.current !== null) {
      const ms = now - startRef.current;
      setElapsed(ms);

      // auto lap
      if (postavke.autoKrugSek && postavke.autoKrugSek > 0) {
        const step = postavke.autoKrugSek * 1000;
        if (ms - lastAutoLapAt.current >= step) {
          handleLap();
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }
  }

  React.useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.code === "Space") {
        e.preventDefault();
        isRunning ? handlePause() : handleStart();
      } else if (e.key.toLowerCase() === "r") {
        e.preventDefault();
        handleReset();
      } else if (e.key.toLowerCase() === "l") {
        e.preventDefault();
        if (isRunning) handleLap();
      } else if (e.key.toLowerCase() === "s") {
        e.preventDefault();
        setOpenSettings((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isRunning, elapsed, postavke.autoKrugSek]);

  return (
    <Container className="py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Stopwatch
            </h1>
            <p className="text-sm text-gray-500">
              Precizno mjerenje vremena i krugova.
            </p>
          </div>

          <Button
            className="inline-flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl px-4 py-2"
            onClick={() => setOpenSettings(true)}
            title="Postavke (S)"
          >
            <IkonaPostavke className="h-4 w-4" />
            Postavke
          </Button>
        </div>

        <Card className="p-8 md:p-12 bg-white/60 dark:bg-black/40 backdrop-blur border border-gray-200/50 dark:border-gray-800/60 rounded-2xl shadow-sm">
          <div className="flex items-center justify-center">
            <div className="font-mono tabular-nums text-5xl md:text-6xl">
              {formatTime(elapsed)}
            </div>
          </div>

          <div className="mt-10 flex items-center justify-center gap-4">
            {!isRunning ? (
              <Button
                className="px-6 py-6 text-lg bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
                onClick={handleStart}
              >
                Start
              </Button>
            ) : (
              <Button
                className="px-6 py-6 text-lg bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl"
                onClick={handlePause}
              >
                Pauza
              </Button>
            )}
            <Button
              className="px-5 py-6 text-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-xl"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              className="px-5 py-6 text-lg bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"
              onClick={handleLap}
              disabled={!isRunning}
            >
              Krug
            </Button>
          </div>

          <p className="mt-5 text-xs text-gray-500 text-center">
            Space = start/pauza · R = reset · L = krug · S = postavke
          </p>

          {laps.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                Krugovi
              </h3>
              <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {laps.map((lap, i) => {
                  const n = laps.length - i;
                  const prev = laps[i + 1] ?? 0;
                  const split = lap - prev;
                  return (
                    <li
                      key={i}
                      className="flex items-center justify-between text-sm border-b border-gray-200 dark:border-gray-800 pb-2"
                    >
                      <span className="text-gray-500">Krug {n}</span>
                      <div className="flex items-center gap-3 font-mono">
                        <span className="text-gray-500">
                          +{formatTime(split)}
                        </span>
                        <span className="font-medium">{formatTime(lap)}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </Card>

        <Card className="mt-6 p-5 bg-white/60 dark:bg-black/40 backdrop-blur border border-gray-200/50 dark:border-gray-800/60 rounded-2xl shadow-sm">
          <h3 className="text-sm font-semibold tracking-wide text-gray-700 dark:text-gray-200">
            Savjet
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Tipkovnički prečaci: Space (start/pauza), L (krug), R (reset), S (postavke). ✔️
          </p>
        </Card>
      </div>

      {/* Modal: Postavke */}
      {openSettings && (
        <Modal title="Postavke" onClose={() => setOpenSettings(false)}>
          <div className="grid gap-6">
            <OpcijeGrupa<number | null>
              label="Automatski krug"
              value={postavke.autoKrugSek}
              options={[null, 30, 60, 120, 300]}
              format={(v) => (v === null ? "Isključeno" : `${v}s`)}
              onChange={(v) => {
                lastAutoLapAt.current = elapsed;
                setPostavke((s) => ({ ...s, autoKrugSek: v }));
              }}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg px-4"
                onClick={() => setOpenSettings(false)}
              >
                Zatvori
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Container>
  );
}

/* ---------------------- modal, opcije i ikona zupčanika ---------------------- */

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  React.useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-lg rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-base font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Zatvori"
            >
              ✕
            </button>
          </div>
          <div className="p-5">{children}</div>
        </div>
      </div>
    </div>
  );
}

function OpcijeGrupa<T extends string | number | boolean | null>({
  label,
  value,
  options,
  onChange,
  format,
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (v: T) => void;
  format: (v: T) => string;
}) {
  return (
    <div className="grid gap-2">
      <div className="text-sm text-gray-600 dark:text-gray-300">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = opt === value;
          return (
            <button
              key={`${opt}`}
              onClick={() => onChange(opt)}
              className={cn(
                "px-3 py-2 rounded-lg text-sm border transition-colors",
                active
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
              )}
            >
              {format(opt)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function IkonaPostavke({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0A1.65 1.65 0 0 0 9 3.09V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0A1.65 1.65 0 0 0 20.91 9H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  );
}
