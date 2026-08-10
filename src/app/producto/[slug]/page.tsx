import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { products } from "@/data/products";

import ProductClient from "./ProductClient";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = products.find(
    (item) => item.slug === slug
  );

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

      images: [
        {
          url: product.image,
          width: 1080,
          height: 1080,
          alt: `Playera ${product.name} - Playeras El Güero`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Playeras El Güero`,
      description: product.description,
      images: [product.image],
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

  const product = products.find(
    (item) => item.slug === slug
  );

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />

      <ProductClient
        key={product.slug}
        product={product}
      />

      <Footer />
    </main>
  );
}