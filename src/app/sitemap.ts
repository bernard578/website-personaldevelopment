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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "posts",
    pagination: false,
    sort: "-updatedAt",
    depth: 0,
    where: {
      and: [
        { _status: { equals: "published" } },
        { slug: { exists: true } },
      ],
    },
  });

  const posts = (docs as BlogPost[]).filter(
    (p) => typeof p.slug === "string" && p.slug.trim()
  );

  const blogUrls: MetadataRoute.Sitemap = posts.map((post) => {
    const lmStr = post.updatedAt ?? post.date ?? post.createdAt;
    const lastMod = lmStr ? new Date(lmStr) : new Date();

    return {
      url: `${baseUrl}/blog/${encodeURIComponent(post.slug)}`,
      lastModified: lastMod,
      changeFrequency: "monthly",
      priority: 0.7,
    };
  });

  return [
    {
      url: `${baseUrl}/`, // ✅ trailing slash to match canonical
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
    ...blogUrls,
  ];
}
