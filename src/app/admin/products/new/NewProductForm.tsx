"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type Collection = {
  id: string;
  name: string;
  slug: string;
};

type NewProductFormProps = {
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

export default function NewProductForm({
  collections,
}: NewProductFormProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("Negro");

  const [collectionId, setCollectionId] = useState(
    collections[0]?.id ?? ""
  );

  const [sizes, setSizes] = useState<string[]>([
    "CH",
    "M",
    "G",
    "XG",
    "2XG",
  ]);

  const [image, setImage] = useState<File | null>(
    null
  );

  const [active, setActive] = useState(true);
  const [featured, setFeatured] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");

  function toggleSize(size: string) {
    setSizes((currentSizes) => {
      if (currentSizes.includes(size)) {
        return currentSizes.filter(
          (currentSize) => currentSize !== size
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
        "Escribe el nombre de la playera."
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

    if (!image) {
      setErrorMessage(
        "Selecciona una imagen de la playera."
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
        "La imagen debe ser PNG, JPG, JPEG o WEBP."
      );
      return;
    }

    const maximumSize = 5 * 1024 * 1024;

    if (image.size > maximumSize) {
      setErrorMessage(
        "La imagen no puede pesar más de 5 MB."
      );
      return;
    }

    const slug = createSlug(name);

    if (!slug) {
      setErrorMessage(
        "No fue posible crear un identificador para el producto."
      );
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const originalExtension =
      image.name.split(".").pop()?.toLowerCase();

    const extension =
      originalExtension === "jpeg"
        ? "jpg"
        : originalExtension || "png";

    const imagePath =
      `${slug}/${Date.now()}.${extension}`;

    /*
      1. Subimos la imagen.
    */
    const { error: uploadError } =
      await supabase.storage
        .from("product-images")
        .upload(imagePath, image, {
          cacheControl: "3600",
          upsert: false,
          contentType: image.type,
        });

    if (uploadError) {
      console.error(uploadError);

      setErrorMessage(
        `No fue posible subir la imagen: ${uploadError.message}`
      );

      setLoading(false);
      return;
    }

    /*
      2. Obtenemos la URL pública.
    */
    const { data: publicUrlData } =
      supabase.storage
        .from("product-images")
        .getPublicUrl(imagePath);

    const imageUrl = publicUrlData.publicUrl;

    /*
      3. Guardamos el producto en PostgreSQL.
    */
    const { error: productError } =
      await supabase
        .from("products")
        .insert({
          name: name.trim(),
          slug,
          collection_id: collectionId,
          subtitle: subtitle.trim() || null,
          description:
            description.trim() || null,
          color: color.trim() || "Negro",
          sizes,
          image_url: imageUrl,
          image_path: imagePath,
          active,
          featured,
          sort_order: 0,
        });

    /*
      Si falla la base de datos,
      eliminamos la imagen que acabamos de subir
      para no dejar archivos huérfanos.
    */
    if (productError) {
      await supabase.storage
        .from("product-images")
        .remove([imagePath]);

      console.error(productError);

      if (productError.code === "23505") {
        setErrorMessage(
          "Ya existe un producto con ese nombre o slug."
        );
      } else {
        setErrorMessage(
          `No fue posible guardar el producto: ${productError.message}`
        );
      }

      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-8 lg:grid-cols-[1fr_0.85fr]"
    >
      {/* DATOS */}
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
              setName(event.target.value)
            }
            placeholder="Ejemplo: Hatch 06"
            className="mt-3 w-full rounded-xl border border-white/10 bg-black px-4 py-4 outline-none transition focus:border-red-500"
          />

          {name && (
            <p className="mt-2 text-xs text-zinc-600">
              URL: /producto/{createSlug(name)}
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
              setCollectionId(event.target.value)
            }
            className="mt-3 w-full rounded-xl border border-white/10 bg-black px-4 py-4 outline-none focus:border-red-500"
          >
            {collections.map((collection) => (
              <option
                key={collection.id}
                value={collection.id}
              >
                {collection.name}
              </option>
            ))}
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
              setSubtitle(event.target.value)
            }
            placeholder="Ejemplo: Yellow Leg"
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
              setColor(event.target.value)
            }
            placeholder="Negro"
            className="mt-3 w-full rounded-xl border border-white/10 bg-black px-4 py-4 outline-none focus:border-red-500"
          />
        </div>

        <div className="mt-6">
          <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
            Descripción
          </label>

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            rows={5}
            placeholder="Describe brevemente el diseño..."
            className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-4 outline-none focus:border-red-500"
          />
        </div>

        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
            Tallas disponibles *
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            {availableSizes.map((size) => {
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
                      : "border-white/10 bg-black text-zinc-500 hover:border-white/30"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* IMAGEN Y PUBLICACIÓN */}
      <div>
        <div className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-6 sm:p-8">
          <h3 className="text-xl font-bold">
            Imagen
          </h3>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Esta imagen se almacenará directamente
            en Supabase Storage.
          </p>

          <label className="mt-6 flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-black p-6 text-center transition hover:border-red-500/50">
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
                const selectedFile =
                  event.target.files?.[0];

                setImage(
                  selectedFile ?? null
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
                {(image.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}
        </div>

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
                Producto destacado
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                Lo usaremos después para destacar diseños.
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
              ? "Publicando..."
              : "Publicar playera"}
          </button>
        </div>
      </div>
    </form>
  );
}