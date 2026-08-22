import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import NewProductForm from "./NewProductForm";

type Collection = {
  id: string;
  name: string;
  slug: string;
};

export default async function NewProductPage() {
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

  const { data: collections, error } = await supabase
    .from("collections")
    .select("id, name, slug")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error("No fue posible cargar las colecciones.");
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <header className="border-b border-white/10 bg-[#080808]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-6 py-5">
          <div className="flex items-center gap-4">
            <Image
              src="/images/logo/logo.png"
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
                Nueva playera
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

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
            Catálogo
          </p>

          <h2 className="mt-3 font-[family-name:var(--font-bebas)] text-5xl uppercase sm:text-6xl">
            Agregar nueva playera
          </h2>

          <p className="mt-3 max-w-2xl text-zinc-500">
            Sube la imagen y completa los datos. El producto quedará guardado
            directamente en Supabase.
          </p>
        </div>

        <NewProductForm
          collections={(collections ?? []) as Collection[]}
        />
      </div>
    </main>
  );
}