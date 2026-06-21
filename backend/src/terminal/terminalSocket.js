import { randomUUID } from "node:crypto";
import {
  clearTerminal,
  closeTerminal,
  createTerminal,
  resizeTerminal,
  writeTerminal,
} from "./terminalManager.js";

export const attachTerminalSocket = (io) => {
  io.on("connection", (socket) => {
    socket.on("terminal:create", ({ projectId, terminalId = randomUUID(), cols, rows }) => {
      const session = createTerminal({ projectId, terminalId, cols, rows });
      socket.join(terminalId);
      session.process.onData((data) => socket.emit("terminal:data", { terminalId, data }));
      socket.emit("terminal:ready", { terminalId });
    });

    socket.on("terminal:input", ({ terminalId, data }) => writeTerminal(terminalId, data));
    socket.on("terminal:resize", ({ terminalId, cols, rows }) => resizeTerminal(terminalId, cols, rows));
    socket.on("terminal:clear", ({ terminalId }) => clearTerminal(terminalId));
    socket.on("terminal:close", ({ terminalId }) => closeTerminal(terminalId));
  });
};
