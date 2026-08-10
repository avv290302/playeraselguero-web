import Image from "next/image";

import Container from "@/components/common/Container";

export default function About() {
  return (
    <section
      id="nosotros"
      className="relative overflow-hidden bg-[#050505] py-24"
    >
      {/* Efectos decorativos */}
      <div className="absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-red-600/5 blur-[160px]" />

      <Container className="relative z-10">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          {/* Imagen / Marca */}
          <div className="relative">
            <div className="absolute -inset-6 rounded-[40px] bg-red-600/5 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#111] p-8">
              <div className="relative mx-auto aspect-square max-w-[480px]">
                <Image
                  src="/images/logo/logo.png"
                  alt="Logotipo de Playeras El Güero"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Información */}
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
              Nuestra historia
            </p>

            <h2 className="mt-3 font-[family-name:var(--font-bebas)] text-5xl uppercase leading-none tracking-wide text-white sm:text-6xl">
              Una marca creada
              <span className="block text-red-500">
                desde la pasión
              </span>
            </h2>

            <div className="mt-8 space-y-5 leading-7 text-zinc-400">
              <p>
                Playeras El Güero nace con la idea de crear diseños que
                representen identidad, tradición y personalidad a través de
                prendas diferentes.
              </p>

              <p>
                Cada colección busca transformar una idea en una playera con
                presencia propia, combinando diseño gráfico, creatividad y una
                estética moderna.
              </p>

              <p>
                El proyecto es dirigido por{" "}
                <strong className="font-semibold text-white">
                  Alejandro Venegas Villalobos
                </strong>
                , creador de Playeras El Güero y desarrollador de esta
                plataforma digital.
              </p>
            </div>

            {/* Datos */}
            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <p className="font-[family-name:var(--font-bebas)] text-4xl text-red-500">
                  100%
                </p>

                <p className="mt-1 text-sm text-zinc-400">
                  Diseños con identidad
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <p className="font-[family-name:var(--font-bebas)] text-4xl text-red-500">
                  MÉXICO
                </p>

                <p className="mt-1 text-sm text-zinc-400">
                  Atención y envíos
                </p>
              </div>
            </div>

            {/* Firma */}
            <div className="mt-10 border-t border-white/10 pt-6">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">
                Fundador
              </p>

              <p className="mt-2 text-lg font-bold text-white">
                Alejandro Venegas Villalobos
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                Playeras El Güero
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}