import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import LogoutButton from "./LogoutButton";

export default async function AdminPage() {
  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      "/admin/login"
    );
  }

  const {
    data: adminRecord,
  } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq(
      "user_id",
      user.id
    )
    .maybeSingle();

  if (!adminRecord) {
    redirect(
      "/admin/login"
    );
  }

  const {
    count:
      productsCount,
  } = await supabase
    .from("products")
    .select("*", {
      count: "exact",
      head: true,
    });

  const {
    count:
      collectionsCount,
  } = await supabase
    .from("collections")
    .select("*", {
      count: "exact",
      head: true,
    });

  const {
    count:
      heroSlidesCount,
  } = await supabase
    .from("hero_slides")
    .select("*", {
      count: "exact",
      head: true,
    });

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* HEADER */}

      <header className="border-b border-white/10 bg-[#080808]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-6 py-5">
          <div className="flex items-center gap-4">
            <Image
              src="/images/logo/logo.webp"
              alt="Playeras El Güero"
              width={60}
              height={60}
              className="h-14 w-14 object-contain"
            />

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
                Playeras El Güero
              </p>

              <h1 className="text-lg font-bold">
                Panel de administración
              </h1>
            </div>
          </div>

          <LogoutButton />
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* BIENVENIDA */}

        <section>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
            Administración
          </p>

          <h2 className="mt-3 font-[family-name:var(--font-bebas)] text-5xl uppercase tracking-wide sm:text-6xl">
            Bienvenido
          </h2>

          <p className="mt-3 max-w-2xl text-zinc-500">
            Administra el catálogo y contenido de
            Playeras El Güero sin modificar código.
          </p>
        </section>

        {/* RESUMEN */}

        <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
              Productos
            </p>

            <p className="mt-3 text-4xl font-bold">
              {productsCount ??
                0}
            </p>

            <p className="mt-2 text-sm text-zinc-600">
              Registrados
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
              Colecciones
            </p>

            <p className="mt-3 text-4xl font-bold">
              {collectionsCount ??
                0}
            </p>

            <p className="mt-2 text-sm text-zinc-600">
              Líneas registradas
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
              Carrusel
            </p>

            <p className="mt-3 text-4xl font-bold">
              {heroSlidesCount ??
                0}
            </p>

            <p className="mt-2 text-sm text-zinc-600">
              Imágenes de portada
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
              Estado
            </p>

            <p className="mt-3 text-lg font-bold text-green-500">
              Administrador autorizado
            </p>

            <p className="mt-2 truncate text-sm text-zinc-600">
              {user.email}
            </p>
          </div>
        </section>

        {/* CATÁLOGO */}

        <section className="mt-12">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
            Catálogo
          </p>

          <h3 className="mt-2 text-2xl font-bold">
            Productos y colecciones
          </h3>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 text-2xl font-bold">
                +
              </div>

              <h4 className="mt-6 text-xl font-bold">
                Agregar nueva playera
              </h4>

              <p className="mt-2 leading-6 text-zinc-500">
                Sube una nueva playera al catálogo.
              </p>

              <Link
                href="/admin/products/new"
                className="mt-6 inline-block rounded-lg bg-red-600 px-5 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-red-500"
              >
                Agregar playera
              </Link>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-xl">
                ◉
              </div>

              <h4 className="mt-6 text-xl font-bold">
                Administrar productos
              </h4>

              <p className="mt-2 leading-6 text-zinc-500">
                Edita, publica, oculta o elimina
                productos.
              </p>

              <Link
                href="/admin/products"
                className="mt-6 inline-block rounded-lg border border-white/15 px-5 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:border-red-500/50"
              >
                Ver productos
              </Link>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-xl">
                ▦
              </div>

              <h4 className="mt-6 text-xl font-bold">
                Administrar colecciones
              </h4>

              <p className="mt-2 leading-6 text-zinc-500">
                Crea, edita, ordena o cambia las
                fotografías de tus colecciones.
              </p>

              <Link
                href="/admin/collections"
                className="mt-6 inline-block rounded-lg border border-white/15 px-5 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:border-red-500/50"
              >
                Ver colecciones
              </Link>
            </div>
          </div>
        </section>

        {/* APARIENCIA */}

        <section className="mt-12">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
            Apariencia
          </p>

          <h3 className="mt-2 text-2xl font-bold">
            Portada de la tienda
          </h3>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 text-xl">
                ▣
              </div>

              <h4 className="mt-6 text-xl font-bold">
                Carrusel de portada
              </h4>

              <p className="mt-2 leading-6 text-zinc-500">
                Agrega, reemplaza, ordena, oculta o
                elimina las fotografías principales
                de la tienda.
              </p>

              <Link
                href="/admin/hero"
                className="mt-6 inline-block rounded-lg bg-red-600 px-5 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-red-500"
              >
                Administrar carrusel
              </Link>
            </div>
          </div>
        </section>

        <div className="mt-12 border-t border-white/10 pt-8">
          <Link
            href="/"
            className="text-sm font-bold uppercase tracking-wider text-zinc-500 transition hover:text-red-500"
          >
            ← Ver tienda
          </Link>
        </div>
      </div>
    </main>
  );
}