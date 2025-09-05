import type { Metadata } from "next";
import Script from "next/script";
import PDVClient from "./PDVClient";

export const metadata: Metadata = {
  title: "PDV kalkulator – Brzo izračunajte PDV u Hrvatskoj (2025)",
  description:
    "Besplatan PDV kalkulator. Izračunajte neto, bruto i iznos PDV-a u Hrvatskoj u par sekundi. Jednostavne formule, primjeri i mini FAQ.",
  alternates: { canonical: "https://osobnirazvoj.hr/alati/pdv-kalkulator" },
  openGraph: {
    url: "https://osobnirazvoj.hr/alati/pdv-kalkulator",
    images: [{ url: "/og/pdv-kalkulator.png", width: 1200, height: 630 }],
  },
  twitter: { images: ["/og/pdv-kalkulator.png"] },
};

export default function Page() {
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Kako izračunati PDV iz bruto cijene?",
        acceptedAnswer: { "@type": "Answer", text: "Bruto cijenu podijelite s (1 + stopa PDV-a). Primjer: 1.000 € ÷ 1,25 = 800 € neto." },
      },
      {
        "@type": "Question",
        name: "Kako izračunati PDV iz neto cijene?",
        acceptedAnswer: { "@type": "Answer", text: "Neto cijenu pomnožite s (1 + stopa PDV-a). Primjer: 800 € × 1,25 = 1.000 € bruto." },
      },
      {
        "@type": "Question",
        name: "Koja je standardna stopa PDV-a u Hrvatskoj?",
        acceptedAnswer: { "@type": "Answer", text: "Standardna stopa je 25 %, a postoje i snižene stope od 13 %, 5 % i 0 %." },
      },
    ],
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* FAQ JSON-LD */}
      <Script id="faq-pdv-jsonld" type="application/ld+json">
        {JSON.stringify(faq)}
      </Script>

      {/* Hero */}
      <h1 className="text-2xl md:text-3xl font-bold mb-4">PDV kalkulator – Brzo izračunajte PDV</h1>
      <p className="mb-6 text-gray-700 dark:text-gray-300">
        Unesite iznos i odaberite stopu PDV-a – naš kalkulator odmah izračunava neto, bruto i iznos PDV-a. Brzo, točno i jednostavno.
      </p>

      {/* App */}
      <PDVClient />

      {/* Mini FAQ */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Česta pitanja o PDV kalkulatoru</h2>

        <div className="mb-6">
          <h3 className="font-medium">Kako izračunati PDV iz bruto cijene?</h3>
          <p>Bruto cijenu podijelite s <code>(1 + stopa PDV-a)</code>. Primjer: 1.000 € ÷ 1,25 = 800 € neto.</p>
        </div>

        <div className="mb-6">
          <h3 className="font-medium">Kako izračunati PDV iz neto cijene?</h3>
          <p>Neto cijenu pomnožite s <code>(1 + stopa PDV-a)</code>. Primjer: 800 € × 1,25 = 1.000 € bruto.</p>
        </div>

        <div className="mb-6">
          <h3 className="font-medium">Koja je standardna stopa PDV-a u Hrvatskoj?</h3>
          <p>Standardna stopa je <strong>25 %</strong>, a postoje i snižene stope od 13 %, 5 % i 0 %.</p>
        </div>
      </section>

      {/* SEO edukativni tekst */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Kako funkcionira PDV u Hrvatskoj</h2>
        <p>
          Porez na dodanu vrijednost (PDV) je opći porez na potrošnju. Obračunava se na gotovo sve proizvode i usluge. 
          Standardna stopa u Hrvatskoj iznosi 25 %, dok su snižene stope 13 %, 5 % i 0 %. 
          Formula za izračun je jednostavna: <em>neto × (1 + stopa PDV-a) = bruto</em>.
        </p>
      </section>

      {/* Zaključak */}
      <section className="mt-12 text-center">
        <p className="mb-4">PDV je jednostavno izračunati pomoću našeg alata. Nema više ručnog računanja – probajte kalkulator i uštedite vrijeme.</p>
      </section>
    </div>
  );
}
