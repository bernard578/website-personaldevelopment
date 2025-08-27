// app/(site)/alati/pomodoro/page.tsx
"use client";

import * as React from "react";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function cn(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

type Faza = "fokus" | "kratka" | "duga";


type Postavke = {
  fokusMin: number;
  kratkaMin: number;
  dugaMin: number;
  dugaSvaki: number; // duga pauza nakon N fokus blokova
  autoStart: boolean;
  // (zvuk/obavijesti namjerno izostavljeni u ovom UI-u)
};

const DEFAULTS: Postavke = {
  fokusMin: 25,
  kratkaMin: 5,
  dugaMin: 15,
  dugaSvaki: 4,
  autoStart: true,
};

const STORAGE_KEY = "pomodoro.settings.hr.v2";
const STORAGE_STATE_KEY = "pomodoro.runtime.hr.v2";

const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);

export default function PomodoroClient() {
  const [postavke, setPostavke] = React.useState<Postavke>(() => {
    if (typeof window === "undefined") return DEFAULTS;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
    } catch {
      return DEFAULTS;
    }
  });

  const [faza, setFaza] = React.useState<Faza>("fokus");
  const [radi, setRadi] = React.useState(false);
  const [sekundi, setSekundi] = React.useState(() => DEFAULTS.fokusMin * 60);
  const [zavrseniFokusi, setZavrseniFokusi] = React.useState(0);

  const [otvoriPostavke, setOtvoriPostavke] = React.useState(false);

  // restore
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_STATE_KEY);
      if (!raw) return;
      const p = JSON.parse(raw);
      if (p.settingsHash === hashPostavki(postavke)) {
        setFaza(p.faza as Faza);
        setRadi(p.radi ?? false);
        setSekundi(p.sekundi ?? DEFAULTS.fokusMin * 60);
        setZavrseniFokusi(p.zavrseniFokusi ?? 0);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // persist
  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(postavke));
  }, [postavke]);
  React.useEffect(() => {
    localStorage.setItem(
      STORAGE_STATE_KEY,
      JSON.stringify({
        faza,
        radi,
        sekundi,
        zavrseniFokusi,
        settingsHash: hashPostavki(postavke),
      })
    );
  }, [faza, radi, sekundi, zavrseniFokusi, postavke]);

  // naslov taba
  React.useEffect(() => {
    const m = Math.floor(sekundi / 60);
    const s = sekundi % 60;
    const prefix = `${pad2(m)}:${pad2(s)}`;
    const label =
      faza === "fokus"
        ? "Fokus"
        : faza === "kratka"
        ? "Kratka pauza"
        : "Duga pauza";
    document.title = `${prefix} • ${label}`;
    return () => {
      document.title = "Pomodoro";
    };
  }, [sekundi, faza]);

  // timer
  React.useEffect(() => {
    if (!radi) return;
    const id = setInterval(() => {
      setSekundi((s) => {
        if (s <= 1) {
          clearInterval(id);
          onKrajFaze();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radi, faza, postavke]);

  // prečaci tipkovnice
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.code === "Space") {
        e.preventDefault();
        setRadi((r) => !r);
      } else if (e.key.toLowerCase() === "r") {
        e.preventDefault();
        onReset();
      } else if (e.key.toLowerCase() === "n") {
        e.preventDefault();
        naSljedece();
      } else if (e.key.toLowerCase() === "s") {
        // 's' otvara/zatvara postavke
        e.preventDefault();
        setOtvoriPostavke((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ukupno trajanje za trenutnu fazu
  const ukupnoSekundi = React.useMemo(() => {
    if (faza === "fokus") return postavke.fokusMin * 60;
    if (faza === "kratka") return postavke.kratkaMin * 60;
    return postavke.dugaMin * 60;
  }, [faza, postavke]);

  React.useEffect(() => {
    setSekundi((s) => Math.min(s, ukupnoSekundi));
  }, [ukupnoSekundi]);

  function onReset() {
    setRadi(false);
    setSekundi(ukupnoSekundi);
  }

  function naSljedece() {
    setRadi(false);
    naprijed();
  }

  function naprijed() {
    if (faza === "fokus") {
      const nextCount = zavrseniFokusi + 1;
      const jeDuga = nextCount % postavke.dugaSvaki === 0;
      setZavrseniFokusi(nextCount);
      setFaza(jeDuga ? "duga" : "kratka");
      setSekundi((jeDuga ? postavke.dugaMin : postavke.kratkaMin) * 60);
      if (postavke.autoStart) setRadi(true);
    } else {
      setFaza("fokus");
      setSekundi(postavke.fokusMin * 60);
      if (postavke.autoStart) setRadi(true);
    }
  }

  function onKrajFaze() {
    naprijed();
  }

  function promijeniFazu(nova: Faza) {
    setRadi(false);
    setFaza(nova);
    setSekundi(
      (nova === "fokus"
        ? postavke.fokusMin
        : nova === "kratka"
        ? postavke.kratkaMin
        : postavke.dugaMin) * 60
    );
  }

  const napredak = 1 - sekundi / ukupnoSekundi; // 0..1

  return (
    <Container className="py-10">
      <div className="mx-auto max-w-4xl">
        <Zaglavlje
          onOpenSettings={() => setOtvoriPostavke(true)}
        />
      <div className="max-w-3xl mx-auto space-y-6">
      {/* Timer */}
      <Card className="p-6 md:p-12 bg-white/60 dark:bg-black/40 backdrop-blur border border-gray-200/50 dark:border-gray-800/60 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <FazaTabovi faza={faza} onChange={promijeniFazu} />
          <ZnakSesije count={zavrseniFokusi} every={postavke.dugaSvaki} />
        </div>

        <div className="mt-10 flex items-center justify-center">
          <KruzniNapredak
            progress={napredak}
            timeLabel={fmtVrijeme(sekundi)}
            faza={faza}
          />
        </div>

        <div className="mt-10 flex items-center justify-center gap-4">
          {!radi ? (
            <Button
              className="px-6 py-6 text-lg bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
              onClick={() => setRadi(true)}
            >
              Start
            </Button>
          ) : (
            <Button
              className="px-6 py-6 text-lg bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl"
              onClick={() => setRadi(false)}
            >
              Pauza
            </Button>
          )}
          <Button
            className="px-5 py-6 text-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-xl"
            onClick={onReset}
          >
            Reset
          </Button>
          <Button
            className="px-5 py-6 text-lg bg-rose-500 hover:bg-rose-600 text-white rounded-xl"
            onClick={naSljedece}
          >
            Sljedeće
          </Button>
        </div>

        <p className="mt-5 text-xs text-gray-500 text-center">
          Space = start/pauza · R = reset · N = sljedeće · S = postavke
        </p>
      </Card>

      {/* Savjet ispod */}
      <Card className="p-5 bg-white/60 dark:bg-black/40 backdrop-blur border border-gray-200/50 dark:border-gray-800/60 rounded-2xl shadow-sm">
        <h3 className="text-sm font-semibold tracking-wide text-gray-700 dark:text-gray-200">
          Savjet
        </h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Klasični 25-minutni fokus uz pauze od 5/15 min. Postavke mijenjaš putem
          gumba <span className="font-medium">Postavke</span> gore desno. ✔️
        </p>
      </Card>
    </div>

      </div>

      {/* MODAL: Postavke */}
      {otvoriPostavke && (
        <Modal onClose={() => setOtvoriPostavke(false)} title="Postavke">
          <div className="grid gap-6">
            <OpcijeGrupa<number>
              label="Fokus (min)"
              value={postavke.fokusMin}
              options={[15, 20, 25, 30, 45]}
              format={(v) => `${v}`}
              onChange={(v) => {
                setPostavke((s) => ({ ...s, fokusMin: v }));
                if (faza === "fokus") setSekundi(v * 60);
              }}
            />
            <OpcijeGrupa<number>
              label="Kratka pauza (min)"
              value={postavke.kratkaMin}
              options={[3, 5, 10]}
              format={(v) => `${v}`}
              onChange={(v) => {
                setPostavke((s) => ({ ...s, kratkaMin: v }));
                if (faza === "kratka") setSekundi(v * 60);
              }}
            />
            <OpcijeGrupa<number>
              label="Duga pauza (min)"
              value={postavke.dugaMin}
              options={[15, 20, 25, 30]}
              format={(v) => `${v}`}
              onChange={(v) => {
                setPostavke((s) => ({ ...s, dugaMin: v }));
                if (faza === "duga") setSekundi(v * 60);
              }}
            />
            <OpcijeGrupa<number>
              label="Duga pauza nakon N fokus blokova"
              value={postavke.dugaSvaki}
              options={[3, 4, 5, 6]}
              format={(v) => `${v}`}
              onChange={(v) => setPostavke((s) => ({ ...s, dugaSvaki: v }))}
            />
            <OpcijeGrupa<boolean>
              label="Automatski pokreni sljedeću fazu"
              value={postavke.autoStart}
              options={[true, false]}
              format={(v) => (v ? "Da" : "Ne")}
              onChange={(v) => setPostavke((s) => ({ ...s, autoStart: v }))}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg px-4"
                onClick={() => setOtvoriPostavke(false)}
              >
                Zatvori
              </Button>
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4"
                onClick={() => setOtvoriPostavke(false)}
              >
                Spremi
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Container>
  );
}

/* ---------------------------- UI podkomponente ---------------------------- */

function Zaglavlje({ onOpenSettings }: { onOpenSettings: () => void }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Pomodoro
        </h1>
        <p className="text-sm text-gray-500">
          Održi fokus kroz sprintove i svjesne pauze.
        </p>
      </div>

      <Button
        className="inline-flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl px-4 py-2"
        onClick={onOpenSettings}
        title="Postavke (S)"
      >
        <IkonaPostavke className="h-4 w-4" />
        Postavke
      </Button>
    </div>
  );
}

function FazaTabovi({
  faza,
  onChange,
}: {
  faza: Faza;
  onChange: (p: Faza) => void;
}) {
  const tabs: { key: Faza; label: string }[] = [
    { key: "fokus", label: "Fokus" },
    { key: "kratka", label: "Kratka pauza" },
    { key: "duga", label: "Duga pauza" },
  ];
  return (
    <div className="inline-flex items-center rounded-xl bg-gray-100 dark:bg-gray-900 p-1">
      {tabs.map((t) => {
        const active = t.key === faza;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm transition-colors",
              active
                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

function ZnakSesije({ count, every }: { count: number; every: number }) {
  const dots = new Array(every).fill(0).map((_, i) => i < count % every);
  const plural =
    count % 10 === 1 && count % 100 !== 11
      ? "blok"
      : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)
      ? "bloka"
      : "blokova";
  return (
    <div className="flex items-center gap-1.5">
      {dots.map((filled, i) => (
        <span
          key={i}
          className={cn(
            "h-2.5 w-2.5 rounded-full",
            filled ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-700"
          )}
        />
      ))}
      <span className="ml-2 text-xs text-gray-500">
        {count} fokus {plural}
      </span>
    </div>
  );
}

function KruzniNapredak({
  progress,
  timeLabel,
  faza,
}: {
  progress: number; // 0..1
  timeLabel: string;
  faza: Faza;
}) {
  const size = 240;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * progress;

  const color =
    faza === "fokus"
      ? "stroke-indigo-600"
      : faza === "kratka"
      ? "stroke-emerald-500"
      : "stroke-rose-500";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className="stroke-gray-200 dark:stroke-gray-800"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeLinecap="round"
          className={cn(color, "transition-all duration-300")}
          strokeDasharray={`${dash} ${c - dash}`}
          strokeWidth={stroke}
          fill="none"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-5xl font-semibold tabular-nums">{timeLabel}</div>
          <div className="mt-1 text-xs uppercase tracking-wide text-gray-500">
            {faza === "fokus"
              ? "Fokus"
              : faza === "kratka"
              ? "Kratka pauza"
              : "Duga pauza"}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- Modal + kontrole ---------------------------- */

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
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
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

function OpcijeGrupa<T extends string | number | boolean>({
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

/* --------------------------------- ikone --------------------------------- */

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

/* --------------------------------- utili --------------------------------- */

function fmtVrijeme(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${pad2(m)}:${pad2(s)}`;
}

function hashPostavki(s: Postavke) {
  const str = `${s.fokusMin}|${s.kratkaMin}|${s.dugaMin}|${s.dugaSvaki}|${s.autoStart}`;
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return h;
}
