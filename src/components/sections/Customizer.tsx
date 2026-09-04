"use client";

import { useMemo, useState } from "react";

import Container from "@/components/common/Container";

import FabricEditor, {
  type EditorSnapshot,
  type FabricEditorPanel,
} from "@/components/customizer/FabricEditor";

import Shirt3D from "@/components/customizer/Shirt3D";

/* ========================================================= */
/* CONFIGURACIÓN */
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

type Side = "front" | "back";

const emptySnapshot: EditorSnapshot = {
  preview: "",
  json: "",
  objectCount: 0,
};

/* ========================================================= */
/* COMPONENTE */
/* ========================================================= */

export default function Customizer() {
  const [selectedColor, setSelectedColor] = useState(
    shirtColors[0]
  );

  const [activeSide, setActiveSide] =
    useState<Side>("front");

  const [activePanel, setActivePanel] =
    useState<FabricEditorPanel>("design");

  const [frontDesign, setFrontDesign] =
    useState<EditorSnapshot>(emptySnapshot);

  const [backDesign, setBackDesign] =
    useState<EditorSnapshot>(emptySnapshot);

  const totalObjects =
    frontDesign.objectCount +
    backDesign.objectCount;

  const currentObjects =
    activeSide === "front"
      ? frontDesign.objectCount
      : backDesign.objectCount;

  const hasDesign =
    totalObjects > 0;

  /* ======================================================= */
  /* WHATSAPP */
  /* ======================================================= */

  const whatsappUrl = useMemo(() => {
    const frontText =
      frontDesign.objectCount === 1
        ? "1 elemento"
        : `${frontDesign.objectCount} elementos`;

    const backText =
      backDesign.objectCount === 1
        ? "1 elemento"
        : `${backDesign.objectCount} elementos`;

    const totalText =
      totalObjects === 1
        ? "1 elemento"
        : `${totalObjects} elementos`;

    const message = encodeURIComponent(
      [
        "Hola, quiero cotizar una playera personalizada de Playeras El Güero.",
        "",
        "DISEÑO CREADO EN EL PERSONALIZADOR 3D",
        "",
        `Color de playera: ${selectedColor.name}`,
        `Diseño al frente: ${frontText}`,
        `Diseño en espalda: ${backText}`,
        `Total del diseño: ${totalText}`,
        "",
        "Me gustaría revisar tamaños, cantidad, ubicación de impresión y precio final.",
      ].join("\n")
    );

    return `https://wa.me/524922230511?text=${message}`;
  }, [
    selectedColor.name,
    frontDesign.objectCount,
    backDesign.objectCount,
    totalObjects,
  ]);

  /* ======================================================= */
  /* UI */
  /* ======================================================= */

  return (
    <section
      id="personaliza"
      className="relative w-full overflow-hidden bg-[#080808] py-20 sm:py-24"
    >
      {/* FONDO */}

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
              Personalizador 3D
            </p>
          </div>

          <h2 className="font-[family-name:var(--font-bebas)] text-5xl uppercase leading-none tracking-wide text-white sm:text-6xl">
            Diseña tu propia
            <span className="ml-3 text-red-500">
              playera
            </span>
          </h2>

          <p className="mt-5 max-w-2xl leading-7 text-zinc-400">
            Elige el color, agrega tus logos y textos,
            acomódalos a tu gusto y revisa el resultado
            directamente en una playera 3D.
          </p>
        </div>

        {/* ================================================= */}
        {/* GUÍA DE 3 PASOS */}
        {/* ================================================= */}

        <div className="mb-6 grid w-full min-w-0 grid-cols-1 gap-3 md:grid-cols-3">
          {/* PASO 1 */}

          <div
            className={`relative overflow-hidden rounded-2xl border p-4 transition ${
              hasDesign
                ? "border-green-500/20 bg-green-500/[0.04]"
                : "border-red-500/30 bg-red-500/[0.06]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                  hasDesign
                    ? "bg-green-500 text-black"
                    : "bg-red-600 text-white"
                }`}
              >
                {hasDesign ? "✓" : "1"}
              </div>

              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                  Paso 1
                </p>

                <p className="mt-1 text-sm font-bold text-white">
                  Elige tu playera
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs leading-5 text-zinc-600">
              Selecciona el color y decide si trabajarás
              en el frente o la espalda.
            </p>
          </div>

          {/* PASO 2 */}

          <div
            className={`relative overflow-hidden rounded-2xl border p-4 transition ${
              hasDesign
                ? "border-red-500/30 bg-red-500/[0.06]"
                : "border-white/10 bg-[#101010]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                  hasDesign
                    ? "bg-red-600 text-white"
                    : "border border-white/10 bg-black text-zinc-500"
                }`}
              >
                2
              </div>

              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                  Paso 2
                </p>

                <p className="mt-1 text-sm font-bold text-white">
                  Crea tu diseño
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs leading-5 text-zinc-600">
              Sube imágenes, agrega texto y utiliza las
              capas para acomodar cada elemento.
            </p>
          </div>

          {/* PASO 3 */}

          <div
            className={`relative overflow-hidden rounded-2xl border p-4 transition ${
              hasDesign
                ? "border-white/15 bg-[#101010]"
                : "border-white/10 bg-[#101010]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                  hasDesign
                    ? "border border-red-500/30 bg-red-500/10 text-red-500"
                    : "border border-white/10 bg-black text-zinc-600"
                }`}
              >
                3
              </div>

              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                  Paso 3
                </p>

                <p className="mt-1 text-sm font-bold text-white">
                  Revisa y cotiza
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs leading-5 text-zinc-600">
              Revisa la vista 3D y envíanos tu solicitud
              directamente por WhatsApp.
            </p>
          </div>
        </div>

        {/* ================================================= */}
        {/* PERSONALIZADOR */}
        {/* ================================================= */}

        <div className="w-full min-w-0 overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0b0b] shadow-2xl shadow-black/40">
          {/* ================================================= */}
          {/* BARRA SUPERIOR */}
          {/* ================================================= */}

          <div className="flex w-full min-w-0 flex-col gap-4 border-b border-white/10 bg-[#0e0e0e] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            {/* FRENTE / ESPALDA */}

            <div className="flex min-w-0 rounded-xl border border-white/10 bg-black p-1">
              <button
                type="button"
                onClick={() =>
                  setActiveSide("front")
                }
                className={`min-w-0 flex-1 rounded-lg px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] transition sm:flex-none sm:px-7 ${
                  activeSide === "front"
                    ? "bg-red-600 text-white shadow-lg shadow-red-950/30"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                Frente
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveSide("back")
                }
                className={`min-w-0 flex-1 rounded-lg px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] transition sm:flex-none sm:px-7 ${
                  activeSide === "back"
                    ? "bg-red-600 text-white shadow-lg shadow-red-950/30"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                Espalda
              </button>
            </div>

            {/* ESTADO */}

            <div className="flex items-center justify-between gap-4 sm:justify-end sm:gap-5">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-600">
                  Editando
                </p>

                <p className="mt-1 text-xs font-bold text-white">
                  {activeSide === "front"
                    ? "Frente"
                    : "Espalda"}
                </p>
              </div>

              <div className="h-8 w-px bg-white/10" />

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-600">
                  Este lado
                </p>

                <p className="mt-1 text-xs font-bold text-white">
                  {currentObjects}{" "}
                  {currentObjects === 1
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
          {/* GRID PRINCIPAL */}
          {/* ================================================= */}

          <div className="grid w-full min-w-0 grid-cols-1 xl:grid-cols-[minmax(0,1.08fr)_minmax(390px,0.92fr)]">
            {/* ================================================= */}
            {/* VISTA 3D */}
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

                  <div className="flex shrink-0 items-center gap-2">
                    {hasDesign && (
                      <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.12em] text-green-400">
                        Diseño activo
                      </span>
                    )}

                    <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.15em] text-red-500">
                      3D
                    </span>
                  </div>
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

                {/* AYUDA 3D */}

                <div className="border-t border-white/10 px-5 py-4 sm:px-6">
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] text-zinc-600">
                    <span>
                      ↔ Arrastra para girar
                    </span>

                    <span>
                      ⤢ Usa zoom para acercarte
                    </span>

                    <span>
                      ↺ Frente/Espalda automático
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ================================================= */}
            {/* PANEL DE EDICIÓN */}
            {/* ================================================= */}

            <div className="w-full min-w-0 bg-[#0d0d0d]">
              {/* CABECERA */}

              <div className="border-b border-white/10 p-4 sm:p-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-red-500">
                    Paso 2 · Diseña
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-white">
                    Herramientas de edición
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-zinc-600">
                    Elige una categoría para mostrar solo
                    las herramientas que necesitas.
                  </p>
                </div>

                {/* PESTAÑAS */}

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

              {/* ================================================= */}
              {/* COLOR */}
              {/* ================================================= */}

              {activePanel ===
                "design" && (
                <div className="border-b border-white/10 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                        Paso 1
                      </p>

                      <p className="mt-1 text-sm font-bold text-white">
                        Color de playera
                      </p>
                    </div>

                    <span className="rounded-lg border border-white/10 bg-black px-3 py-2 text-xs font-bold text-white">
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
                            className={`relative h-11 w-11 rounded-full border-2 transition ${
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
                              <span className="absolute -bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-red-500" />
                            )}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

              {/* ================================================= */}
              {/* FABRIC EDITOR */}
              {/* ================================================= */}

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

              {/* ================================================= */}
              {/* PASO FINAL */}
              {/* ================================================= */}

              <div className="border-t border-white/10 bg-[#0a0a0a] p-5">
                <div className="mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-red-500">
                    Paso 3 · Finaliza
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-white">
                    Revisa tu diseño
                  </h3>
                </div>

                {/* RESUMEN */}

                <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
                  <div className="grid grid-cols-3 divide-x divide-white/10">
                    <div className="min-w-0 p-4 text-center">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">
                        Playera
                      </p>

                      <div className="mt-2 flex items-center justify-center gap-2">
                        <span
                          className="h-3 w-3 shrink-0 rounded-full border border-white/20"
                          style={{
                            backgroundColor:
                              selectedColor.hex,
                          }}
                        />

                        <p className="truncate text-xs font-bold text-white">
                          {
                            selectedColor.name
                          }
                        </p>
                      </div>
                    </div>

                    <div className="p-4 text-center">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">
                        Frente
                      </p>

                      <p className="mt-2 text-base font-black text-white">
                        {
                          frontDesign.objectCount
                        }
                      </p>
                    </div>

                    <div className="p-4 text-center">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">
                        Espalda
                      </p>

                      <p className="mt-2 text-base font-black text-white">
                        {
                          backDesign.objectCount
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-white/10 px-4 py-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-600">
                      Total de elementos
                    </span>

                    <span className="text-sm font-black text-white">
                      {
                        totalObjects
                      }
                    </span>
                  </div>
                </div>

                {/* ESTADO */}

                {hasDesign ? (
                  <div className="mt-4 flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/[0.05] p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-500 text-sm font-black text-black">
                      ✓
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold text-green-400">
                        Tu diseño está listo para cotizar
                      </p>

                      <p className="mt-1 text-[10px] leading-5 text-zinc-600">
                        Podremos revisar contigo los últimos
                        detalles antes de producirlo.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <p className="text-xs font-bold text-zinc-400">
                      Tu diseño todavía está vacío
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-zinc-600">
                      Agrega un logo, imagen o texto para
                      comenzar a personalizar tu playera.
                    </p>
                  </div>
                )}

                {/* WHATSAPP */}

                <a
                  href={
                    whatsappUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                  className={`mt-4 flex w-full items-center justify-center gap-3 rounded-xl px-5 py-4 text-center text-sm font-black uppercase tracking-[0.12em] text-white transition ${
                    hasDesign
                      ? "bg-red-600 shadow-lg shadow-red-950/30 hover:-translate-y-0.5 hover:bg-red-500"
                      : "bg-zinc-800 hover:bg-zinc-700"
                  }`}
                >
                  <span>
                    {hasDesign
                      ? "✓"
                      : "→"}
                  </span>

                  <span>
                    {hasDesign
                      ? "Diseño listo — Cotizar por WhatsApp"
                      : "Cotizar por WhatsApp"}
                  </span>
                </a>

                <p className="mt-3 text-center text-[10px] leading-5 text-zinc-600">
                  El personalizador es una representación
                  previa. Confirmaremos contigo medidas,
                  ubicación de impresión, tallas, cantidad
                  y precio antes de producir.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* CIERRE */}
        {/* ================================================= */}

        <div className="mx-auto mt-6 max-w-2xl text-center">
          <p className="text-xs leading-6 text-zinc-600">
            ¿Necesitas ayuda con tu diseño? Puedes crear una
            idea básica aquí y nosotros te ayudamos a
            perfeccionarla antes de imprimir.
          </p>
        </div>
      </Container>
    </section>
  );
}