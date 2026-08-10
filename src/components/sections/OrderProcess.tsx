import Container from "@/components/common/Container";

const steps = [
  {
    number: "01",
    title: "Elige tu diseño",
    description:
      "Explora nuestras colecciones y selecciona la playera que más te guste.",
  },
  {
    number: "02",
    title: "Selecciona talla",
    description:
      "Entra al diseño, selecciona tu talla y agrega la cantidad que necesitas.",
  },
  {
    number: "03",
    title: "Solicita cotización",
    description:
      "Presiona el botón de WhatsApp y recibiremos automáticamente los datos de tu pedido.",
  },
  {
    number: "04",
    title: "Recibe tu pedido",
    description:
      "Confirmamos todos los detalles contigo y preparamos tu pedido para entrega o envío.",
  },
];

export default function OrderProcess() {
  return (
    <section
      id="como-comprar"
      className="relative overflow-hidden bg-[#090909] py-24"
    >
      {/* Efectos decorativos */}
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/5 blur-[170px]" />

      <Container className="relative z-10">
        {/* Encabezado */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
            Fácil y rápido
          </p>

          <h2 className="mt-3 font-[family-name:var(--font-bebas)] text-5xl uppercase tracking-wide text-white sm:text-6xl">
            ¿Cómo hacer
            <span className="ml-3 text-red-500">tu pedido?</span>
          </h2>

          <p className="mt-5 leading-7 text-zinc-400">
            Comprar tu playera es muy sencillo. Elige un diseño, selecciona los
            detalles de tu pedido y nosotros te atendemos directamente por
            WhatsApp.
          </p>
        </div>

        {/* Pasos */}
        <div className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Línea decorativa */}
          <div className="absolute left-[12%] right-[12%] top-10 hidden h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent lg:block" />

          {steps.map((step) => (
            <article
              key={step.number}
              className="group relative rounded-2xl border border-white/10 bg-[#111] p-7 transition duration-300 hover:-translate-y-1 hover:border-red-500/40"
            >
              <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full border border-red-500/30 bg-[#0a0a0a] font-[family-name:var(--font-bebas)] text-4xl text-red-500 transition duration-300 group-hover:bg-red-600 group-hover:text-white">
                {step.number}
              </div>

              <h3 className="mt-7 text-xl font-bold text-white">
                {step.title}
              </h3>

              <p className="mt-4 text-sm leading-6 text-zinc-400">
                {step.description}
              </p>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-3xl border border-white/10 bg-gradient-to-r from-white/[0.03] to-red-500/[0.04] p-8 md:p-10">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-500">
                ¿Listo para comenzar?
              </p>

              <h3 className="mt-3 font-[family-name:var(--font-bebas)] text-4xl uppercase tracking-wide text-white">
                Encuentra tu próximo diseño
              </h3>

              <p className="mt-3 max-w-2xl text-zinc-400">
                Explora el catálogo o cuéntanos directamente qué playera estás
                buscando.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="#catalogo"
                className="rounded-lg border border-white/15 px-7 py-4 text-center text-sm font-bold uppercase tracking-wide text-white transition hover:border-white"
              >
                Ver catálogo
              </a>

              <a
                href="https://wa.me/524922230511?text=Hola%2C%20quiero%20informaci%C3%B3n%20para%20hacer%20un%20pedido%20de%20playeras."
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-red-600 px-7 py-4 text-center text-sm font-bold uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:bg-red-500"
              >
                Hablar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}