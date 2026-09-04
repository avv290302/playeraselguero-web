"use client";

import {
  type FormEvent,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

function createSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NewCollectionForm() {
  const router = useRouter();

  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [sortOrder, setSortOrder] =
    useState("0");

  const [active, setActive] =
    useState(true);

  const [image, setImage] =
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

    if (!image) {
      setErrorMessage(
        "Selecciona una imagen para la colección."
      );
      return;
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    if (!allowedTypes.includes(image.type)) {
      setErrorMessage(
        "La imagen debe ser PNG, JPG o WEBP."
      );
      return;
    }

    if (
      image.size >
      5 * 1024 * 1024
    ) {
      setErrorMessage(
        "La imagen no puede pesar más de 5 MB."
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

    setLoading(true);

    const supabase = createClient();

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
        image.type
      ];

    const imagePath =
      `collections/${slug}/${Date.now()}.${extension}`;

    /* SUBIR IMAGEN */

    const { error: uploadError } =
      await supabase.storage
        .from("product-images")
        .upload(
          imagePath,
          image,
          {
            cacheControl: "3600",
            upsert: false,
            contentType: image.type,
          }
        );

    if (uploadError) {
      setErrorMessage(
        `No fue posible subir la imagen: ${uploadError.message}`
      );

      setLoading(false);
      return;
    }

    const { data: publicUrlData } =
      supabase.storage
        .from("product-images")
        .getPublicUrl(
          imagePath
        );

    const imageUrl =
      publicUrlData.publicUrl;

    /* CREAR COLECCIÓN */

    const { error: insertError } =
      await supabase
        .from("collections")
        .insert({
          name: name.trim(),
          slug,
          description:
            description.trim() ||
            null,
          image_url: imageUrl,
          image_path: imagePath,
          active,
          sort_order:
            numericSortOrder,
          updated_at:
            new Date().toISOString(),
        });

    if (insertError) {
      await supabase.storage
        .from("product-images")
        .remove([
          imagePath,
        ]);

      if (
        insertError.code ===
        "23505"
      ) {
        setErrorMessage(
          "Ya existe una colección con ese nombre o URL."
        );
      } else {
        setErrorMessage(
          `No fue posible crear la colección: ${insertError.message}`
        );
      }

      setLoading(false);
      return;
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
      {/* INFORMACIÓN */}

      <div className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-6 sm:p-8">
        <h2 className="text-xl font-bold">
          Información de la colección
        </h2>

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
            placeholder="Ej. Asil"
            className="mt-3 w-full rounded-xl border border-white/10 bg-black px-4 py-4 outline-none transition focus:border-red-500"
          />

          {name && (
            <p className="mt-2 text-xs text-zinc-600">
              URL: {createSlug(name)}
            </p>
          )}
        </div>

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
            Ejemplo: 1, 2, 3...
          </p>
        </div>
      </div>

      {/* DERECHA */}

      <div>
        <div className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-6 sm:p-8">
          <h2 className="text-xl font-bold">
            Imagen
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Esta será la fotografía que aparecerá
            en la tarjeta de la colección.
          </p>

          <label className="mt-6 flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-black p-6 text-center transition hover:border-red-500/50">
            <span className="text-3xl">
              +
            </span>

            <span className="mt-3 font-bold">
              Seleccionar imagen
            </span>

            <span className="mt-2 text-xs text-zinc-600">
              PNG, JPG o WEBP · máximo 5 MB
            </span>

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(event) => {
                const file =
                  event.target.files?.[0];

                setImage(
                  file ?? null
                );
              }}
            />
          </label>

          {image && (
            <div className="mt-4 rounded-xl border border-green-500/20 bg-green-500/5 p-4">
              <p className="text-sm font-bold text-green-400">
                Imagen seleccionada
              </p>

              <p className="mt-1 break-all text-xs text-zinc-500">
                {image.name}
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                {(
                  image.size /
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
            Publicación
          </h2>

          <label className="mt-6 flex cursor-pointer items-center justify-between gap-5 rounded-xl border border-white/10 bg-black p-4">
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
              ? "Creando..."
              : "Crear colección"}
          </button>
        </div>
      </div>
    </form>
  );
}