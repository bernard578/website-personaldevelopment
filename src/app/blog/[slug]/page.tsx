// src/app/blog/[slug]/page.tsx
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import RichTextField from '@/components/RichTextField'
import { slugify } from '@/utils/slugify'

export const revalidate = 60

interface Props {
  params: { slug: string }
}

export default async function PostPage({ params }: Props) {
  const normalizedSlug = slugify(params.slug)

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

  const thumb = post.thumbnail
  const img = typeof thumb === 'string' ? undefined : thumb?.url

  return (
    <article className="container mx-auto px-6 py-12">
      <Link href="/blog" className="block mb-6 text-indigo-600 hover:underline">
        ← Back to all posts
      </Link>

      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

      {img && (
        <div className="relative h-64 w-full mb-8">
          <Image src={img} alt={post.title as string} fill className="object-cover rounded" />
        </div>
      )}

      <RichTextField data={post.body} />
    </article>
  )
}
