import { create } from "zustand";

export const usePlayerStore = create((set) => ({
  role: null,

  setRole: (role) => set({ role }),

  clearRole: () => set({ role: null }),
}));