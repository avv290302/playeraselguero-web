export default function Hero() {
  return (
    <section className="flex min-h-screen items-center justify-center">
      <div className="px-6 text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-red-500">
          Playeras personalizadas
        </p>

        <h1 className="text-5xl font-bold md:text-7xl">
          Playeras El Güero
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
          Diseñamos playeras personalizadas para equipos, eventos, negocios y
          proyectos especiales.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <button className="rounded-lg bg-red-600 px-6 py-3 font-semibold transition hover:bg-red-700">
            Ver catálogo
          </button>

          <button className="rounded-lg border border-gray-700 px-6 py-3 font-semibold transition hover:border-white">
            Cotizar por WhatsApp
          </button>
        </div>
      </div>
    </section>
  );
}