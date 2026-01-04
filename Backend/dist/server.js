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
    origin: (process.env.CORS_ORIGIN || "http://localhost:5173").replace(/\/$/, ""),
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
// Socket.io setup
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: corsOptions.origin,
        credentials: true,
    },
    transports: ["websocket", "polling"],
});
// Setup socket event handlers
(0, socket_service_1.setupSocketHandlers)(io);
// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "ok", service: "webrtc-signaling-server" });
});
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
    console.log(`WebRTC Signaling Server running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map