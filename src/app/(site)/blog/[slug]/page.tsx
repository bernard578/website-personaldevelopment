// src/app/(site)/blog/[slug]/page.tsx
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import RichTextField from '@/components/RichTextField'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'

// ----- Strong types -----
type RichTextData = React.ComponentProps<typeof RichText>['data']

type Media =
  | { url?: string | null; filename?: string | null }
  | string
  | null
  | undefined

type SEO = {
  metaTitle?: string | null
  metaDescription?: string | null
}

type Post = {
  id: string
  title: string
  slug: string
  body: RichTextData
  thumbnail?: Media
  date?: string | null
  createdAt?: string | null
  _status?: 'draft' | 'published'
  seo?: SEO | null
}

export const revalidate = 60
type Props = { params: Promise<{ slug: string }> }

// ----- helpers -----
const toRelative = (u?: string | null) => {
  if (!u) return undefined
  try {
    return u.startsWith('http') ? new URL(u).pathname : u
  } catch {
    return u ?? undefined
  }
}

function mediaUrl(m: Media) {
  if (!m || typeof m === 'string') return undefined
  const fromUrl = toRelative(m.url ?? undefined)
  if (fromUrl) return fromUrl
  return m.filename ? `/media/${m.filename}` : undefined
}

async function fetchPostBySlug(slug: string): Promise<Post | null> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })
  return (docs?.[0] as unknown as Post) ?? null
}

// ----- Next Metadata (title + description only) -----
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await fetchPostBySlug(slug)
  if (!post) return {}

  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || undefined,
  }
}

// ----- Page -----
export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await fetchPostBySlug(slug)
  if (!post) notFound()

  const heroUrl = mediaUrl(post.thumbnail)
  const dateISO = post.date ?? post.createdAt ?? null
  const dateLabel = dateISO ? new Date(dateISO).toLocaleDateString('hr-HR') : ''

  return (
    <article className="mx-auto max-w-4xl px-6 py-12">
      <Link href="/blog" className="mb-6 inline-block text-indigo-600 hover:underline">
        ← Natrag na sve objave
      </Link>

      <div className="mb-6 space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">{post.title}</h1>
        {dateLabel && <p className="text-sm text-zinc-500">{dateLabel}</p>}
      </div>

      {heroUrl && (
        // Fixed-height, no-crop wrapper; whole image is visible
        <div className="relative mb-10 w-full overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <div className="relative w-full h-72 md:h-96">
            <Image
              src={heroUrl}
              alt={post.title}
              fill
              className="object-contain p-3"   // <-- key: contain + padding, no cropping
              sizes="(max-width: 768px) 100vw, 896px"
              priority={false}
            />
          </div>
        </div>
      )}

      <div className="prose prose-zinc max-w-none">
        <RichTextField data={post.body} />
      </div>
    </article>
  )
}
