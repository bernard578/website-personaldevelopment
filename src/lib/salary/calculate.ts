import type { Municipality } from "./municipalities";

export const PERSONAL_ALLOWANCE_DEFAULT = 560; // EUR/month
export const BRACKET_THRESHOLD = 4200; // EUR/month (50,400/year)

export interface SalaryResult {
  neto: number;
  bruto1: number;
  bruto2: number;
  employeeContributions: number;
  osobniOdbitak: number;
  poreznaOsnovica: number;
  porez: number;
  trosakPoslodavca: number;
}

function grossToNet(
  bruto1: number,
  municipality: Municipality,
  personalAllowance: number
): SalaryResult {
  const employeeContributions = bruto1 * 0.20;
  const dohodak = bruto1 - employeeContributions;
  const osobniOdbitak = Math.min(personalAllowance, dohodak);
  const poreznaOsnovica = Math.max(0, dohodak - osobniOdbitak);

  const porez =
    municipality.lowerRate * Math.min(poreznaOsnovica, BRACKET_THRESHOLD) +
    municipality.upperRate * Math.max(0, poreznaOsnovica - BRACKET_THRESHOLD);

  const neto = dohodak - porez;
  const bruto2 = bruto1 * 1.165;

  return {
    neto,
    bruto1,
    bruto2,
    employeeContributions,
    osobniOdbitak,
    poreznaOsnovica,
    porez,
    trosakPoslodavca: bruto2,
  };
}

export function calculateSalary(params: {
  mode: "gross_to_net" | "net_to_gross";
  amount: number;
  municipality: Municipality;
  personalAllowance: number;
}): SalaryResult {
  const { mode, amount, municipality, personalAllowance } = params;

  if (mode === "gross_to_net") {
    return grossToNet(amount, municipality, personalAllowance);
  }

  // Net → Gross: binary search
  let lo = 0;
  let hi = 200_000;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const result = grossToNet(mid, municipality, personalAllowance);
    if (result.neto < amount) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return grossToNet((lo + hi) / 2, municipality, personalAllowance);
}
