import API from "../api/compilerApi";

export const getPorts = async (projectId) => {
  const response = await API.get(`/projects/${projectId}/ports`);
  return response.data.ports;
};

export const getProcesses = async (projectId) => {
  const response = await API.get(`/projects/${projectId}/processes`);
  return response.data.processes;
};

export const runNpmInstall = async (projectId, target, packageName = "") => {
  const response = await API.post(`/projects/${projectId}/npm/install`, { target, packageName });
  return response.data.process;
};

export const runNpmScript = async (projectId, target, script) => {
  const response = await API.post(`/projects/${projectId}/npm/run`, { target, script });
  return response.data.process;
};

export const stopProcess = async (projectId, processId) => {
  await API.delete(`/projects/${projectId}/processes/${encodeURIComponent(processId)}`);
};
