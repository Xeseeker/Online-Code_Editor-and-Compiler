import {
  createProject,
  deleteProject,
  listProjects,
  openProject,
  renameProject,
} from "../services/projectService.js";

const handleError = (res, error) => {
  res.status(error.statusCode || 500).json({ error: error.message || "Project error" });
};

export const getProjects = async (req, res) => {
  try {
    res.json({ projects: await listProjects() });
  } catch (error) {
    handleError(res, error);
  }
};

export const postProject = async (req, res) => {
  try {
    res.status(201).json({ project: await createProject(req.body) });
  } catch (error) {
    handleError(res, error);
  }
};

export const getProject = async (req, res) => {
  try {
    res.json({ project: await openProject(req.params.projectId) });
  } catch (error) {
    handleError(res, error);
  }
};

export const patchProject = async (req, res) => {
  try {
    res.json({ project: await renameProject(req.params.projectId, req.body) });
  } catch (error) {
    handleError(res, error);
  }
};

export const removeProject = async (req, res) => {
  try {
    await deleteProject(req.params.projectId);
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
};
