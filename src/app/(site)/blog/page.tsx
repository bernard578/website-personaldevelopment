// src/app/(site)/blog/page.tsx
import Image from "next/image"
import Link from "next/link"
import { getPayload } from "payload"
import config from "@payload-config"
import { Card, CardContent } from "@/components/ui/card"
import Badge from "@/components/ui/Badge"

export const revalidate = 60

// ⬇️ helper: napravi relativan URL ako dođe absolutni
function toRelative(u?: string) {
  if (!u) return undefined
  return u.startsWith("http") ? new URL(u).pathname : u
}

export default async function BlogPage() {
  const payload = await getPayload({ config })
  const { docs: posts } = await payload.find({
    collection: "posts",
    where: { _status: { equals: "published" } },
    sort: "-date",
    depth: 1,
    pagination: false,
  })

  return (
    <main className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">All Posts</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const title = post.title as string
          const postSlug = post.slug as string

          // ⬇️ thumbnail može biti povezan dokument (object) – uzmi .url ili .filename
          const thumb = post.thumbnail as any
          const thumbnailUrl =
            toRelative(thumb?.url) ??
            (thumb?.filename ? `/api/media/file/${thumb.filename}` : undefined)

          return (
            <Card key={post.id} className="rounded-xl border border-zinc-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <Link href={`/blog/${postSlug}`} className="block">
                {thumbnailUrl && (
                  <div className="relative w-full h-48 bg-white">
                    <Image
                      src={thumbnailUrl}
                      alt={title}
                      fill
                      className="object-contain p-2"   // ⬅️ no crop + some breathing room
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                )}
                <CardContent className="p-4 space-y-2">
                  {post.category && <Badge>{String(post.category).replace(/-/g, " ")}</Badge>}
                  <h2 className="text-lg font-semibold leading-snug line-clamp-2">{title}</h2>
                  <p className="text-sm text-indigo-600">Read more →</p>
                </CardContent>
              </Link>
            </Card>
          )
        })}
      </div>
    </main>
  )
}