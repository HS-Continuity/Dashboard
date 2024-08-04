import { create } from "zustand";

const getFontSizeFromStorage = () => {
  const stored = localStorage.getItem("font-size");
  return stored ? parseInt(stored, 10) : 16;
};

export const useFontSizeStore = create((set, get) => ({
  fontSize: getFontSizeFromStorage(),
  isEasyView: false,
  setFontSize: size => {
    const { isEasyView } = get();
    if (!isEasyView) {
      localStorage.setItem("font-size", size.toString());
      set({ fontSize: size });
      document.documentElement.style.fontSize = `${size}px`;
    }
  },
  setIsEasyView: isEasy => {
    set({ isEasyView: isEasy });
    if (isEasy) {
      set({ fontSize: 18 });
      document.documentElement.style.fontSize = "18px";
    } else {
      const storedSize = getFontSizeFromStorage();
      set({ fontSize: storedSize });
      document.documentElement.style.fontSize = `${storedSize}px`;
    }
  },
}));
