"use client";

import * as React from "react";
import Container from "@/components/Container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const fmt = new Intl.NumberFormat("hr-HR", { style: "currency", currency: "EUR" });

export default function PDVClient() {
  const [amount, setAmount] = React.useState(1000);
  const [mode, setMode] = React.useState<"neto2bruto" | "bruto2neto">("neto2bruto");
  const [rate, setRate] = React.useState(25);
  const [result, setResult] = React.useState<{ neto: number; pdv: number; bruto: number } | null>(null);

  function calculate() {
    let neto = 0, bruto = 0, pdv = 0;
    if (mode === "neto2bruto") {
      neto = amount;
      bruto = neto * (1 + rate / 100);
      pdv = bruto - neto;
    } else {
      bruto = amount;
      neto = bruto / (1 + rate / 100);
      pdv = bruto - neto;
    }
    setResult({ neto, pdv, bruto });
  }

  return (
    <Container className="py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            PDV kalkulator – Brzo izračunajte PDV
          </h1>
          <p className="text-sm text-gray-500">
            Unesite iznos i stopu PDV-a – odmah ćete dobiti neto, PDV i bruto vrijednost.
          </p>
        </div>

        {/* Form */}
        <Card className="p-6 md:p-8 bg-white/60 dark:bg-black/40 backdrop-blur border rounded-2xl shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Iznos (€)" value={amount} min={0} step={1} onChange={setAmount} />
            <label className="block">
              <span className="block text-sm font-medium mb-1">Vrsta izračuna</span>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.values as "neto2bruto" | "bruto2neto")}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
              >
                <option value="neto2bruto">Neto → Bruto</option>
                <option value="bruto2neto">Bruto → Neto</option>
              </select>
            </label>
            <label className="block">
              <span className="block text-sm font-medium mb-1">Stopa PDV-a</span>
              <select
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
              >
                <option value={25}>25 % (standardna)</option>
                <option value={13}>13 %</option>
                <option value={5}>5 %</option>
                <option value={0}>0 %</option>
              </select>
            </label>
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={calculate} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
              Izračunaj
            </Button>
          </div>
        </Card>

        {/* Result */}
        {result && (
          <Card className="mt-6 p-6 bg-white/60 dark:bg-black/40 backdrop-blur border rounded-2xl shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Rezultat</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <Stat label="Neto" value={fmt.format(result.neto)} />
              <Stat label="PDV" value={fmt.format(result.pdv)} positive />
              <Stat label="Bruto" value={fmt.format(result.bruto)} />
            </div>
          </Card>
        )}
      </div>
    </Container>
  );
}

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
