"use client";

import {
  useMemo,
  useState,
} from "react";

import Container from "@/components/common/Container";

import FabricEditor, {
  type EditorSnapshot,
  type FabricEditorPanel,
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
    activePanel,
    setActivePanel,
  ] =
    useState<FabricEditorPanel>(
      "design"
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

  const currentObjects =
    activeSide === "front"
      ? frontDesign.objectCount
      : backDesign.objectCount;

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
            `Color: ${selectedColor.name}`,
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
      className="relative w-full overflow-hidden bg-[#080808] py-20 sm:py-24"
    >
      {/* ================================================= */}
      {/* DECORACIÓN */}
      {/* ================================================= */}

      <div className="pointer-events-none absolute left-0 top-1/3 h-[500px] w-[500px] rounded-full bg-red-600/5 blur-[170px]" />

      <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-red-600/5 blur-[170px]" />

      <Container className="relative z-10 w-full min-w-0">
        {/* ================================================= */}
        {/* ENCABEZADO */}
        {/* ================================================= */}

        <div className="mb-10 max-w-3xl">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-red-500" />

            <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-500">
              Personalizador Pro
            </p>
          </div>

          <h2 className="font-[family-name:var(--font-bebas)] text-5xl uppercase leading-none tracking-wide text-white sm:text-6xl">
            Crea tu propia
            <span className="ml-3 text-red-500">
              playera
            </span>
          </h2>

          <p className="mt-5 max-w-2xl leading-7 text-zinc-400">
            Agrega logos y textos, acomoda cada
            elemento y visualiza el resultado
            directamente sobre una playera 3D.
          </p>
        </div>

        {/* ================================================= */}
        {/* CONTENEDOR PRINCIPAL */}
        {/* ================================================= */}

        <div className="w-full min-w-0 overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0b0b]">
          {/* ================================================= */}
          {/* BARRA SUPERIOR */}
          {/* ================================================= */}

          <div className="flex w-full min-w-0 flex-col gap-4 border-b border-white/10 bg-[#0e0e0e] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            {/* FRENTE / ESPALDA */}

            <div className="flex min-w-0 rounded-xl border border-white/10 bg-black p-1">
              <button
                type="button"
                onClick={() =>
                  setActiveSide(
                    "front"
                  )
                }
                className={`min-w-0 flex-1 rounded-lg px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] transition sm:flex-none sm:px-7 ${
                  activeSide ===
                  "front"
                    ? "bg-red-600 text-white shadow-lg shadow-red-950/30"
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
                className={`min-w-0 flex-1 rounded-lg px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] transition sm:flex-none sm:px-7 ${
                  activeSide ===
                  "back"
                    ? "bg-red-600 text-white shadow-lg shadow-red-950/30"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                Espalda
              </button>
            </div>

            {/* ESTADO */}

            <div className="flex items-center justify-between gap-5 sm:justify-end">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-600">
                  Editando
                </p>

                <p className="mt-1 text-xs font-bold text-white">
                  {activeSide ===
                  "front"
                    ? "Frente"
                    : "Espalda"}
                </p>
              </div>

              <div className="h-8 w-px bg-white/10" />

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-600">
                  En este lado
                </p>

                <p className="mt-1 text-xs font-bold text-white">
                  {currentObjects}{" "}
                  {currentObjects ===
                  1
                    ? "elemento"
                    : "elementos"}
                </p>
              </div>

              <div className="h-8 w-px bg-white/10" />

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-600">
                  Total
                </p>

                <p className="mt-1 text-xs font-bold text-white">
                  {totalObjects}
                </p>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* GRID */}
          {/* ================================================= */}

          <div className="grid w-full min-w-0 grid-cols-1 gap-0 xl:grid-cols-[minmax(0,1.08fr)_minmax(390px,0.92fr)]">
            {/* ================================================= */}
            {/* 3D */}
            {/* ================================================= */}

            <div className="min-w-0 border-b border-white/10 xl:border-b-0 xl:border-r">
              <div className="xl:sticky xl:top-20 xl:self-start">
                <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white">
                      Vista previa
                    </p>

                    <p className="mt-1 text-xs text-zinc-600">
                      Arrastra para rotar · pellizca para zoom
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.15em] text-red-500">
                    3D
                  </span>
                </div>

                <div className="h-[560px] w-full min-w-0 sm:h-[640px] xl:h-[720px]">
                  <Shirt3D
                    color={
                      selectedColor.hex
                    }
                    frontDesign={
                      frontDesign.preview
                    }
                    backDesign={
                      backDesign.preview
                    }
                    activeSide={
                      activeSide
                    }
                  />
                </div>
              </div>
            </div>

            {/* ================================================= */}
            {/* EDITOR */}
            {/* ================================================= */}

            <div className="w-full min-w-0 bg-[#0d0d0d]">
              {/* ============================================= */}
              {/* CABECERA EDITOR */}
              {/* ============================================= */}

              <div className="border-b border-white/10 p-4 sm:p-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-red-500">
                    Herramientas
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-white">
                    Edita tu diseño
                  </h3>
                </div>

                {/* ========================================= */}
                {/* PESTAÑAS */}
                {/* ========================================= */}

                <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-black p-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setActivePanel(
                        "design"
                      )
                    }
                    className={`rounded-xl px-2 py-3 text-[10px] font-bold uppercase tracking-[0.12em] transition sm:text-xs ${
                      activePanel ===
                      "design"
                        ? "bg-red-600 text-white"
                        : "text-zinc-500 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    Diseño
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActivePanel(
                        "text"
                      )
                    }
                    className={`rounded-xl px-2 py-3 text-[10px] font-bold uppercase tracking-[0.12em] transition sm:text-xs ${
                      activePanel ===
                      "text"
                        ? "bg-red-600 text-white"
                        : "text-zinc-500 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    Texto
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActivePanel(
                        "layers"
                      )
                    }
                    className={`rounded-xl px-2 py-3 text-[10px] font-bold uppercase tracking-[0.12em] transition sm:text-xs ${
                      activePanel ===
                      "layers"
                        ? "bg-red-600 text-white"
                        : "text-zinc-500 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    Capas
                  </button>
                </div>
              </div>

              {/* ============================================= */}
              {/* COLOR DE PLAYERA */}
              {/* ============================================= */}

              {activePanel ===
                "design" && (
                <div className="border-b border-white/10 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                        Playera
                      </p>

                      <p className="mt-1 text-sm font-bold text-white">
                        Color
                      </p>
                    </div>

                    <span className="text-xs font-bold text-zinc-400">
                      {
                        selectedColor.name
                      }
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {shirtColors.map(
                      (color) => {
                        const selected =
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
                            title={
                              color.name
                            }
                            aria-label={`Color ${color.name}`}
                            className={`relative h-10 w-10 rounded-full border-2 transition ${
                              selected
                                ? "scale-110 border-red-500"
                                : "border-white/15 hover:scale-105 hover:border-white/50"
                            }`}
                            style={{
                              backgroundColor:
                                color.hex,
                            }}
                          >
                            {selected && (
                              <span className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-red-500" />
                            )}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

              {/* ============================================= */}
              {/* FABRIC */}
              {/* ============================================= */}

              <div className="w-full min-w-0 p-4 sm:p-5">
                <div
                  className={
                    activeSide ===
                    "front"
                      ? "block"
                      : "hidden"
                  }
                >
                  <FabricEditor
                    panel={
                      activePanel
                    }
                    onChange={
                      setFrontDesign
                    }
                  />
                </div>

                <div
                  className={
                    activeSide ===
                    "back"
                      ? "block"
                      : "hidden"
                  }
                >
                  <FabricEditor
                    panel={
                      activePanel
                    }
                    onChange={
                      setBackDesign
                    }
                  />
                </div>
              </div>

              {/* ============================================= */}
              {/* RESUMEN / CTA */}
              {/* ============================================= */}

              <div className="border-t border-white/10 p-5">
                <div className="rounded-2xl border border-white/10 bg-black p-4">
                  <div className="grid grid-cols-3 divide-x divide-white/10">
                    <div className="px-2 text-center">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">
                        Color
                      </p>

                      <p className="mt-2 truncate text-xs font-bold text-white">
                        {
                          selectedColor.name
                        }
                      </p>
                    </div>

                    <div className="px-2 text-center">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">
                        Frente
                      </p>

                      <p className="mt-2 text-xs font-bold text-white">
                        {
                          frontDesign.objectCount
                        }
                      </p>
                    </div>

                    <div className="px-2 text-center">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">
                        Espalda
                      </p>

                      <p className="mt-2 text-xs font-bold text-white">
                        {
                          backDesign.objectCount
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <a
                  href={
                    whatsappUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 block w-full rounded-xl bg-red-600 px-5 py-4 text-center text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-red-500"
                >
                  Cotizar mi diseño
                </a>

                <p className="mt-3 text-center text-[10px] leading-5 text-zinc-600">
                  Revisaremos contigo tamaño,
                  ubicación y detalles antes de
                  producir la playera.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}