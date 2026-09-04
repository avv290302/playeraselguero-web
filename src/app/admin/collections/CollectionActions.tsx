"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

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

type CollectionActionsProps = {
  collection: Collection;
};

export default function CollectionActions({
  collection,
}: CollectionActionsProps) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  async function toggleVisibility() {
    setLoading(true);
    setErrorMessage("");

    const supabase = createClient();

    const { error } = await supabase
      .from("collections")
      .update({
        active: !collection.active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", collection.id);

    if (error) {
      setErrorMessage(
        `No fue posible actualizar la colección: ${error.message}`
      );

      setLoading(false);
      return;
    }

    router.refresh();

    setLoading(false);
  }

  async function deleteCollection() {
    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar la colección "${collection.name}"?`
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);
    setErrorMessage("");

    const supabase = createClient();

    /*
     * Antes de borrar comprobamos si existen
     * productos pertenecientes a la colección.
     */
    const { count, error: productsError } =
      await supabase
        .from("products")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq(
          "collection_id",
          collection.id
        );

    if (productsError) {
      setErrorMessage(
        `No fue posible comprobar los productos: ${productsError.message}`
      );

      setLoading(false);
      return;
    }

    if ((count ?? 0) > 0) {
      setErrorMessage(
        `No puedes eliminar esta colección porque tiene ${count} ${
          count === 1
            ? "producto asociado"
            : "productos asociados"
        }. Primero mueve o elimina esos productos.`
      );

      setLoading(false);
      return;
    }

    const { error: deleteError } =
      await supabase
        .from("collections")
        .delete()
        .eq("id", collection.id);

    if (deleteError) {
      setErrorMessage(
        `No fue posible eliminar la colección: ${deleteError.message}`
      );

      setLoading(false);
      return;
    }

    /*
     * La base ya fue eliminada.
     * Ahora limpiamos la imagen del Storage,
     * solo si fue subida desde el Admin.
     *
     * Las imágenes antiguas de /public no tienen
     * image_path, por lo que no se tocan.
     */
    if (collection.image_path) {
      const { error: removeImageError } =
        await supabase.storage
          .from("product-images")
          .remove([
            collection.image_path,
          ]);

      if (removeImageError) {
        console.error(
          "Colección eliminada pero no se pudo borrar su imagen:",
          removeImageError
        );
      }
    }

    router.refresh();

    setLoading(false);
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        <Link
          href={`/admin/collections/${collection.id}/edit`}
          className="rounded-xl border border-white/10 bg-black px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-white transition hover:border-red-500/50"
        >
          Editar
        </Link>

        <button
          type="button"
          onClick={toggleVisibility}
          disabled={loading}
          className="rounded-xl border border-white/10 bg-black px-3 py-3 text-xs font-bold uppercase tracking-wider text-zinc-400 transition hover:border-white/30 hover:text-white disabled:opacity-40"
        >
          {collection.active
            ? "Ocultar"
            : "Mostrar"}
        </button>
      </div>

      <button
        type="button"
        onClick={deleteCollection}
        disabled={loading}
        className="mt-2 w-full rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-3 text-xs font-bold uppercase tracking-wider text-red-500 transition hover:border-red-500 disabled:opacity-40"
      >
        {loading
          ? "Procesando..."
          : "Eliminar colección"}
      </button>

      {errorMessage && (
        <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs leading-5 text-red-400">
          {errorMessage}
        </div>
      )}
    </div>
  );
}