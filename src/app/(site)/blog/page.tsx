// src/app/(site)/blog/page.tsx
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Card, CardContent } from '@/components/ui/card'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Svi članci o osobnom razvoju: financije, vrijeme, navike…',
  alternates: { canonical: '/blog' },
}

type Media =
  | { url?: string | null; filename?: string | null }
  | string
  | null
  | undefined

function toRelative(u?: string | null) {
  if (!u) return undefined
  try { return u.startsWith('http') ? new URL(u).pathname : u } catch { return u ?? undefined }
}
function mediaUrl(m: Media) {
  if (!m || typeof m === 'string') return undefined
  const fromUrl = toRelative(m.url ?? undefined)
  return fromUrl || (m.filename ? `/media/${m.filename}` : undefined)
}
function humanizeCategory(slug?: string | null) {
  if (!slug) return ''
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export default async function BlogPage() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    sort: '-date',
    depth: 1,
    pagination: false,
  })

  const posts = docs ?? []

  return (
    <section className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Svi članci</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: any) => {
          const title = String(post.title)
          const postSlug = String(post.slug)
          const thumbnailUrl = mediaUrl(post.thumbnail)
          const category = humanizeCategory(post.category)

          return (
            <Card key={post.id} className="rounded-xl border border-zinc-200 bg-white shadow-sm hover:shadow-md overflow-hidden">
              <Link href={`/blog/${postSlug}`} className="block">
                {thumbnailUrl && (
                  <div className="relative w-full h-48 bg-white">
                    <Image
                      src={thumbnailUrl}
                      alt={title}
                      fill
                      className="object-contain p-2"   // keep full image visible
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading="lazy"
                    />
                  </div>
                )}
                <CardContent className="p-4 space-y-2">
                  {!!category && <span className="text-xs text-zinc-600">{category}</span>}
                  <h2 className="text-lg font-semibold leading-snug line-clamp-2">{title}</h2>
                  <p className="text-sm text-indigo-600">Pročitaj više →</p>
                </CardContent>
              </Link>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
