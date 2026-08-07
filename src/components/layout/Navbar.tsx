export default function Navbar() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="text-xl font-bold">
          PLAYERAS <span className="text-red-500">EL GÜERO</span>
        </div>

        <div className="hidden gap-8 md:flex">
          <a className="transition hover:text-red-500" href="#">
            Inicio
          </a>

          <a className="transition hover:text-red-500" href="#">
            Catálogo
          </a>

          <a className="transition hover:text-red-500" href="#">
            Galería
          </a>

          <a className="transition hover:text-red-500" href="#">
            Contacto
          </a>
        </div>

        <button className="rounded-lg bg-red-600 px-5 py-2 font-semibold transition hover:bg-red-700">
          Cotizar
        </button>
      </nav>
    </header>
  );
}