"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import Container from "@/components/common/Container";
import CartDrawer from "@/components/cart/CartDrawer";
import { useCart } from "@/context/CartContext";

const navigation = [
  { name: "Inicio", href: "/" },
  { name: "Catálogo", href: "/#catalogo" },
  { name: "Colecciones", href: "/#colecciones" },
  { name: "Personaliza", href: "/#personaliza" },
  { name: "Galería", href: "/#galeria" },
  { name: "Nosotros", href: "/#nosotros" },
  { name: "Contacto", href: "/#contacto" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const {
    totalItems,
    cartOpen,
    openCart,
    closeCart,
  } = useCart();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleOpenCart = () => {
    setMenuOpen(false);
    openCart();
  };

  return (
    <>
      <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/85 backdrop-blur-xl">
        <Container>
          <nav className="flex h-20 items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-3"
              onClick={closeMenu}
            >
              <Image
                src="/images/logo/logo.png"
                alt="Playeras El Güero"
                width={64}
                height={64}
                className="h-14 w-14 object-contain"
                priority
              />

              <div className="leading-none">
                <span className="block text-xs font-bold tracking-[0.15em] text-white sm:text-sm">
                  PLAYERAS
                </span>

                <span className="mt-1 block text-base font-black tracking-wide text-red-500 sm:text-lg">
                  EL GÜERO
                </span>
              </div>
            </Link>

            <div className="hidden items-center gap-7 text-sm font-medium lg:flex">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="transition hover:text-red-500"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleOpenCart}
                className="relative flex h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-sm font-bold text-white transition hover:border-red-500/50 hover:bg-white/[0.06]"
                aria-label={`Abrir carrito. ${totalItems} prendas`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L20.5 8H7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="10" cy="20" r="1" />
                  <circle cx="17" cy="20" r="1" />
                </svg>

                <span className="hidden sm:inline">
                  Carrito
                </span>

                {totalItems > 0 && (
                  <span className="absolute -right-2 -top-2 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-black text-white">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </button>

              <a
                href="https://wa.me/524922230511?text=Hola%2C%20quiero%20cotizar%20una%20playera."
                target="_blank"
                rel="noreferrer"
                className="hidden rounded-lg bg-red-600 px-5 py-2.5 text-sm font-bold transition hover:bg-red-500 sm:block"
              >
                Cotizar
              </a>

              <button
                type="button"
                onClick={() =>
                  setMenuOpen((current) => !current)
                }
                className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] transition hover:border-red-500/40 lg:hidden"
                aria-label={
                  menuOpen
                    ? "Cerrar menú"
                    : "Abrir menú"
                }
                aria-expanded={menuOpen}
              >
                <span
                  className={`h-0.5 w-5 bg-white transition ${
                    menuOpen
                      ? "translate-y-2 rotate-45"
                      : ""
                  }`}
                />

                <span
                  className={`h-0.5 w-5 bg-white transition ${
                    menuOpen ? "opacity-0" : ""
                  }`}
                />

                <span
                  className={`h-0.5 w-5 bg-white transition ${
                    menuOpen
                      ? "-translate-y-2 -rotate-45"
                      : ""
                  }`}
                />
              </button>
            </div>
          </nav>
        </Container>

        <div
          className={`overflow-hidden border-t border-white/10 bg-[#080808] transition-all duration-300 lg:hidden ${
            menuOpen
              ? "max-h-[500px] opacity-100"
              : "max-h-0 border-transparent opacity-0"
          }`}
        >
          <Container>
            <div className="flex flex-col py-5">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMenu}
                  className="border-b border-white/5 py-4 text-sm font-bold text-zinc-300 transition hover:text-red-500"
                >
                  {item.name}
                </Link>
              ))}

              <button
                type="button"
                onClick={handleOpenCart}
                className="mt-5 rounded-lg border border-white/10 px-5 py-4 text-center text-sm font-bold uppercase tracking-wide text-white transition hover:border-red-500/40"
              >
                Ver carrito
                {totalItems > 0
                  ? ` (${totalItems})`
                  : ""}
              </button>

              <a
                href="https://wa.me/524922230511?text=Hola%2C%20quiero%20cotizar%20una%20playera."
                target="_blank"
                rel="noreferrer"
                onClick={closeMenu}
                className="mt-3 rounded-lg bg-red-600 px-5 py-4 text-center text-sm font-bold uppercase tracking-wide text-white transition hover:bg-red-500 sm:hidden"
              >
                Cotizar por WhatsApp
              </a>
            </div>
          </Container>
        </div>
      </header>

      <CartDrawer
        open={cartOpen}
        onClose={closeCart}
      />
    </>
  );
}