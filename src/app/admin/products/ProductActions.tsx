"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type ProductActionsProps = {
  id: string;
  name: string;
  active: boolean;
  imagePath: string | null;
};

export default function ProductActions({
  id,
  name,
  active,
  imagePath,
}: ProductActionsProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function toggleVisibility() {
    setErrorMessage("");
    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase
      .from("products")
      .update({
        active: !active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      setErrorMessage(
        `No fue posible actualizar: ${error.message}`
      );
      setLoading(false);
      return;
    }

    router.refresh();
    setLoading(false);
  }

  async function deleteProduct() {
    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar "${name}"?\n\nEsta acción eliminará el producto y su imagen.`
    );

    if (!confirmed) {
      return;
    }

    setErrorMessage("");
    setLoading(true);

    const supabase = createClient();

    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (deleteError) {
      setErrorMessage(
        `No fue posible eliminar: ${deleteError.message}`
      );
      setLoading(false);
      return;
    }

    if (imagePath) {
      const { error: imageError } =
        await supabase.storage
          .from("product-images")
          .remove([imagePath]);

      if (imageError) {
        console.error(
          "Producto eliminado, pero no fue posible borrar la imagen:",
          imageError
        );
      }
    }

    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-44">
      <button
        type="button"
        onClick={toggleVisibility}
        disabled={loading}
        className={`rounded-lg border px-4 py-3 text-xs font-bold uppercase tracking-wider transition disabled:opacity-50 ${
          active
            ? "border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10"
            : "border-green-500/20 text-green-400 hover:bg-green-500/10"
        }`}
      >
        {active ? "Ocultar" : "Publicar"}
      </button>

      <Link
  href={`/admin/products/${id}/edit`}
  className="rounded-lg border border-white/10 px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-zinc-300 transition hover:border-red-500/40 hover:text-white"
>
  Editar
</Link>

      <button
        type="button"
        onClick={deleteProduct}
        disabled={loading}
        className="rounded-lg border border-red-500/20 px-4 py-3 text-xs font-bold uppercase tracking-wider text-red-500 transition hover:bg-red-500/10 disabled:opacity-50"
      >
        {loading ? "Procesando..." : "Eliminar"}
      </button>

      {errorMessage && (
        <p className="max-w-44 text-xs leading-5 text-red-400">
          {errorMessage}
        </p>
      )}
    </div>
  );
}