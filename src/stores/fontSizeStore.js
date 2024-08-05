import { create } from "zustand";

const getTableFontSizeFromStorage = () => {
  const stored = localStorage.getItem("table-font-size");
  return stored ? parseInt(stored, 10) : 16;
};

export const useFontSizeStore = create(set => ({
  tableFontSize: getTableFontSizeFromStorage(),
  setTableFontSize: size => {
    localStorage.setItem("table-font-size", size.toString());
    set({ tableFontSize: size });
  },
}));
