// src/app/blog/page.tsx
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Card, CardContent } from '@/components/ui/card'

export const revalidate = 60

// Humanize a slug like "upravljanje-vremenom" → "Upravljanje Vremenom"
function humanizeCategory(slug: string) {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export default async function BlogPage() {
  const payload = await getPayload({ config })
  const { docs: posts } = await payload.find({
    collection: 'posts',
    where: { _status: {equals: 'published'} },
    sort: '-createdAt',
    depth: 1,
    pagination: false,
  })

  return (
    <main className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">All Posts</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const title     = post.title as string
          const postSlug  = post.slug  as string  // ← use the real slug from Payload
          const catSlug   = post.category as string
          const category  = humanizeCategory(catSlug)

          const thumb      = post.thumbnail
          const thumbnailUrl = typeof thumb === 'string' ? undefined : thumb?.url

          return (
            <Card key={post.id} className="hover:shadow-lg">
              <Link href={`/blog/${postSlug}`} className="block">
                {thumbnailUrl && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={thumbnailUrl}
                      alt={title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                )}
                <CardContent className="p-4">
                  <p className="text-sm text-gray-500 mb-1">{category}</p>
                  <h2 className="text-xl font-semibold mb-2">{title}</h2>
                  <p className="text-indigo-600 hover:underline">Read more →</p>
                </CardContent>
              </Link>
            </Card>
          )
        })}
      </div>
    </main>
  )
}
