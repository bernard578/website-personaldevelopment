import type { Metadata } from "next";
import SiteLayout from "@/app/(site)/components/layouts/SiteLayout";
import HeroSection from "./HeroSection"; // 👈 client component

export const metadata: Metadata = {
  alternates: { canonical: "https://osobnirazvoj.hr/" },
  title: "OsobniRazvoj",
  description:
    "Tvoje odredište za znanje o financijama, upravljanju vremenom, razvoju navika i osobnom rastu – sve na jednom mjestu.",
};

export default function Home() {
  return (
    <SiteLayout variant="colorful">
      <HeroSection />
    </SiteLayout>
  );
}
