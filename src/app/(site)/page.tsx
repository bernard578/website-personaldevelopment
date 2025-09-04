'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import SiteLayout from "@/app/(site)/components/layouts/SiteLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://osobnirazvoj.hr/", // homepage canonical
  },
  title: "OsobniRazvoj",
  description:
    "Tvoje odredište za znanje o financijama, upravljanju vremenom, razvoju navika i osobnom rastu - sve na jednom mjestu.",
};

export default function Home() {
  return (
    <SiteLayout variant='colorful'>
      <section className="flex items-center justify-center text-center px-6 py-20">
        <div>
          <motion.h2
            className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Otključaj svoju najbolju verziju
          </motion.h2>
          <p className="max-w-2xl mx-auto text-lg md:text-xl mb-8">
            Tvoje odredište za znanje o financijama, upravljanju vremenom, 
            razvoju navika i osobnom rastu – sve na jednom mjestu.
          </p>
          <Button size="lg" asChild className="text-lg font-semibold shadow-xl">
            <Link href="/blog">Započni Svoje Putovanje</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
