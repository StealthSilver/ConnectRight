"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_service_1 = require("./services/socket.service");
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
// CORS configuration
const corsOptions = {
    origin: (process.env.CORS_ORIGIN ||
        process.env.FRONTEND_URL ||
        "http://localhost:5173").replace(/\/$/, ""),
    credentials: true,
    methods: ["GET", "POST"],
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
// Socket.io setup
const io = new socket_io_1.Server(httpServer, {
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
    serveClient: true,
    connectTimeout: 45000,
    allowUpgrades: true,
    perMessageDeflate: {
        threshold: 16384,
    },
});
// Setup socket event handlers
(0, socket_service_1.setupSocketHandlers)(io);
// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "ok", service: "webrtc-signaling-server" });
});
const PORT = Number(process.env.PORT) || 4000;
const HOST = process.env.HOST || "0.0.0.0";
httpServer.listen(PORT, HOST, () => {
    console.log(`WebRTC Signaling Server running on ${HOST}:${PORT}`);
    console.log(`CORS Origin: ${corsOptions.origin}`);
    console.log(`WebSocket path: /socket.io/`);
});
//# sourceMappingURL=server.js.map