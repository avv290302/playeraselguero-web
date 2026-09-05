"use client";

import {
  useState,
  type ComponentType,
} from "react";

import Container from "@/components/common/Container";

type CustomizerComponent =
  ComponentType<Record<string, never>>;

export default function CustomizerGate() {
  const [
    Customizer,
    setCustomizer,
  ] =
    useState<CustomizerComponent | null>(
      null
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function openCustomizer() {
    if (
      loading ||
      Customizer
    ) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      /*
       * IMPORTANTE:
       *
       * Este import ocurre ÚNICAMENTE
       * cuando el usuario pulsa el botón.
       *
       * Antes de eso NO se descarga:
       *
       * - Fabric.js
       * - Three.js
       * - React Three Fiber
       * - Drei
       * - Shirt3D
       * - FabricEditor
       * - modelo GLB
       */
      const customizerModule =
        await import(
          "@/components/sections/Customizer"
        );

      setCustomizer(
        () =>
          customizerModule.default
      );
    } catch (loadError) {
      console.error(
        "Error cargando el personalizador:",
        loadError
      );

      setError(
        "No fue posible cargar el personalizador. Inténtalo nuevamente."
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * Una vez cargado eliminamos
   * completamente esta portada ligera
   * y mostramos el personalizador real.
   */
  if (Customizer) {
    return <Customizer />;
  }

  return (
    <section
      id="personaliza"
      className="relative overflow-hidden border-y border-white/10 bg-[#080808] py-24 text-white"
    >
      {/* FONDOS */}

      <div className="absolute left-1/2 top-0 h-[450px] w-[700px] -translate-x-1/2 rounded-full bg-red-600/[0.07] blur-[160px]" />

      <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-red-700/[0.05] blur-[120px]" />

      <Container className="relative z-10">
        <div className="mx-auto max-w-5xl">
          {/* ENCABEZADO */}

          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
              Personalización 3D
            </p>

            <h2 className="mt-4 font-[family-name:var(--font-bebas)] text-5xl uppercase leading-none tracking-wide text-white sm:text-6xl lg:text-7xl">
              Crea tu propia{" "}
              <span className="text-red-500">
                playera
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
              Diseña tu playera desde cero.
              Agrega tus imágenes, textos y
              elementos, visualízala en 3D y
              crea algo completamente tuyo.
            </p>
          </div>

          {/* TARJETA */}

          <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d0d]">
            {/* PARTE VISUAL */}

            <div className="relative overflow-hidden border-b border-white/10 bg-black px-6 py-12 sm:px-10">
              <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/10 blur-[80px]" />

              <div className="relative mx-auto flex h-48 w-48 items-center justify-center sm:h-56 sm:w-56">
                {/* PLAYERA ILUSTRATIVA */}

                <svg
                  viewBox="0 0 300 300"
                  role="img"
                  aria-label="Ilustración de playera personalizada"
                  className="h-full w-full"
                >
                  <path
                    d="
                      M95 62
                      L49 85
                      L20 146
                      L72 169
                      L91 133
                      L91 252
                      L209 252
                      L209 133
                      L228 169
                      L280 146
                      L251 85
                      L205 62
                      C188 54 174 48 164 44
                      C161 61 155 70 150 70
                      C145 70 139 61 136 44
                      C126 48 112 54 95 62
                      Z
                    "
                    fill="#111111"
                    stroke="#52525b"
                    strokeWidth="5"
                    strokeLinejoin="round"
                  />

                  <path
                    d="
                      M136 44
                      C139 61 145 70 150 70
                      C155 70 161 61 164 44
                    "
                    fill="none"
                    stroke="#71717a"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />

                  <rect
                    x="111"
                    y="112"
                    width="78"
                    height="88"
                    rx="8"
                    fill="#dc2626"
                    opacity="0.9"
                  />

                  <text
                    x="150"
                    y="150"
                    textAnchor="middle"
                    fill="white"
                    fontSize="17"
                    fontWeight="800"
                  >
                    TU
                  </text>

                  <text
                    x="150"
                    y="172"
                    textAnchor="middle"
                    fill="white"
                    fontSize="17"
                    fontWeight="800"
                  >
                    DISEÑO
                  </text>
                </svg>
              </div>

              <div className="relative mt-6 flex justify-center">
                <span className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 sm:text-xs">
                  Vista previa 3D
                </span>
              </div>
            </div>

            {/* INFORMACIÓN */}

            <div className="p-6 sm:p-8">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/[0.07] bg-black/30 p-5 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 font-black text-red-500">
                    1
                  </div>

                  <p className="mt-3 text-sm font-bold text-white">
                    Elige
                  </p>

                  <p className="mt-1 text-xs leading-5 text-zinc-600">
                    Escoge el color de tu
                    playera.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/[0.07] bg-black/30 p-5 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 font-black text-red-500">
                    2
                  </div>

                  <p className="mt-3 text-sm font-bold text-white">
                    Diseña
                  </p>

                  <p className="mt-1 text-xs leading-5 text-zinc-600">
                    Agrega imágenes y
                    textos.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/[0.07] bg-black/30 p-5 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 font-black text-red-500">
                    3
                  </div>

                  <p className="mt-3 text-sm font-bold text-white">
                    Visualiza
                  </p>

                  <p className="mt-1 text-xs leading-5 text-zinc-600">
                    Revisa tu diseño en
                    3D.
                  </p>
                </div>
              </div>

              {/* ERROR */}

              {error && (
                <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* BOTÓN */}

              <button
                type="button"
                onClick={
                  openCustomizer
                }
                disabled={
                  loading
                }
                className="mt-8 flex min-h-16 w-full items-center justify-center rounded-xl bg-red-600 px-6 py-5 text-sm font-black uppercase tracking-[0.15em] text-white transition hover:-translate-y-0.5 hover:bg-red-500 disabled:cursor-wait disabled:opacity-70 sm:text-base"
              >
                {loading ? (
                  <span className="flex items-center gap-3">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                    Cargando personalizador...
                  </span>
                ) : (
                  "Abrir personalizador"
                )}
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-zinc-600">
                El editor 3D se cargará
                cuando decidas utilizarlo.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}