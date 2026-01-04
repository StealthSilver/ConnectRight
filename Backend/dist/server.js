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
// CORS configuration - explicitly allow the frontend
const allowedOrigins = [
    "https://connect-right.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    // Allow any origin if CORS_ORIGIN env var is set
    ...(process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(",").map((url) => url.trim())
        : []),
];
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) {
            return callback(null, true);
        }
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.warn(`CORS blocked request from origin: ${origin}`);
            callback(null, true); // Allow all for now to debug
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
// Apply CORS middleware
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
// Additional CORS headers for polling
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    // Handle preflight
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});
// Socket.io setup
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        credentials: true,
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    },
    // Prioritize polling for Render compatibility, then websocket
    transports: ["polling", "websocket"],
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
// Add debugging for Socket.IO connections
io.on("connection", (socket) => {
    const transport = socket.handshake.headers["x-forwarded-proto"] || "unknown";
    console.log(`[Socket.IO] New connection: ${socket.id} via ${socket.conn.transport.name}`);
    socket.on("disconnect", () => {
        console.log(`[Socket.IO] Disconnected: ${socket.id}`);
    });
});
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