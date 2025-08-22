import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import Header from './components/Header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  weight: ['300','400','500','600','700'],
});
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://osobnirazvoj.hr'),
  alternates: { canonical: 'https://osobnirazvoj.hr/', languages: { hr: '/', 'x-default': '/' } },
  title: { default: 'OsobniRazvoj', template: '%s · OsobniRazvoj' },
  description:
    'Alati za osobni razvoj: blog o financijama, upravljanje vremenom, pomodoro timer i još mnogo toga.',
  openGraph: {
    title: 'OsobniRazvoj',
    description:
      'Alati za osobni razvoj: blog o financijama, upravljanje vremenom, pomodoro timer i još mnogo toga.',
    url: '/',
    siteName: 'OsobniRazvoj',
    type: 'website',
  },
};

export default function SiteGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-white text-zinc-900 antialiased`}>
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="py-6 text-center bg-white border-t border-gray-200 text-gray-600">
        <p>© {new Date().getFullYear()} OsobniRazvoj. Sva prava pridržana.</p>
      </footer>
    </div>
  );
}
