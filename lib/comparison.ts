import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CompareItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number | null;
  isPromo?: boolean;
  image: string;
  brand: string;
  rating: number;
  reviewCount: number;
  specs?: { key: string; value: string }[];
}

interface ComparisonState {
  items: CompareItem[];
  addItem: (item: CompareItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: CompareItem) => boolean;
  isComparing: (id: string) => boolean;
  clearAll: () => void;
  canAdd: () => boolean;
}

export const useComparisonStore = create<ComparisonState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          if (state.items.find((i) => i.id === item.id)) return state;
          if (state.items.length >= 4) return state;
          return { items: [...state.items, item] };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },

      toggleItem: (item) => {
        const exists = get().items.find((i) => i.id === item.id);
        if (exists) {
          get().removeItem(item.id);
          return false;
        } else {
          if (get().items.length >= 4) return false;
          get().addItem(item);
          return true;
        }
      },

      isComparing: (id) => {
        return get().items.some((i) => i.id === id);
      },

      clearAll: () => set({ items: [] }),

      canAdd: () => get().items.length < 4,
    }),
    {
      name: "HAUSAURA-comparison",
      // persist middleware handles cross-tab sync via storage event automatically
    }
  )
);
