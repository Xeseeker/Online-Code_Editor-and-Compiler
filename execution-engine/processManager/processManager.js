import { spawn } from "node:child_process";

const processes = new Map();

export const startProcess = ({ id, command, args = [], cwd, env = {} }) => {
  if (processes.has(id)) {
    return processes.get(id);
  }

  const child = spawn(command, args, {
    cwd,
    env: { ...process.env, ...env },
    shell: true,
  });

  const record = {
    id,
    pid: child.pid,
    status: "running",
    port: env.PORT ? Number(env.PORT) : undefined,
    startedAt: new Date().toISOString(),
    child,
  };

  child.on("exit", (code) => {
    record.status = "exited";
    record.exitCode = code;
  });

  processes.set(id, record);
  return record;
};

export const stopProcess = (id) => {
  const record = processes.get(id);
  if (!record) return false;
  record.child.kill();
  record.status = "stopped";
  return true;
};

export const listProcesses = () =>
  Array.from(processes.values()).map(({ child, ...record }) => record);
