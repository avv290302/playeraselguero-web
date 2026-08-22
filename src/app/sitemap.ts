import type { MetadataRoute } from "next";

import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://playeraselguero.com";

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("slug, updated_at")
    .eq("active", true)
    .order("sort_order", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Error generando sitemap desde Supabase:",
      error
    );
  }

  const productPages: MetadataRoute.Sitemap =
    (data ?? []).map((product) => ({
      url: `${baseUrl}/producto/${product.slug}`,
      lastModified: product.updated_at
        ? new Date(product.updated_at)
        : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },

    ...productPages,
  ];
}