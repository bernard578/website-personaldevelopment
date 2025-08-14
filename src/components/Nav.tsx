'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Container from '@/components/Container'

export default function Nav() {
  const pathname = usePathname()

  const link = (href: string, label: string) => {
    const active = pathname?.startsWith(href)
    return (
      <Link
        href={href}
        className={`px-3 py-2 rounded-md text-sm font-medium ${
          active ? 'bg-zinc-100' : 'hover:bg-zinc-100'
        }`}
      >
        {label}
      </Link>
    )
  }

  return (
    <header className="border-b border-zinc-200">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="font-semibold">GrowMe</Link>
        <nav className="flex items-center gap-1">
          {link('/blog', 'Blog')}
          {link('/alati', 'Alati')}
          <Link
            href="/get-started"
            className="ml-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Get Started
          </Link>
        </nav>
      </Container>
    </header>
  )
}
