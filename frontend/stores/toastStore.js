import { create } from "zustand";

export const useToastStore = create((set) => ({
  title: "",
  message: "",
  type: "info", // 'success' | 'error' | 'info' | 'warning'
  show: false,
  time: 2000,
  showToast: (title, message, type, time) => {
    set({ title, message, type, show: true, time: time || 2000 });
  },
  hideToast: () => {
    set({ show: false });
  },
}));
