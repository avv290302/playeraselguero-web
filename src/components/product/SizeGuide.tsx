"use client";

import { useEffect, useState } from "react";

import {
  SIZE_GUIDE,
  SIZE_TOLERANCE,
} from "@/lib/productInfo";

export default function SizeGuide() {
  const [open, setOpen] =
    useState(false);

  /* ======================================================= */
  /* CERRAR CON ESC */
  /* ======================================================= */

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open]);

  return (
    <>
      {/* ================================================= */}
      {/* BOTÓN */}
      {/* ================================================= */}

      <button
        type="button"
        onClick={() =>
          setOpen(true)
        }
        className="inline-flex items-center gap-2 text-sm font-bold text-red-500 transition hover:text-red-400"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-xs">
          ?
        </span>

        ¿Qué talla me queda?
      </button>

      {/* ================================================= */}
      {/* MODAL */}
      {/* ================================================= */}

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="size-guide-title"
          onClick={() =>
            setOpen(false)
          }
        >
          <div
            className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0b0b0b] text-white shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="sticky top-0 z-20 flex items-start justify-between gap-5 border-b border-white/10 bg-[#0b0b0b]/95 px-6 py-5 backdrop-blur-md sm:px-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-500">
                  Encuentra tu medida
                </p>

                <h2
                  id="size-guide-title"
                  className="mt-1 font-[family-name:var(--font-bebas)] text-4xl uppercase tracking-wide sm:text-5xl"
                >
                  Guía de tallas
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setOpen(false)
                }
                aria-label="Cerrar guía de tallas"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black text-2xl text-zinc-400 transition hover:border-red-500 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="p-6 sm:p-8">
              {/* ================================================= */}
              {/* INTRODUCCIÓN */}
              {/* ================================================= */}

              <p className="max-w-3xl text-sm leading-7 text-zinc-400 sm:text-base">
                Para elegir mejor tu talla,
                compara estas medidas con una
                playera que actualmente te quede
                como te gusta.
              </p>

              <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-4">
                <p className="text-sm leading-6 text-zinc-300">
                  <strong className="text-white">
                    Importante:
                  </strong>{" "}
                  mide una playera extendida sobre
                  una superficie plana. No tomes
                  estas medidas directamente sobre
                  tu cuerpo.
                </p>
              </div>

              {/* ================================================= */}
              {/* TABLA */}
              {/* ================================================= */}

              <div className="mt-8">
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-500">
                    Medidas de la prenda
                  </p>

                  <h3 className="mt-2 text-2xl font-bold">
                    Tabla de tallas
                  </h3>
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/10">
                  <div className="grid grid-cols-3 bg-red-600 px-3 py-4 text-center text-xs font-bold uppercase tracking-wider sm:px-5 sm:text-sm">
                    <div>
                      Talla
                    </div>

                    <div>
                      Ancho
                    </div>

                    <div>
                      Largo
                    </div>
                  </div>

                  {SIZE_GUIDE.map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        key={
                          item.size
                        }
                        className={`grid grid-cols-3 px-3 py-4 text-center sm:px-5 ${
                          index %
                            2 ===
                          0
                            ? "bg-[#0f0f0f]"
                            : "bg-[#0a0a0a]"
                        } ${
                          index !==
                          0
                            ? "border-t border-white/[0.06]"
                            : ""
                        }`}
                      >
                        <div className="font-black text-white">
                          {
                            item.size
                          }
                        </div>

                        <div className="text-zinc-300">
                          {
                            item.width
                          }
                        </div>

                        <div className="text-zinc-300">
                          {
                            item.length
                          }
                        </div>
                      </div>
                    )
                  )}
                </div>

                <p className="mt-3 text-xs leading-5 text-zinc-600">
                  Tolerancia aproximada de
                  fabricación:{" "}
                  {SIZE_TOLERANCE} en
                  ancho y largo.
                </p>
              </div>

              {/* ================================================= */}
              {/* CÓMO MEDIR */}
              {/* ================================================= */}

              <div className="mt-12">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-500">
                  Cómo tomar las medidas
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  Usa una playera que ya te quede
                  bien
                </h3>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500">
                  Extiende la playera completamente
                  sobre una mesa o cama y sigue las
                  referencias de la ilustración.
                </p>

                <div className="mt-7 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                  {/* ============================================= */}
                  {/* ILUSTRACIÓN */}
                  {/* ============================================= */}

                  <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#080808] p-4 sm:p-7">
                    <div className="rounded-2xl border border-white/[0.06] bg-black/40 p-3 sm:p-5">
                      <svg
                        viewBox="0 0 620 620"
                        role="img"
                        aria-label="Ilustración de una playera mostrando cómo medir el ancho de axila a axila y el largo desde la parte superior hasta el borde inferior"
                        className="mx-auto h-auto w-full max-w-[520px]"
                      >
                        {/* FONDO */}

                        <rect
                          x="10"
                          y="10"
                          width="600"
                          height="600"
                          rx="36"
                          fill="#090909"
                          stroke="rgba(255,255,255,0.06)"
                          strokeWidth="2"
                        />

                        {/* SOMBRA */}

                        <path
                          d="
                            M180 145
                            L105 185
                            L55 300
                            L145 335
                            L175 275
                            L175 535
                            L445 535
                            L445 275
                            L475 335
                            L565 300
                            L515 185
                            L440 145
                            C410 130 385 118 360 108
                            C350 145 332 165 310 165
                            C288 165 270 145 260 108
                            C235 118 210 130 180 145
                            Z
                          "
                          fill="#050505"
                          stroke="#3f3f46"
                          strokeWidth="8"
                          strokeLinejoin="round"
                        />

                        {/* HOMBROS */}

                        <path
                          d="
                            M180 145
                            C215 135 238 120 260 108
                          "
                          fill="none"
                          stroke="#71717a"
                          strokeWidth="5"
                          strokeLinecap="round"
                        />

                        <path
                          d="
                            M360 108
                            C382 120 405 135 440 145
                          "
                          fill="none"
                          stroke="#71717a"
                          strokeWidth="5"
                          strokeLinecap="round"
                        />

                        {/* CUELLO */}

                        <path
                          d="
                            M260 108
                            C266 145 285 166 310 166
                            C335 166 354 145 360 108
                          "
                          fill="none"
                          stroke="#a1a1aa"
                          strokeWidth="7"
                          strokeLinecap="round"
                        />

                        {/* COSTURAS MANGAS */}

                        <line
                          x1="175"
                          y1="275"
                          x2="180"
                          y2="145"
                          stroke="#27272a"
                          strokeWidth="4"
                        />

                        <line
                          x1="445"
                          y1="275"
                          x2="440"
                          y2="145"
                          stroke="#27272a"
                          strokeWidth="4"
                        />

                        {/* ================================================= */}
                        {/* ANCHO */}
                        {/* ================================================= */}

                        <line
                          x1="175"
                          y1="285"
                          x2="445"
                          y2="285"
                          stroke="#ef4444"
                          strokeWidth="6"
                          strokeLinecap="round"
                        />

                        {/* FLECHA IZQ */}

                        <path
                          d="
                            M175 285
                            L198 270
                            M175 285
                            L198 300
                          "
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="6"
                          strokeLinecap="round"
                        />

                        {/* FLECHA DER */}

                        <path
                          d="
                            M445 285
                            L422 270
                            M445 285
                            L422 300
                          "
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="6"
                          strokeLinecap="round"
                        />

                        {/* LABEL ANCHO */}

                        <rect
                          x="245"
                          y="240"
                          width="130"
                          height="36"
                          rx="18"
                          fill="#dc2626"
                        />

                        <text
                          x="310"
                          y="264"
                          textAnchor="middle"
                          fill="white"
                          fontSize="20"
                          fontWeight="800"
                        >
                          ANCHO
                        </text>

                        {/* ================================================= */}
                        {/* LARGO */}
                        {/* ================================================= */}

                        <line
                          x1="395"
                          y1="145"
                          x2="395"
                          y2="535"
                          stroke="#ef4444"
                          strokeWidth="6"
                          strokeLinecap="round"
                        />

                        {/* FLECHA ARRIBA */}

                        <path
                          d="
                            M395 145
                            L380 168
                            M395 145
                            L410 168
                          "
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="6"
                          strokeLinecap="round"
                        />

                        {/* FLECHA ABAJO */}

                        <path
                          d="
                            M395 535
                            L380 512
                            M395 535
                            L410 512
                          "
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="6"
                          strokeLinecap="round"
                        />

                        {/* LABEL LARGO */}

                        <g
                          transform="translate(413 305) rotate(90)"
                        >
                          <rect
                            x="-65"
                            y="-18"
                            width="130"
                            height="36"
                            rx="18"
                            fill="#dc2626"
                          />

                          <text
                            x="0"
                            y="7"
                            textAnchor="middle"
                            fill="white"
                            fontSize="20"
                            fontWeight="800"
                          >
                            LARGO
                          </text>
                        </g>

                        {/* PUNTOS DE REFERENCIA */}

                        <circle
                          cx="175"
                          cy="285"
                          r="8"
                          fill="#ffffff"
                        />

                        <circle
                          cx="445"
                          cy="285"
                          r="8"
                          fill="#ffffff"
                        />

                        <circle
                          cx="395"
                          cy="145"
                          r="8"
                          fill="#ffffff"
                        />

                        <circle
                          cx="395"
                          cy="535"
                          r="8"
                          fill="#ffffff"
                        />
                      </svg>
                    </div>

                    <p className="mt-4 text-center text-xs leading-5 text-zinc-600">
                      Ilustración de referencia.
                      Coloca la prenda completamente
                      extendida antes de medir.
                    </p>
                  </div>

                  {/* ============================================= */}
                  {/* EXPLICACIÓN */}
                  {/* ============================================= */}

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-600 text-lg font-black">
                          1
                        </div>

                        <div>
                          <h4 className="text-lg font-bold">
                            Ancho
                          </h4>

                          <p className="mt-2 text-sm leading-6 text-zinc-400">
                            Mide en línea recta de
                            una axila a la otra.
                            Mantén la playera
                            completamente plana y
                            sin estirar la tela.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-600 text-lg font-black">
                          2
                        </div>

                        <div>
                          <h4 className="text-lg font-bold">
                            Largo
                          </h4>

                          <p className="mt-2 text-sm leading-6 text-zinc-400">
                            Mide desde la parte
                            superior de la playera,
                            cerca del hombro, hasta
                            el borde inferior de la
                            prenda.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-lg font-black text-red-500">
                          !
                        </div>

                        <div>
                          <h4 className="text-lg font-bold">
                            No estires la playera
                          </h4>

                          <p className="mt-2 text-sm leading-6 text-zinc-400">
                            Toma las medidas con la
                            prenda en su forma
                            natural. Estirar la tela
                            puede alterar el
                            resultado.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ================================================= */}
              {/* ¿AMPLIAS O REDUCIDAS? */}
              {/* ================================================= */}

              <div className="mt-10 rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
                  Duda frecuente
                </p>

                <h3 className="mt-2 text-xl font-bold text-white">
                  ¿Vienen amplias o reducidas?
                </h3>

                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  La percepción del ajuste puede
                  cambiar según la complexión de
                  cada persona y cómo te guste
                  vestir. Por eso, la forma más
                  precisa de elegir es comparar el
                  ancho y largo con una playera que
                  actualmente te quede bien.
                </p>
              </div>

              {/* ================================================= */}
              {/* ENTRE DOS TALLAS */}
              {/* ================================================= */}

              <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                  Consejo
                </p>

                <h3 className="mt-2 text-xl font-bold text-white">
                  ¿Estás entre dos tallas?
                </h3>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/[0.06] bg-[#080808] p-4">
                    <p className="font-bold text-white">
                      Más cómoda o suelta
                    </p>

                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                      Si prefieres mayor libertad
                      y un ajuste más relajado,
                      considera la talla mayor.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/[0.06] bg-[#080808] p-4">
                    <p className="font-bold text-white">
                      Más ajustada
                    </p>

                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                      Si prefieres una sensación
                      más ceñida al cuerpo,
                      considera la talla menor.
                    </p>
                  </div>
                </div>
              </div>

              {/* ================================================= */}
              {/* CERRAR */}
              {/* ================================================= */}

              <button
                type="button"
                onClick={() =>
                  setOpen(false)
                }
                className="mt-8 w-full rounded-xl bg-red-600 px-6 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-red-500"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}