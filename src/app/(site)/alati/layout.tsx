'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SiteLayout from '@/app/(site)/components/layouts/SiteLayout';

const tools = [
  { href: '/alati', label: 'Svi alati', icon: '📂' },
  { href: '/alati/pomodoro', label: 'Pomodoro Timer', icon: '⏳' },
  { href: '/alati/stopwatch', label: 'Stopwatch', icon: '⏱️' },
];

export default function AlatiLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <SiteLayout variant="simple" showCta={false}>
      <div className="container mx-auto px-6 py-8 grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3">
          <nav className="rounded-xl bg-gray-100 p-3 ring-1 ring-gray-200">
            <ul className="space-y-1">
              {tools.map((t) => {
                const active =
                  pathname === t.href ||
                  (t.href !== '/alati' && pathname?.startsWith(t.href));

                return (
                  <li key={t.href}>
                    <Link
                      href={t.href}
                      className={[
                        'flex items-center gap-2 rounded-lg px-3 py-2 text-sm',
                        active
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-700 hover:bg-gray-200',
                      ].join(' ')}
                    >
                      <span className="w-5 text-center">{t.icon}</span>
                      <span>{t.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <div className="col-span-12 md:col-span-9">
          <div className="rounded-xl bg-gray-50 p-6 ring-1 ring-gray-200">
            {children}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
