"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import Container from "@/components/common/Container";
import SizeGuide from "@/components/product/SizeGuide";

import { useCart } from "@/context/CartContext";

import {
  SHIRT_CARE,
  SHIRT_INFO,
  SHIRT_SPECIFICATIONS,
} from "@/lib/productInfo";

type Product = {
  id: string;
  slug: string;
  name: string;
  line: string;
  subtitle: string;
  image: string;
  color: string;
  sizes: string[];
  description: string;
  price: number | null;
  currency: string;
};

type ProductClientProps = {
  product: Product;
  relatedProducts: Product[];
};

function formatPrice(
  price: number | null,
  currency: string
) {
  if (price === null || price <= 0) {
    return null;
  }

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

export default function ProductClient({
  product,
  relatedProducts,
}: ProductClientProps) {
  const { addItem, openCart } = useCart();

  const [selectedSize, setSelectedSize] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  const [addedMessage, setAddedMessage] =
    useState("");

  const formattedPrice = formatPrice(
    product.price,
    product.currency
  );

  const decreaseQuantity = () => {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  };

  const increaseQuantity = () => {
    setQuantity(
      (current) => current + 1
    );
  };

  function handleAddToCart() {
    if (!selectedSize) {
      return;
    }

    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      size: selectedSize,
      quantity,
      price: product.price,
      currency: product.currency,
    });

    openCart();

    setAddedMessage(
      `${product.name} · talla ${selectedSize} · ${quantity} ${
        quantity === 1
          ? "pieza agregada"
          : "piezas agregadas"
      }`
    );

    setQuantity(1);

    window.setTimeout(() => {
      setAddedMessage("");
    }, 2500);
  }

  return (
    <>
      {/* ================================================= */}
      {/* FICHA DEL PRODUCTO */}
      {/* ================================================= */}

      <section className="bg-[#050505] pb-24 pt-32 text-white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
            {/* IMAGEN */}

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#111]">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.image}
                  alt={`Playera ${product.name}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition duration-700 hover:scale-105"
                  priority
                />
              </div>
            </div>

            {/* INFORMACIÓN */}

            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-red-500">
                Diseño exclusivo
              </p>

              <h1 className="font-[family-name:var(--font-bebas)] text-5xl uppercase leading-none tracking-wide text-white sm:text-6xl lg:text-7xl">
                {product.name}
              </h1>

              <p className="mt-3 text-lg text-zinc-400 sm:text-xl">
                {product.subtitle}
              </p>

              <div className="mt-4 inline-flex rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
                  Colección {product.line}
                </span>
              </div>

              {/* PRECIO */}

              <div className="mt-7">
                {formattedPrice ? (
                  <div className="flex items-end gap-3">
                    <span className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                      {formattedPrice}
                    </span>

                    <span className="pb-1 text-sm font-bold uppercase tracking-wider text-zinc-500">
                      {product.currency}
                    </span>
                  </div>
                ) : (
                  <p className="text-lg font-bold text-zinc-500">
                    Precio próximamente
                  </p>
                )}

                <p className="mt-2 text-xs text-zinc-600">
                  Precio por prenda.
                </p>
              </div>

              {/* DESCRIPCIÓN */}

              <p className="mt-8 max-w-xl leading-7 text-zinc-400">
                {product.description}
              </p>

              {/* COLOR */}

              <div className="mt-8">
                <p className="text-sm font-bold uppercase tracking-wider text-zinc-300">
                  Color
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <span
                    className={`h-6 w-6 rounded-full border ${
                      product.color === "Blanco"
                        ? "border-zinc-400 bg-white"
                        : "border-white/20 bg-[#111]"
                    }`}
                  />

                  <span className="text-lg text-white">
                    {product.color}
                  </span>
                </div>
              </div>

              {/* ================================================= */}
              {/* TALLAS */}
              {/* ================================================= */}

              <div className="mt-8">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div className="flex flex-wrap items-center gap-4">
                    <p className="text-sm font-bold uppercase tracking-wider text-zinc-300">
                      Tallas disponibles
                    </p>

                    <SizeGuide />
                  </div>

                  {selectedSize && (
                    <span className="text-sm font-semibold text-red-500">
                      Seleccionada:{" "}
                      {selectedSize}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  {product.sizes.map(
                    (size) => {
                      const isSelected =
                        selectedSize === size;

                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() =>
                            setSelectedSize(
                              size
                            )
                          }
                          className={`min-w-12 rounded-lg border px-4 py-3 text-sm font-bold transition ${
                            isSelected
                              ? "border-red-500 bg-red-600 text-white"
                              : "border-white/15 bg-transparent text-white hover:border-red-500"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* CANTIDAD */}

              <div className="mt-8">
                <p className="text-sm font-bold uppercase tracking-wider text-zinc-300">
                  Cantidad
                </p>

                <div className="mt-4 inline-flex items-center overflow-hidden rounded-lg border border-white/15">
                  <button
                    type="button"
                    onClick={
                      decreaseQuantity
                    }
                    className="flex h-12 w-12 items-center justify-center text-xl font-bold transition hover:bg-white/10"
                    aria-label="Disminuir cantidad"
                  >
                    −
                  </button>

                  <div className="flex h-12 min-w-16 items-center justify-center border-x border-white/15 px-4 font-bold">
                    {quantity}
                  </div>

                  <button
                    type="button"
                    onClick={
                      increaseQuantity
                    }
                    className="flex h-12 w-12 items-center justify-center text-xl font-bold transition hover:bg-white/10"
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>
              </div>

              {!selectedSize && (
                <p className="mt-5 text-sm text-zinc-500">
                  Selecciona una talla antes de
                  agregar al carrito.
                </p>
              )}

              {addedMessage && (
                <div className="mt-5 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm font-semibold text-green-400">
                  ✓ {addedMessage}
                </div>
              )}

              {/* BOTONES */}

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={
                    handleAddToCart
                  }
                  disabled={
                    !selectedSize
                  }
                  className={`rounded-lg px-7 py-4 text-center text-sm font-bold uppercase tracking-wide transition ${
                    selectedSize
                      ? "bg-red-600 text-white hover:-translate-y-0.5 hover:bg-red-500"
                      : "cursor-not-allowed bg-zinc-800 text-zinc-500"
                  }`}
                >
                  {selectedSize
                    ? "Agregar al carrito"
                    : "Selecciona una talla"}
                </button>

                <Link
                  href="/#catalogo"
                  className="rounded-lg border border-white/20 px-7 py-4 text-center text-sm font-bold uppercase tracking-wide text-white transition hover:border-white hover:bg-white/[0.03]"
                >
                  Ver más diseños
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ================================================= */}
      {/* INFORMACIÓN DE LA PLAYERA */}
      {/* ================================================= */}

      <section className="border-t border-white/10 bg-[#080808] py-20 text-white">
        <Container>
          <div className="mb-10">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
              Calidad y cuidados
            </p>

            <h2 className="mt-3 font-[family-name:var(--font-bebas)] text-4xl uppercase tracking-wide sm:text-5xl">
              Detalles de la playera
            </h2>

            <p className="mt-4 max-w-3xl leading-7 text-zinc-400">
              Conoce las características de la
              prenda y sigue nuestras
              recomendaciones para conservar el
              algodón y el estampado en mejores
              condiciones.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            {/* ESPECIFICACIONES */}

            <div className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-500">
                Especificaciones
              </p>

              <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
                {SHIRT_SPECIFICATIONS.map(
                  (item) => (
                    <div
                      key={item.label}
                      className="bg-[#0a0a0a] p-5"
                    >
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-600">
                        {item.label}
                      </p>

                      <p className="mt-2 text-lg font-semibold text-white">
                        {item.value}
                      </p>
                    </div>
                  )
                )}
              </div>

              {/* IMPRESIÓN */}

              <div className="mt-6 rounded-2xl border border-red-500/15 bg-red-500/[0.04] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-500">
                  Técnica de impresión
                </p>

                <p className="mt-3 text-sm leading-7 text-zinc-300">
                  {SHIRT_INFO.print}
                </p>
              </div>
            </div>

            {/* CUIDADOS */}

            <div className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-500">
                Cuidados de la prenda
              </p>

              <h3 className="mt-3 text-2xl font-bold">
                Recomendaciones de lavado
              </h3>

              <div className="mt-6 space-y-3">
                {SHIRT_CARE.map(
                  (instruction) => (
                    <div
                      key={instruction}
                      className="flex gap-3 rounded-xl border border-white/[0.06] bg-black/30 p-4"
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600/10 text-xs font-black text-red-500">
                        ✓
                      </div>

                      <p className="text-sm leading-6 text-zinc-400">
                        {instruction}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* NOTA */}

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5">
            <p className="text-xs leading-6 text-zinc-500">
              Para obtener mejores resultados,
              revisa también las indicaciones
              específicas de la etiqueta de la
              prenda.
            </p>
          </div>
        </Container>
      </section>

      {/* ================================================= */}
      {/* PRODUCTOS RELACIONADOS */}
      {/* ================================================= */}

      {relatedProducts.length > 0 && (
        <section className="border-t border-white/10 bg-[#050505] py-20 text-white">
          <Container>
            <div className="mb-10">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
                Descubre más
              </p>

              <h2 className="mt-3 font-[family-name:var(--font-bebas)] text-4xl uppercase leading-none tracking-wide sm:text-5xl">
                También te puede interesar
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map(
                (item) => {
                  const itemPrice =
                    formatPrice(
                      item.price,
                      item.currency
                    );

                  return (
                    <Link
                      key={item.id}
                      href={`/producto/${item.slug}`}
                      className="group overflow-hidden rounded-2xl border border-white/10 bg-[#111] transition duration-300 hover:-translate-y-1 hover:border-red-500/40"
                    >
                      <div className="relative aspect-square overflow-hidden">
                        {item.image ? (
                          <Image
                            src={
                              item.image
                            }
                            alt={`Playera ${item.name}`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-zinc-600">
                            Sin imagen
                          </div>
                        )}

                        <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs font-bold uppercase tracking-wider text-zinc-300 backdrop-blur-md">
                          {item.line}
                        </div>
                      </div>

                      <div className="p-5">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
                          Colección{" "}
                          {item.line}
                        </p>

                        <h3 className="mt-2 font-[family-name:var(--font-bebas)] text-3xl uppercase text-white">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-sm text-zinc-500">
                          {item.subtitle}
                        </p>

                        {itemPrice ? (
                          <div className="mt-4 flex items-end gap-2">
                            <span className="text-xl font-black text-white">
                              {itemPrice}
                            </span>

                            <span className="pb-0.5 text-xs font-bold text-zinc-500">
                              {
                                item.currency
                              }
                            </span>
                          </div>
                        ) : (
                          <p className="mt-4 text-sm text-zinc-600">
                            Precio próximamente
                          </p>
                        )}

                        <div className="mt-5 text-sm font-bold uppercase tracking-wider text-red-500">
                          Ver diseño →
                        </div>
                      </div>
                    </Link>
                  );
                }
              )}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}