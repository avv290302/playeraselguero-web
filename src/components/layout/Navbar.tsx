import Image from "next/image";
import Container from "@/components/common/Container";

export default function Navbar() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <Container>
        <nav className="flex h-20 items-center justify-between">
          <a href="#" className="flex items-center gap-3">
  <Image
    src="/images/logo/logo.jpeg"
    alt="Playeras El Güero"
    width={64}
    height={64}
    className="h-14 w-14 rounded-full object-cover"
    priority
  />

  <div className="hidden leading-none sm:block">
    <span className="block text-sm font-bold tracking-[0.15em] text-white">
      PLAYERAS
    </span>

    <span className="block text-lg font-black tracking-wide text-red-500">
      EL GÜERO
    </span>
  </div>
</a>

          <div className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a className="transition hover:text-red-500" href="#">
              Inicio
            </a>

            <a className="transition hover:text-red-500" href="#catalogo">
              Catálogo
            </a>

            <a className="transition hover:text-red-500" href="#colecciones">
              Colecciones
            </a>

            <a className="transition hover:text-red-500" href="#galeria">
              Galería
            </a>

            <a className="transition hover:text-red-500" href="#contacto">
              Contacto
            </a>
          </div>

          <a
            href="#contacto"
            className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-bold transition hover:bg-red-500"
          >
            Cotizar
          </a>
        </nav>
      </Container>
    </header>
  );
}