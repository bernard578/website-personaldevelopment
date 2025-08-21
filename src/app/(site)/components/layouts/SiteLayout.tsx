// src/app/(site)/components/layouts/SiteLayout.tsx
'use client';

import { ReactNode } from 'react';

interface SiteLayoutProps {
  children: ReactNode;
  variant?: 'colorful' | 'simple';
  // NEW: disable chrome (header/footer) by default
  withChrome?: boolean;
}

export default function SiteLayout({
  children,
  variant = 'colorful',
  withChrome = false, // <-- off by default
}: SiteLayoutProps) {
  const mainClasses =
    variant === 'colorful'
      ? 'min-h-screen flex flex-col bg-gradient-to-br from-blue-500 via-violet-500 to-indigo-600 text-white'
      : 'min-h-screen flex flex-col bg-gray-50 text-gray-900';

  return (
    <main className={mainClasses}>
      {/* render nothing extra unless explicitly requested */}
      {withChrome ? (
        <>
          {/* put your header here only if you ever need a page-specific header */}
          <div className="container mx-auto p-6" />
          <div className="flex-1">{children}</div>
          <footer className="py-6 text-center bg-white border-t border-gray-200 text-gray-600">
            <p>© {new Date().getFullYear()} OsobniRazvoj. Sva prava pridržana.</p>
          </footer>
        </>
      ) : (
        <div className="flex-1">{children}</div>
      )}
    </main>
  );
}
