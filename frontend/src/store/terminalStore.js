import { create } from "zustand";

export const useTerminalStore = create((set) => ({
  terminals: [],
  activeTerminalId: "",
  addTerminal: (terminalId) =>
    set((state) => ({
      terminals: state.terminals.includes(terminalId) ? state.terminals : [...state.terminals, terminalId],
      activeTerminalId: terminalId,
    })),
  setActiveTerminal: (terminalId) => set({ activeTerminalId: terminalId }),
  removeTerminal: (terminalId) =>
    set((state) => ({
      terminals: state.terminals.filter((id) => id !== terminalId),
      activeTerminalId: state.activeTerminalId === terminalId ? state.terminals[0] || "" : state.activeTerminalId,
    })),
}));
