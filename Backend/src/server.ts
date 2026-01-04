import express, { type Request, type Response } from "express";
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
  origin: (
    process.env.CORS_ORIGIN ||
    process.env.FRONTEND_URL ||
    "http://localhost:5173"
  )
    .split(",")
    .map((url) => url.trim()),
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: corsOptions.origin,
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
  pingInterval: 25000,
  pingTimeout: 60000,
  path: "/socket.io/",
  upgradeTimeout: 10000,
  maxHttpBufferSize: 1e6,
  serveClient: true,
  connectTimeout: 45000,
  allowUpgrades: true,
  perMessageDeflate: {
    threshold: 16384,
  },
  // Removed handlePreflightRequest as it's not a valid Socket.IO server option.
});

// Setup socket event handlers
setupSocketHandlers(io);

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", service: "webrtc-signaling-server" });
});

const PORT = Number(process.env.PORT) || 4000;
const HOST = process.env.HOST || "0.0.0.0";

httpServer.listen(PORT, HOST, () => {
  console.log(`WebRTC Signaling Server running on ${HOST}:${PORT}`);
  console.log(`CORS Origin: ${corsOptions.origin}`);
  console.log(`WebSocket path: /socket.io/`);
});
