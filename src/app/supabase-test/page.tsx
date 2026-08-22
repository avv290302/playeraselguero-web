import { createClient } from "@/lib/supabase/server";

export default async function SupabaseTestPage() {
  const supabase = await createClient();

  const { data: collections, error } = await supabase
    .from("collections")
    .select("id, name, slug, active, sort_order")
    .order("sort_order", { ascending: true });

  if (error) {
    return (
      <main className="min-h-screen bg-black p-10 text-white">
        <h1 className="text-3xl font-bold text-red-500">
          Error conectando con Supabase
        </h1>

        <pre className="mt-6 whitespace-pre-wrap rounded-xl bg-zinc-900 p-6 text-sm">
          {error.message}
        </pre>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black p-10 text-white">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
          Playeras El Güero V2
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Conexión con Supabase
        </h1>

        <p className="mt-3 text-zinc-400">
          Si ves las siete colecciones aquí abajo, Next.js ya está conectado
          correctamente con la base de datos.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {collections?.map((collection) => (
            <div
              key={collection.id}
              className="rounded-xl border border-white/10 bg-zinc-950 p-5"
            >
              <p className="text-xl font-bold">
                {collection.name}
              </p>

              <p className="mt-2 text-sm text-zinc-500">
                Slug: {collection.slug}
              </p>

              <p className="mt-2 text-sm text-zinc-500">
                Orden: {collection.sort_order}
              </p>

              <p
                className={`mt-3 text-sm font-bold ${
                  collection.active
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {collection.active ? "ACTIVA" : "OCULTA"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}