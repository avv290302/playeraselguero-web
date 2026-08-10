import Container from "@/components/common/Container";

const benefits = [
  {
    number: "01",
    title: "Diseños exclusivos",
    description:
      "Diseños creados para destacar, con una identidad visual fuerte y diferente.",
  },
  {
    number: "02",
    title: "Personalización",
    description:
      "Podemos adaptar nombres, logotipos, equipos y detalles especiales para tu pedido.",
  },
  {
    number: "03",
    title: "Envíos a todo México",
    description:
      "Preparamos tus pedidos para que puedas recibirlos estés donde estés.",
  },
  {
    number: "04",
    title: "Atención directa",
    description:
      "Cotiza y recibe seguimiento personalizado directamente por WhatsApp.",
  },
];

export default function Benefits() {
  return (
    <section className="relative overflow-hidden bg-[#090909] py-24">
      {/* Efectos de fondo */}
      <div className="absolute left-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-red-600/5 blur-[160px]" />

      <Container className="relative z-10">
        {/* Encabezado */}
        <div className="mb-14 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
            Nuestra diferencia
          </p>

          <h2 className="mt-3 font-[family-name:var(--font-bebas)] text-5xl uppercase tracking-wide text-white sm:text-6xl">
            Más que una
            <span className="ml-3 text-red-500">playera</span>
          </h2>

          <p className="mt-5 leading-7 text-zinc-400">
            Cada diseño busca representar identidad, pasión y personalidad.
            Queremos que cada playera se sienta hecha para quien la porta.
          </p>
        </div>

        {/* Beneficios */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <article
              key={benefit.number}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#111] p-7 transition duration-300 hover:-translate-y-1 hover:border-red-500/40"
            >
              {/* Número */}
              <span className="font-[family-name:var(--font-bebas)] text-5xl text-white/10 transition group-hover:text-red-500/20">
                {benefit.number}
              </span>

              {/* Línea */}
              <div className="mt-6 h-px w-12 bg-red-500 transition-all duration-300 group-hover:w-20" />

              <h3 className="mt-6 text-lg font-bold text-white">
                {benefit.title}
              </h3>

              <p className="mt-4 text-sm leading-6 text-zinc-400">
                {benefit.description}
              </p>
            </article>
          ))}
        </div>

        {/* CTA inferior */}
        <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:flex-row md:items-center">
          <div>
            <h3 className="font-[family-name:var(--font-bebas)] text-3xl uppercase tracking-wide text-white">
              ¿Tienes una idea para tu playera?
            </h3>

            <p className="mt-2 text-zinc-400">
              Cuéntanos qué tienes en mente y te ayudamos a convertirlo en un
              diseño.
            </p>
          </div>

          <a
            href="https://wa.me/524922230511?text=Hola%2C%20quiero%20cotizar%20una%20playera%20personalizada."
            target="_blank"
            rel="noreferrer"
            className="shrink-0 rounded-lg bg-red-600 px-7 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:bg-red-500"
          >
            Cotizar por WhatsApp
          </a>
        </div>
      </Container>
    </section>
  );
}