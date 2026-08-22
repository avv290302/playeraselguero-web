import Image from "next/image";
import Link from "next/link";

import Container from "@/components/common/Container";
import { createClient } from "@/lib/supabase/server";

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

type CatalogProps = {
  activeFilter?: string;
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

export default async function Catalog({
  activeFilter = "Todos",
}: CatalogProps) {
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
      sort_order,
      collections (
        name
      )
    `)
    .eq("active", true)
    .order("sort_order", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Error cargando el catálogo desde Supabase:",
      error
    );
  }

  const products = (data ?? []).map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    subtitle: product.subtitle ?? "",
    description: product.description ?? "",
    color: product.color ?? "Negro",
    sizes: Array.isArray(product.sizes)
      ? product.sizes
      : [],
    image: product.image_url ?? "",
    line: getCollectionName(product.collections),
  }));

  const currentFilter = filters.includes(activeFilter)
    ? activeFilter
    : "Todos";

  const filteredProducts =
    currentFilter === "Todos"
      ? products
      : products.filter(
          (product) =>
            product.line === currentFilter
        );

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
            Explora nuestros diseños organizados por línea y
            encuentra la playera que mejor represente tu estilo.
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-10 flex flex-wrap gap-3">
          {filters.map((filter) => {
            const isActive =
              currentFilter === filter;

            const href =
              filter === "Todos"
                ? "/#catalogo"
                : `/?line=${encodeURIComponent(
                    filter
                  )}#catalogo`;

            return (
              <Link
                key={filter}
                href={href}
                className={`rounded-full border px-5 py-2 text-sm font-bold transition ${
                  isActive
                    ? "border-red-500 bg-red-600 text-white"
                    : "border-white/10 bg-white/[0.02] text-zinc-400 hover:border-red-500/50 hover:text-white"
                }`}
              >
                {filter}
              </Link>
            );
          })}
        </div>

        {/* Información */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <p className="text-sm text-zinc-500">
            Mostrando{" "}
            <span className="font-bold text-white">
              {filteredProducts.length}
            </span>{" "}
            {filteredProducts.length === 1
              ? "diseño"
              : "diseños"}
          </p>

          {currentFilter !== "Todos" && (
            <p className="text-sm font-bold uppercase tracking-wider text-red-500">
              {currentFilter}
            </p>
          )}
        </div>

        {/* Productos */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-[#101010] transition duration-300 hover:-translate-y-1 hover:border-red-500/40"
            >
              <Link
                href={`/producto/${product.slug}`}
              >
                <div className="relative aspect-square overflow-hidden bg-zinc-950">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={`Playera ${product.name}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-6 text-center text-sm text-zinc-600">
                      Imagen próximamente
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs font-bold uppercase tracking-wider text-zinc-300 backdrop-blur-md">
                    {product.line}
                  </div>
                </div>
              </Link>

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

        {/* Sin resultados */}
        {filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <h3 className="font-[family-name:var(--font-bebas)] text-4xl uppercase text-white">
              Próximamente
            </h3>

            <p className="mt-3 text-zinc-500">
              Todavía no hay diseños disponibles en esta
              colección.
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}