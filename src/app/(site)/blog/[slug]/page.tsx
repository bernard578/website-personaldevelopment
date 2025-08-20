// src/app/(site)/blog/[slug]/page.tsx
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import RichTextField from '@/components/RichTextField'
import Badge from '@/components/ui/Badge'
import { slugify } from '@/lib/utils/slugify'
import { humanizeCategory } from '@/lib/utils/humanize'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type React from 'react'

// infer the exact type that RichText expects
type RichTextData = React.ComponentProps<typeof RichText>['data']

type Media =
  | { url?: string | null; filename?: string | null }
  | string
  | null
  | undefined

type Post = {
  id: string
  title: string
  slug: string
  body: RichTextData
  category?: string | null
  thumbnail?: Media
  date?: string | null
  createdAt?: string | null
  _status?: 'draft' | 'published'
}

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

// helper — strip origin if absolute
const toRelative = (u?: string | null) => {
  if (!u) return undefined
  try {
    return u.startsWith('http') ? new URL(u).pathname : u
  } catch {
    return u
  }
}

// ✅ Small frontend fallback: prefer doc.url, else /media/<filename>
function mediaUrl(m: Media) {
  if (!m || typeof m === 'string') return undefined
  const fromUrl = toRelative(m.url ?? undefined)
  if (fromUrl) return fromUrl
  return m.filename ? `/media/${m.filename}` : undefined
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const normalizedSlug = slugify(slug)

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'posts',
    where: {
      and: [
        { slug: { equals: normalizedSlug } },
        { _status: { equals: 'published' } },
      ],
    },
    depth: 2,
    limit: 1,
  })

  const post = docs[0] as unknown as Post
  if (!post) notFound()

  const heroUrl = mediaUrl(post.thumbnail)

  const category = humanizeCategory(post.category ?? '')
  const dateISO = post.date ?? post.createdAt ?? null
  const dateLabel = dateISO ? new Date(dateISO).toLocaleDateString('hr-HR') : ''

  return (
    <article className="mx-auto max-w-4xl px-6 py-12">
      <Link
        href="/blog"
        className="mb-6 inline-block text-indigo-600 hover:underline"
      >
        ← Natrag na sve objave
      </Link>

      <div className="mb-6 space-y-3">
        {category && <Badge>{category}</Badge>}
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">
          {String(post.title)}
        </h1>
        {dateLabel && <p className="text-sm text-zinc-500">{dateLabel}</p>}
      </div>

      {heroUrl && (
        <div className="relative mb-10 w-full h-72 md:h-96 bg-white border border-zinc-200 rounded-xl overflow-hidden">
          <Image
            src={heroUrl}
            alt={String(post.title)}
            fill
            className="object-contain p-3"
            sizes="100vw"
            priority
          />
        </div>
      )}

      <div className="prose prose-zinc max-w-none">
        <RichTextField data={post.body} />
      </div>
    </article>
  )
}
