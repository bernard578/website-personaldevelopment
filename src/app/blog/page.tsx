// src/app/blog/page.tsx

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PostMeta {
  slug: string;
  title: string;
}

interface CategoryBlock {
  category: string;
  displayName: string;
  posts: PostMeta[];
}

export default function BlogIndexPage() {
  const postsRoot = path.join(process.cwd(), 'content/posts');
  if (!fs.existsSync(postsRoot)) {
    notFound();
  }
  
  const categories = fs
    .readdirSync(postsRoot)
    .filter((dir) => fs.statSync(path.join(postsRoot, dir)).isDirectory());

  const blocks: CategoryBlock[] = [];

  for (const category of categories) {
    const dirPath = path.join(postsRoot, category);
    const files = fs.readdirSync(dirPath).filter((f) => /\.mdx?$/.test(f));
    if (files.length === 0) continue; // skip empty

    // Map front-matter titles
    const metas = files.map((file) => {
      const slug = file.replace(/\.[^/.]+$/, '');
      const raw = fs.readFileSync(path.join(dirPath, file), 'utf8');
      const { data } = matter(raw);
      return { slug, title: data.title ?? slug };
    });

    // Limit to first 2 posts
    const posts = metas.slice(0, 2);
    blocks.push({ category, displayName: capitalize(category), posts });
  }

  return (
    <main className="container mx-auto py-12 px-6">
      {blocks.map(({ category, displayName, posts }) => (
        <section key={category} className="mb-10">
          <h2 className="text-3xl font-bold mb-4">{displayName}</h2>
          <ul className="list-disc list-inside space-y-2">
            {posts.map(({ slug, title }) => (
              <li key={slug}>
                <Link
                  href={`/blog/${category}/${slug}`}
                  className="text-indigo-600 hover:underline"
                >
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
