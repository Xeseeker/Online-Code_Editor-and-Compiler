import { attachTerminalSocket } from "../terminal/terminalSocket.js";

export const registerSockets = (io) => {
  attachTerminalSocket(io);
};
