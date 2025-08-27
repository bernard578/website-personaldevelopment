import type { Metadata } from "next";
import Script from "next/script";
import CompoundInterestClient from "./CompoundInterestClient";

export const metadata: Metadata = {
  title:
    "Kalkulator složene kamate – rast štednje i investicija kroz vrijeme | Alati",
  description:
    "Besplatni kalkulator složene kamate: izračun rasta štednje i investicija uz početni iznos, mjesečne uplate i godišnju kamatnu stopu. Grafikon i tablični pregled.",
  alternates: { canonical: "https://osobnirazvoj.hr/alati/compound-interest-calculator" },
  openGraph: {
    url: "https://osobnirazvoj.hr/alati/compound-interest-calculator",
    images: [{ url: "/og/compound-interest-calculator.png", width: 1200, height: 630 }],
  },
  twitter: {
    images: ["/og/compound-interest-calculator.png"],
  },

};

export default function Page() {
  // FAQ JSON-LD (tekst usklađen s vidljivim FAQ-om)
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Kako se u ovom alatu računa složena kamata?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Koristi se mjesečno kapitaliziranje. Godišnja stopa se preračuna u mjesečnu, zatim se svaki mjesec saldo množi s (1 + mjesečna stopa), a potom se doda mjesečna uplata.",
        },
      },
      {
        "@type": "Question",
        name: "Kada se knjiže mjesečne uplate?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Uplate se knjiže nakon obračuna kamate za taj mjesec (first interest, then contribution). To znači da uplata počinje zarađivati kamatu od sljedećeg mjeseca.",
        },
      },
      {
        "@type": "Question",
        name: "Što sve ulazi u “Glavnicu” (uplaćeni kapital)?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Glavnica uključuje početni iznos i sve mjesečne uplate. Kamata je razlika između ukupnog salda i ukupno uplaćenog kapitala.",
        },
      },
      {
        "@type": "Question",
        name: "Zašto se rezultati mogu razlikovati od banke ili drugog kalkulatora?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Razlike nastaju zbog načina kapitalizacije (mjesečno vs. godišnje), redoslijeda knjiženja (uplata nakon kamate vs. prije), zaokruživanja i mogućih naknada/poreza koje ovaj alat ne uračunava.",
        },
      },
      {
        "@type": "Question",
        name: "Mogu li mijenjati kapitalizaciju, inflaciju ili varijabilnu stopu?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "U ovoj verziji kapitalizacija je mjesečna, inflacija nije uključena, a stopa je stalna kroz cijelo razdoblje. Za različite scenarije promijenite unos i pokrenite novi izračun.",
        },
      },
      {
        "@type": "Question",
        name: "Što prikazuje graf iznad tablice?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Stacked područja prikazuju glavnicu (donji sloj) i akumuliranu kamatu (gornji sloj), a linija prikazuje ukupni iznos kroz godine.",
        },
      },
      {
        "@type": "Question",
        name: "Pohranjuje li alat moje podatke?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Izračun se izvodi u pregledniku. Unosi se ne šalju na poslužitelj.",
        },
      },
      {
        "@type": "Question",
        name: "Je li ovo financijski savjet?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Nije. Rezultati su informativni i ovise o pretpostavkama koje unosiš.",
        },
      },
    ],
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* FAQ JSON-LD */}
      <Script id="faq-compound-jsonld" type="application/ld+json">
        {JSON.stringify(faq)}
      </Script>

      {/* SEO CONTENT */}
      <h1 className="text-2xl md:text-3xl font-bold mb-4">
        Kalkulator složene kamate online
      </h1>
      <p className="mb-6 text-gray-700 dark:text-gray-300">
        Izračunaj kako će tvoja štednja ili investicije rasti kroz godine uz
        složenu kamatu. Unesi <em>početni iznos</em>, <em>mjesečnu uplatu</em>,{" "}
        <em>trajanje</em> i <em>godišnju kamatu</em>. Alat prikazuje sažetak,
        grafikon rasta i detaljnu tablicu po godinama.
      </p>

      {/* APP */}
      <CompoundInterestClient />

      {/* FAQ (vidljivo korisniku) */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Česta pitanja</h2>

        <div className="mb-6">
          <h3 className="font-medium">Kako se u ovom alatu računa složena kamata?</h3>
          <p>
            Koristi se <strong>mjesečno kapitaliziranje</strong>. Godišnja stopa
            se preračuna u mjesečnu, zatim se svaki mjesec saldo množi s{" "}
            <code>(1 + mjesečna stopa)</code>, a potom se doda mjesečna uplata.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="font-medium">Kada se knjiže mjesečne uplate?</h3>
          <p>
            Uplate se knjiže <strong>nakon</strong> obračuna kamate za taj
            mjesec (first interest, then contribution). Uplata počinje
            zarađivati kamatu od sljedećeg mjeseca.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="font-medium">Što sve ulazi u “Glavnicu” (uplaćeni kapital)?</h3>
          <p>
            Glavnica uključuje <strong>početni iznos</strong> i sve{" "}
            <strong>mjesečne uplate</strong>. Kamata = saldo − ukupno uplaćeno.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="font-medium">
            Zašto se rezultati mogu razlikovati od banke ili drugog kalkulatora?
          </h3>
          <p>
            Zbog različitog <em>načina kapitalizacije</em>,{" "}
            <em>redoslijeda knjiženja</em>, <em>zaokruživanja</em> te potencijalnih{" "}
            <em>naknada/poreza</em> koje ovaj alat ne uračunava.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="font-medium">
            Mogu li mijenjati kapitalizaciju, inflaciju ili varijabilnu stopu?
          </h3>
          <p>
            U ovoj verziji kapitalizacija je <strong>mjesečna</strong>, inflacija
            nije uključena, a stopa je <strong>stalna</strong> kroz cijeli period.
            Za drugačije scenarije promijeni ulazne vrijednosti i pokreni novi
            izračun.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="font-medium">Što prikazuje graf iznad tablice?</h3>
          <p>
            Stacked područja prikazuju <strong>glavnicu</strong> (donji sloj) i{" "}
            <strong>akumuliranu kamatu</strong> (gornji sloj), a linija prikazuje{" "}
            <strong>ukupni iznos</strong> kroz godine.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="font-medium">Pohranjuje li alat moje podatke?</h3>
          <p>
            Izračun se izvodi <strong>u pregledniku</strong>. Unosi se ne šalju
            na poslužitelj.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="font-medium">Je li ovo financijski savjet?</h3>
          <p>
            Nije. Rezultati su informativni i ovise o pretpostavkama koje unosiš.
          </p>
        </div>
      </section>
    </div>
  );
}
