// src/app/(site)/alati/stopwatch/page.tsx
import type { Metadata } from "next";
import StopwatchClient from "./StopwatchClient";

export const metadata: Metadata = {
  title: "Štoperica online – Precizna štoperica s milisekundama i krugovima | Alati",
  description: "Besplatna online štoperica s milisekundama, krugovima i tipkovničkim prečacima. Koristite našu digitalnu štopericu za trening, učenje i mjerenje vremena.",
  alternates: { canonical: "https://osobnirazvoj.hr/alati/stopwatch" },
  openGraph: {
    title: "Štoperica online · Alati",
    description: "Besplatna online štoperica s milisekundama, krugovima i tipkovničkim prečacima.",
    url: "https://osobnirazvoj.hr/alati/stopwatch",
    images: [{ url: "/og/stopwatch.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Štoperica online · Alati",
    description: "Besplatna online štoperica s milisekundama, krugovima i tipkovničkim prečacima.",
    images: ["/og/stopwatch.png"],
  },
};


export default function Page() {
  return <StopwatchClient />;
}
