/* eslint-disable @next/next/no-img-element */

import Image from "next/image";
import Link from "next/link";

import Container from "@/components/common/Container";

import { createClient } from "@/lib/supabase/server";

type Collection = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  active: boolean;
  sort_order: number;
};

export default async function Collections() {
  const supabase =
    await createClient();

  const {
    data,
    error,
  } = await supabase
    .from("collections")
    .select(
      `
        id,
        name,
        slug,
        description,
        image_url,
        active,
        sort_order
      `
    )
    .eq(
      "active",
      true
    )
    .order(
      "sort_order",
      {
        ascending: true,
      }
    )
    .order(
      "name",
      {
        ascending: true,
      }
    );

  if (error) {
    console.error(
      "Error cargando colecciones:",
      error
    );
  }

  const collections =
    (data ?? []) as Collection[];

  return (
    <section
      id="colecciones"
      className="relative overflow-hidden bg-[#080808] py-24"
    >
      {/* FONDO */}

      <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-red-600/5 blur-[150px]" />

      <Container className="relative z-10">
        {/* ENCABEZADO */}

        <div className="mb-14">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-red-500">
            Diseños exclusivos
          </p>

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <h2 className="font-[family-name:var(--font-bebas)] text-5xl uppercase leading-[0.95] tracking-wide text-white sm:text-6xl">
                <span className="block sm:inline">
                  Nuestras
                </span>

                <span className="block text-red-500 sm:ml-3 sm:inline">
                  colecciones
                </span>
              </h2>

              <p className="mt-4 max-w-2xl text-zinc-400">
                Explora nuestras líneas y encuentra
                diseños creados para representar tu
                pasión con identidad, estilo y
                personalidad.
              </p>
            </div>

            <Link
              href="/#catalogo"
              className="text-sm font-bold uppercase tracking-wider text-white transition hover:text-red-500"
            >
              Ver todos los diseños →
            </Link>
          </div>
        </div>

        {/* COLECCIONES */}

        {collections.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-[#111] px-6 py-14 text-center">
            <p className="text-lg font-bold text-white">
              Próximamente nuevas colecciones
            </p>

            <p className="mt-2 text-sm text-zinc-600">
              Estamos preparando nuevos diseños.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map(
              (collection) => (
                <Link
                  key={
                    collection.id
                  }
                  href={`/?line=${encodeURIComponent(
                    collection.name
                  )}#catalogo`}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#111] transition duration-300 hover:-translate-y-1 hover:border-red-500/40"
                >
                  <div className="relative aspect-square overflow-hidden bg-black">
                    {/* IMAGEN */}

                    {collection.image_url ? (
                      collection.image_url.startsWith(
                        "/"
                      ) ? (
                        <Image
                          src={
                            collection.image_url
                          }
                          alt={`Gallo de la línea ${collection.name}`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <img
                          src={
                            collection.image_url
                          }
                          alt={`Imagen de la colección ${collection.name}`}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                        />
                      )
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-zinc-700">
                        Sin imagen
                      </div>
                    )}

                    {/* SOMBRA */}

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

                    {/* BADGE */}

                    <div className="absolute right-5 top-5 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs uppercase tracking-widest text-zinc-300 backdrop-blur-md">
                      Colección
                    </div>

                    {/* TEXTO */}

                    <div className="absolute bottom-0 left-0 w-full p-6">
                      <h3 className="font-[family-name:var(--font-bebas)] text-4xl uppercase tracking-wide text-white">
                        {
                          collection.name
                        }
                      </h3>

                      {collection.description && (
                        <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-300 opacity-0 transition duration-300 group-hover:opacity-100">
                          {
                            collection.description
                          }
                        </p>
                      )}

                      <div className="mt-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-red-500">
                        Ver colección

                        <span className="transition-transform duration-300 group-hover:translate-x-2">
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            )}
          </div>
        )}
      </Container>
    </section>
  );
}