'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

interface SiteLayoutProps {
  children: ReactNode;
  showCta?: boolean;
  ctaHref?: string;
  ctaLabel?: string;
  variant?: 'colorful' | 'simple';
}

export default function SiteLayout({
  children,
  showCta = true,
  ctaHref = '/blog',
  ctaLabel = 'Započni',
  variant = 'colorful',
}: SiteLayoutProps) {
  const mainClasses =
    variant === 'colorful'
      ? 'min-h-screen flex flex-col bg-gradient-to-br from-blue-500 via-violet-500 to-indigo-600 text-white'
      : 'min-h-screen flex flex-col bg-gray-50 text-gray-900';

  return (
    <main className={mainClasses}>
      {/* Header */}
      <header className="container mx-auto p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">OsobniRazvoj</h1>
        <nav className="flex items-center gap-4">
          <Link href="/blog" className="hover:underline">Blog</Link>
          <Link href="/alati" className="hover:underline">Alati</Link>
          {showCta && (
            <Link href={ctaHref}>
              <Button variant={variant === 'colorful' ? 'secondary' : 'default'}>
                {ctaLabel}
              </Button>
            </Link>
          )}
        </nav>
      </header>

      {/* Content */}
      <div className="flex-1">{children}</div>

      {/* Footer */}
      <footer className={`py-6 text-center ${
        variant === 'colorful'
          ? 'bg-gray-900 text-gray-200'
          : 'bg-white border-t border-gray-200 text-gray-600'
      }`}>
        <p>© {new Date().getFullYear()} OsobniRazvoj. Sva prava pridržana.</p>
      </footer>
    </main>
  );
}
