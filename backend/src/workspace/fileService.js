import fs from "node:fs/promises";
import path from "node:path";
import { getProjectPath, touchProject } from "../services/projectService.js";

const normalizeRelativePath = (targetPath = "") => {
  const normalized = path.normalize(targetPath).replace(/^(\.\.(\/|\\|$))+/, "");
  return normalized === "." ? "" : normalized;
};

export const resolveProjectPath = (projectId, targetPath = "") => {
  const root = getProjectPath(projectId);
  const resolved = path.resolve(root, normalizeRelativePath(targetPath));

  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    const error = new Error("Path escapes project workspace");
    error.statusCode = 400;
    throw error;
  }

  return resolved;
};

const toTree = async (absolutePath, rootPath) => {
  const stat = await fs.stat(absolutePath);
  const name = path.basename(absolutePath);
  const relativePath = path.relative(rootPath, absolutePath).replaceAll(path.sep, "/");

  if (!stat.isDirectory()) {
    return { name, path: relativePath, type: "file", lastModifiedAt: stat.mtime.toISOString(), size: stat.size };
  }

  const entries = await fs.readdir(absolutePath);
  const children = await Promise.all(entries.map((entry) => toTree(path.join(absolutePath, entry), rootPath)));
  children.sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === "folder" ? -1 : 1));

  return { name: relativePath ? name : "project", path: relativePath, type: "folder", children };
};

export const getFileTree = async (projectId) => {
  const root = resolveProjectPath(projectId);
  return toTree(root, root);
};

export const readFile = async (projectId, filePath) => {
  const resolved = resolveProjectPath(projectId, filePath);
  const stat = await fs.stat(resolved);

  if (!stat.isFile()) {
    const error = new Error("Path is not a file");
    error.statusCode = 400;
    throw error;
  }

  return fs.readFile(resolved, "utf8");
};

export const writeFile = async (projectId, filePath, content = "") => {
  const resolved = resolveProjectPath(projectId, filePath);
  await fs.mkdir(path.dirname(resolved), { recursive: true });
  await fs.writeFile(resolved, content);
  await touchProject(projectId);
  return { path: normalizeRelativePath(filePath).replaceAll(path.sep, "/") };
};

export const createFile = async (projectId, filePath, content = "") => {
  const resolved = resolveProjectPath(projectId, filePath);
  await fs.mkdir(path.dirname(resolved), { recursive: true });
  await fs.writeFile(resolved, content, { flag: "wx" });
  await touchProject(projectId);
  return { path: normalizeRelativePath(filePath).replaceAll(path.sep, "/") };
};

export const createFolder = async (projectId, folderPath) => {
  await fs.mkdir(resolveProjectPath(projectId, folderPath), { recursive: true });
  await touchProject(projectId);
  return { path: normalizeRelativePath(folderPath).replaceAll(path.sep, "/") };
};

export const renameEntry = async (projectId, fromPath, toPath) => {
  await fs.rename(resolveProjectPath(projectId, fromPath), resolveProjectPath(projectId, toPath));
  await touchProject(projectId);
  return { path: normalizeRelativePath(toPath).replaceAll(path.sep, "/") };
};

export const moveEntry = renameEntry;

export const deleteEntry = async (projectId, targetPath) => {
  await fs.rm(resolveProjectPath(projectId, targetPath), { recursive: true, force: true });
  await touchProject(projectId);
};
