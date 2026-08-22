import Image from "next/image";
import Link from "next/link";

import Container from "@/components/common/Container";
import { createClient } from "@/lib/supabase/server";

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

  if (Array.isArray(collection) && collection.length > 0) {
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

export default async function Gallery() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      slug,
      name,
      image_url,
      collections (
        name
      )
    `)
    .eq("active", true)
    .order("sort_order", {
      ascending: true,
    })
    .limit(8);

  if (error) {
    console.error(
      "Error cargando la galería desde Supabase:",
      error
    );
  }

  const galleryProducts = (data ?? []).map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    image: product.image_url ?? "",
    line: getCollectionName(product.collections),
  }));

  return (
    <section
      id="galeria"
      className="relative overflow-hidden bg-[#050505] py-24"
    >
      {/* Efecto de fondo */}
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/5 blur-[180px]" />

      <Container className="relative z-10">
        {/* Encabezado */}
        <div className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
              Nuestro trabajo
            </p>

            <h2 className="mt-3 font-[family-name:var(--font-bebas)] text-5xl uppercase tracking-wide text-white sm:text-6xl">
              Diseños que
              <span className="ml-3 text-red-500">
                hablan por sí solos
              </span>
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-zinc-400">
              Una muestra de algunos de nuestros diseños. Cada
              playera combina identidad, estilo y pasión en una
              pieza única.
            </p>
          </div>

          <Link
            href="/#catalogo"
            className="text-sm font-bold uppercase tracking-wider text-white transition hover:text-red-500"
          >
            Explorar catálogo →
          </Link>
        </div>

        {/* Galería */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {galleryProducts.map((product, index) => {
            const featured = index === 0 || index === 5;

            return (
              <Link
                key={product.id}
                href={`/producto/${product.slug}`}
                className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[#111] ${
                  featured
                    ? "col-span-2 row-span-2"
                    : ""
                }`}
              >
                <div className="relative aspect-square">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={`Diseño ${product.name}`}
                      fill
                      sizes={
                        featured
                          ? "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                          : "(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                      }
                      className="object-cover transition duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-zinc-600">
                      Sin imagen
                    </div>
                  )}

                  {/* Oscurecimiento */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-60 transition duration-300 group-hover:opacity-90" />

                  {/* Información */}
                  <div className="absolute inset-x-0 bottom-0 translate-y-4 p-5 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
                      {product.line}
                    </p>

                    <h3 className="mt-1 font-[family-name:var(--font-bebas)] text-3xl uppercase text-white">
                      {product.name}
                    </h3>

                    <p className="mt-2 text-sm text-zinc-300">
                      Ver diseño →
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/#catalogo"
            className="inline-flex rounded-lg border border-white/15 px-7 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:border-red-500 hover:bg-red-500/10"
          >
            Ver todos los diseños
          </Link>
        </div>
      </Container>
    </section>
  );
}