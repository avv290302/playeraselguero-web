import Image from "next/image";
import Link from "next/link";

import Container from "@/components/common/Container";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050505]">
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
          {/* Marca */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-4">
              <Image
                src="/images/logo/logo.png"
                alt="Playeras El Güero"
                width={70}
                height={70}
                className="h-16 w-16 rounded-full object-cover"
              />

              <div>
                <span className="block text-sm font-bold tracking-[0.15em] text-white">
                  PLAYERAS
                </span>

                <span className="block text-xl font-black tracking-wide text-red-500">
                  EL GÜERO
                </span>
              </div>
            </Link>

            <p className="mt-6 max-w-md text-sm leading-7 text-zinc-500">
              Diseños exclusivos y playeras personalizadas creadas para
              representar identidad, pasión y personalidad.
            </p>

            <a
              href="https://wa.me/524922230511?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20Playeras%20El%20G%C3%BCero."
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex text-sm font-bold text-white transition hover:text-red-500"
            >
              WhatsApp: 492 223 0511 →
            </a>
          </div>

          {/* Navegación */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
              Navegación
            </p>

            <div className="mt-6 flex flex-col gap-4 text-sm text-zinc-400">
              <Link
                href="/"
                className="transition hover:text-white"
              >
                Inicio
              </Link>

              <Link
                href="/#catalogo"
                className="transition hover:text-white"
              >
                Catálogo
              </Link>

              <Link
                href="/#colecciones"
                className="transition hover:text-white"
              >
                Colecciones
              </Link>

              <Link
                href="/#galeria"
                className="transition hover:text-white"
              >
                Galería
              </Link>

              <Link
                href="/#nosotros"
                className="transition hover:text-white"
              >
                Nosotros
              </Link>

              <Link
                href="/#contacto"
                className="transition hover:text-white"
              >
                Contacto
              </Link>
            </div>
          </div>

          {/* Información */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
              Información
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-sm font-bold text-white">
                  Cobertura
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  Envíos a todo México
                </p>
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  Pedidos
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  Atención por WhatsApp
                </p>
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  Sitio oficial
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  playeraselguero.com
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Parte inferior */}
        <div className="border-t border-white/10 py-7">
          <div className="flex flex-col justify-between gap-4 text-sm text-zinc-600 md:flex-row md:items-center">
            <p>
              © {new Date().getFullYear()} Playeras El Güero. Todos los derechos
              reservados.
            </p>

            <p>
              Fundado y desarrollado por{" "}
              <span className="font-semibold text-zinc-400">
                Alejandro Venegas Villalobos
              </span>
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}