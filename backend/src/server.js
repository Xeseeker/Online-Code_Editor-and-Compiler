import { createServer } from "node:http";
import { Server } from "socket.io";
import app from "./app.js";
import { registerSockets } from "./sockets/index.js";

const PORT = process.env.PORT || 5000;
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
});

registerSockets(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
