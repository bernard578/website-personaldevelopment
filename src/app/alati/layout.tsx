import Link from 'next/link'
import type { ReactNode } from 'react'

export default function AlatiLayout({ children }: { children: ReactNode }) {
  const links = [
    { href: '/alati', label: '📂 Svi alati' },
    { href: '/alati/pomodoro', label: '⏳ Pomodoro Timer' },
    { href: '/alati/stopwatch', label: '⏱️ Stopwatch' },
  ]

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Alati</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="md:col-span-1 bg-gray-100 p-4 rounded-lg shadow">
          <nav>
            <ul className="space-y-2">
              {links.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block px-3 py-2 rounded hover:bg-indigo-200 hover:text-indigo-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Glavni sadržaj */}
        <section className="md:col-span-3">{children}</section>
      </div>
    </div>
  )
}