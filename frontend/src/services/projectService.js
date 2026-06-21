import API from "../api/compilerApi";

export const listProjects = async () => {
  const response = await API.get("/projects");
  return response.data.projects;
};

export const createProject = async (name) => {
  const response = await API.post("/projects", { name });
  return response.data.project;
};

export const renameProject = async (projectId, name) => {
  const response = await API.patch(`/projects/${projectId}`, { name });
  return response.data.project;
};

export const deleteProject = async (projectId) => {
  await API.delete(`/projects/${projectId}`);
};
