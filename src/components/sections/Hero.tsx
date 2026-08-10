import Image from "next/image";

import Container from "@/components/common/Container";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050505] pt-20">
      {/* Fondo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(229,9,20,0.18),transparent_35%)]" />

      <div className="absolute left-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-red-700/10 blur-[140px] sm:h-[500px] sm:w-[500px]" />

      <Container className="relative z-10">
        <div className="grid min-h-[calc(100vh-80px)] items-center gap-10 py-12 lg:grid-cols-2 lg:gap-14 lg:py-16">
          
          {/* TEXTO */}
          <div className="order-1">
            <div className="mb-5 inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-red-500 sm:text-xs">
              Playeras premium
            </div>

            <h1 className="font-[family-name:var(--font-bebas)] text-5xl uppercase leading-[0.9] tracking-wide text-white sm:text-6xl md:text-7xl lg:text-8xl">
              Diseñamos
              <span className="block text-red-500">
                tu pasión.
              </span>

              Vestimos
              <span className="block text-red-500">
                tu legado.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-zinc-400 sm:mt-8 sm:text-base lg:text-lg">
              Diseños exclusivos para quienes quieren portar su identidad con
              orgullo. Playeras personalizadas con estilo, carácter y presencia.
            </p>

            {/* BOTONES */}
            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4">
              <a
                href="#catalogo"
                className="w-full rounded-lg bg-red-600 px-7 py-4 text-center text-sm font-bold uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:bg-red-500 sm:w-auto"
              >
                Ver catálogo
              </a>

              <a
                href="#personaliza"
                className="w-full rounded-lg border border-white/20 px-7 py-4 text-center text-sm font-bold uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:border-white hover:bg-white/5 sm:w-auto"
              >
                Personalizar playera
              </a>
            </div>

            {/* BENEFICIOS */}
            <div className="mt-9 grid grid-cols-3 gap-3 border-t border-white/10 pt-6 sm:mt-12 sm:gap-5">
              <div>
                <strong className="block text-xs text-white sm:text-sm">
                  Diseños
                </strong>

                <span className="text-[11px] text-zinc-500 sm:text-sm">
                  Exclusivos
                </span>
              </div>

              <div>
                <strong className="block text-xs text-white sm:text-sm">
                  Envíos
                </strong>

                <span className="text-[11px] text-zinc-500 sm:text-sm">
                  Todo México
                </span>
              </div>

              <div>
                <strong className="block text-xs text-white sm:text-sm">
                  Atención
                </strong>

                <span className="text-[11px] text-zinc-500 sm:text-sm">
                  WhatsApp
                </span>
              </div>
            </div>
          </div>

          {/* PLAYERA */}
          <div className="order-2 flex items-center justify-center lg:min-h-[560px]">
            <div className="relative w-full max-w-[420px] sm:max-w-[500px] lg:max-w-[560px]">
              
              {/* Brillo */}
              <div className="absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/10 blur-[90px]" />

              {/* Marco */}
              <div className="absolute -inset-2 rounded-[28px] border border-white/5 bg-white/[0.02] sm:-inset-4 sm:rounded-[40px]" />

              <Image
                src="/images/hero/hero-shirt4.png"
                alt="Playera personalizada Playeras El Güero"
                width={1080}
                height={1080}
                className="relative z-10 h-auto w-full rounded-2xl object-cover shadow-2xl sm:rounded-3xl"
                priority
              />

              <div className="absolute bottom-3 left-3 z-20 rounded-full border border-white/10 bg-black/70 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md sm:bottom-5 sm:left-5 sm:px-4 sm:text-xs">
                Diseño exclusivo
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}