"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";

import Container from "@/components/common/Container";

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

export default function Customizer() {
  const [selectedColor, setSelectedColor] = useState(shirtColors[0]);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoName, setLogoName] = useState("");

  const [logoSize, setLogoSize] = useState(30);
  const [logoX, setLogoX] = useState(50);
  const [logoY, setLogoY] = useState(45);

  const handleLogoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setLogoName(file.name);

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setLogoPreview(reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  const resetCustomizer = () => {
    setSelectedColor(shirtColors[0]);
    setLogoPreview(null);
    setLogoName("");
    setLogoSize(30);
    setLogoX(50);
    setLogoY(45);
  };

  const whatsappUrl = useMemo(() => {
    const message = encodeURIComponent(
      `Hola, estuve usando el personalizador de Playeras El Güero y quiero cotizar una playera personalizada.

Color: ${selectedColor.name}
Logo: ${logoName || "Aún no especificado"}

Quiero continuar con mi diseño personalizado.`
    );

    return `https://wa.me/524922230511?text=${message}`;
  }, [selectedColor.name, logoName]);

  const shirtStroke =
    selectedColor.name === "Blanco" ? "#888888" : "#292929";

  return (
    <section
      id="personaliza"
      className="relative overflow-hidden bg-[#080808] py-24"
    >
      {/* Luces decorativas */}
      <div className="absolute left-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-red-600/5 blur-[170px]" />

      <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-red-600/5 blur-[170px]" />

      <Container className="relative z-10">
        {/* Encabezado */}
        <div className="mb-14 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
            Diseña la tuya
          </p>

          <h2 className="mt-3 font-[family-name:var(--font-bebas)] text-5xl uppercase leading-none tracking-wide text-white sm:text-6xl">
            Personaliza
            <span className="ml-3 text-red-500">
              tu playera
            </span>
          </h2>

          <p className="mt-5 leading-7 text-zinc-400">
            Elige el color de tu playera, sube tu logotipo y visualiza una
            propuesta antes de solicitar tu cotización.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          {/* ================================================= */}
          {/* PREVISUALIZACIÓN */}
          {/* ================================================= */}

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#101010]">
            <div className="border-b border-white/10 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">
                    Vista previa
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Frente de la playera
                  </p>
                </div>

                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs uppercase tracking-wider text-zinc-400">
                  Simulación
                </span>
              </div>
            </div>

            <div className="relative flex min-h-[600px] items-center justify-center overflow-hidden p-6 sm:p-10">
              {/* Luz de fondo */}
              <div className="absolute h-[400px] w-[400px] rounded-full bg-red-500/5 blur-[100px]" />

              {/* Área de playera */}
              <div className="relative aspect-[500/560] w-full max-w-[500px]">
                {/* Playera SVG */}
                <svg
                  viewBox="0 0 500 560"
                  className="absolute inset-0 h-full w-full drop-shadow-2xl"
                  aria-label="Vista previa de playera"
                >
                  <path
                    d="
                      M150 90
                      L95 112
                      L25 190
                      L82 242
                      L125 205
                      L125 520
                      L375 520
                      L375 205
                      L418 242
                      L475 190
                      L405 112
                      L350 90
                      C330 122 300 140 250 140
                      C200 140 170 122 150 90
                      Z
                    "
                    fill={selectedColor.hex}
                    stroke={shirtStroke}
                    strokeWidth="3"
                  />

                  {/* Cuello */}
                  <path
                    d="
                      M185 95
                      C200 130 220 145 250 145
                      C280 145 300 130 315 95
                    "
                    fill="none"
                    stroke={shirtStroke}
                    strokeWidth="6"
                    strokeLinecap="round"
                  />

                  {/* Costuras mangas */}
                  <path
                    d="M125 205 L95 175"
                    stroke={shirtStroke}
                    strokeWidth="2"
                    opacity="0.6"
                  />

                  <path
                    d="M375 205 L405 175"
                    stroke={shirtStroke}
                    strokeWidth="2"
                    opacity="0.6"
                  />
                </svg>

                {/* Logo cargado */}
                {logoPreview ? (
                  <div
                    className="absolute"
                    style={{
                      left: `${logoX}%`,
                      top: `${logoY}%`,
                      width: `${logoSize}%`,
                      aspectRatio: "1 / 1",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <Image
                      src={logoPreview}
                      alt="Logo personalizado"
                      fill
                      unoptimized
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div
                    className="absolute flex items-center justify-center rounded-lg border border-dashed border-white/20 text-center"
                    style={{
                      left: "50%",
                      top: "45%",
                      width: "28%",
                      height: "22%",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <span
                      className={`px-3 text-xs ${
                        selectedColor.name === "Blanco"
                          ? "text-zinc-500"
                          : "text-zinc-600"
                      }`}
                    >
                      Tu logo
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Aviso */}
            <div className="border-t border-white/10 px-6 py-4">
              <p className="text-xs leading-5 text-zinc-600">
                Esta vista es una simulación visual. El tamaño y posición final
                del estampado se confirman antes de producir el pedido.
              </p>
            </div>
          </div>

          {/* ================================================= */}
          {/* CONTROLES */}
          {/* ================================================= */}

          <div className="space-y-6">
            {/* Color */}
            <div className="rounded-2xl border border-white/10 bg-[#111] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
                    Paso 01
                  </p>

                  <h3 className="mt-2 text-xl font-bold text-white">
                    Color de la playera
                  </h3>
                </div>

                <span className="text-sm font-semibold text-zinc-400">
                  {selectedColor.name}
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {shirtColors.map((color) => {
                  const isSelected =
                    color.name === selectedColor.name;

                  return (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      aria-label={`Seleccionar color ${color.name}`}
                      title={color.name}
                      className={`relative h-11 w-11 rounded-full border-2 transition ${
                        isSelected
                          ? "scale-110 border-red-500"
                          : "border-white/20 hover:border-white/60"
                      }`}
                      style={{
                        backgroundColor: color.hex,
                      }}
                    >
                      {isSelected && (
                        <span className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-red-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subir logo */}
            <div className="rounded-2xl border border-white/10 bg-[#111] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
                Paso 02
              </p>

              <h3 className="mt-2 text-xl font-bold text-white">
                Sube tu logotipo
              </h3>

              <p className="mt-3 text-sm leading-6 text-zinc-500">
                Para mejores resultados utiliza PNG con fondo transparente.
              </p>

              <label
                htmlFor="logo-upload"
                className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-white/[0.02] px-6 py-8 text-center transition hover:border-red-500/50 hover:bg-red-500/[0.03]"
              >
                <span className="text-sm font-bold text-white">
                  Seleccionar archivo
                </span>

                <span className="mt-2 text-xs text-zinc-500">
                  PNG, JPG o WEBP
                </span>

                {logoName && (
                  <span className="mt-4 max-w-full truncate text-xs font-semibold text-red-500">
                    {logoName}
                  </span>
                )}
              </label>

              <input
                id="logo-upload"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>

            {/* Ajustar logo */}
            <div
              className={`rounded-2xl border border-white/10 bg-[#111] p-6 transition ${
                !logoPreview ? "opacity-50" : ""
              }`}
            >
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
                Paso 03
              </p>

              <h3 className="mt-2 text-xl font-bold text-white">
                Ajusta tu diseño
              </h3>

              <div className="mt-7 space-y-7">
                {/* Tamaño */}
                <div>
                  <div className="mb-3 flex justify-between text-sm">
                    <span className="text-zinc-400">
                      Tamaño
                    </span>

                    <span className="font-bold text-white">
                      {logoSize}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={logoSize}
                    disabled={!logoPreview}
                    onChange={(event) =>
                      setLogoSize(Number(event.target.value))
                    }
                    className="w-full accent-red-600"
                  />
                </div>

                {/* Horizontal */}
                <div>
                  <div className="mb-3 flex justify-between text-sm">
                    <span className="text-zinc-400">
                      Posición horizontal
                    </span>

                    <span className="font-bold text-white">
                      {logoX}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="30"
                    max="70"
                    value={logoX}
                    disabled={!logoPreview}
                    onChange={(event) =>
                      setLogoX(Number(event.target.value))
                    }
                    className="w-full accent-red-600"
                  />
                </div>

                {/* Vertical */}
                <div>
                  <div className="mb-3 flex justify-between text-sm">
                    <span className="text-zinc-400">
                      Posición vertical
                    </span>

                    <span className="font-bold text-white">
                      {logoY}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="25"
                    max="70"
                    value={logoY}
                    disabled={!logoPreview}
                    onChange={(event) =>
                      setLogoY(Number(event.target.value))
                    }
                    className="w-full accent-red-600"
                  />
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={resetCustomizer}
                className="rounded-lg border border-white/15 px-6 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:border-white"
              >
                Reiniciar
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-red-600 px-6 py-4 text-center text-sm font-bold uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:bg-red-500"
              >
                Cotizar mi diseño
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}