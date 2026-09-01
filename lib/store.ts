import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  brand?: string;
  quantity: number;

}

export interface CouponData {
  code: string;
  discountPercent: number;
  label: string;
}

interface CartState {
  items: CartItem[];
  coupon: CouponData | null;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: CouponData) => void;
  removeCoupon: () => void;
  updatePrice: (id: string, price: number) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      coupon: null,

      addItem: (item, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          const qty = Math.max(1, quantity);

          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + qty }
                  : i
              ),
            };
          }

          return {
            items: [...state.items, { ...item, quantity: qty }],
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id
              ? { ...i, quantity: Math.max(1, quantity) }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [], coupon: null }),

      applyCoupon: (coupon) => set({ coupon }),

      removeCoupon: () => set({ coupon: null }),

      updatePrice: (id, price) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, price } : i
          ),
        }));
      },
    }),
    {
      name: "HAUSAURA-cart",
    }
  )
);

export const selectItemCount = (state: CartState) =>
  state.items.reduce((count, item) => count + item.quantity, 0);

export const selectTotal = (state: CartState) =>
  state.items.reduce((total, item) => total + item.price * item.quantity, 0);
