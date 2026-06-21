import { create } from "zustand";

export const useEditorStore = create((set) => ({
  output: "",
  isRunning: false,
  setOutput: (output) => set({ output }),
  setIsRunning: (isRunning) => set({ isRunning }),
}));
