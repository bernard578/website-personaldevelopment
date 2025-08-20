import { MetadataRoute } from "next";
import { getPayload } from "payload";
import config from "@payload-config";

// Define the fields we care about from Payload
interface BlogPost {
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://osobnirazvoj.hr";

  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "posts",
    pagination: false,
    sort: "-updatedAt",
  });

  const posts = docs as BlogPost[];

  const blogUrls: MetadataRoute.Sitemap = posts.map((post) => {
    const lmStr = post.updatedAt ?? post.createdAt;
    const lastMod = lmStr ? new Date(lmStr) : new Date();

    return {
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: lastMod,
      changeFrequency: "monthly",
      priority: 0.7,
    };
  });

  return [
    {
      url: baseUrl,
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
  ] satisfies MetadataRoute.Sitemap;
}
