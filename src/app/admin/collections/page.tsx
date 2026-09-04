import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import CollectionActions from "./CollectionActions";

type Collection = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  image_path: string | null;
  active: boolean;
  sort_order: number;
};

export default async function AdminCollectionsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: adminRecord } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminRecord) {
    redirect("/admin/login");
  }

  const { data, error } = await supabase
    .from("collections")
    .select(
      `
        id,
        name,
        slug,
        description,
        image_url,
        image_path,
        active,
        sort_order
      `
    )
    .order("sort_order", {
      ascending: true,
    })
    .order("name", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Error cargando colecciones:",
      error
    );
  }

  const collections =
    (data ?? []) as Collection[];

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <header className="border-b border-white/10 bg-[#080808]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin"
              className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-600 transition hover:text-red-500"
            >
              ← Panel principal
            </Link>

            <h1 className="mt-3 font-[family-name:var(--font-bebas)] text-4xl uppercase tracking-wide sm:text-5xl">
              Colecciones
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Administra las líneas que aparecen en
              la tienda.
            </p>
          </div>

          <Link
            href="/admin/collections/new"
            className="rounded-xl bg-red-600 px-6 py-4 text-center text-sm font-bold uppercase tracking-wider text-white transition hover:bg-red-500"
          >
            + Nueva colección
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-500">
              Catálogo
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              {collections.length}{" "}
              {collections.length === 1
                ? "colección"
                : "colecciones"}
            </h2>
          </div>
        </div>

        {collections.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-[#0b0b0b] p-12 text-center">
            <p className="text-xl font-bold">
              No hay colecciones
            </p>

            <p className="mt-2 text-sm text-zinc-600">
              Crea la primera colección para
              comenzar.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <article
                key={collection.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0b]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-black">
                  {collection.image_url ? (
                    collection.image_url.startsWith(
                      "/"
                    ) ? (
                      <Image
                        src={collection.image_url}
                        alt={collection.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={collection.image_url}
                        alt={collection.name}
                        className="h-full w-full object-cover"
                      />
                    )
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-zinc-700">
                      Sin imagen
                    </div>
                  )}

                  <div className="absolute left-4 top-4">
                    <span
                      className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur ${
                        collection.active
                          ? "border-green-500/20 bg-green-500/10 text-green-400"
                          : "border-white/10 bg-black/70 text-zinc-500"
                      }`}
                    >
                      {collection.active
                        ? "Visible"
                        : "Oculta"}
                    </span>
                  </div>

                  <div className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/70 px-3 py-1 text-[10px] font-bold text-zinc-400 backdrop-blur">
                    Orden {collection.sort_order}
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-500">
                    Colección
                  </p>

                  <h3 className="mt-2 text-2xl font-bold">
                    {collection.name}
                  </h3>

                  <p className="mt-1 text-xs text-zinc-700">
                    /{collection.slug}
                  </p>

                  <p className="mt-4 line-clamp-3 min-h-[60px] text-sm leading-6 text-zinc-500">
                    {collection.description ||
                      "Sin descripción."}
                  </p>

                  <div className="mt-6">
                    <CollectionActions
                      collection={collection}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}