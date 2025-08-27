'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Header() {
  const pathname = usePathname();
  const showCta = pathname === '/'; // CTA only on homepage

  return (
    <header className="container mx-auto p-6 flex justify-between items-center">
      <Link href="/" className="flex items-center gap-2">
        {/* ✅ Logo on the left */}
        <Image 
          src="/logo.png" 
          alt="Osobni Razvoj Logo" 
          width={40} 
          height={40} 
          priority 
        />
        <span className="text-3xl font-bold hover:underline">OsobniRazvoj</span>
      </Link>
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
