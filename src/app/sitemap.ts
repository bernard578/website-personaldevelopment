// /src/app/sitemap.ts
import { MetadataRoute } from "next";
import { getPayload } from "payload";
import config from "@payload-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://osobnirazvoj.hr";

  const payload = await getPayload({ config });
  const { docs: posts } = await payload.find({
    collection: "posts",
    pagination: false,
    sort: "-updatedAt",
  });

  const blogUrls: MetadataRoute.Sitemap = posts.map((post: any) => {
    const lmStr =
      (post.updatedAt as string | undefined) ??
      (post.createdAt as string | undefined);
    const lastMod = lmStr ? new Date(lmStr) : new Date();

    return {
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: lastMod,              // string | Date is OK
      changeFrequency: "monthly",         // 👈 literal, not string
      priority: 0.7,
    };
  });

  // Return typed array; using `satisfies` keeps literal types intact
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
