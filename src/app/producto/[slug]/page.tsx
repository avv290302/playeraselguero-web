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
  price: number | string | null;
  currency: string | null;
  sizes: unknown;
  image_url: string | null;
  collections: unknown;
}) {
  const parsedPrice =
    data.price !== null
      ? Number(data.price)
      : null;

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,

    line: getCollectionName(
      data.collections
    ),

    subtitle:
      data.subtitle ?? "",

    description:
      data.description ?? "",

    image:
      data.image_url ?? "",

    color:
      data.color ?? "Negro",

    price:
      parsedPrice !== null &&
      Number.isFinite(parsedPrice)
        ? parsedPrice
        : null,

    currency:
      data.currency ?? "MXN",

    sizes: Array.isArray(data.sizes)
      ? data.sizes.filter(
          (size): size is string =>
            typeof size === "string"
        )
      : [],
  };
}

async function getProduct(
  slug: string
) {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from("products")
      .select(`
        id,
        slug,
        name,
        subtitle,
        description,
        color,
        price,
        currency,
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

async function getRelatedProducts(
  currentSlug: string
) {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from("products")
      .select(`
        id,
        slug,
        name,
        subtitle,
        description,
        color,
        price,
        currency,
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

  return (data ?? []).map(
    normalizeProduct
  );
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  const product =
    await getProduct(slug);

  if (!product) {
    return {
      title:
        "Producto no encontrado",

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

    description:
      `${product.name} de la colección ${product.line}. ${product.description}`,

    keywords: [
      product.name,
      product.line,
      "Playeras El Güero",
      "playeras de gallos",
      "playeras personalizadas",
      "playeras galleras",
      "diseños de playeras",
    ],

    alternates: {
      canonical:
        `/producto/${product.slug}`,
    },

    openGraph: {
      type: "website",

      url:
        `/producto/${product.slug}`,

      title:
        `${product.name} | Playeras El Güero`,

      description:
        product.description,

      images: product.image
        ? [
            {
              url: product.image,
              width: 1080,
              height: 1080,
              alt:
                `Playera ${product.name} - Playeras El Güero`,
            },
          ]
        : [],
    },

    twitter: {
      card:
        "summary_large_image",

      title:
        `${product.name} | Playeras El Güero`,

      description:
        product.description,

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

  const product =
    await getProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts =
    await getRelatedProducts(
      product.slug
    );

  const productUrl =
    `https://playeraselguero.com/producto/${product.slug}`;

  const productStructuredData =
    product.price !== null &&
    product.price > 0
      ? {
          "@context":
            "https://schema.org",

          "@type":
            "Product",

          "@id":
            `${productUrl}#product`,

          name:
            product.name,

          description:
            product.description,

          url:
            productUrl,

          sku:
            product.slug,

          category:
            `Playeras de gallos - ${product.line}`,

          image:
            product.image
              ? [product.image]
              : undefined,

          color:
            product.color,

          brand: {
            "@type":
              "Brand",

            name:
              "Playeras El Güero",
          },

          manufacturer: {
            "@type":
              "Organization",

            "@id":
              "https://playeraselguero.com/#organization",

            name:
              "Playeras El Güero",
          },

          offers: {
            "@type":
              "Offer",

            url:
              productUrl,

            priceCurrency:
              product.currency,

            price:
              product.price.toFixed(
                2
              ),
          },

          additionalProperty: [
            {
              "@type":
                "PropertyValue",

              name:
                "Colección",

              value:
                product.line,
            },

            {
              "@type":
                "PropertyValue",

              name:
                "Tallas disponibles",

              value:
                product.sizes.join(
                  ", "
                ),
            },
          ],
        }
      : null;

  return (
    <main className="min-h-screen bg-[#050505]">
      {productStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              productStructuredData
            ).replace(
              /</g,
              "\\u003c"
            ),
          }}
        />
      )}

      <Navbar />

      <ProductClient
        key={product.slug}
        product={product}
        relatedProducts={
          relatedProducts
        }
      />

      <Footer />
    </main>
  );
}