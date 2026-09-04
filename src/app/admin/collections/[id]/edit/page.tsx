import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import EditCollectionForm from "./EditCollectionForm";

type EditCollectionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCollectionPage({
  params,
}: EditCollectionPageProps) {
  const { id } = await params;

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

  const { data: collection, error } = await supabase
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
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(
      "Error cargando colección:",
      error
    );
  }

  if (!collection) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <header className="border-b border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <Link
            href="/admin/collections"
            className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-600 transition hover:text-red-500"
          >
            ← Colecciones
          </Link>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-red-500">
            Editar colección
          </p>

          <h1 className="mt-2 font-[family-name:var(--font-bebas)] text-5xl uppercase tracking-wide sm:text-6xl">
            {collection.name}
          </h1>

          <p className="mt-3 max-w-2xl text-zinc-500">
            Modifica información, fotografía, orden
            o visibilidad de esta colección.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <EditCollectionForm
          collection={collection}
        />
      </div>
    </main>
  );
}