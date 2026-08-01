import express from "express";
import cors from "cors";
import executionRoutes from "./routes/executionRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import projectProcessRoutes from "./routes/projectProcessRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", executionRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/projects/:projectId/files", fileRoutes);
app.use("/api/projects/:projectId", projectProcessRoutes);

app.get("/ping", (req, res) => {
  res.json({ message: "Server working" });
});

export default app;
