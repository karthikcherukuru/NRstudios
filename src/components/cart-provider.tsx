"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import { getProduct } from "@/lib/products";

const STORAGE_KEY = "nr-studios:cart:v1";
export const DEFAULT_VARIANT = "Saree & unstitched blouse";
export type CartItem = { key: string; productId: string; variant: string; quantity: number };
type CartState = { items: CartItem[]; hydrated: boolean; storageAvailable: boolean };
type Action =
  | { type: "hydrate"; items: CartItem[]; storageAvailable: boolean }
  | { type: "add"; productId: string; variant: string }
  | { type: "quantity"; key: string; quantity: number }
  | { type: "remove"; key: string }
  | { type: "clear" }
  | { type: "storage-error" };

function parseItems(value: string | null): CartItem[] {
  if (!value) return [];
  let parsed: unknown;
  try { parsed = JSON.parse(value); } catch { return []; }
  if (!Array.isArray(parsed)) return [];
  const seen = new Set<string>();
  return parsed.flatMap((item: unknown) => {
    if (!item || typeof item !== "object") return [];
    const entry = item as Record<string, unknown>;
    if (typeof entry.productId !== "string" || !getProduct(entry.productId) || typeof entry.quantity !== "number" || !Number.isFinite(entry.quantity) || entry.quantity < 1) return [];
    const variant = DEFAULT_VARIANT;
    const key = `${entry.productId}:${variant}`;
    if (seen.has(key)) return [];
    seen.add(key);
    return [{ key, productId: entry.productId, variant, quantity: Math.min(9, Math.floor(entry.quantity)) }];
  });
}

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "hydrate": return { ...state, items: action.items, hydrated: true, storageAvailable: action.storageAvailable };
    case "storage-error": return state.storageAvailable ? { ...state, storageAvailable: false } : state;
    case "clear": return { ...state, items: [] };
    case "remove": return { ...state, items: state.items.filter((item) => item.key !== action.key) };
    case "quantity": return { ...state, items: state.items.map((item) => item.key === action.key ? { ...item, quantity: Math.max(1, Math.min(9, Math.floor(action.quantity))) } : item) };
    case "add": {
      if (!state.hydrated || !getProduct(action.productId)) return state;
      const key = `${action.productId}:${action.variant}`;
      const exists = state.items.some((item) => item.key === key);
      return { ...state, items: exists
        ? state.items.map((item) => item.key === key ? { ...item, quantity: Math.min(9, item.quantity + 1) } : item)
        : [...state.items, { key, productId: action.productId, variant: action.variant, quantity: 1 }] };
    }
  }
}

type CartContextValue = CartState & {
  count: number; subtotal: number;
  addItem: (productId: string, variant?: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
};
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], hydrated: false, storageAvailable: true });
  useEffect(() => {
    try { dispatch({ type: "hydrate", items: parseItems(localStorage.getItem(STORAGE_KEY)), storageAvailable: true }); }
    catch { dispatch({ type: "hydrate", items: [], storageAvailable: false }); }
    function sync(event: StorageEvent) {
      if (event.key !== STORAGE_KEY && event.key !== null) return;
      try { dispatch({ type: "hydrate", items: parseItems(event.newValue), storageAvailable: true }); }
      catch { /* Ignore malformed cart data from another tab. */ }
    }
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => {
    if (!state.hydrated || !state.storageAvailable) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items)); }
    catch { dispatch({ type: "storage-error" }); }
  }, [state.items, state.hydrated, state.storageAvailable]);

  const addItem = useCallback((productId: string, variant = DEFAULT_VARIANT) => dispatch({ type: "add", productId, variant }), []);
  const setQuantity = useCallback((key: string, quantity: number) => { if (Number.isFinite(quantity)) dispatch({ type: "quantity", key, quantity }); }, []);
  const removeItem = useCallback((key: string) => dispatch({ type: "remove", key }), []);
  const clearCart = useCallback(() => dispatch({ type: "clear" }), []);
  const value = useMemo(() => ({
    ...state,
    count: state.items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: state.items.reduce((sum, item) => sum + (getProduct(item.productId)?.price ?? 0) * item.quantity, 0),
    addItem, setQuantity, removeItem, clearCart,
  }), [state, addItem, setQuantity, removeItem, clearCart]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
