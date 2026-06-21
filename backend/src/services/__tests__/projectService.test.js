import test from "node:test";
import assert from "node:assert/strict";
import { createProject, deleteProject, listProjects, renameProject } from "../projectService.js";
import { createFile, getFileTree, readFile, writeFile } from "../../workspace/fileService.js";

test("project service creates, renames, lists, and deletes workspaces", async () => {
  const project = await createProject({ name: "Workspace test" });

  try {
    assert.ok(project.id);
    assert.equal(project.name, "Workspace test");

    const renamed = await renameProject(project.id, { name: "Renamed workspace" });
    assert.equal(renamed.name, "Renamed workspace");

    const projects = await listProjects();
    assert.ok(projects.some((item) => item.id === project.id));
  } finally {
    await deleteProject(project.id);
  }
});

test("file service handles nested files inside a project", async () => {
  const project = await createProject({ name: "File service test" });

  try {
    await createFile(project.id, "frontend/src/extra.js", "console.log('extra');");
    assert.equal(await readFile(project.id, "frontend/src/extra.js"), "console.log('extra');");

    await writeFile(project.id, "frontend/src/extra.js", "console.log('updated');");
    assert.equal(await readFile(project.id, "frontend/src/extra.js"), "console.log('updated');");

    const tree = await getFileTree(project.id);
    assert.equal(tree.type, "folder");
    assert.ok(tree.children.some((child) => child.name === "frontend"));
  } finally {
    await deleteProject(project.id);
  }
});
