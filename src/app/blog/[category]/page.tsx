// src/app/blog/[category]/page.tsx
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { notFound } from 'next/navigation';

interface Props {
  params: { category: string };
}

const ALL_CATEGORIES: Record<string, string> = {
  financije: 'Finance',
  trening: 'Working Out',
  mindfulness: 'Mindfulness',
  produktivnost: 'Productivity',
};

export default async function CategoryPage({ params }: Props) {
  // await the params promise first
  const { category } = await params;
  const title = ALL_CATEGORIES[category];

  if (!title) {
    notFound();
  }

  // replace this with your real data‐fetch
  const posts = [
    { slug: 'ulaganje-u-fondove', title: 'Ulaganje u fondove' },
    { slug: 'kako-sastaviti-budzet', title: 'Kako sastaviti budžet' },
  ];

  return (
    <main className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold mb-6">{title}</h1>
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <Card key={post.slug} className="hover:shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold">{post.title}</h2>
                <Link
                  href={`/blog/${category}/${post.slug}`}
                  className="mt-2 inline-block text-indigo-600 hover:underline"
                >
                  Read more →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  const slugs = Object.keys(ALL_CATEGORIES);
  return slugs.map((category) => ({ category }));
}
