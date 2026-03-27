// src/app/(site)/blog/[slug]/page.tsx
import { cache } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import RichTextField from '@/components/RichTextField'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { mediaUrl } from '@/lib/media'
import type { Metadata } from 'next'


const BASE_URL = "https://osobnirazvoj.hr";

// ----- Strong types -----
type RichTextData = React.ComponentProps<typeof RichText>['data']

type SEO = {
  metaTitle?: string | null
  metaDescription?: string | null
}

type Post = {
  id: string
  title: string
  slug: string
  body: RichTextData
  thumbnail?: Parameters<typeof mediaUrl>[0]
  date?: string | null
  createdAt?: string | null
  _status?: 'draft' | 'published'
  seo?: SEO | null
}


export const revalidate = 60
type Props = { params: Promise<{ slug: string }> }

const fetchPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })
  return (docs?.[0] as unknown as Post) ?? null
})

// ----- Next Metadata (title + description only) -----
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; // if you keep Promise, do: const { slug } = await params;
  const post = await fetchPostBySlug(slug);
  if (!post) return {};

  const title = post.seo?.metaTitle || post.title;
  const description = post.seo?.metaDescription || undefined;
  const canonical = `${BASE_URL}/blog/${encodeURIComponent(slug)}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: { url: canonical, title, description },
    twitter: { card: "summary_large_image", title, description },
  };
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
