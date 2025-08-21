// src/app/layout.tsx
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '../globals.css'
// import Nav from '@/components/Nav'   // optional
// import Footer from '@/components/Footer' // optional

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  weight: ['300','400','500','600','700'],
})
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://osobnirazvoj.hr'), // set your real domain
  alternates: { canonical: '/' },
  title: {
    default: 'OsobniRazvoj',
    template: '%s · OsobniRazvoj',
  },
  description:
    'Alati za osobni razvoj: blog o financijama, upravljanje vremenom, alati\
    kao što su pomodoro timer, štoperica i još mnogo toga.',
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'OsobniRazvoj',
    description:
      'Alati za osobni razvoj: blog o financijama, upravljanje vremenom, alati\
    kao što su pomodoro timer, štoperica i još mnogo toga.',
    url: '/',
    siteName: 'OsobniRazvoj',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-white text-zinc-900 antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          {/* <Nav /> */}
          <main className="flex-1">{children}</main>
          {/* <Footer /> */}
        </div>
      </body>
    </html>
  )
}