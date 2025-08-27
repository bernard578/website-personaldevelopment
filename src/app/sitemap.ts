// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { getPayload } from "payload";
import config from "@payload-config";

interface BlogPost {
  slug: string;
  _status?: "draft" | "published";
  createdAt?: string;
  updatedAt?: string;
  date?: string;
}

const baseUrl = "https://osobnirazvoj.hr";

const safeDate = (iso?: string) => (iso ? new Date(iso) : new Date());

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // --- Blog posts from Payload (published only)
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "posts",
    pagination: false,
    sort: "-updatedAt",
    depth: 0,
    where: {
      and: [{ _status: { equals: "published" } }, { slug: { exists: true } }],
    },
  });

  const posts = (docs as BlogPost[]).filter((p) => typeof p.slug === "string" && p.slug.trim());

  const blogUrls: MetadataRoute.Sitemap = posts.map((post) => {
    const lmStr = post.updatedAt ?? post.date ?? post.createdAt;
    return {
      url: `${baseUrl}/blog/${encodeURIComponent(post.slug)}`,
      lastModified: safeDate(lmStr),
      changeFrequency: "monthly",
      priority: 0.7,
    };
  });

  // --- Static pages
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`, // keep only root with trailing slash if your canonicals do that
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/alati`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/alati/pomodoro`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/alati/stopwatch`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/alati/compound-interest-calculator`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },

  ];

  return [...staticUrls, ...blogUrls];
}
