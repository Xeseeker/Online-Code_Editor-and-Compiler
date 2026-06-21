import express from "express";
import {
  getProject,
  getProjects,
  patchProject,
  postProject,
  removeProject,
} from "../controllers/projectController.js";

const router = express.Router();

router.get("/", getProjects);
router.post("/", postProject);
router.get("/:projectId", getProject);
router.patch("/:projectId", patchProject);
router.delete("/:projectId", removeProject);

export default router;
