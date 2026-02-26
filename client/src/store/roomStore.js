import { create } from "zustand";

export const useRoomStore = create((set) => ({
  room: null,

  setRoom: (roomData) => set({ room: roomData }),

  clearRoom: () => set({ room: null }),
}));