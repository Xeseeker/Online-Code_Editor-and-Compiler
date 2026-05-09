import express from "express";
import cors from "cors";
import executionRoutes from "./routes/executionRoutes.js";


const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", executionRoutes);

app.get("/ping", (req, res) => {
  res.json({ message: "Server working" });
});

export default app;
