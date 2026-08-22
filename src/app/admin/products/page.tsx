/* eslint-disable @next/next/no-img-element */

import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import ProductActions from "./ProductActions";

/*
  Esta función nos permite obtener el nombre de la colección
  aunque Supabase la represente internamente como objeto
  o arreglo.
*/
function getCollectionName(collection: unknown): string {
  if (!collection) {
    return "Sin colección";
  }

  if (Array.isArray(collection)) {
    const firstCollection = collection[0];

    if (
      firstCollection &&
      typeof firstCollection === "object" &&
      "name" in firstCollection
    ) {
      const name = (
        firstCollection as {
          name?: unknown;
        }
      ).name;

      if (typeof name === "string") {
        return name;
      }
    }

    return "Sin colección";
  }

  if (
    typeof collection === "object" &&
    "name" in collection
  ) {
    const name = (
      collection as {
        name?: unknown;
      }
    ).name;

    if (typeof name === "string") {
      return name;
    }
  }

  return "Sin colección";
}

export default async function AdminProductsPage() {
  const supabase = await createClient();

  /*
    1. Verificamos que exista una sesión.
  */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  /*
    2. Verificamos que el usuario sea administrador.
  */
  const { data: adminRecord } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminRecord) {
    redirect("/admin/login");
  }

  /*
    3. Cargamos todos los productos.

    También obtenemos el nombre de la colección
    relacionada mediante collection_id.
  */
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      subtitle,
      color,
      sizes,
      image_url,
      image_path,
      active,
      featured,
      created_at,
      collections (
        name
      )
    `)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(
      `No fue posible cargar los productos: ${error.message}`
    );
  }

  /*
    IMPORTANTE:

    Ya no hacemos:

    (data ?? []) as Product[]

    Dejamos que Supabase infiera los tipos.
  */
  const products = data ?? [];

  const activeProducts = products.filter(
    (product) => product.active
  ).length;

  const hiddenProducts =
    products.length - activeProducts;

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* HEADER */}
      <header className="border-b border-white/10 bg-[#080808]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-4">
            <Image
              src="/images/logo/logo.png"
              alt="Playeras El Güero"
              width={60}
              height={60}
              className="h-14 w-14 object-contain"
              priority
            />

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
                Playeras El Güero
              </p>

              <h1 className="text-lg font-bold">
                Administrar productos
              </h1>
            </div>
          </div>

          <Link
            href="/admin"
            className="rounded-lg border border-white/10 px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-400 transition hover:border-red-500/40 hover:text-white"
          >
            ← Panel
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* ENCABEZADO */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
              Catálogo
            </p>

            <h2 className="mt-3 font-[family-name:var(--font-bebas)] text-5xl uppercase tracking-wide sm:text-6xl">
              Tus productos
            </h2>

            <p className="mt-3 max-w-2xl text-zinc-500">
              Desde aquí podrás administrar todas las playeras
              registradas en la base de datos.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="rounded-xl bg-red-600 px-6 py-4 text-center text-sm font-bold uppercase tracking-wider text-white transition hover:bg-red-500"
          >
            + Nueva playera
          </Link>
        </div>

        {/* ESTADÍSTICAS */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
              Total
            </p>

            <p className="mt-2 text-3xl font-bold">
              {products.length}
            </p>
          </div>

          <div className="rounded-2xl border border-green-500/10 bg-green-500/[0.03] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
              Publicados
            </p>

            <p className="mt-2 text-3xl font-bold text-green-500">
              {activeProducts}
            </p>
          </div>

          <div className="rounded-2xl border border-yellow-500/10 bg-yellow-500/[0.03] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
              Ocultos
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-500">
              {hiddenProducts}
            </p>
          </div>
        </div>

        {/* SIN PRODUCTOS */}
        {products.length === 0 && (
          <div className="mt-10 rounded-3xl border border-dashed border-white/15 bg-[#0b0b0b] px-6 py-20 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-500">
              Catálogo vacío
            </p>

            <h3 className="mt-3 text-2xl font-bold">
              Todavía no tienes productos
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-500">
              Agrega tu primera playera desde el panel de
              administración.
            </p>

            <Link
              href="/admin/products/new"
              className="mt-7 inline-block rounded-xl bg-red-600 px-6 py-4 text-sm font-bold uppercase tracking-wider"
            >
              + Agregar playera
            </Link>
          </div>
        )}

        {/* LISTA DE PRODUCTOS */}
        {products.length > 0 && (
          <div className="mt-10 space-y-4">
            {products.map((product) => {
              const collectionName =
                getCollectionName(
                  product.collections
                );

              return (
                <article
                  key={product.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b]"
                >
                  <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
                    {/* IMAGEN */}
                    <div className="h-32 w-full flex-shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black sm:h-28 sm:w-28">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-zinc-700">
                          Sin imagen
                        </div>
                      )}
                    </div>

                    {/* INFORMACIÓN */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-bold">
                          {product.name}
                        </h3>

                        {product.active ? (
                          <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-green-400">
                            Publicado
                          </span>
                        ) : (
                          <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-yellow-400">
                            Oculto
                          </span>
                        )}

                        {product.featured && (
                          <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-red-400">
                            Destacado
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-sm text-zinc-500">
                        {collectionName}

                        {product.subtitle
                          ? ` · ${product.subtitle}`
                          : ""}
                      </p>

                      <p className="mt-2 text-xs text-zinc-600">
                        Color: {product.color}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {(product.sizes ?? []).map(
                            (size: string) => (
                            <span
                              key={size}
                              className="rounded-md border border-white/10 bg-black px-2.5 py-1 text-xs font-bold text-zinc-400"
                            >
                              {size}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    {/* ACCIONES */}
                    <ProductActions
                      id={product.id}
                      name={product.name}
                      active={product.active}
                      imagePath={
                        product.image_path
                      }
                    />
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}