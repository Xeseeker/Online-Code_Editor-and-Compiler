import API from "../api/compilerApi";

export const getFileTree = async (projectId) => {
  const response = await API.get(`/projects/${projectId}/files/tree`);
  return response.data.tree;
};

export const readFile = async (projectId, path) => {
  const response = await API.get(`/projects/${projectId}/files/content`, { params: { path } });
  return response.data;
};

export const saveFile = async (projectId, path, content) => {
  const response = await API.put(`/projects/${projectId}/files/content`, { path, content });
  return response.data.file;
};

export const createFile = async (projectId, path, content = "") => {
  const response = await API.post(`/projects/${projectId}/files/file`, { path, content });
  return response.data.file;
};

export const createFolder = async (projectId, path) => {
  const response = await API.post(`/projects/${projectId}/files/folder`, { path });
  return response.data.folder;
};

export const renameEntry = async (projectId, fromPath, toPath) => {
  const response = await API.patch(`/projects/${projectId}/files/entry`, { fromPath, toPath });
  return response.data.entry;
};

export const moveEntry = async (projectId, fromPath, toPath) => {
  const response = await API.patch(`/projects/${projectId}/files/entry`, { action: "move", fromPath, toPath });
  return response.data.entry;
};

export const deleteEntry = async (projectId, path) => {
  await API.delete(`/projects/${projectId}/files/entry`, { params: { path } });
};
