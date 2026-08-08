import Image from "next/image";
import Link from "next/link";

import Container from "@/components/common/Container";

const collections = [
  {
    name: "Blancos",
    image: "/images/products/blancos-01.png",
    description: "Diseños claros y diferentes para quienes buscan otro estilo.",
  },
  {
    name: "Brown Red",
    image: "/images/products/brown-red-01.png",
    description: "Diseños con carácter inspirados en la línea Brown Red.",
  },
  {
    name: "Hatch",
    image: "/images/products/hatch-01.png",
    description: "Explora todos nuestros diseños inspirados en la línea Hatch.",
  },
  {
    name: "Kelso",
    image: "/images/products/kelso-01.png",
    description: "Diseños inspirados en una de las líneas más reconocidas.",
  },
  {
    name: "Regular Grey",
    image: "/images/products/regular-grey-01.png",
    description: "Una colección con diseños inspirados en Regular Grey.",
  },
  {
    name: "Round Head",
    image: "/images/products/round-head-01.png",
    description: "Explora nuestros diseños inspirados en la línea Round Head.",
  },
  {
    name: "Sweater",
    image: "/images/products/sweater-01.png",
    description: "Diseños modernos inspirados en la reconocida línea Sweater.",
  },
];

export default function Collections() {
  return (
    <section
      id="colecciones"
      className="relative overflow-hidden bg-[#080808] py-24"
    >
      <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-red-600/5 blur-[150px]" />

      <Container className="relative z-10">
        <div className="mb-14">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-red-500">
            Diseños exclusivos
          </p>

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <h2 className="font-[family-name:var(--font-bebas)] text-5xl uppercase tracking-wide text-white sm:text-6xl">
                Nuestras
                <span className="ml-3 text-red-500">colecciones</span>
              </h2>

              <p className="mt-4 max-w-2xl text-zinc-400">
                Explora nuestras líneas y encuentra diseños creados para
                representar tu pasión con identidad, estilo y personalidad.
              </p>
            </div>

            <Link
              href="/#catalogo"
              className="text-sm font-bold uppercase tracking-wider text-white transition hover:text-red-500"
            >
              Ver todos los diseños →
            </Link>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <Link
              key={collection.name}
              href={`/?line=${encodeURIComponent(
                collection.name
              )}#catalogo`}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#111] transition duration-300 hover:-translate-y-1 hover:border-red-500/40"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={collection.image}
                  alt={`Colección ${collection.name}`}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

                <div className="absolute right-5 top-5 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs uppercase tracking-widest text-zinc-300 backdrop-blur-md">
                  Colección
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6">
                  <h3 className="font-[family-name:var(--font-bebas)] text-4xl uppercase tracking-wide text-white">
                    {collection.name}
                  </h3>

                  <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-300 opacity-0 transition duration-300 group-hover:opacity-100">
                    {collection.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-red-500">
                    Ver colección

                    <span className="transition-transform duration-300 group-hover:translate-x-2">
                      →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}