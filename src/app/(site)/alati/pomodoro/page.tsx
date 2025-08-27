// src/app/(site)/alati/pomodoro/page.tsx
import type { Metadata } from "next";
import PomodoroClient from "./PomodoroClient";

export const metadata: Metadata = {
  title: "Pomodoro timer – 25/5 fokus blokovi, kratke i duge pauze | Alati",
  description:
    "Besplatni Pomodoro timer na hrvatskom: fokus blokovi (25/5), kratke i duge pauze, zvuk obavijesti i tipkovnički prečaci.",
  alternates: { canonical: "https://osobnirazvoj.hr/alati/pomodoro" },
  openGraph: {
    title: "Pomodoro timer · Alati",
    description:
      "Besplatni Pomodoro timer na hrvatskom s fokus blokovima, kratkim i dugim pauzama te tipkovničkim prečacima.",
    url: "https://osobnirazvoj.hr/alati/pomodoro",
    images: [{ url: "/og/pomodoro.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pomodoro timer · Alati",
    description:
      "Pomodoro timer s 25/5 ciklusima, prilagodljivim pauzama i prečacima.",
    images: ["/og/pomodoro.png"],
  },
};

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* SEO CONTENT */}
      <h1 className="text-2xl md:text-3xl font-bold mb-4">
        Pomodoro timer (25/5)
      </h1>
      <p className="mb-6 text-gray-700 dark:text-gray-300">
        Jednostavan i učinkovit <strong>Pomodoro timer</strong> na hrvatskom.
        Postavite <em>fokus blokove</em> (25 minuta), <em>kratke i duge pauze</em>,
        za brži rad i bolju produktivnost.
      </p>


      {/* APP */}
      <PomodoroClient />

      {/* FAQ SECTION */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Česta pitanja</h2>

        <div className="mb-6">
          <h3 className="font-medium">Što je Pomodoro tehnika?</h3>
          <p>
            Pomodoro tehnika je metoda rada u fokus blokovima (npr. 25 minuta) s
            kratkim pauzama (5 minuta) i povremenim dužim pauzama, namijenjena
            povećanju produktivnosti.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="font-medium">Mogu li promijeniti duljinu blokova?</h3>
          <p>
            Da, trajanje fokusa i pauza možete prilagoditi u postavkama alata.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="font-medium">Radi li na mobitelu?</h3>
          <p>
            Da, Pomodoro timer je optimiziran i za mobitele i za stolna
            računala.
          </p>
        </div>
      </section>
    </div>
  );
}
