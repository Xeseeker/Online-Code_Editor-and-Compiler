import express from "express";
import {
  getFile,
  getTree,
  patchEntry,
  postFile,
  postFolder,
  putFile,
  removeEntry,
} from "../controllers/fileController.js";

const router = express.Router({ mergeParams: true });

router.get("/tree", getTree);
router.get("/content", getFile);
router.put("/content", putFile);
router.post("/file", postFile);
router.post("/folder", postFolder);
router.patch("/entry", patchEntry);
router.delete("/entry", removeEntry);

export default router;
