// src/app/blog/page.tsx
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Card, CardContent } from '@/components/ui/card'
import Badge from '@/components/ui/Badge'
import SiteLayout from '@/app/(site)/components/layouts/SiteLayout'
import type { Metadata } from 'next'

export const revalidate = 60

// ✅ Canonical & basic SEO for the listing page
export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Svi članci na temu osobnog razvoja: financije, upravljanje vremenom, navike i još mnogo toga.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog · OsobniRazvoj',
    description:
      'Svi članci na temu osobnog razvoja: financije, upravljanje vremenom, navike i još mnogo toga.',
    url: '/blog',
    type: 'website',
  },
}

type Media =
  | { url?: string | null; filename?: string | null }
  | string
  | null
  | undefined

type Post = {
  id: string
  title: string
  slug: string
  category?: string | null
  thumbnail?: Media
  _status?: 'draft' | 'published'
  date?: string | null
  createdAt?: string | null
}

function toRelative(u?: string | null) {
  if (!u) return undefined
  try {
    return u.startsWith('http') ? new URL(u).pathname : u
  } catch {
    return u ?? undefined
  }
}

// Prefer asset .url (relative if possible); fallback to /media/<filename>
function mediaUrl(m: Media) {
  if (!m || typeof m === 'string') return undefined
  const fromUrl = toRelative(m.url ?? undefined)
  if (fromUrl) return fromUrl
  return m.filename ? `/media/${m.filename}` : undefined
}

function humanizeCategory(slug?: string | null) {
  if (!slug) return ''
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export default async function BlogPage() {
  const payload = await getPayload({ config })

  // Only published posts; newest first (prefer `date`, fallback to createdAt)
  const { docs } = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    sort: '-date',
    depth: 1,
    pagination: false,
  })

  // Ensure correct shape
  const posts = (docs as unknown as Post[])
    // If some posts lack `date`, do a stable secondary sort by createdAt
    .sort((a, b) => {
      const ad = a.date ?? a.createdAt ?? ''
      const bd = b.date ?? b.createdAt ?? ''
      return ad > bd ? -1 : ad < bd ? 1 : 0
    })

  return (
    <SiteLayout showCta={false} variant="simple">
      <section className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">Svi članci</h1>

        {posts.length === 0 ? (
          <p className="text-zinc-600">Još nema objavljenih članaka.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const title = String(post.title)
              const postSlug = String(post.slug)
              const thumbnailUrl = mediaUrl(post.thumbnail)
              const category = humanizeCategory(post.category)

              return (
                <Card
                  key={post.id}
                  className="rounded-xl border border-zinc-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden text-gray-900"
                >
                  <Link href={`/blog/${postSlug}`} className="block">
                    {thumbnailUrl && (
                      <div className="relative w-full h-48 bg-white">
                        <Image
                          src={thumbnailUrl}
                          alt={title}
                          fill
                          // object-contain keeps logos/transparent images tidy;
                          // switch to object-cover if you want full-bleed crops
                          className="object-contain p-2"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <CardContent className="p-4 space-y-2">
                      {!!category && <Badge>{category}</Badge>}
                      <h2 className="text-lg font-semibold leading-snug line-clamp-2">
                        {title}
                      </h2>
                      <p className="text-sm text-indigo-600">Pročitaj više →</p>
                    </CardContent>
                  </Link>
                </Card>
              )
            })}
          </div>
        )}
      </section>
    </SiteLayout>
  )
}
