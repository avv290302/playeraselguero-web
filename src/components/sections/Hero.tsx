import Image from "next/image";
import Container from "@/components/common/Container";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050505] pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(229,9,20,0.18),transparent_35%)]" />

      <div className="absolute left-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-red-700/10 blur-[160px]" />

      <Container className="relative z-10">
        <div className="grid min-h-[calc(100vh-80px)] items-center gap-12 py-12 lg:grid-cols-2">

          <div>
            <div className="mb-6 inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-red-500">
              Playeras premium
            </div>

            <h1 className="font-[family-name:var(--font-bebas)] text-6xl uppercase leading-[0.88] tracking-wide sm:text-7xl lg:text-8xl">
              Diseñamos
              <span className="block text-red-500">tu pasión.</span>

              Vestimos
              <span className="block text-red-500">tu legado.</span>
            </h1>

            <p className="mt-8 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
              Diseños exclusivos para quienes quieren portar su identidad con
              orgullo. Playeras personalizadas con estilo, carácter y presencia.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#catalogo"
                className="rounded-lg bg-red-600 px-7 py-4 text-center text-sm font-bold uppercase tracking-wide transition hover:-translate-y-0.5 hover:bg-red-500"
              >
                Ver catálogo
              </a>

              <a
                href="#contacto"
                className="rounded-lg border border-white/20 px-7 py-4 text-center text-sm font-bold uppercase tracking-wide transition hover:-translate-y-0.5 hover:border-white hover:bg-white/5"
              >
                Cotizar por WhatsApp
              </a>
            </div>

            <div className="mt-12 grid max-w-xl grid-cols-3 gap-5 border-t border-white/10 pt-6 text-sm">
              <div>
                <strong className="block text-white">Diseños</strong>
                <span className="text-zinc-500">Exclusivos</span>
              </div>

              <div>
                <strong className="block text-white">Envíos</strong>
                <span className="text-zinc-500">Todo México</span>
              </div>

              <div>
                <strong className="block text-white">Atención</strong>
                <span className="text-zinc-500">WhatsApp</span>
              </div>
            </div>
          </div>

          <div className="relative flex min-h-[560px] items-center justify-center">
            <div className="absolute h-[480px] w-[480px] rounded-full bg-red-600/10 blur-[120px]" />

            <div className="relative w-full max-w-[560px]">
              <div className="absolute -inset-5 rounded-[40px] border border-white/5 bg-white/[0.02]" />

              <Image
                src="/images/hero/hero-shirt2.png"
                alt="Playera personalizada Playeras El Güero"
                width={1080}
                height={1080}
                className="relative z-10 h-auto w-full rounded-3xl object-cover shadow-2xl"
                priority
              />

              <div className="absolute bottom-5 left-5 z-20 rounded-full border border-white/10 bg-black/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                Diseño exclusivo
              </div>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}