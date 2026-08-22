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
};

type CartContextType = {
  items: CartItem[];
  totalItems: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size: string) => void;
  updateQuantity: (
    id: string,
    size: string,
    quantity: number
  ) => void;
  clearCart: () => void;
};

const CartContext =
  createContext<CartContextType | null>(null);

const STORAGE_KEY = "playeras-el-guero-cart";

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedCart =
        window.localStorage.getItem(STORAGE_KEY);

      if (savedCart) {
        const parsed = JSON.parse(savedCart);

        if (Array.isArray(parsed)) {
          setItems(parsed);
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

  function addItem(newItem: CartItem) {
    setItems((currentItems) => {
      const existingItem =
        currentItems.find(
          (item) =>
            item.id === newItem.id &&
            item.size === newItem.size
        );

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === newItem.id &&
          item.size === newItem.size
            ? {
                ...item,
                quantity:
                  item.quantity +
                  newItem.quantity,
              }
            : item
        );
      }

      return [...currentItems, newItem];
    });
  }

  function removeItem(
    id: string,
    size: string
  ) {
    setItems((currentItems) =>
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
      removeItem(id, size);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
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

  const totalItems = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + item.quantity,
        0
      ),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      totalItems,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [items, totalItems]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart debe usarse dentro de CartProvider"
    );
  }

  return context;
}