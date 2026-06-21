import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, "../../workspace/projects");
const metadataFile = path.resolve(__dirname, "../../workspace/projects.json");

const now = () => new Date().toISOString();

const ensureWorkspace = async () => {
  await fs.mkdir(workspaceRoot, { recursive: true });
  try {
    await fs.access(metadataFile);
  } catch {
    await fs.mkdir(path.dirname(metadataFile), { recursive: true });
    await fs.writeFile(metadataFile, "[]\n");
  }
};

const readMetadata = async () => {
  await ensureWorkspace();
  const data = await fs.readFile(metadataFile, "utf8");
  return JSON.parse(data || "[]");
};

const writeMetadata = async (projects) => {
  await fs.writeFile(metadataFile, `${JSON.stringify(projects, null, 2)}\n`);
};

export const getProjectPath = (projectId) => path.join(workspaceRoot, projectId);

const writeProjectManifest = async (project) => {
  await fs.writeFile(
    path.join(getProjectPath(project.id), ".workspace"),
    `${JSON.stringify(project, null, 2)}\n`,
  );
};

const createStarterFiles = async (project) => {
  const projectPath = getProjectPath(project.id);
  await fs.mkdir(path.join(projectPath, "frontend", "src"), { recursive: true });
  await fs.mkdir(path.join(projectPath, "backend", "src"), { recursive: true });

  await fs.writeFile(
    path.join(projectPath, "README.md"),
    `# ${project.name}\n\nFull-stack workspace created by the online IDE.\n`,
  );
  await fs.writeFile(
    path.join(projectPath, "frontend", "package.json"),
    `${JSON.stringify(
      {
        scripts: { dev: "vite --host 0.0.0.0", build: "vite build" },
        dependencies: {
          "@vitejs/plugin-react": "latest",
          vite: "latest",
          react: "latest",
          "react-dom": "latest",
        },
        devDependencies: {},
      },
      null,
      2,
    )}\n`,
  );
  await fs.writeFile(
    path.join(projectPath, "frontend", "index.html"),
    "<div id='root'></div><script type='module' src='/src/main.jsx'></script>\n",
  );
  await fs.writeFile(
    path.join(projectPath, "frontend", "vite.config.js"),
    "import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({ plugins: [react()] });\n",
  );
  await fs.writeFile(
    path.join(projectPath, "frontend", "src", "main.jsx"),
    "import React from 'react';\nimport { createRoot } from 'react-dom/client';\n\ncreateRoot(document.getElementById('root')).render(<h1>Hello workspace</h1>);\n",
  );
  await fs.writeFile(
    path.join(projectPath, "backend", "package.json"),
    `${JSON.stringify(
      {
        scripts: { dev: "node src/server.js", start: "node src/server.js" },
        dependencies: { express: "latest", cors: "latest", dotenv: "latest" },
      },
      null,
      2,
    )}\n`,
  );
  await fs.writeFile(path.join(projectPath, "backend", ".env"), "PORT=3001\n");
  await fs.writeFile(
    path.join(projectPath, "backend", "src", "server.js"),
    "import express from 'express';\nimport cors from 'cors';\n\nconst app = express();\napp.use(cors());\napp.use(express.json());\napp.get('/api/health', (req, res) => res.json({ ok: true }));\n\nconst port = process.env.PORT || 3001;\napp.listen(port, () => console.log(`Backend running on ${port}`));\n",
  );
};

export const listProjects = async () => readMetadata();

export const createProject = async ({ name }) => {
  if (!name?.trim()) {
    const error = new Error("Project name is required");
    error.statusCode = 400;
    throw error;
  }

  const projects = await readMetadata();
  const timestamp = now();
  const project = {
    id: randomUUID(),
    name: name.trim(),
    createdAt: timestamp,
    lastModifiedAt: timestamp,
  };

  await fs.mkdir(getProjectPath(project.id), { recursive: true });
  await createStarterFiles(project);
  await writeProjectManifest(project);
  projects.push(project);
  await writeMetadata(projects);
  return project;
};

export const openProject = async (projectId) => {
  const projects = await readMetadata();
  const project = projects.find((item) => item.id === projectId);

  if (!project) {
    const error = new Error("Project not found");
    error.statusCode = 404;
    throw error;
  }

  return project;
};

export const touchProject = async (projectId) => {
  const projects = await readMetadata();
  const project = projects.find((item) => item.id === projectId);

  if (!project) return null;

  project.lastModifiedAt = now();
  await writeMetadata(projects);
  await writeProjectManifest(project);
  return project;
};

export const renameProject = async (projectId, { name }) => {
  if (!name?.trim()) {
    const error = new Error("Project name is required");
    error.statusCode = 400;
    throw error;
  }

  const projects = await readMetadata();
  const project = projects.find((item) => item.id === projectId);

  if (!project) {
    const error = new Error("Project not found");
    error.statusCode = 404;
    throw error;
  }

  project.name = name.trim();
  project.lastModifiedAt = now();
  await writeMetadata(projects);
  await writeProjectManifest(project);
  return project;
};

export const deleteProject = async (projectId) => {
  const projects = await readMetadata();
  const nextProjects = projects.filter((item) => item.id !== projectId);

  if (nextProjects.length === projects.length) {
    const error = new Error("Project not found");
    error.statusCode = 404;
    throw error;
  }

  await fs.rm(getProjectPath(projectId), { recursive: true, force: true });
  await writeMetadata(nextProjects);
};
