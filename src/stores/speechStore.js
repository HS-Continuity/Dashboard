import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useSpeechStore = create(
  persist(
    set => ({
      isSpeechEnabled: false,
      setIsSpeechEnabled: value => set({ isSpeechEnabled: value }),
    }),
    {
      name: "speech-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
