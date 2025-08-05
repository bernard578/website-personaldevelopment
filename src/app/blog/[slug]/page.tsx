// src/app/blog/[slug]/page.tsx
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import RichTextRenderer from '@/components/RichTextRenderer'

export const revalidate = 60

// same slugify helper as above
function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'posts',
    pagination: false,
  })

  // build one { slug } per post
  return docs.map((d) => ({
    slug: slugify(d.title as string),
  }))
}

interface Props {
  params: { slug: string }
}

export default async function PostPage({ params: { slug } }: Props) {
  const payload = await getPayload({ config })
  // fetch all posts (you could select fewer fields too)
  const { docs: posts } = await payload.find({
    collection: 'posts',
    pagination: false,
    depth: 2,
  })

  // find by matching slugified title
  const post = posts.find((p) => slugify(p.title as string) === slug)
  if (!post) notFound()

  const title = post.title as string
  const catSlug = post.category as string
  const categoryLabel = catSlug
    .split('-')
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join(' ')

const thumb = post.thumbnail
const thumbnailUrl =
  thumb && typeof thumb !== 'string'
    ? thumb.url          // here TS knows `thumb` is a Media object
    : undefined

  return (
    <article className="container mx-auto px-6 py-12">
      <Link href="/blog" className="inline-block text-indigo-600 hover:underline mb-6">
        ← Back to all posts
      </Link>
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-sm text-gray-500 mb-6">{categoryLabel}</p>

      {thumbnailUrl && (
        <div className="relative h-64 w-full mb-8">
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="object-cover rounded"
          />
        </div>
      )}

      <RichTextRenderer data={post.body} />
    </article>
  )
}
