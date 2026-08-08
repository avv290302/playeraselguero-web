"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

import Container from "@/components/common/Container";
import Navbar from "@/components/layout/Navbar";
import { products } from "@/data/products";

export default function ProductPage() {
  const params = useParams<{ slug: string }>();

  const product = useMemo(
    () => products.find((item) => item.slug === params.slug),
    [params.slug]
  );

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  if (!product) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <Navbar />

        <section className="pt-40">
          <Container>
            <div className="text-center">
              <h1 className="text-4xl font-bold">
                Producto no encontrado
              </h1>

              <Link
                href="/#colecciones"
                className="mt-8 inline-block rounded-lg bg-red-600 px-6 py-3 font-bold"
              >
                Volver a colecciones
              </Link>
            </div>
          </Container>
        </section>
      </main>
    );
  }

  const productUrl =
    typeof window !== "undefined" ? window.location.href : "";

  const whatsappMessage = encodeURIComponent(
    `Hola, me interesa la playera ${product.name}.

Talla: ${selectedSize || "Sin seleccionar"}
Cantidad: ${quantity}

¿Me puedes dar más información?

Producto: ${productUrl}`
  );

  const whatsappUrl = `https://wa.me/524922230511?text=${whatsappMessage}`;

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const increaseQuantity = () => {
    setQuantity((current) => current + 1);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <section className="pb-24 pt-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Imagen */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#111]">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.image}
                  alt={`Playera ${product.name}`}
                  fill
                  className="object-cover transition duration-700 hover:scale-105"
                  priority
                />
              </div>
            </div>

            {/* Información */}
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-red-500">
                Diseño exclusivo
              </p>

              <h1 className="font-[family-name:var(--font-bebas)] text-6xl uppercase tracking-wide sm:text-7xl">
                {product.name}
              </h1>

              <p className="mt-2 text-xl text-zinc-400">
                {product.subtitle}
              </p>

              <p className="mt-8 max-w-xl leading-7 text-zinc-400">
                {product.description}
              </p>

              {/* Color */}
              <div className="mt-8">
                <p className="text-sm font-bold uppercase tracking-wider text-zinc-300">
                  Color
                </p>

                <p className="mt-2 text-lg">
                  {product.color}
                </p>
              </div>

              {/* Tallas */}
              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold uppercase tracking-wider text-zinc-300">
                    Tallas disponibles
                  </p>

                  {selectedSize && (
                    <span className="text-sm text-red-500">
                      Seleccionada: {selectedSize}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize === size;

                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`rounded-lg border px-4 py-2 text-sm font-bold transition ${
                          isSelected
                            ? "border-red-500 bg-red-600 text-white"
                            : "border-white/15 bg-transparent text-white hover:border-red-500"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cantidad */}
              <div className="mt-8">
                <p className="text-sm font-bold uppercase tracking-wider text-zinc-300">
                  Cantidad
                </p>

                <div className="mt-4 inline-flex items-center overflow-hidden rounded-lg border border-white/15">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    className="h-12 w-12 text-xl font-bold transition hover:bg-white/10"
                    aria-label="Disminuir cantidad"
                  >
                    −
                  </button>

                  <div className="flex h-12 min-w-14 items-center justify-center border-x border-white/15 px-4 font-bold">
                    {quantity}
                  </div>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    className="h-12 w-12 text-xl font-bold transition hover:bg-white/10"
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>
              </div>

              {!selectedSize && (
                <p className="mt-5 text-sm text-zinc-500">
                  Selecciona una talla para preparar tu cotización.
                </p>
              )}

              {/* Botones */}
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href={selectedSize ? whatsappUrl : undefined}
                  target={selectedSize ? "_blank" : undefined}
                  rel={selectedSize ? "noreferrer" : undefined}
                  aria-disabled={!selectedSize}
                  className={`rounded-lg px-7 py-4 text-center text-sm font-bold uppercase tracking-wide transition ${
                    selectedSize
                      ? "bg-red-600 hover:bg-red-500"
                      : "cursor-not-allowed bg-zinc-800 text-zinc-500"
                  }`}
                >
                  {selectedSize
                    ? "Cotizar por WhatsApp"
                    : "Selecciona una talla"}
                </a>

                <Link
                  href="/#colecciones"
                  className="rounded-lg border border-white/20 px-7 py-4 text-center text-sm font-bold uppercase tracking-wide transition hover:border-white"
                >
                  Ver más diseños
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Productos relacionados */}
      <section className="border-t border-white/10 bg-[#080808] py-20">
        <Container>
          <div className="mb-10">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
              Descubre más
            </p>

            <h2 className="mt-3 font-[family-name:var(--font-bebas)] text-5xl uppercase">
              También te puede interesar
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products
              .filter((item) => item.slug !== product.slug)
              .slice(0, 3)
              .map((item) => (
                <Link
                  key={item.slug}
                  href={`/producto/${item.slug}`}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-[#111]"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={item.image}
                      alt={`Playera ${item.name}`}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-110"
                    />
                  </div>

                  <div className="p-5">
                    <h3 className="font-[family-name:var(--font-bebas)] text-3xl uppercase">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500">
                      {item.subtitle}
                    </p>

                    <div className="mt-4 text-sm font-bold uppercase tracking-wider text-red-500">
                      Ver diseño →
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </Container>
      </section>
    </main>
  );
}