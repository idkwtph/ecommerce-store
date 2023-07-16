import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { Product } from "@/types";
import toast from "react-hot-toast";

interface CartStore {
  items: Product[];
  addItem: (data: Product) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      addItem: (data: Product) => {
        toast.loading("Adding item to cart.");
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === data.id);

        if (existingItem) {
          toast.remove();
          return toast("Item already in cart.");
        }

        set({ items: [...get().items, data] });
        toast.remove();
        toast.success("Item added to cart.");
      },
      removeItem: (id: string) => {
        toast.loading("Removing item from cart.");
        set({ items: [...get().items.filter((item) => item.id !== id)] });
        toast.remove();
        toast.success("Item removed from cart.");
      },
      removeAll: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;
