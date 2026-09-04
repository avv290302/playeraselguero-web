"use client";

/* eslint-disable @next/next/no-img-element */

import {
  type FormEvent,
  useState,
} from "react";

import { useRouter } from "next/navigation";

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

type EditCollectionFormProps = {
  collection: Collection;
};

function createSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function EditCollectionForm({
  collection,
}: EditCollectionFormProps) {
  const router = useRouter();

  const [name, setName] =
    useState(collection.name);

  const [description, setDescription] =
    useState(collection.description ?? "");

  const [sortOrder, setSortOrder] =
    useState(
      String(collection.sort_order)
    );

  const [active, setActive] =
    useState(collection.active);

  const [newImage, setNewImage] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage(
        "Escribe el nombre de la colección."
      );

      return;
    }

    const slug =
      createSlug(name);

    if (!slug) {
      setErrorMessage(
        "No fue posible generar la URL de la colección."
      );

      return;
    }

    const numericSortOrder =
      Number(sortOrder);

    if (
      !Number.isFinite(
        numericSortOrder
      )
    ) {
      setErrorMessage(
        "El orden debe ser un número válido."
      );

      return;
    }

    if (newImage) {
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/webp",
      ];

      if (
        !allowedTypes.includes(
          newImage.type
        )
      ) {
        setErrorMessage(
          "La nueva imagen debe ser PNG, JPG o WEBP."
        );

        return;
      }

      if (
        newImage.size >
        5 * 1024 * 1024
      ) {
        setErrorMessage(
          "La nueva imagen no puede pesar más de 5 MB."
        );

        return;
      }
    }

    setLoading(true);

    const supabase =
      createClient();

    let newImagePath:
      | string
      | null = null;

    let newImageUrl:
      | string
      | null = null;

    /* =============================================== */
    /* SUBIR NUEVA FOTO */
    /* =============================================== */

    if (newImage) {
      const extensionByType: Record<
        string,
        string
      > = {
        "image/png": "png",
        "image/jpeg": "jpg",
        "image/webp": "webp",
      };

      const extension =
        extensionByType[
          newImage.type
        ];

      newImagePath =
        `collections/${slug}/${Date.now()}.${extension}`;

      const { error: uploadError } =
        await supabase.storage
          .from("product-images")
          .upload(
            newImagePath,
            newImage,
            {
              cacheControl: "3600",
              upsert: false,
              contentType:
                newImage.type,
            }
          );

      if (uploadError) {
        setErrorMessage(
          `No fue posible subir la nueva imagen: ${uploadError.message}`
        );

        setLoading(false);
        return;
      }

      const { data: publicUrlData } =
        supabase.storage
          .from("product-images")
          .getPublicUrl(
            newImagePath
          );

      newImageUrl =
        publicUrlData.publicUrl;
    }

    /* =============================================== */
    /* ACTUALIZAR COLECCIÓN */
    /* =============================================== */

    const changes = {
      name: name.trim(),

      slug,

      description:
        description.trim() ||
        null,

      active,

      sort_order:
        numericSortOrder,

      updated_at:
        new Date().toISOString(),

      ...(newImagePath &&
      newImageUrl
        ? {
            image_path:
              newImagePath,

            image_url:
              newImageUrl,
          }
        : {}),
    };

    const { error: updateError } =
      await supabase
        .from("collections")
        .update(changes)
        .eq(
          "id",
          collection.id
        );

    if (updateError) {
      if (newImagePath) {
        await supabase.storage
          .from("product-images")
          .remove([
            newImagePath,
          ]);
      }

      if (
        updateError.code ===
        "23505"
      ) {
        setErrorMessage(
          "Ya existe otra colección con ese nombre o URL."
        );
      } else {
        setErrorMessage(
          `No fue posible guardar los cambios: ${updateError.message}`
        );
      }

      setLoading(false);
      return;
    }

    /* =============================================== */
    /* BORRAR FOTO ANTERIOR DEL STORAGE */
    /* =============================================== */

    if (
      newImagePath &&
      collection.image_path &&
      collection.image_path !==
        newImagePath
    ) {
      const { error: removeError } =
        await supabase.storage
          .from("product-images")
          .remove([
            collection.image_path,
          ]);

      if (removeError) {
        console.error(
          "Colección actualizada, pero no se pudo eliminar la imagen anterior:",
          removeError
        );
      }
    }

    router.push(
      "/admin/collections"
    );

    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-8 lg:grid-cols-[1fr_0.85fr]"
    >
      {/* ================================================= */}
      {/* INFORMACIÓN */}
      {/* ================================================= */}

      <div className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-6 sm:p-8">
        <h2 className="text-xl font-bold">
          Información de la colección
        </h2>

        {/* NOMBRE */}

        <div className="mt-7">
          <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
            Nombre *
          </label>

          <input
            type="text"
            value={name}
            onChange={(event) =>
              setName(
                event.target.value
              )
            }
            className="mt-3 w-full rounded-xl border border-white/10 bg-black px-4 py-4 outline-none transition focus:border-red-500"
          />

          {name && (
            <p className="mt-2 text-xs text-zinc-600">
              URL: {createSlug(name)}
            </p>
          )}
        </div>

        {/* DESCRIPCIÓN */}

        <div className="mt-6">
          <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
            Descripción
          </label>

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            rows={5}
            placeholder="Describe brevemente esta línea..."
            className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-4 outline-none transition focus:border-red-500"
          />
        </div>

        {/* ORDEN */}

        <div className="mt-6">
          <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
            Orden de aparición
          </label>

          <input
            type="number"
            value={sortOrder}
            onChange={(event) =>
              setSortOrder(
                event.target.value
              )
            }
            min="0"
            step="1"
            className="mt-3 w-full rounded-xl border border-white/10 bg-black px-4 py-4 outline-none transition focus:border-red-500"
          />

          <p className="mt-2 text-xs leading-5 text-zinc-600">
            Los números menores aparecen primero.
          </p>
        </div>

        {/* ESTADO */}

        <div className="mt-6">
          <label className="flex cursor-pointer items-center justify-between gap-5 rounded-xl border border-white/10 bg-black p-4">
            <div>
              <p className="font-bold">
                Colección visible
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                Aparecerá en la página principal.
              </p>
            </div>

            <input
              type="checkbox"
              checked={active}
              onChange={(event) =>
                setActive(
                  event.target.checked
                )
              }
              className="h-5 w-5 accent-red-600"
            />
          </label>
        </div>
      </div>

      {/* ================================================= */}
      {/* IMAGEN Y GUARDAR */}
      {/* ================================================= */}

      <div>
        <div className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-6 sm:p-8">
          <h2 className="text-xl font-bold">
            Fotografía
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Puedes reemplazar la fotografía del
            gallo o utilizar cualquier imagen que
            quieras para representar esta colección.
          </p>

          {collection.image_url && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-black">
              <img
                src={
                  collection.image_url
                }
                alt={
                  collection.name
                }
                className="aspect-square w-full object-cover"
              />
            </div>
          )}

          <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-black p-6 text-center transition hover:border-red-500/50">
            <span className="text-3xl">
              +
            </span>

            <span className="mt-3 font-bold">
              Reemplazar fotografía
            </span>

            <span className="mt-2 text-xs text-zinc-600">
              PNG, JPG o WEBP · máximo 5 MB
            </span>

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(event) =>
                setNewImage(
                  event.target.files?.[0] ??
                    null
                )
              }
            />
          </label>

          {newImage && (
            <div className="mt-4 rounded-xl border border-green-500/20 bg-green-500/5 p-4">
              <p className="text-sm font-bold text-green-400">
                Nueva imagen seleccionada
              </p>

              <p className="mt-1 break-all text-xs text-zinc-500">
                {newImage.name}
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                {(
                  newImage.size /
                  1024 /
                  1024
                ).toFixed(2)}{" "}
                MB
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-[#0b0b0b] p-6 sm:p-8">
          <h2 className="text-xl font-bold">
            Guardar cambios
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Los cambios se aplicarán a la sección
            de colecciones de la tienda.
          </p>

          {errorMessage && (
            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm leading-6 text-red-400">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-7 w-full rounded-xl bg-red-600 px-6 py-4 text-sm font-bold uppercase tracking-[0.15em] text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Guardando..."
              : "Guardar cambios"}
          </button>
        </div>
      </div>
    </form>
  );
}