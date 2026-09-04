import Image from "next/image";
import Link from "next/link";

import Container from "@/components/common/Container";

const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/share/19eESFvFqj/",
    description:
      "Síguenos en Facebook y entérate de dinámicas, novedades y promociones especiales.",
    bgClass:
      "from-[#1877F2]/20 via-[#1877F2]/10 to-white/5",
    borderClass: "border-[#1877F2]/30",
    textClass: "text-[#1877F2]",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M22 12.07C22 6.5 17.52 2 12 2S2 6.5 2 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.92 3.78-3.92 1.1 0 2.25.2 2.25.2v2.48H15.2c-1.25 0-1.64.78-1.64 1.57v1.89h2.8l-.45 2.9h-2.35V22c4.78-.75 8.44-4.91 8.44-9.93Z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/playeraselguero?igsi=MXNqY2E4Z2o1aXFkZg==",
    description:
      "Próximamente también compartiremos contenido, diseños y novedades en Instagram.",
    bgClass:
      "from-pink-500/20 via-orange-400/10 to-purple-500/10",
    borderClass: "border-pink-500/30",
    textClass: "text-pink-400",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="instagram-gradient"
            x1="0%"
            y1="100%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#f58529" />
            <stop offset="35%" stopColor="#dd2a7b" />
            <stop offset="65%" stopColor="#8134af" />
            <stop offset="100%" stopColor="#515bd4" />
          </linearGradient>
        </defs>
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
          stroke="url(#instagram-gradient)"
          strokeWidth="1.8"
        />
        <circle
          cx="12"
          cy="12"
          r="4.25"
          stroke="url(#instagram-gradient)"
          strokeWidth="1.8"
        />
        <circle
          cx="17.2"
          cy="6.8"
          r="1.2"
          fill="url(#instagram-gradient)"
        />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@playeraselguero",
    description:
      "Síguenos en TikTok para ver contenido diferente, tendencias y más ideas de diseños.",
    bgClass:
      "from-cyan-400/10 via-pink-500/10 to-white/5",
    borderClass: "border-cyan-400/20",
    textClass: "text-white",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M14 4c.7 1.9 2.1 3.3 4 4v2.5c-1.4-.1-2.8-.6-4-1.5v5.3a5.3 5.3 0 1 1-5.3-5.3c.4 0 .8 0 1.2.1v2.7a2.7 2.7 0 1 0 1.4 2.4V4H14Z"
          fill="#ffffff"
        />
        <path
          d="M13 4c.7 1.9 2.1 3.3 4 4"
          stroke="#25F4EE"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M11.2 11.9a2.7 2.7 0 1 0 1.4 2.4V4"
          stroke="#FE2C55"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

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
              href="https://wa.me/524922230511?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20Playeras%20El%20G%C3%BCero"
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
              <Link href="/" className="transition hover:text-white">
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

        {/* Redes sociales */}
        <div className="border-t border-white/10 py-12">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
              Redes sociales
            </p>

            <h3 className="mt-3 font-[family-name:var(--font-bebas)] text-4xl uppercase tracking-wide text-white sm:text-5xl">
              Síguenos y entérate de todo
            </h3>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500">
              Síguenos en nuestras redes sociales y mantente al tanto de nuevos
              diseños, promociones, dinámicas y contenido especial que
              compartimos para nuestra comunidad.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className={`group rounded-2xl border ${social.borderClass} bg-gradient-to-br ${social.bgClass} p-5 transition duration-300 hover:-translate-y-1 hover:border-red-500/40`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/40 ${social.textClass}`}
                  >
                    {social.icon}
                  </div>

                  <div>
                    <p className="text-lg font-bold text-white">
                      {social.name}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      {social.description}
                    </p>
                    <span className="mt-4 inline-flex text-sm font-bold text-red-500 transition group-hover:translate-x-1">
                      Visitar perfil →
                    </span>
                  </div>
                </div>
              </a>
            ))}
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