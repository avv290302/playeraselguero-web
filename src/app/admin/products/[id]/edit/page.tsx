import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import EditProductForm from "./EditProductForm";

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type Collection = {
  id: string;
  name: string;
  slug: string;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
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

  const { data: productData, error: productError } =
    await supabase
      .from("products")
      .select(`
        id,
        name,
        slug,
        collection_id,
        subtitle,
        description,
        color,
        sizes,
        image_url,
        image_path,
        active,
        featured
      `)
      .eq("id", id)
      .maybeSingle();

  if (productError) {
    throw new Error(
      `No fue posible cargar el producto: ${productError.message}`
    );
  }

  if (!productData) {
    notFound();
  }

  const { data: collections, error: collectionsError } =
    await supabase
      .from("collections")
      .select("id, name, slug")
      .eq("active", true)
      .order("sort_order", {
        ascending: true,
      });

  if (collectionsError) {
    throw new Error(
      `No fue posible cargar las colecciones: ${collectionsError.message}`
    );
  }

  const product = {
    id: String(productData.id),

    name:
      typeof productData.name === "string"
        ? productData.name
        : "",

    slug:
      typeof productData.slug === "string"
        ? productData.slug
        : "",

    collection_id:
      typeof productData.collection_id === "string"
        ? productData.collection_id
        : "",

    subtitle:
      typeof productData.subtitle === "string"
        ? productData.subtitle
        : "",

    description:
      typeof productData.description === "string"
        ? productData.description
        : "",

    color:
      typeof productData.color === "string"
        ? productData.color
        : "Negro",

    sizes: Array.isArray(productData.sizes)
      ? productData.sizes.filter(
          (size): size is string =>
            typeof size === "string"
        )
      : [],

    image_url:
      typeof productData.image_url === "string"
        ? productData.image_url
        : null,

    image_path:
      typeof productData.image_path === "string"
        ? productData.image_path
        : null,

    active: Boolean(productData.active),

    featured: Boolean(productData.featured),
  };

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
                Editar producto
              </h1>
            </div>
          </div>

          <Link
            href="/admin/products"
            className="rounded-lg border border-white/10 px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-400 transition hover:border-red-500/40 hover:text-white"
          >
            ← Productos
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
          Catálogo
        </p>

        <h2 className="mt-3 font-[family-name:var(--font-bebas)] text-5xl uppercase sm:text-6xl">
          Editar {product.name}
        </h2>

        <p className="mt-3 max-w-2xl text-zinc-500">
          Modifica los datos de la playera o reemplaza
          su fotografía.
        </p>

        <div className="mt-10">
          <EditProductForm
            product={product}
            collections={
              (collections ?? []) as Collection[]
            }
          />
        </div>
      </div>
    </main>
  );
}