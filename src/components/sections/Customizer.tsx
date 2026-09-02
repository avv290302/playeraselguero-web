"use client";

import { useMemo, useState } from "react";

import Container from "@/components/common/Container";

import FabricEditor, {
  type EditorSnapshot,
} from "@/components/customizer/FabricEditor";

import Shirt3D from "@/components/customizer/Shirt3D";

/* ========================================================= */
/* COLORES */
/* ========================================================= */

const shirtColors = [
  {
    name: "Negro",
    hex: "#111111",
  },
  {
    name: "Blanco",
    hex: "#F4F4F4",
  },
  {
    name: "Rojo",
    hex: "#B91C1C",
  },
  {
    name: "Azul",
    hex: "#1D4ED8",
  },
  {
    name: "Verde",
    hex: "#166534",
  },
  {
    name: "Gris",
    hex: "#52525B",
  },
];

type Side =
  | "front"
  | "back";

const emptySnapshot: EditorSnapshot = {
  preview: "",
  json: "",
  objectCount: 0,
};

/* ========================================================= */
/* COMPONENTE */
/* ========================================================= */

export default function Customizer() {
  const [
    selectedColor,
    setSelectedColor,
  ] = useState(
    shirtColors[0]
  );

  const [
    activeSide,
    setActiveSide,
  ] = useState<Side>(
    "front"
  );

  const [
    frontDesign,
    setFrontDesign,
  ] =
    useState<EditorSnapshot>(
      emptySnapshot
    );

  const [
    backDesign,
    setBackDesign,
  ] =
    useState<EditorSnapshot>(
      emptySnapshot
    );

  const totalObjects =
    frontDesign.objectCount +
    backDesign.objectCount;

  /* ======================================================= */
  /* WHATSAPP */
  /* ======================================================= */

  const whatsappUrl =
    useMemo(() => {
      const message =
        encodeURIComponent(
          [
            "Hola, estuve usando el personalizador de Playeras El Güero y quiero cotizar una playera personalizada.",
            "",
            `Color de playera: ${selectedColor.name}`,
            `Elementos al frente: ${frontDesign.objectCount}`,
            `Elementos en espalda: ${backDesign.objectCount}`,
            `Total de elementos: ${totalObjects}`,
            "",
            "Quiero continuar con mi diseño personalizado.",
          ].join("\n")
        );

      return `https://wa.me/524922230511?text=${message}`;
    }, [
      selectedColor.name,
      frontDesign.objectCount,
      backDesign.objectCount,
      totalObjects,
    ]);

  return (
    <section
      id="personaliza"
      className="relative w-full overflow-hidden bg-[#080808] py-24"
    >
      {/* ================================================= */}
      {/* FONDO */}
      {/* ================================================= */}

      <div className="pointer-events-none absolute left-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-red-600/5 blur-[170px]" />

      <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-red-600/5 blur-[170px]" />

      <Container className="relative z-10 w-full min-w-0">
        {/* ================================================= */}
        {/* ENCABEZADO */}
        {/* ================================================= */}

        <div className="mb-12 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
            Personalizador Pro
          </p>

          <h2 className="mt-3 font-[family-name:var(--font-bebas)] text-5xl uppercase leading-none tracking-wide text-white sm:text-6xl">
            Diseña
            <span className="ml-3 text-red-500">
              tu playera
            </span>
          </h2>

          <p className="mt-5 max-w-2xl leading-7 text-zinc-400">
            Diseña tu playera en tiempo real.
            Agrega logos, textos y elementos,
            cambia colores y visualiza tu
            diseño directamente sobre una
            playera 3D interactiva.
          </p>
        </div>

        {/* ================================================= */}
        {/* FRENTE / ESPALDA */}
        {/* ================================================= */}

        <div className="mb-6 flex w-full min-w-0 flex-col gap-4 rounded-2xl border border-white/10 bg-[#0d0d0d] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 rounded-xl border border-white/10 bg-black p-1">
            <button
              type="button"
              onClick={() =>
                setActiveSide(
                  "front"
                )
              }
              className={`flex-1 rounded-lg px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] transition sm:flex-none sm:px-6 ${
                activeSide ===
                "front"
                  ? "bg-red-600 text-white"
                  : "text-zinc-500 hover:text-white"
              }`}
            >
              Frente
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveSide(
                  "back"
                )
              }
              className={`flex-1 rounded-lg px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] transition sm:flex-none sm:px-6 ${
                activeSide ===
                "back"
                  ? "bg-red-600 text-white"
                  : "text-zinc-500 hover:text-white"
              }`}
            >
              Espalda
            </button>
          </div>

          <div className="flex items-center justify-between gap-6 sm:justify-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                Editando
              </p>

              <p className="mt-1 text-sm font-bold text-white">
                {activeSide ===
                "front"
                  ? "Frente"
                  : "Espalda"}
              </p>
            </div>

            <div className="h-8 w-px bg-white/10" />

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                Elementos
              </p>

              <p className="mt-1 text-sm font-bold text-white">
                {totalObjects}
              </p>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* ÁREA PRINCIPAL */}
        {/* ================================================= */}

        <div className="grid w-full min-w-0 grid-cols-1 gap-6 overflow-hidden xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
          {/* ================================================= */}
          {/* CARD PLAYERA 3D */}
          {/* ================================================= */}

          <div className="mx-auto w-full min-w-0 max-w-full overflow-hidden rounded-3xl border border-white/10 bg-[#101010]">
            <div className="flex min-w-0 items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <p className="text-sm font-bold text-white sm:text-base">
                  Vista 3D de tu playera
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-500 sm:text-sm">
                  Gírala, acércala y observa tu
                  playera desde cualquier ángulo.
                </p>
              </div>

              <span className="shrink-0 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.15em] text-red-500 sm:text-[10px]">
                3D interactivo
              </span>
            </div>

            <div className="h-[580px] w-full min-w-0 sm:h-[650px] lg:h-[700px]">
              <Shirt3D
  color={selectedColor.hex}
  frontDesign={frontDesign.preview}
  backDesign={backDesign.preview}
  activeSide={activeSide}
