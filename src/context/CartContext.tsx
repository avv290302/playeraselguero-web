"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  image: string;
  size: string;
  quantity: number;

  price?: number | null;
  currency?: string;
};

type CartContextType = {
  items: CartItem[];

  totalItems: number;

  totalPrice: number;

  cartOpen: boolean;

  openCart: () => void;

  closeCart: () => void;

  addItem: (item: CartItem) => void;

  removeItem: (
    id: string,
    size: string
  ) => void;

  updateQuantity: (
    id: string,
    size: string,
    quantity: number
  ) => void;

  clearCart: () => void;
};

const CartContext =
  createContext<CartContextType | null>(
    null
  );

const STORAGE_KEY =
  "playeras-el-guero-cart";

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] =
    useState<CartItem[]>([]);

  const [hydrated, setHydrated] =
    useState(false);

  const [cartOpen, setCartOpen] =
    useState(false);

  useEffect(() => {
    try {
      const savedCart =
        window.localStorage.getItem(
          STORAGE_KEY
        );

      if (savedCart) {
        const parsed =
          JSON.parse(savedCart);

        if (Array.isArray(parsed)) {
          const normalizedItems =
            parsed
              .filter(
                (item) =>
                  item &&
                  typeof item ===
                    "object" &&
                  typeof item.id ===
                    "string" &&
                  typeof item.slug ===
                    "string" &&
                  typeof item.name ===
                    "string" &&
                  typeof item.size ===
                    "string" &&
                  typeof item.quantity ===
                    "number"
              )
              .map((item) => {
                const parsedPrice =
                  item.price !== null &&
                  item.price !==
                    undefined
                    ? Number(
                        item.price
                      )
                    : null;

                return {
                  id: item.id,

                  slug: item.slug,

                  name: item.name,

                  image:
                    typeof item.image ===
                    "string"
                      ? item.image
                      : "",

                  size: item.size,

                  quantity:
                    Math.max(
                      1,
                      item.quantity
                    ),

                  price:
                    parsedPrice !==
                      null &&
                    Number.isFinite(
                      parsedPrice
                    )
                      ? parsedPrice
                      : null,

                  currency:
                    typeof item.currency ===
                    "string"
                      ? item.currency
                      : "MXN",
                };
              });

          setItems(
            normalizedItems
          );
        }
      }
    } catch (error) {
      console.error(
        "No fue posible cargar el carrito:",
        error
      );
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(items)
      );
    } catch (error) {
      console.error(
        "No fue posible guardar el carrito:",
        error
      );
    }
  }, [items, hydrated]);

  function openCart() {
    setCartOpen(true);
  }

  function closeCart() {
    setCartOpen(false);
  }

  function addItem(
    newItem: CartItem
  ) {
    setItems(
      (currentItems) => {
        const existingItem =
          currentItems.find(
            (item) =>
              item.id ===
                newItem.id &&
              item.size ===
                newItem.size
          );

        if (existingItem) {
          return currentItems.map(
            (item) =>
              item.id ===
                newItem.id &&
              item.size ===
                newItem.size
                ? {
                    ...item,

                    quantity:
                      item.quantity +
                      newItem.quantity,

                    /*
                      Actualizamos también
                      precio y moneda por si
                      cambiaron desde que
                      se agregó al carrito.
                    */
                    price:
                      newItem.price ??
                      item.price ??
                      null,

                    currency:
                      newItem.currency ??
                      item.currency ??
                      "MXN",
                  }
                : item
          );
        }

        return [
          ...currentItems,
          {
            ...newItem,

            price:
              newItem.price ??
              null,

            currency:
              newItem.currency ??
              "MXN",
          },
        ];
      }
    );
  }

  function removeItem(
    id: string,
    size: string
  ) {
    setItems(
      (currentItems) =>
        currentItems.filter(
          (item) =>
            !(
              item.id === id &&
              item.size === size
            )
        )
    );
  }

  function updateQuantity(
    id: string,
    size: string,
    quantity: number
  ) {
    if (quantity <= 0) {
      removeItem(
        id,
        size
      );

      return;
    }

    setItems(
      (currentItems) =>
        currentItems.map(
          (item) =>
            item.id === id &&
            item.size === size
              ? {
                  ...item,
                  quantity,
                }
              : item
        )
    );
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems =
    useMemo(
      () =>
        items.reduce(
          (
            total,
            item
          ) =>
            total +
            item.quantity,
          0
        ),
      [items]
    );

  const totalPrice =
    useMemo(
      () =>
        items.reduce(
          (
            total,
            item
          ) => {
            const price =
              typeof item.price ===
                "number" &&
              Number.isFinite(
                item.price
              )
                ? item.price
                : 0;

            return (
              total +
              price *
                item.quantity
            );
          },
          0
        ),
      [items]
    );

  const value = useMemo(
    () => ({
      items,

      totalItems,

      totalPrice,

      cartOpen,

      openCart,

      closeCart,

      addItem,

      removeItem,

      updateQuantity,

      clearCart,
    }),
    [
      items,
      totalItems,
      totalPrice,
      cartOpen,
    ]
  );

  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart debe usarse dentro de CartProvider"
    );
  }

  return context;
}