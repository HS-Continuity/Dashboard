import { create } from "zustand";

const getFontSizeFromStorage = () => {
  const stored = localStorage.getItem("font-size");
  return stored ? parseInt(stored, 10) : 16;
};

export const useFontSizeStore = create(set => ({
  fontSize: getFontSizeFromStorage(),
  setFontSize: size => {
    localStorage.setItem("font-size", size.toString());
    set({ fontSize: size });
    document.documentElement.style.fontSize = `${size}px`;
  },
}));