/>
            </div>

            <div className="border-t border-white/10 px-5 py-4 sm:px-6">
              <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="min-w-0 text-xs leading-5 text-zinc-600">
                  Arrastra la playera para rotarla.
                  Usa la rueda del mouse o pellizca
                  con dos dedos para hacer zoom.
                </p>

                <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-700">
                  Vista 360°
                </span>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* PANEL DERECHO */}
          {/* ================================================= */}

          <div className="w-full min-w-0 space-y-5 overflow-hidden">
            {/* ============================================= */}
            {/* COLOR */}
            {/* ============================================= */}

            <div className="w-full min-w-0 rounded-2xl border border-white/10 bg-[#111] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-5">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-500">
                    Playera
                  </p>

                  <h3 className="mt-2 text-xl font-bold text-white">
                    Selecciona el color
                  </h3>
                </div>

                <span className="shrink-0 text-sm font-semibold text-zinc-400">
                  {
                    selectedColor.name
                  }
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {shirtColors.map(
                  (color) => {
                    const isSelected =
                      selectedColor.name ===
                      color.name;

                    return (
                      <button
                        key={
                          color.name
                        }
                        type="button"
                        onClick={() =>
                          setSelectedColor(
                            color
                          )
                        }
                        aria-label={`Seleccionar color ${color.name}`}
                        title={
                          color.name
                        }
                        className={`relative h-11 w-11 shrink-0 rounded-full border-2 transition ${
                          isSelected
                            ? "scale-110 border-red-500"
                            : "border-white/20 hover:scale-105 hover:border-white/60"
                        }`}
                        style={{
                          backgroundColor:
                            color.hex,
                        }}
                      >
                        {isSelected && (
                          <span className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-red-500" />
                        )}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* ============================================= */}
            {/* ZONA */}
            {/* ============================================= */}

            <div className="w-full min-w-0 rounded-2xl border border-white/10 bg-[#111] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-500">
                Zona de diseño
              </p>

              <div className="mt-4 grid min-w-0 grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setActiveSide(
                      "front"
                    )
                  }
                  className={`min-w-0 rounded-xl border px-3 py-4 text-sm font-bold transition sm:px-4 ${
                    activeSide ===
                    "front"
                      ? "border-red-500 bg-red-500/10 text-white"
                      : "border-white/10 bg-black text-zinc-500 hover:border-white/20 hover:text-white"
                  }`}
                >
                  Frente
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveSide(
                      "back"
                    )
                  }
                  className={`min-w-0 rounded-xl border px-3 py-4 text-sm font-bold transition sm:px-4 ${
                    activeSide ===
                    "back"
                      ? "border-red-500 bg-red-500/10 text-white"
                      : "border-white/10 bg-black text-zinc-500 hover:border-white/20 hover:text-white"
                  }`}
                >
                  Espalda
                </button>
              </div>

              <p className="mt-4 text-xs leading-5 text-zinc-600">
                Estás editando el{" "}
                <span className="font-bold text-zinc-400">
                  {activeSide ===
                  "front"
                    ? "frente"
                    : "reverso"}
                </span>{" "}
                de la playera.
              </p>
            </div>

            {/* ============================================= */}
            {/* EDITOR FRENTE */}
            {/* ============================================= */}

            <div
              className={
                activeSide ===
                "front"
                  ? "block w-full min-w-0"
                  : "hidden"
              }
            >
              <FabricEditor
                onChange={
                  setFrontDesign
                }
              />
            </div>

            {/* ============================================= */}
            {/* EDITOR ESPALDA */}
            {/* ============================================= */}

            <div
              className={
                activeSide ===
                "back"
                  ? "block w-full min-w-0"
                  : "hidden"
              }
            >
              <FabricEditor
                onChange={
                  setBackDesign
                }
              />
            </div>

            {/* ============================================= */}
            {/* RESUMEN */}
            {/* ============================================= */}

            <div className="w-full min-w-0 rounded-2xl border border-white/10 bg-[#111] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-500">
                    Tu diseño
                  </p>

                  <h3 className="mt-2 text-xl font-bold text-white">
                    Resumen
                  </h3>
                </div>

                <span className="shrink-0 rounded-full border border-white/10 bg-black px-3 py-1 text-xs font-bold text-zinc-400">
                  {totalObjects}{" "}
                  {totalObjects ===
                  1
                    ? "elemento"
                    : "elementos"}
                </span>
              </div>

              <div className="mt-5 divide-y divide-white/10 border-y border-white/10">
                <div className="flex items-center justify-between gap-4 py-4">
                  <span className="text-sm text-zinc-500">
                    Color
                  </span>

                  <div className="flex items-center gap-2">
                    <span
                      className="h-4 w-4 rounded-full border border-white/20"
                      style={{
                        backgroundColor:
                          selectedColor.hex,
                      }}
                    />

                    <span className="text-sm font-bold text-white">
                      {
                        selectedColor.name
                      }
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 py-4">
                  <span className="text-sm text-zinc-500">
                    Frente
                  </span>

                  <span className="text-sm font-bold text-white">
                    {
                      frontDesign.objectCount
                    }{" "}
                    {frontDesign.objectCount ===
                    1
                      ? "elemento"
                      : "elementos"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 py-4">
                  <span className="text-sm text-zinc-500">
                    Espalda
                  </span>

                  <span className="text-sm font-bold text-white">
                    {
                      backDesign.objectCount
                    }{" "}
                    {backDesign.objectCount ===
                    1
                      ? "elemento"
                      : "elementos"}
                  </span>
                </div>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 block w-full rounded-xl bg-red-600 px-5 py-4 text-center text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-red-500"
              >
                Cotizar mi diseño
              </a>

              <p className="mt-3 text-center text-[10px] leading-5 text-zinc-600">
                Tu diseño será revisado antes de
                iniciar la producción.
              </p>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* AVISO */}
        {/* ================================================= */}

        <div className="mt-6 w-full min-w-0 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4">
          <p className="text-xs leading-5 text-zinc-600">
            El personalizador ofrece una
            representación visual del producto.
            Tamaño, ubicación y características
            del estampado se confirman antes de
            fabricar el pedido.
          </p>
        </div>
      </Container>
    </section>
  );
}