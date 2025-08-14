// src/app/blog/[slug]/page.tsx
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import RichTextField from '@/components/RichTextField'
import Badge from '@/components/ui/Badge'
import { slugify } from '@/lib/utils/slugify'
import { humanizeCategory } from '@/lib/utils/humanize'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

// helper — strip origin if absolute
const toRelative = (u?: string) =>
  !u ? undefined : u.startsWith('http') ? new URL(u).pathname : u

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

  const post = docs[0]
  if (!post) notFound()

  const thumb = post.thumbnail as any
  const heroUrl =
    toRelative(thumb?.url) ??
    (thumb?.filename ? `/api/media/file/${thumb.filename}` : undefined)

  const category = humanizeCategory((post.category as string) ?? '')
  const dateISO = (post as any).date ?? (post as any).createdAt
  const dateLabel = dateISO ? new Date(dateISO).toLocaleDateString('hr-HR') : ''

  return (
    <article className="mx-auto max-w-4xl px-6 py-12">
      <Link href="/blog" className="mb-6 inline-block text-indigo-600 hover:underline">
        ← Natrag na sve objave
      </Link>

      <div className="mb-6 space-y-3">
        {category && <Badge>{category}</Badge>}
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">{String(post.title)}</h1>
        {dateLabel && <p className="text-sm text-zinc-500">{dateLabel}</p>}
      </div>

      {/* Option A — show full image, no crop */}
      {heroUrl && (
        <div className="relative mb-10 w-full h-72 md:h-96 bg-white border border-zinc-200 rounded-xl overflow-hidden">
          <Image
            src={heroUrl}
            alt={String(post.title)}
            fill
            className="object-contain p-3"  // no crop + breathing room
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