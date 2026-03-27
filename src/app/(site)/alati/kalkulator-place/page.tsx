import type { Metadata } from "next";
import Script from "next/script";
import KalkulatorPlaceClient from "./KalkulatorPlaceClient";

export const metadata: Metadata = {
  title: "Kalkulator plaće – Bruto u Neto 2026 (svi gradovi Hrvatske)",
  description:
    "Besplatan kalkulator plaće za Hrvatsku 2026. Izračunajte neto iz bruta ili bruto iz neta za bilo koji grad ili općinu. Točne porezne stope za sve gradove.",
  alternates: { canonical: "https://osobnirazvoj.hr/alati/kalkulator-place" },
  openGraph: {
    url: "https://osobnirazvoj.hr/alati/kalkulator-place",
  },
};

export default function Page() {
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Kako se računa neto plaća iz bruta u Hrvatskoj?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Od bruta 1 se oduzima 20% doprinosa (MIO I i MIO II). Dobiveni dohodak se umanjuje za osobni odbitak (560 €/mj), a na ostatak (poreznu osnovicu) se primjenjuje porezna stopa prema gradu/općini.",
        },
      },
      {
        "@type": "Question",
        name: "Što je Bruto 1 a što Bruto 2?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Bruto 1 je plaća na koju se obračunavaju doprinosi zaposlenika. Bruto 2 (trošak poslodavca) je Bruto 1 × 1,165 jer poslodavac plaća još 16,5% doprinosa za zdravstveno osiguranje.",
        },
      },
      {
        "@type": "Question",
        name: "Zašto porez ovisi o gradu?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Od 2024. svaki grad i općina u Hrvatskoj samostalno određuje dvije stope poreza na dohodak – nižu (do 4.200 €/mj) i višu (iznad toga). Zato je isti bruto drugačiji neto u Zagrebu i u Splitu.",
        },
      },
      {
        "@type": "Question",
        name: "Koliki je osobni odbitak u 2026. godini?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Osnovni osobni odbitak iznosi 560 € mjesečno. Može se povećati uz uvjet djece, invaliditeta i dr.",
        },
      },
      {
        "@type": "Question",
        name: "Koliko doprinosa plaća zaposlenik?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Zaposlenik plaća 15% za MIO I i 5% za MIO II – ukupno 20% od bruto 1 plaće.",
        },
      },
      {
        "@type": "Question",
        name: "Koliko doprinosa plaća poslodavac?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Poslodavac plaća 16,5% doprinosa za zdravstveno osiguranje iznad bruto 1. Zato je bruto 2 = bruto 1 × 1,165.",
        },
      },
    ],
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Script id="faq-place-jsonld" type="application/ld+json">
        {JSON.stringify(faq)}
      </Script>

      <h1 className="text-2xl md:text-3xl font-bold mb-4">
        Kalkulator plaće – Bruto u Neto 2026
      </h1>
      <p className="mb-6 text-gray-700 dark:text-gray-300">
        Izračunajte neto plaću iz bruta (ili obrnuto) za bilo koji grad ili općinu u Hrvatskoj.
        Kalkulator koristi službene porezne stope za 2026. godinu.
      </p>

      <KalkulatorPlaceClient />

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Česta pitanja o plaći u Hrvatskoj</h2>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium">Kako se računa neto plaća iz bruta?</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Od bruta 1 se oduzima 20% doprinosa. Na preostali dohodak se primjenjuje osobni odbitak,
              a na poreznu osnovicu stopa poreza prema gradu.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Što je razlika između Bruto 1 i Bruto 2?</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Bruto 2 je ukupni trošak poslodavca: Bruto 1 × 1,165. Razlika su doprinosi za zdravstveno
              osiguranje koje plaća poslodavac (16,5%).
            </p>
          </div>
          <div>
            <h3 className="font-medium">Zašto porez ovisi o gradu?</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Od 2024. svaka jedinica lokalne samouprave određuje vlastite porezne stope.
              Na primjer, Zagreb ima 23%/33%, dok mnoge manje općine imaju 20%/30%.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Koliki je osobni odbitak u 2026.?</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Osnovni osobni odbitak iznosi <strong>560 € mjesečno</strong>. Može se uvećati za djecu,
              invaliditet i ostale olakšice.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
