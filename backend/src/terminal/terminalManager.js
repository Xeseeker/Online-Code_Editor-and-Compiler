import os from "node:os";
import pty from "node-pty";
import { resolveProjectPath } from "../workspace/fileService.js";

const sessions = new Map();

const getShell = () => (os.platform() === "win32" ? "powershell.exe" : "bash");

export const createTerminal = ({ projectId, terminalId, cols = 80, rows = 24 }) => {
  const existing = sessions.get(terminalId);
  if (existing) return existing;

  const terminalProcess = pty.spawn(getShell(), [], {
    name: "xterm-color",
    cols,
    rows,
    cwd: resolveProjectPath(projectId),
    env: process.env,
  });

  const session = { id: terminalId, projectId, process: terminalProcess, createdAt: new Date().toISOString() };
  sessions.set(terminalId, session);
  terminalProcess.onExit(() => sessions.delete(terminalId));
  return session;
};

export const writeTerminal = (terminalId, data) => {
  sessions.get(terminalId)?.process.write(data);
};

export const resizeTerminal = (terminalId, cols, rows) => {
  sessions.get(terminalId)?.process.resize(cols, rows);
};

export const clearTerminal = (terminalId) => {
  sessions.get(terminalId)?.process.write("\x1bc");
};

export const closeTerminal = (terminalId) => {
  sessions.get(terminalId)?.process.kill();
  sessions.delete(terminalId);
};
