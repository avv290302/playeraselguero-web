import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { createClient } from "@/lib/supabase/server";

import ProductClient from "./ProductClient";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function getCollectionName(collection: unknown) {
  if (
    collection &&
    typeof collection === "object" &&
    !Array.isArray(collection) &&
    "name" in collection
  ) {
    const name = (collection as { name?: unknown }).name;

    return typeof name === "string" ? name : "";
  }

  if (
    Array.isArray(collection) &&
    collection.length > 0
  ) {
    const firstCollection = collection[0];

    if (
      firstCollection &&
      typeof firstCollection === "object" &&
      "name" in firstCollection
    ) {
      const name = (
        firstCollection as { name?: unknown }
      ).name;

      return typeof name === "string" ? name : "";
    }
  }

  return "";
}

function normalizeProduct(data: {
  id: string;
  slug: string;
  name: string;
  subtitle: string | null;
  description: string | null;
  color: string | null;
  sizes: unknown;
  image_url: string | null;
  collections: unknown;
}) {
  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    line: getCollectionName(data.collections),
    subtitle: data.subtitle ?? "",
    image: data.image_url ?? "",
    color: data.color ?? "Negro",

    sizes: Array.isArray(data.sizes)
      ? data.sizes.filter(
          (size): size is string =>
            typeof size === "string"
        )
      : [],

    description: data.description ?? "",
  };
}

async function getProduct(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      slug,
      name,
      subtitle,
      description,
      color,
      sizes,
      image_url,
      collections (
        name
      )
    `)
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (error) {
    console.error(
      `Error cargando producto ${slug}:`,
      error
    );

    return null;
  }

  if (!data) {
    return null;
  }

  return normalizeProduct(data);
}

async function getRelatedProducts(currentSlug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      slug,
      name,
      subtitle,
      description,
      color,
      sizes,
      image_url,
      collections (
        name
      )
    `)
    .eq("active", true)
    .neq("slug", currentSlug)
    .order("sort_order", {
      ascending: true,
    })
    .limit(3);

  if (error) {
    console.error(
      "Error cargando productos relacionados:",
      error
    );

    return [];
  }

  return (data ?? []).map(normalizeProduct);
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Producto no encontrado",

      description:
        "El diseño solicitado no está disponible en Playeras El Güero.",

      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: product.name,

    description: `${product.name} de la colección ${product.line}. ${product.description}`,

    keywords: [
      product.name,
      product.line,
      "Playeras El Güero",
      "playeras personalizadas",
      "playeras galleras",
      "diseños de playeras",
    ],

    alternates: {
      canonical: `/producto/${product.slug}`,
    },

    openGraph: {
      type: "website",

      url: `/producto/${product.slug}`,

      title: `${product.name} | Playeras El Güero`,

      description: product.description,

      images: product.image
        ? [
            {
              url: product.image,
              width: 1080,
              height: 1080,
              alt: `Playera ${product.name} - Playeras El Güero`,
            },
          ]
        : [],
    },

    twitter: {
      card: "summary_large_image",

      title: `${product.name} | Playeras El Güero`,

      description: product.description,

      images: product.image
        ? [product.image]
        : [],
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts =
    await getRelatedProducts(product.slug);

  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />

      <ProductClient
        key={product.slug}
        product={product}
        relatedProducts={relatedProducts}
      />

      <Footer />
    </main>
  );
}