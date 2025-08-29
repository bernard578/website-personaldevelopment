// src/app/layout.tsx
import type { Metadata } from 'next'
import { Suspense } from 'react'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import GAReporter from '@/components/GAReporter'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://osobnirazvoj.hr'),
  alternates: { canonical: 'https://osobnirazvoj.hr/' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const GA_ID = 'G-GKV39BDX4F'

  return (
    <html lang="hr">
      <body>
        {children}
        <GoogleAnalytics GA_MEASUREMENT_ID={GA_ID} />
        <Suspense fallback={null}>
          <GAReporter GA_MEASUREMENT_ID={GA_ID} />
        </Suspense>
      </body>
    </html>
  )
}
