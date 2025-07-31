// src/app/blog/[category]/[slug]/page.tsx

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// Client-side wrapper that renders the serialized MDX
import PostContent from '@/components/PostContent';

interface Props {
  params: {
    category: string;
    slug: string;
  };
}

// Pre-render all category/slug combinations at build time
export async function generateStaticParams() {
  const postsRoot = path.join(process.cwd(), 'content/posts');
  const categories = fs.readdirSync(postsRoot).filter(dir =>
    fs.statSync(path.join(postsRoot, dir)).isDirectory()
  );

  const params: { category: string; slug: string }[] = [];
  for (const category of categories) {
    const categoryDir = path.join(postsRoot, category);
    const files = fs.readdirSync(categoryDir).filter(f => /\.mdx?$/.test(f));
    for (const file of files) {
      params.push({
        category,
        slug: file.replace(/\.[^/.]+$/, ''),
      });
    }
  }
  return params;
}

export default async function PostPage({ params }: Props) {
  // Await params because Next.js dynamic APIs are now promises
  const { category, slug } = await params;
  const postPath = path.join(process.cwd(), 'content/posts', category, `${slug}.mdx`);

  if (!fs.existsSync(postPath)) {
    notFound();
  }

  // Read and parse front-matter
  const raw = fs.readFileSync(postPath, 'utf8');
  const { data, content } = matter(raw);

  // Dynamically import the serializer
  const { serialize } = await import('next-mdx-remote/serialize');
  const mdxSource = await serialize(content, { scope: data });

  return <PostContent mdxSource={mdxSource} />;

}
