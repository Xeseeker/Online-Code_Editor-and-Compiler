import { spawn } from "node:child_process";

const processes = new Map();

const appendLog = (record, chunk) => {
  record.logs += chunk.toString();
  if (record.logs.length > 20000) {
    record.logs = record.logs.slice(-20000);
  }
};

export const startProcess = ({ id, projectId, name, command, args = [], cwd, env = {}, port }) => {
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
    projectId,
    name,
    command,
    args,
    cwd,
    pid: child.pid,
    status: "running",
    port: port || (env.PORT ? Number(env.PORT) : undefined),
    startedAt: new Date().toISOString(),
    exitCode: null,
    logs: "",
    child,
  };

  child.stdout?.on("data", (chunk) => appendLog(record, chunk));
  child.stderr?.on("data", (chunk) => appendLog(record, chunk));
  child.on("error", (error) => {
    record.status = "errored";
    appendLog(record, `${error.message}\n`);
  });
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

export const getProcess = (id) => {
  const record = processes.get(id);
  if (!record) return null;
  const { child, ...snapshot } = record;
  return snapshot;
};

export const listProcesses = (projectId) =>
  Array.from(processes.values())
    .filter((record) => !projectId || record.projectId === projectId)
    .map(({ child, ...record }) => record);
