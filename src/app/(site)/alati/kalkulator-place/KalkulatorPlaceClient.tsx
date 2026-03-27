"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MUNICIPALITIES } from "@/lib/salary/municipalities";
import { calculateSalary, PERSONAL_ALLOWANCE_DEFAULT, type SalaryResult } from "@/lib/salary/calculate";

const fmt = new Intl.NumberFormat("hr-HR", { style: "currency", currency: "EUR" });

export default function KalkulatorPlaceClient() {
  const [mode, setMode] = React.useState<"gross_to_net" | "net_to_gross">("gross_to_net");
  const [amount, setAmount] = React.useState(2000);
  const [municipalityQuery, setMunicipalityQuery] = React.useState("Zagreb");
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState<number>(
    MUNICIPALITIES.findIndex((m) => m.name === "ZAGREB")
  );
  const [allowanceMode, setAllowanceMode] = React.useState<"basic" | "custom">("basic");
  const [customAllowance, setCustomAllowance] = React.useState(PERSONAL_ALLOWANCE_DEFAULT);
  const [result, setResult] = React.useState<SalaryResult | null>(null);

  const filtered = React.useMemo(() => {
    const q = municipalityQuery.toUpperCase().trim();
    if (!q) return MUNICIPALITIES.map((m, i) => ({ m, i }));
    return MUNICIPALITIES
      .map((m, i) => ({ m, i }))
      .filter(({ m }) => m.name.includes(q));
  }, [municipalityQuery]);

  const selectedMunicipality = selectedIndex >= 0 ? MUNICIPALITIES[selectedIndex] : null;

  function handleSelect(globalIndex: number) {
    setSelectedIndex(globalIndex);
    setMunicipalityQuery(
      MUNICIPALITIES[globalIndex].name.charAt(0) +
      MUNICIPALITIES[globalIndex].name.slice(1).toLowerCase()
    );
    setShowDropdown(false);
  }

  function calculate() {
    if (!selectedMunicipality) return;
    const personalAllowance =
      allowanceMode === "basic" ? PERSONAL_ALLOWANCE_DEFAULT : customAllowance;
    const r = calculateSalary({ mode, amount, municipality: selectedMunicipality, personalAllowance });
    setResult(r);
  }

  const municipality = selectedMunicipality;

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="p-6 md:p-8 bg-white/60 dark:bg-black/40 backdrop-blur border rounded-2xl shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Mode */}
          <label className="block">
            <span className="block text-sm font-medium mb-1">Vrsta izračuna</span>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as "gross_to_net" | "net_to_gross")}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
            >
              <option value="gross_to_net">Bruto → Neto</option>
              <option value="net_to_gross">Neto → Bruto</option>
            </select>
          </label>

          {/* Amount */}
          <Field
            label={mode === "gross_to_net" ? "Bruto 1 plaća (€)" : "Neto plaća (€)"}
            value={amount}
            onChange={setAmount}
            min={0}
            step={50}
          />

          {/* Municipality combobox */}
          <div className="relative sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Grad / Općina</label>
            <input
              type="text"
              value={municipalityQuery}
              onChange={(e) => {
                setMunicipalityQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              placeholder="Upišite naziv..."
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
            />
            {showDropdown && filtered.length > 0 && (
              <ul className="absolute z-10 mt-1 max-h-52 w-full overflow-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg text-sm">
                {filtered.slice(0, 50).map(({ m, i }) => (
                  <li
                    key={i}
                    onMouseDown={() => handleSelect(i)}
                    className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                  >
                    <span>{m.name.charAt(0) + m.name.slice(1).toLowerCase()}</span>
                    <span className="text-xs text-gray-400">
                      {(m.lowerRate * 100).toFixed(1)}% / {(m.upperRate * 100).toFixed(1)}%
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {municipality && (
              <p className="mt-1 text-xs text-gray-500">
                Stope: {(municipality.lowerRate * 100).toFixed(1)}% (niža) / {(municipality.upperRate * 100).toFixed(1)}% (viša)
              </p>
            )}
          </div>

          {/* Personal allowance toggle */}
          <div className="sm:col-span-2">
            <span className="block text-sm font-medium mb-1">Osobni odbitak</span>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setAllowanceMode("basic")}
                className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                  allowanceMode === "basic"
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                }`}
              >
                Osnovno (560 €)
              </button>
              <button
                onClick={() => setAllowanceMode("custom")}
                className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                  allowanceMode === "custom"
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                }`}
              >
                Prilagođeno
              </button>
            </div>
            {allowanceMode === "custom" && (
              <div className="mt-2">
                <Field
                  label="Iznos osobnog odbitka (€/mj)"
                  value={customAllowance}
                  onChange={setCustomAllowance}
                  min={0}
                  step={10}
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={calculate}
            disabled={!selectedMunicipality}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50"
          >
            Izračunaj
          </Button>
        </div>
      </Card>

      {result && (
        <Card className="mt-6 p-6 bg-white/60 dark:bg-black/40 backdrop-blur border rounded-2xl shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Rezultat</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <Stat label="Neto plaća" value={fmt.format(result.neto)} highlight />
            <Stat label="Bruto 1" value={fmt.format(result.bruto1)} />
            <Stat label="Bruto 2" value={fmt.format(result.bruto2)} />
            <Stat label="Trošak poslodavca" value={fmt.format(result.trosakPoslodavca)} />
            <Stat label="Doprinosi iz plaće" value={fmt.format(result.employeeContributions)} />
            <Stat label="Osobni odbitak" value={fmt.format(result.osobniOdbitak)} />
            <Stat label="Porezna osnovica" value={fmt.format(result.poreznaOsnovica)} />
            <Stat label="Porez" value={fmt.format(result.porez)} />
          </div>
        </Card>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  min,
  step,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
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
        step={step}
        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
      />
    </label>
  );
}

function Stat({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 p-3">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className={`mt-1 text-base font-medium ${highlight ? "text-indigo-600" : ""}`}>{value}</div>
    </div>
  );
}
