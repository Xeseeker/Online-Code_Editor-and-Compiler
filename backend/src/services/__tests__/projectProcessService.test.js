import test from "node:test";
import assert from "node:assert/strict";
import { createProject, deleteProject } from "../projectService.js";
import { getProjectPorts, runNpmUninstall, runPipInstall } from "../projectProcessService.js";

test("project process service allocates stable frontend and backend ports", async () => {
  const project = await createProject({ name: "Process ports test" });

  try {
    const first = await getProjectPorts(project.id);
    const second = await getProjectPorts(project.id);

    assert.equal(first.projectId, project.id);
    assert.equal(first.frontendPort, second.frontendPort);
    assert.equal(first.backendPort, second.backendPort);
    assert.notEqual(first.frontendPort, first.backendPort);
  } finally {
    await deleteProject(project.id);
  }
});

test("project process service validates package commands", async () => {
  const project = await createProject({ name: "Process validation test" });

  try {
    await assert.rejects(
      () => runNpmUninstall(project.id, { target: "frontend", packageName: "" }),
      /Package name is required/,
    );
    await assert.rejects(
      () => runPipInstall(project.id, { packageName: "" }),
      /Package name is required/,
    );
  } finally {
    await deleteProject(project.id);
  }
});
