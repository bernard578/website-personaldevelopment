// src/app/layout.tsx
import type { Metadata } from 'next'
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GAReporter from "@/components/GAReporter";
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://osobnirazvoj.hr'),
  alternates: { canonical: 'https://osobnirazvoj.hr/' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const GA_ID = "G-KN5Q4BVCWE";

  return (
    <html lang="hr">
      <body>
        {children}
        <GoogleAnalytics GA_MEASUREMENT_ID={GA_ID} />
        <GAReporter GA_MEASUREMENT_ID={GA_ID} />
      </body>
    </html>
  )
}
