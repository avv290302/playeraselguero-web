"use client";

/* eslint-disable @next/next/no-img-element */

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type Collection = {
  id: string;
  name: string;
  slug: string;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  collection_id: string;
  subtitle: string;
  description: string;
  color: string;
  sizes: string[];
  image_url: string | null;
  image_path: string | null;
  active: boolean;
  featured: boolean;
};

type EditProductFormProps = {
  product: Product;
  collections: Collection[];
};

const availableSizes = [
  "CH",
  "M",
  "G",
  "XG",
  "2XG",
];

function createSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function EditProductForm({
  product,
  collections,
}: EditProductFormProps) {
  const router = useRouter();

  const [name, setName] =
    useState(product.name);

  const [subtitle, setSubtitle] =
    useState(product.subtitle);

  const [description, setDescription] =
    useState(product.description);

  const [color, setColor] =
    useState(product.color);

  const [collectionId, setCollectionId] =
    useState(product.collection_id);

  const [sizes, setSizes] =
    useState<string[]>(product.sizes);

  const [active, setActive] =
    useState(product.active);

  const [featured, setFeatured] =
    useState(product.featured);

  const [newImage, setNewImage] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  function toggleSize(size: string) {
    setSizes((currentSizes) => {
      if (currentSizes.includes(size)) {
        return currentSizes.filter(
          (currentSize) =>
            currentSize !== size
        );
      }

      return [...currentSizes, size];
    });
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage(
        "Escribe el nombre del producto."
      );
      return;
    }

    if (!collectionId) {
      setErrorMessage(
        "Selecciona una colección."
      );
      return;
    }

    if (sizes.length === 0) {
      setErrorMessage(
        "Selecciona al menos una talla."
      );
      return;
    }

    if (newImage) {
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/webp",
      ];

      if (!allowedTypes.includes(newImage.type)) {
        setErrorMessage(
          "La nueva imagen debe ser PNG, JPG o WEBP."
        );
        return;
      }

      if (newImage.size > 5 * 1024 * 1024) {
        setErrorMessage(
          "La nueva imagen no puede pesar más de 5 MB."
        );
        return;
      }
    }

    const slug = createSlug(name);

    if (!slug) {
      setErrorMessage(
        "No fue posible generar la URL del producto."
      );
      return;
    }

    setLoading(true);

    const supabase = createClient();

    let newImagePath: string | null = null;
    let newImageUrl: string | null = null;

    /*
      Si seleccionaste una nueva imagen,
      primero la subimos.
    */
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
        extensionByType[newImage.type];

      newImagePath =
        `${slug}/${Date.now()}.${extension}`;

      const { error: uploadError } =
        await supabase.storage
          .from("product-images")
          .upload(
            newImagePath,
            newImage,
            {
              cacheControl: "3600",
              upsert: false,
              contentType: newImage.type,
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
          .getPublicUrl(newImagePath);

      newImageUrl =
        publicUrlData.publicUrl;
    }

    /*
      Preparamos los cambios.
    */
    const changes = {
      name: name.trim(),
      slug,
      collection_id: collectionId,
      subtitle:
        subtitle.trim() || null,
      description:
        description.trim() || null,
      color:
        color.trim() || "Negro",
      sizes,
      active,
      featured,
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

    /*
      Actualizamos PostgreSQL.
    */
    const { error: updateError } =
      await supabase
        .from("products")
        .update(changes)
        .eq("id", product.id);

    if (updateError) {
      /*
        Si la actualización falla pero
        ya habíamos subido una imagen nueva,
        la eliminamos para no dejar basura.
      */
      if (newImagePath) {
        await supabase.storage
          .from("product-images")
          .remove([newImagePath]);
      }

      if (updateError.code === "23505") {
        setErrorMessage(
          "Ya existe otro producto con ese nombre o URL."
        );
      } else {
        setErrorMessage(
          `No fue posible guardar los cambios: ${updateError.message}`
        );
      }

      setLoading(false);
      return;
    }

    /*
      Si la base ya se actualizó correctamente
      y reemplazamos la fotografía,
      ahora sí eliminamos la anterior.
    */
    if (
      newImagePath &&
      product.image_path &&
      product.image_path !==
        newImagePath
    ) {
      const { error: removeError } =
        await supabase.storage
          .from("product-images")
          .remove([
            product.image_path,
          ]);

      if (removeError) {
        console.error(
          "Producto actualizado, pero no se pudo eliminar la imagen anterior:",
          removeError
        );
      }
    }

    router.push(
      "/admin/products"
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
        <h3 className="text-xl font-bold">
          Información del producto
        </h3>

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
              URL: /producto/
              {createSlug(name)}
            </p>
          )}
        </div>

        <div className="mt-6">
          <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
            Colección *
          </label>

          <select
            value={collectionId}
            onChange={(event) =>
              setCollectionId(
                event.target.value
              )
            }
            className="mt-3 w-full rounded-xl border border-white/10 bg-black px-4 py-4 outline-none focus:border-red-500"
          >
            {collections.map(
              (collection) => (
                <option
                  key={collection.id}
                  value={collection.id}
                >
                  {collection.name}
                </option>
              )
            )}
          </select>
        </div>

        <div className="mt-6">
          <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
            Subtítulo
          </label>

          <input
            type="text"
            value={subtitle}
            onChange={(event) =>
              setSubtitle(
                event.target.value
              )
            }
            className="mt-3 w-full rounded-xl border border-white/10 bg-black px-4 py-4 outline-none focus:border-red-500"
          />
        </div>

        <div className="mt-6">
          <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
            Color
          </label>

          <input
            type="text"
            value={color}
            onChange={(event) =>
              setColor(
                event.target.value
              )
            }
            className="mt-3 w-full rounded-xl border border-white/10 bg-black px-4 py-4 outline-none focus:border-red-500"
          />
        </div>

        <div className="mt-6">
          <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
            Descripción
          </label>

          <textarea
            rows={5}
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-4 outline-none focus:border-red-500"
          />
        </div>

        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
            Tallas disponibles
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            {availableSizes.map(
              (size) => {
                const selected =
                  sizes.includes(size);

                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() =>
                      toggleSize(size)
                    }
                    className={`rounded-lg border px-5 py-3 text-sm font-bold transition ${
                      selected
                        ? "border-red-500 bg-red-600 text-white"
                        : "border-white/10 bg-black text-zinc-500"
                    }`}
                  >
                    {size}
                  </button>
                );
              }
            )}
          </div>
        </div>
      </div>

      {/* IMAGEN */}
      <div>
        <div className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-6 sm:p-8">
          <h3 className="text-xl font-bold">
            Imagen
          </h3>

          {product.image_url && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-black">
              <img
                src={product.image_url}
                alt={product.name}
                className="aspect-square w-full object-cover"
              />
            </div>
          )}

          <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-black p-6 text-center transition hover:border-red-500/50">
            <span className="text-2xl">
              +
            </span>

            <span className="mt-2 font-bold">
              Reemplazar imagen
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
                  event.target
                    .files?.[0] ??
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
            </div>
          )}
        </div>

        {/* PUBLICACIÓN */}
        <div className="mt-6 rounded-3xl border border-white/10 bg-[#0b0b0b] p-6 sm:p-8">
          <h3 className="text-xl font-bold">
            Publicación
          </h3>

          <label className="mt-6 flex cursor-pointer items-center justify-between gap-5 rounded-xl border border-white/10 bg-black p-4">
            <div>
              <p className="font-bold">
                Producto visible
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                Aparecerá en el catálogo.
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

          <label className="mt-3 flex cursor-pointer items-center justify-between gap-5 rounded-xl border border-white/10 bg-black p-4">
            <div>
              <p className="font-bold">
                Destacado
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                Producto especial.
              </p>
            </div>

            <input
              type="checkbox"
              checked={featured}
              onChange={(event) =>
                setFeatured(
                  event.target.checked
                )
              }
              className="h-5 w-5 accent-red-600"
            />
          </label>

          {errorMessage && (
            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-7 w-full rounded-xl bg-red-600 px-6 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-red-500 disabled:opacity-50"
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