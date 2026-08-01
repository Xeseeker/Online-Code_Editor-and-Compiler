import express from "express";
import {
  deleteProcess,
  getPorts,
  getProcess,
  getProcesses,
  postNpmInstall,
  postNpmScript,
  postNpmUninstall,
  postPipInstall,
  postPipUninstall,
} from "../controllers/projectProcessController.js";

const router = express.Router({ mergeParams: true });

router.get("/ports", getPorts);
router.get("/processes", getProcesses);
router.get("/processes/:processId", getProcess);
router.delete("/processes/:processId", deleteProcess);
router.post("/npm/install", postNpmInstall);
router.post("/npm/uninstall", postNpmUninstall);
router.post("/npm/run", postNpmScript);
router.post("/pip/install", postPipInstall);
router.post("/pip/uninstall", postPipUninstall);

export default router;
