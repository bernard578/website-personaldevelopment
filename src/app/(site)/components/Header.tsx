'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Header() {
  const pathname = usePathname();
  const showCta = pathname === '/'; // CTA only on homepage

  return (
    <header className="container mx-auto p-6 flex justify-between items-center">
      <Link href="/" className="text-3xl font-bold hover:underline">OsobniRazvoj</Link>
      <nav className="flex items-center gap-4">
        <Link href="/blog" className="hover:underline">Blog</Link>
        <Link href="/alati" className="hover:underline">Alati</Link>
        {showCta && (
          <Link href="/blog">
            <Button variant="default">Započni</Button>
          </Link>
        )}
      </nav>
    </header>
  );
}
