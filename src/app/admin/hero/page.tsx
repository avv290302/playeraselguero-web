import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import HeroSlidesManager from "./HeroSlidesManager";

export type AdminHeroSlide = {
  id: string;
  image_url: string;
  image_path: string | null;
  alt_text: string | null;
  active: boolean;
  sort_order: number;
};

export default async function AdminHeroPage() {
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
    data,
    error,
  } = await supabase
    .from("hero_slides")
    .select(
      `
        id,
        image_url,
        image_path,
        alt_text,
        active,
        sort_order
      `
    )
    .order(
      "sort_order",
      {
        ascending: true,
      }
    )
    .order(
      "created_at",
      {
        ascending: true,
      }
    );

  if (error) {
    console.error(
      "Error cargando imágenes del carrusel:",
      error
    );
  }

  const slides =
    (data ??
      []) as AdminHeroSlide[];

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <header className="border-b border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <Link
            href="/admin"
            className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-600 transition hover:text-red-500"
          >
            ← Panel principal
          </Link>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-red-500">
            Apariencia
          </p>

          <h1 className="mt-2 font-[family-name:var(--font-bebas)] text-5xl uppercase tracking-wide sm:text-6xl">
            Carrusel de portada
          </h1>

          <p className="mt-3 max-w-2xl text-zinc-500">
            Administra las imágenes que aparecen en
            la fotografía principal de Playeras El
            Güero.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <HeroSlidesManager
          slides={
            slides
          }
        />
      </div>
    </main>
  );
}