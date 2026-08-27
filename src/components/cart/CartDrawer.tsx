"use client";

import Image from "next/image";

import { useCart } from "@/context/CartContext";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

function formatPrice(
  price: number,
  currency = "MXN"
) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

export default function CartDrawer({
  open,
  onClose,
}: CartDrawerProps) {
  const {
    items,
    totalItems,
    totalPrice,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const hasMissingPrices = items.some(
    (item) =>
      typeof item.price !== "number" ||
      !Number.isFinite(item.price) ||
      item.price <= 0
  );

  const whatsappMessage = encodeURIComponent(
    [
      "Hola, quiero realizar un pedido en Playeras El Güero.",
      "",
      "PEDIDO:",
      "",

      ...items.flatMap((item, index) => {
        const hasPrice =
          typeof item.price === "number" &&
          Number.isFinite(item.price) &&
          item.price > 0;

        const currency =
          item.currency ?? "MXN";

        const subtotal = hasPrice
          ? item.price! * item.quantity
          : null;

        return [
          `${index + 1}. ${item.name}`,
          `   Talla: ${item.size}`,
          `   Cantidad: ${item.quantity}`,

          hasPrice
            ? `   Precio unitario: ${formatPrice(
                item.price!,
                currency
              )} ${currency}`
            : "   Precio: pendiente",

          subtotal !== null
            ? `   Subtotal: ${formatPrice(
                subtotal,
                currency
              )} ${currency}`
            : "",

          `   https://playeraselguero.com/producto/${item.slug}`,
          "",
        ].filter(Boolean);
      }),

      `TOTAL DE PRENDAS: ${totalItems}`,

      hasMissingPrices
        ? `TOTAL PARCIAL: ${formatPrice(
            totalPrice,
            "MXN"
          )} MXN`
        : `TOTAL: ${formatPrice(
            totalPrice,
            "MXN"
          )} MXN`,

      "",

      hasMissingPrices
        ? "Hay productos pendientes de precio. Quedo atento a la confirmación del total."
        : "Quedo atento a disponibilidad y tiempo de entrega.",

      "Gracias.",
    ].join("\n")
  );

  const whatsappUrl =
    `https://wa.me/524922230511?text=${whatsappMessage}`;

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Cerrar carrito"
          onClick={onClose}
          className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-[100] h-screen w-full max-w-md border-l border-white/10 bg-[#080808] text-white shadow-2xl transition-transform duration-300 ${
          open
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
                Tu pedido
              </p>

              <h2 className="mt-1 text-xl font-bold">
                Carrito
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-xl text-zinc-400 transition hover:border-red-500 hover:text-white"
              aria-label="Cerrar carrito"
            >
              ×
            </button>
          </div>

          {/* PRODUCTOS */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <p className="font-[family-name:var(--font-bebas)] text-4xl uppercase text-white">
                  Tu carrito está vacío
                </p>

                <p className="mt-3 max-w-xs text-sm leading-6 text-zinc-500">
                  Agrega diseños, tallas y cantidades para
                  preparar tu pedido.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => {
                  const hasPrice =
                    typeof item.price ===
                      "number" &&
                    Number.isFinite(
                      item.price
                    ) &&
                    item.price > 0;

                  const currency =
                    item.currency ??
                    "MXN";

                  const subtotal =
                    hasPrice
                      ? item.price! *
                        item.quantity
                      : null;

                  return (
                    <article
                      key={`${item.id}-${item.size}`}
                      className="rounded-2xl border border-white/10 bg-[#101010] p-4"
                    >
                      <div className="flex gap-4">
                        {/* IMAGEN */}
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-black">
                          {item.image ? (
                            <Image
                              src={
                                item.image
                              }
                              alt={`Playera ${item.name}`}
                              fill
                              sizes="96px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center px-2 text-center text-[10px] text-zinc-600">
                              Sin imagen
                            </div>
                          )}
                        </div>

                        {/* INFORMACIÓN */}
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-bold text-white">
                            {item.name}
                          </h3>

                          <p className="mt-1 text-sm text-zinc-500">
                            Talla{" "}
                            {item.size}
                          </p>

                          {/* PRECIO */}
                          {hasPrice ? (
                            <div className="mt-2">
                              <p className="text-sm font-bold text-white">
                                {formatPrice(
                                  item.price!,
                                  currency
                                )}{" "}
                                <span className="text-xs text-zinc-500">
                                  {
                                    currency
                                  }
                                </span>
                              </p>

                              {item.quantity >
                                1 && (
                                <p className="mt-1 text-xs text-zinc-500">
                                  Subtotal:{" "}
                                  <span className="font-bold text-zinc-300">
                                    {formatPrice(
                                      subtotal!,
                                      currency
                                    )}{" "}
                                    {
                                      currency
                                    }
                                  </span>
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="mt-2 text-xs font-semibold text-zinc-600">
                              Precio pendiente
                            </p>
                          )}

                          {/* CANTIDAD */}
                          <div className="mt-4 flex items-center justify-between gap-3">
                            <div className="inline-flex items-center overflow-hidden rounded-lg border border-white/10">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.size,
                                    item.quantity -
                                      1
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center text-lg transition hover:bg-white/10"
                                aria-label={`Disminuir cantidad de ${item.name} talla ${item.size}`}
                              >
                                −
                              </button>

                              <div className="flex h-9 min-w-10 items-center justify-center border-x border-white/10 px-2 text-sm font-bold">
                                {
                                  item.quantity
                                }
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.size,
                                    item.quantity +
                                      1
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center text-lg transition hover:bg-white/10"
                                aria-label={`Aumentar cantidad de ${item.name} talla ${item.size}`}
                              >
                                +
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                removeItem(
                                  item.id,
                                  item.size
                                )
                              }
                              className="text-xs font-bold uppercase tracking-wider text-red-500 transition hover:text-red-400"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* TOTAL */}
          <div className="border-t border-white/10 bg-[#0b0b0b] px-6 py-5">
            <div className="flex items-center justify-between">
              <span className="text-sm uppercase tracking-wider text-zinc-500">
                Total de prendas
              </span>

              <span className="text-xl font-bold text-white">
                {totalItems}
              </span>
            </div>

            {items.length > 0 && (
              <>
                <div className="mt-4 flex items-end justify-between border-t border-white/10 pt-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                      {hasMissingPrices
                        ? "Total parcial"
                        : "Total"}
                    </p>

                    {hasMissingPrices && (
                      <p className="mt-1 text-xs text-zinc-600">
                        Hay productos sin
                        precio.
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-3xl font-black text-white">
                      {formatPrice(
                        totalPrice,
                        "MXN"
                      )}
                    </span>

                    <span className="ml-2 text-xs font-bold text-zinc-500">
                      MXN
                    </span>
                  </div>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 block rounded-xl bg-red-600 px-5 py-4 text-center text-sm font-bold uppercase tracking-wider text-white transition hover:bg-red-500"
                >
                  Enviar pedido por WhatsApp
                </a>

                <button
                  type="button"
                  onClick={clearCart}
                  className="mt-3 w-full rounded-xl border border-white/10 px-5 py-3 text-xs font-bold uppercase tracking-wider text-zinc-500 transition hover:border-red-500/30 hover:text-white"
                >
                  Vaciar carrito
                </button>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}