import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { setupSocketHandlers } from "./services/socket.service";

dotenv.config();

const app = express();
const httpServer = createServer(app);

// CORS configuration
const corsOptions = {
  origin: (process.env.CORS_ORIGIN || "http://localhost:5173").replace(
    /\/$/,
    ""
  ),
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: corsOptions.origin,
    credentials: true,
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
  pingInterval: 25000,
  pingTimeout: 60000,
  path: "/socket.io/",
  upgradeTimeout: 10000,
  maxHttpBufferSize: 1e6,
});

// Setup socket event handlers
setupSocketHandlers(io);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "webrtc-signaling-server" });
});

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(`WebRTC Signaling Server running on port ${PORT}`);
});
