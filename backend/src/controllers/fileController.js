import {
  createFile,
  createFolder,
  deleteEntry,
  getFileTree,
  moveEntry,
  readFile,
  renameEntry,
  writeFile,
} from "../workspace/fileService.js";

const handleError = (res, error) => {
  res.status(error.statusCode || 500).json({ error: error.message || "File operation failed" });
};

export const getTree = async (req, res) => {
  try {
    res.json({ tree: await getFileTree(req.params.projectId) });
  } catch (error) {
    handleError(res, error);
  }
};

export const getFile = async (req, res) => {
  try {
    res.json({ path: req.query.path, content: await readFile(req.params.projectId, req.query.path) });
  } catch (error) {
    handleError(res, error);
  }
};

export const putFile = async (req, res) => {
  try {
    res.json({ file: await writeFile(req.params.projectId, req.body.path, req.body.content) });
  } catch (error) {
    handleError(res, error);
  }
};

export const postFile = async (req, res) => {
  try {
    res.status(201).json({ file: await createFile(req.params.projectId, req.body.path, req.body.content) });
  } catch (error) {
    handleError(res, error);
  }
};

export const postFolder = async (req, res) => {
  try {
    res.status(201).json({ folder: await createFolder(req.params.projectId, req.body.path) });
  } catch (error) {
    handleError(res, error);
  }
};

export const patchEntry = async (req, res) => {
  try {
    const action = req.body.action === "move" ? moveEntry : renameEntry;
    res.json({ entry: await action(req.params.projectId, req.body.fromPath, req.body.toPath) });
  } catch (error) {
    handleError(res, error);
  }
};

export const removeEntry = async (req, res) => {
  try {
    await deleteEntry(req.params.projectId, req.query.path);
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
};
