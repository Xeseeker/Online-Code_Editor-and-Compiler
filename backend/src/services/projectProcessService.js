import { randomUUID } from "node:crypto";
import os from "node:os";
import path from "node:path";
import {
  getProcess,
  listProcesses,
  startProcess,
  stopProcess,
} from "../../../execution-engine/processManager/processManager.js";
import { getPorts } from "./portService.js";
import { openProject } from "./projectService.js";
import { resolveProjectPath } from "../workspace/fileService.js";

const npmCommand = os.platform() === "win32" ? "npm.cmd" : "npm";
const pipCommand = os.platform() === "win32" ? "pip.exe" : "pip";
const allowedTargets = new Set(["frontend", "backend"]);

const assertTarget = (target) => {
  if (!allowedTargets.has(target)) {
    const error = new Error("Target must be frontend or backend");
    error.statusCode = 400;
    throw error;
  }
};

const getTargetCwd = (projectId, target) => {
  assertTarget(target);
  return resolveProjectPath(projectId, target);
};

const createRecord = ({ projectId, target, name, command, args, cwd, env, port }) => {
  const id = `${projectId}:${target}:${name}:${randomUUID()}`;
  return startProcess({ id, projectId, name: `${target} ${name}`, command, args, cwd, env, port });
};

export const getProjectPorts = async (projectId) => {
  await openProject(projectId);
  return getPorts(projectId);
};

export const listProjectProcesses = async (projectId) => {
  await openProject(projectId);
  return listProcesses(projectId);
};

export const getProjectProcess = async (projectId, processId) => {
  await openProject(projectId);
  const process = getProcess(processId);

  if (!process || process.projectId !== projectId) {
    const error = new Error("Process not found");
    error.statusCode = 404;
    throw error;
  }

  return process;
};

export const stopProjectProcess = async (projectId, processId) => {
  await openProject(projectId);
  if (!stopProcess(processId)) {
    const error = new Error("Process not found");
    error.statusCode = 404;
    throw error;
  }
};

export const runNpmInstall = async (projectId, { target, packageName }) => {
  await openProject(projectId);
  const cwd = getTargetCwd(projectId, target);
  const args = ["install"];
  if (packageName?.trim()) args.push(packageName.trim());
  return createRecord({ projectId, target, name: "npm install", command: npmCommand, args, cwd });
};

export const runNpmUninstall = async (projectId, { target, packageName }) => {
  if (!packageName?.trim()) {
    const error = new Error("Package name is required");
    error.statusCode = 400;
    throw error;
  }

  await openProject(projectId);
  const cwd = getTargetCwd(projectId, target);
  return createRecord({
    projectId,
    target,
    name: "npm uninstall",
    command: npmCommand,
    args: ["uninstall", packageName.trim()],
    cwd,
  });
};

export const runNpmScript = async (projectId, { target, script = "dev" }) => {
  await openProject(projectId);
  const ports = getPorts(projectId);
  const cwd = getTargetCwd(projectId, target);
  const port = target === "frontend" ? ports.frontendPort : ports.backendPort;
  const args = ["run", script];

  if (script === "dev" && target === "frontend") {
    args.push("--", "--host", "0.0.0.0", "--port", String(port));
  }

  return createRecord({
    projectId,
    target,
    name: `npm run ${script}`,
    command: npmCommand,
    args,
    cwd,
    env: { PORT: String(port) },
    port,
  });
};

export const runPipInstall = async (projectId, { packageName }) => {
  if (!packageName?.trim()) {
    const error = new Error("Package name is required");
    error.statusCode = 400;
    throw error;
  }

  await openProject(projectId);
  return createRecord({
    projectId,
    target: "backend",
    name: "pip install",
    command: pipCommand,
    args: ["install", packageName.trim()],
    cwd: path.join(resolveProjectPath(projectId), "backend"),
  });
};

export const runPipUninstall = async (projectId, { packageName }) => {
  if (!packageName?.trim()) {
    const error = new Error("Package name is required");
    error.statusCode = 400;
    throw error;
  }

  await openProject(projectId);
  return createRecord({
    projectId,
    target: "backend",
    name: "pip uninstall",
    command: pipCommand,
    args: ["uninstall", "-y", packageName.trim()],
    cwd: path.join(resolveProjectPath(projectId), "backend"),
  });
};
