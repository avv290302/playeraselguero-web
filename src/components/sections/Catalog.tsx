"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import Container from "@/components/common/Container";
import { products } from "@/data/products";

const filters = [
  "Todos",
  "Blancos",
  "Brown Red",
  "Hatch",
  "Kelso",
  "Regular Grey",
  "Round Head",
  "Sweater",
];

export default function Catalog() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const lineFromUrl = searchParams.get("line");

  const activeFilter =
    lineFromUrl && filters.includes(lineFromUrl)
      ? lineFromUrl
      : "Todos";

  const filteredProducts =
    activeFilter === "Todos"
      ? products
      : products.filter(
          (product) => product.line === activeFilter
        );

  const handleFilterChange = (filter: string) => {
    if (filter === "Todos") {
      router.replace("/#catalogo", {
        scroll: false,
      });

      return;
    }

    router.replace(
      `/?line=${encodeURIComponent(filter)}#catalogo`,
      {
        scroll: false,
      }
    );
  };

  return (
    <section
      id="catalogo"
      className="relative overflow-hidden bg-[#050505] py-24"
    >
      {/* Luz decorativa */}
      <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-red-600/5 blur-[150px]" />

      <Container className="relative z-10">
        {/* Encabezado */}
        <div className="mb-12">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
            Catálogo
          </p>

          <h2 className="mt-3 font-[family-name:var(--font-bebas)] text-5xl uppercase tracking-wide text-white sm:text-6xl">
            Nuestros diseños
          </h2>

          <p className="mt-4 max-w-2xl text-zinc-400">
            Explora nuestros diseños organizados por línea y encuentra la
            playera que mejor represente tu estilo.
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-10 flex flex-wrap gap-3">
          {filters.map((filter) => {
            const isActive = activeFilter === filter;

            return (
              <button
                key={filter}
                type="button"
                onClick={() => handleFilterChange(filter)}
                className={`rounded-full border px-5 py-2 text-sm font-bold transition ${
                  isActive
                    ? "border-red-500 bg-red-600 text-white"
                    : "border-white/10 bg-white/[0.02] text-zinc-400 hover:border-red-500/50 hover:text-white"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Información del filtro */}
        <div className="mb-8 flex items-center justify-between">
          <p className="text-sm text-zinc-500">
            Mostrando{" "}
            <span className="font-bold text-white">
              {filteredProducts.length}
            </span>{" "}
            {filteredProducts.length === 1
              ? "diseño"
              : "diseños"}
          </p>

          {activeFilter !== "Todos" && (
            <p className="text-sm font-bold uppercase tracking-wider text-red-500">
              {activeFilter}
            </p>
          )}
        </div>

        {/* Productos */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <article
              key={product.slug}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-[#101010] transition duration-300 hover:-translate-y-1 hover:border-red-500/40"
            >
              {/* Imagen */}
              <Link href={`/producto/${product.slug}`}>
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.image}
                    alt={`Playera ${product.name}`}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs font-bold uppercase tracking-wider text-zinc-300 backdrop-blur-md">
                    {product.line}
                  </div>
                </div>
              </Link>

              {/* Información */}
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
                  Colección {product.line}
                </p>

                <h3 className="mt-2 font-[family-name:var(--font-bebas)] text-3xl uppercase tracking-wide text-white">
                  {product.name}
                </h3>

                <p className="mt-1 text-sm text-zinc-500">
                  {product.subtitle}
                </p>

                <p className="mt-4 line-clamp-2 text-sm leading-6 text-zinc-400">
                  {product.description}
                </p>

                <Link
                  href={`/producto/${product.slug}`}
                  className="mt-6 block rounded-lg bg-red-600 px-4 py-3 text-center text-sm font-bold uppercase tracking-wide text-white transition hover:bg-red-500"
                >
                  Ver diseño
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Sin productos */}
        {filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <h3 className="font-[family-name:var(--font-bebas)] text-4xl uppercase text-white">
              Próximamente
            </h3>

            <p className="mt-3 text-zinc-500">
              Todavía no hay diseños disponibles en esta colección.
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}