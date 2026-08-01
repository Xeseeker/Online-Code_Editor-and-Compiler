import {
  getProjectPorts,
  getProjectProcess,
  listProjectProcesses,
  runNpmInstall,
  runNpmScript,
  runNpmUninstall,
  runPipInstall,
  runPipUninstall,
  stopProjectProcess,
} from "../services/projectProcessService.js";

const handleError = (res, error) => {
  res.status(error.statusCode || 500).json({ error: error.message || "Process operation failed" });
};

export const getPorts = async (req, res) => {
  try {
    res.json({ ports: await getProjectPorts(req.params.projectId) });
  } catch (error) {
    handleError(res, error);
  }
};

export const getProcesses = async (req, res) => {
  try {
    res.json({ processes: await listProjectProcesses(req.params.projectId) });
  } catch (error) {
    handleError(res, error);
  }
};

export const getProcess = async (req, res) => {
  try {
    res.json({ process: await getProjectProcess(req.params.projectId, req.params.processId) });
  } catch (error) {
    handleError(res, error);
  }
};

export const postNpmInstall = async (req, res) => {
  try {
    res.status(202).json({ process: await runNpmInstall(req.params.projectId, req.body) });
  } catch (error) {
    handleError(res, error);
  }
};

export const postNpmUninstall = async (req, res) => {
  try {
    res.status(202).json({ process: await runNpmUninstall(req.params.projectId, req.body) });
  } catch (error) {
    handleError(res, error);
  }
};

export const postNpmScript = async (req, res) => {
  try {
    res.status(202).json({ process: await runNpmScript(req.params.projectId, req.body) });
  } catch (error) {
    handleError(res, error);
  }
};

export const postPipInstall = async (req, res) => {
  try {
    res.status(202).json({ process: await runPipInstall(req.params.projectId, req.body) });
  } catch (error) {
    handleError(res, error);
  }
};

export const postPipUninstall = async (req, res) => {
  try {
    res.status(202).json({ process: await runPipUninstall(req.params.projectId, req.body) });
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteProcess = async (req, res) => {
  try {
    await stopProjectProcess(req.params.projectId, req.params.processId);
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
};
