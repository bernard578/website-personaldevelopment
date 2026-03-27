// src/app/(site)/alati/page.tsx                                              */
import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Alati",
  description:
    "Kolekcija produktivnih alata: Pomodoro, Stopwatch, Kalkulator složene kamate i PDV kalkulator.",
  alternates: { canonical: "/alati" },
};

export default function AlatiPage() {
  return (
    <section>
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">
        Alati
      </h1>

      {/* kartice alata */}
      <ul className="grid gap-4 sm:grid-cols-2">
        <li>
          <Link
            href="/alati/pomodoro"
            className="block rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">⏳</span>
              <div>
                <div className="font-medium">Pomodoro Timer</div>
                <p className="text-sm text-gray-500">
                  Fokus blokovi, kratke/duge pauze, prečaci tipkovnice.
                </p>
              </div>
            </div>
          </Link>
        </li>

        <li>
          <Link
            href="/alati/stopwatch"
            className="block rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">⏱️</span>
              <div>
                <div className="font-medium">Stopwatch</div>
                <p className="text-sm text-gray-500">
                  Štoperica s milisekundama, krugovima i prečacima.
                </p>
              </div>
            </div>
          </Link>
        </li>

        <li>
          <Link
            href="/alati/compound-interest-calculator"
            className="block rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">💰</span>
              <div>
                <div className="font-medium">Kalkulator složene kamate</div>
                <p className="text-sm text-gray-500">
                  Pokaži rast štednje i ulaganja kroz vrijeme.
                </p>
              </div>
            </div>
          </Link>
        </li>

        {/* ✅ NEW: kartica za PDV kalkulator */}
        <li>
          <Link
            href="/alati/kalkulator-place"
            className="block rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">💼</span>
              <div>
                <div className="font-medium">Kalkulator plaće</div>
                <p className="text-sm text-gray-500">
                  Izračunaj neto iz bruta i obrnuto za bilo koji grad u Hrvatskoj.
                </p>
              </div>
            </div>
          </Link>
        </li>

        <li>
          <Link
            href="/alati/pdv-kalkulator"
            className="block rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🧮</span>
              <div>
                <div className="font-medium">PDV kalkulator</div>
                <p className="text-sm text-gray-500">
                  Izračun neto, PDV i bruto za 25 %, 13 %, 5 % i 0 %.
                </p>
              </div>
            </div>
          </Link>
        </li>
      </ul>
    </section>
  );
}
