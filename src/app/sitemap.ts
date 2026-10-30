import { MetadataRoute } from "next";
import { getBranches } from "@/lib/db-services";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.dkdancecompany.com";

  const branches = await getBranches();
  const activeBranches = branches.filter((b) => b.isActive !== false);

  const baselineDate = new Date("2026-10-30");

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: baselineDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/classes`,
      lastModified: baselineDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/branches`,
      lastModified: baselineDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: baselineDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/dance-styles`,
      lastModified: baselineDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/online-classes`,
      lastModified: baselineDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: baselineDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: baselineDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/videos`,
      lastModified: baselineDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: baselineDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/rules`,
      lastModified: baselineDate,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: baselineDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: baselineDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const branchRoutes: MetadataRoute.Sitemap = activeBranches.map((branch) => ({
    url: `${baseUrl}/branches/${branch.slug}`,
    lastModified: (branch as any).updatedAt ? new Date((branch as any).updatedAt) : baselineDate,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...branchRoutes];
}
