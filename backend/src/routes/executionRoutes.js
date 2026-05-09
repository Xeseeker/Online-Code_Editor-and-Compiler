import express from "express";
import { executeCode } from "../controllers/executionController.js";

const router = express.Router();

router.post("/execute", executeCode);
router.get("/execute", (req, res) => {
  res.send("Execute route working");
});
export default router;
