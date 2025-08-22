// src/app/layout.tsx  (root)
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://osobnirazvoj.hr'),
  alternates: { canonical: 'https://osobnirazvoj.hr/' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hr">
      <body>{children}</body>
    </html>
  )
}
