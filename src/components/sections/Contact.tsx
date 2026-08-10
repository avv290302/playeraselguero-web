import Container from "@/components/common/Container";

export default function Contact() {
  const whatsappUrl =
    "https://wa.me/524922230511?text=Hola%2C%20vi%20la%20p%C3%A1gina%20de%20Playeras%20El%20G%C3%BCero%20y%20quiero%20m%C3%A1s%20informaci%C3%B3n.";

  return (
    <section
      id="contacto"
      className="relative overflow-hidden bg-[#090909] py-24"
    >
      {/* Efectos decorativos */}
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/5 blur-[170px]" />

      <Container className="relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Texto */}
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
              Contacto
            </p>

            <h2 className="mt-3 font-[family-name:var(--font-bebas)] text-5xl uppercase leading-none tracking-wide text-white sm:text-6xl">
              ¿Tienes una idea?
              <span className="block text-red-500">
                Hagámosla realidad.
              </span>
            </h2>

            <p className="mt-6 max-w-xl leading-7 text-zinc-400">
              Escríbenos directamente para cotizaciones, pedidos,
              personalizaciones o cualquier duda sobre nuestros diseños.
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-9 inline-flex rounded-lg bg-red-600 px-7 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:bg-red-500"
            >
              Hablar por WhatsApp
            </a>
          </div>

          {/* Información */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-[#111] p-7">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
                WhatsApp
              </p>

              <p className="mt-4 text-xl font-bold text-white">
                492 223 0511
              </p>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Atención directa para pedidos y cotizaciones.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#111] p-7">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
                Cobertura
              </p>

              <p className="mt-4 text-xl font-bold text-white">
                Todo México
              </p>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Consulta disponibilidad y opciones de envío.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#111] p-7 sm:col-span-2">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
                Personalización
              </p>

              <p className="mt-4 text-xl font-bold text-white">
                ¿Quieres algo diferente?
              </p>

              <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
                Podemos trabajar sobre una idea, nombre, logotipo, equipo o
                concepto especial para desarrollar una propuesta personalizada.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}