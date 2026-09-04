"use client";

/* eslint-disable @next/next/no-img-element */

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";

import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

import type { AdminHeroSlide } from "./page";

const MAX_FILE_SIZE =
  5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
];

function extensionFromType(
  type: string
) {
  if (
    type === "image/png"
  ) {
    return "png";
  }

  if (
    type === "image/jpeg"
  ) {
    return "jpg";
  }

  return "webp";
}

type HeroSlidesManagerProps = {
  slides: AdminHeroSlide[];
};

export default function HeroSlidesManager({
  slides,
}: HeroSlidesManagerProps) {
  const router =
    useRouter();

  const [loading, setLoading] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    altDrafts,
    setAltDrafts,
  ] = useState<
    Record<string, string>
  >({});

  /* ======================================================= */
  /* SINCRONIZAR TEXTOS */
  /* ======================================================= */

  useEffect(() => {
    const nextDrafts: Record<
      string,
      string
    > = {};

    slides.forEach(
      (slide) => {
        nextDrafts[
          slide.id
        ] =
          slide.alt_text ??
          "";
      }
    );

    setAltDrafts(
      nextDrafts
    );
  }, [slides]);

  const visibleCount =
    useMemo(
      () =>
        slides.filter(
          (slide) =>
            slide.active
        ).length,
      [slides]
    );

  function resetMessages() {
    setErrorMessage("");
    setSuccessMessage("");
  }

  function validateFile(
    file: File
  ) {
    if (
      !ALLOWED_TYPES.includes(
        file.type
      )
    ) {
      return "La imagen debe ser PNG, JPG o WEBP.";
    }

    if (
      file.size >
      MAX_FILE_SIZE
    ) {
      return "Cada imagen puede pesar máximo 5 MB.";
    }

    return null;
  }

  /* ======================================================= */
  /* AGREGAR IMÁGENES */
  /* ======================================================= */

  async function addImages(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files =
      Array.from(
        event.target.files ??
          []
      );

    event.target.value =
      "";

    if (
      files.length === 0
    ) {
      return;
    }

    resetMessages();

    for (const file of files) {
      const validation =
        validateFile(
          file
        );

      if (validation) {
        setErrorMessage(
          `${file.name}: ${validation}`
        );

        return;
      }
    }

    setLoading(true);

    const supabase =
      createClient();

    let nextOrder =
      slides.reduce(
        (
          maximum,
          slide
        ) =>
          Math.max(
            maximum,
            slide.sort_order
          ),
        0
      ) + 1;

    for (const file of files) {
      const extension =
        extensionFromType(
          file.type
        );

      const path =
        `hero/${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}.${extension}`;

      const {
        error:
          uploadError,
      } =
        await supabase.storage
          .from(
            "product-images"
          )
          .upload(
            path,
            file,
            {
              cacheControl:
                "3600",
              upsert: false,
              contentType:
                file.type,
            }
          );

      if (uploadError) {
        setErrorMessage(
          `No fue posible subir ${file.name}: ${uploadError.message}`
        );

        setLoading(false);
        return;
      }

      const {
        data:
          publicUrlData,
      } =
        supabase.storage
          .from(
            "product-images"
          )
          .getPublicUrl(
            path
          );

      const {
        error:
          insertError,
      } =
        await supabase
          .from(
            "hero_slides"
          )
          .insert({
            image_url:
              publicUrlData.publicUrl,

            image_path:
              path,

            alt_text:
              "Playera personalizada Playeras El Güero",

            active:
              true,

            sort_order:
              nextOrder,

            updated_at:
              new Date().toISOString(),
          });

      if (insertError) {
        await supabase.storage
          .from(
            "product-images"
          )
          .remove([
            path,
          ]);

        setErrorMessage(
          `No fue posible registrar ${file.name}: ${insertError.message}`
        );

        setLoading(false);
        return;
      }

      nextOrder += 1;
    }

    setSuccessMessage(
      files.length === 1
        ? "Imagen agregada correctamente."
        : `${files.length} imágenes agregadas correctamente.`
    );

    setLoading(false);

    router.refresh();
  }

  /* ======================================================= */
  /* VISIBILIDAD */
  /* ======================================================= */

  async function toggleActive(
    slide: AdminHeroSlide
  ) {
    resetMessages();

    setLoading(true);

    const supabase =
      createClient();

    const {
      error,
    } =
      await supabase
        .from(
          "hero_slides"
        )
        .update({
          active:
            !slide.active,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          slide.id
        );

    if (error) {
      setErrorMessage(
        `No fue posible actualizar la imagen: ${error.message}`
      );

      setLoading(false);
      return;
    }

    setLoading(false);

    router.refresh();
  }

  /* ======================================================= */
  /* GUARDAR ALT */
  /* ======================================================= */

  async function saveAlt(
    slide: AdminHeroSlide
  ) {
    resetMessages();

    setLoading(true);

    const supabase =
      createClient();

    const value =
      altDrafts[
        slide.id
      ]?.trim();

    const {
      error,
    } =
      await supabase
        .from(
          "hero_slides"
        )
        .update({
          alt_text:
            value || null,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          slide.id
        );

    if (error) {
      setErrorMessage(
        `No fue posible guardar el texto: ${error.message}`
      );

      setLoading(false);
      return;
    }

    setSuccessMessage(
      "Texto de imagen actualizado."
    );

    setLoading(false);

    router.refresh();
  }

  /* ======================================================= */
  /* REEMPLAZAR FOTO */
  /* ======================================================= */

  async function replaceImage(
    slide: AdminHeroSlide,
    file:
      | File
      | undefined
  ) {
    if (!file) {
      return;
    }

    resetMessages();

    const validation =
      validateFile(
        file
      );

    if (validation) {
      setErrorMessage(
        validation
      );

      return;
    }

    setLoading(true);

    const supabase =
      createClient();

    const extension =
      extensionFromType(
        file.type
      );

    const newPath =
      `hero/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${extension}`;

    const {
      error:
        uploadError,
    } =
      await supabase.storage
        .from(
          "product-images"
        )
        .upload(
          newPath,
          file,
          {
            cacheControl:
              "3600",
            upsert: false,
            contentType:
              file.type,
          }
        );

    if (uploadError) {
      setErrorMessage(
        `No fue posible subir la nueva imagen: ${uploadError.message}`
      );

      setLoading(false);
      return;
    }

    const {
      data:
        publicUrlData,
    } =
      supabase.storage
        .from(
          "product-images"
        )
        .getPublicUrl(
          newPath
        );

    const {
      error:
        updateError,
    } =
      await supabase
        .from(
          "hero_slides"
        )
        .update({
          image_url:
            publicUrlData.publicUrl,

          image_path:
            newPath,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          slide.id
        );

    if (updateError) {
      await supabase.storage
        .from(
          "product-images"
        )
        .remove([
          newPath,
        ]);

      setErrorMessage(
        `No fue posible reemplazar la imagen: ${updateError.message}`
      );

      setLoading(false);
      return;
    }

    if (
      slide.image_path &&
      slide.image_path !==
        newPath
    ) {
      const {
        error:
          removeError,
      } =
        await supabase.storage
          .from(
            "product-images"
          )
          .remove([
            slide.image_path,
          ]);

      if (removeError) {
        console.error(
          "Imagen reemplazada, pero no se pudo borrar la anterior:",
          removeError
        );
      }
    }

    setSuccessMessage(
      "Imagen reemplazada correctamente."
    );

    setLoading(false);

    router.refresh();
  }

  /* ======================================================= */
  /* CAMBIAR ORDEN */
  /* ======================================================= */

  async function moveSlide(
    slideId: string,
    direction:
      | "up"
      | "down"
  ) {
    resetMessages();

    const ordered =
      [...slides].sort(
        (a, b) =>
          a.sort_order -
          b.sort_order
      );

    const currentIndex =
      ordered.findIndex(
        (slide) =>
          slide.id ===
          slideId
      );

    if (
      currentIndex === -1
    ) {
      return;
    }

    const targetIndex =
      direction === "up"
        ? currentIndex - 1
        : currentIndex + 1;

    if (
      targetIndex < 0 ||
      targetIndex >=
        ordered.length
    ) {
      return;
    }

    const copy =
      [...ordered];

    [
      copy[currentIndex],
      copy[targetIndex],
    ] = [
      copy[targetIndex],
      copy[currentIndex],
    ];

    setLoading(true);

    const supabase =
      createClient();

    const results =
      await Promise.all(
        copy.map(
          (
            slide,
            index
          ) =>
            supabase
              .from(
                "hero_slides"
              )
              .update({
                sort_order:
                  index + 1,

                updated_at:
                  new Date().toISOString(),
              })
              .eq(
                "id",
                slide.id
              )
        )
      );

    const failed =
      results.find(
        (result) =>
          result.error
      );

    if (
      failed?.error
    ) {
      setErrorMessage(
        `No fue posible cambiar el orden: ${failed.error.message}`
      );

      setLoading(false);
      return;
    }

    setLoading(false);

    router.refresh();
  }

  /* ======================================================= */
  /* ELIMINAR */
  /* ======================================================= */

  async function deleteSlide(
    slide: AdminHeroSlide
  ) {
    const confirmed =
      window.confirm(
        "¿Seguro que quieres eliminar esta imagen del carrusel?"
      );

    if (!confirmed) {
      return;
    }

    resetMessages();

    setLoading(true);

    const supabase =
      createClient();

    const {
      error:
        deleteError,
    } =
      await supabase
        .from(
          "hero_slides"
        )
        .delete()
        .eq(
          "id",
          slide.id
        );

    if (deleteError) {
      setErrorMessage(
        `No fue posible eliminar la imagen: ${deleteError.message}`
      );

      setLoading(false);
      return;
    }

    if (
      slide.image_path
    ) {
      const {
        error:
          removeError,
      } =
        await supabase.storage
          .from(
            "product-images"
          )
          .remove([
            slide.image_path,
          ]);

      if (removeError) {
        console.error(
          "Registro eliminado, pero no se pudo borrar la imagen:",
          removeError
        );
      }
    }

    setSuccessMessage(
      "Imagen eliminada."
    );

    setLoading(false);

    router.refresh();
  }

  /* ======================================================= */
  /* UI */
  /* ======================================================= */

  return (
    <div>
      {/* RESUMEN */}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
            Imágenes
          </p>

          <p className="mt-2 text-3xl font-black">
            {slides.length}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
            Visibles
          </p>

          <p className="mt-2 text-3xl font-black text-green-500">
            {visibleCount}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
            Cambio automático
          </p>

          <p className="mt-2 text-lg font-bold">
            Cada 5 segundos
          </p>
        </div>
      </div>

      {/* AGREGAR */}

      <div className="mt-6 rounded-3xl border border-red-500/20 bg-red-500/[0.04] p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-500">
          Agregar imágenes
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          Amplía tu carrusel
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
          Puedes seleccionar una o varias imágenes
          al mismo tiempo. Se agregarán
          automáticamente al final del carrusel.
        </p>

        <label className="mt-6 flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-red-500/30 bg-black px-6 py-6 text-center transition hover:border-red-500">
          <div>
            <p className="text-2xl">
              +
            </p>

            <p className="mt-2 font-bold">
              Seleccionar imágenes
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              PNG, JPG o WEBP · máximo 5 MB cada una
            </p>
          </div>

          <input
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp"
            disabled={
              loading
            }
            onChange={
              addImages
            }
            className="hidden"
          />
        </label>
      </div>

      {/* MENSAJES */}

      {errorMessage && (
        <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm leading-6 text-red-400">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mt-5 rounded-xl border border-green-500/20 bg-green-500/5 p-4 text-sm text-green-400">
          {successMessage}
        </div>
      )}

      {/* LISTA */}

      <div className="mt-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-500">
            Carrusel
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Imágenes actuales
          </h2>
        </div>

        {slides.length ===
        0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-white/10 bg-[#0b0b0b] p-12 text-center">
            <p className="font-bold">
              No hay imágenes
            </p>

            <p className="mt-2 text-sm text-zinc-600">
              La portada utilizará la imagen
              predeterminada.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {slides.map(
              (
                slide,
                index
              ) => (
                <article
                  key={
                    slide.id
                  }
                  className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0b]"
                >
                  {/* FOTO */}

                  <div className="relative aspect-square overflow-hidden bg-black">
                    <img
                      src={
                        slide.image_url
                      }
                      alt={
                        slide.alt_text ||
                        "Imagen del carrusel"
                      }
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/70 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur">
                      Imagen{" "}
                      {index + 1}
                    </div>

                    <div
                      className={`absolute right-4 top-4 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase backdrop-blur ${
                        slide.active
                          ? "border-green-500/20 bg-green-500/10 text-green-400"
                          : "border-white/10 bg-black/70 text-zinc-500"
                      }`}
                    >
                      {slide.active
                        ? "Visible"
                        : "Oculta"}
                    </div>
                  </div>

                  <div className="p-5">
                    {/* ALT */}

                    <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-600">
                      Descripción de imagen
                    </label>

                    <input
                      type="text"
                      value={
                        altDrafts[
                          slide.id
                        ] ?? ""
                      }
                      onChange={(
                        event
                      ) =>
                        setAltDrafts(
                          (
                            current
                          ) => ({
                            ...current,

                            [slide.id]:
                              event.target.value,
                          })
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-white/10 bg-black px-3 py-3 text-sm outline-none focus:border-red-500"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        saveAlt(
                          slide
                        )
                      }
                      disabled={
                        loading
                      }
                      className="mt-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 transition hover:text-red-500 disabled:opacity-40"
                    >
                      Guardar descripción
                    </button>

                    {/* ORDEN */}

                    <div className="mt-5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-600">
                        Orden
                      </p>

                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            moveSlide(
                              slide.id,
                              "up"
                            )
                          }
                          disabled={
                            loading ||
                            index === 0
                          }
                          className="rounded-xl border border-white/10 bg-black px-3 py-3 text-xs font-bold text-white transition hover:border-red-500 disabled:opacity-20"
                        >
                          ← Antes
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            moveSlide(
                              slide.id,
                              "down"
                            )
                          }
                          disabled={
                            loading ||
                            index ===
                              slides.length -
                                1
                          }
                          className="rounded-xl border border-white/10 bg-black px-3 py-3 text-xs font-bold text-white transition hover:border-red-500 disabled:opacity-20"
                        >
                          Después →
                        </button>
                      </div>
                    </div>

                    {/* REEMPLAZAR */}

                    <label className="mt-4 block cursor-pointer rounded-xl border border-white/10 bg-black px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-white transition hover:border-red-500/50">
                      Reemplazar foto

                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        disabled={
                          loading
                        }
                        className="hidden"
                        onChange={(
                          event
                        ) => {
                          const file =
                            event.target.files?.[0];

                          event.target.value =
                            "";

                          void replaceImage(
                            slide,
                            file
                          );
                        }}
                      />
                    </label>

                    {/* VISIBILIDAD */}

                    <button
                      type="button"
                      onClick={() =>
                        toggleActive(
                          slide
                        )
                      }
                      disabled={
                        loading
                      }
                      className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-400 transition hover:border-white/30 hover:text-white disabled:opacity-40"
                    >
                      {slide.active
                        ? "Ocultar imagen"
                        : "Mostrar imagen"}
                    </button>

                    {/* ELIMINAR */}

                    <button
                      type="button"
                      onClick={() =>
                        deleteSlide(
                          slide
                        )
                      }
                      disabled={
                        loading
                      }
                      className="mt-2 w-full rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs font-bold uppercase tracking-wider text-red-500 transition hover:border-red-500 disabled:opacity-40"
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}