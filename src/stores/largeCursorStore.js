import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useLargeCursorStore = create(
  persist(
    set => ({
      isLargeCursor: false,
      setIsLargeCursor: value => set({ isLargeCursor: value }),
    }),
    {
      name: "large-cursor-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
