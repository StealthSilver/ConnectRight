"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketHandlers = void 0;
const room_model_1 = require("../models/room.model");
const setupSocketHandlers = (io) => {
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);
        // Join room
        socket.on("join-room", ({ roomId, userName }) => {
            console.log(`\n=== JOIN ROOM ===`);
            console.log(`User: ${userName} (${socket.id})`);
            console.log(`Room: ${roomId}`);
            // Get existing peers in the room BEFORE adding new peer
            const existingPeers = room_model_1.roomManager.getPeersInRoom(roomId);
            console.log(`Existing peers in room: ${existingPeers.length}`);
            existingPeers.forEach((p) => console.log(`  - ${p.userName} (${p.socketId})`));
            // Join the socket.io room
            socket.join(roomId);
            // Add the new peer to the room
            const newPeer = {
                id: socket.id,
                socketId: socket.id,
                userName,
                isAudioMuted: false,
                isVideoMuted: false,
            };
            room_model_1.roomManager.addPeerToRoom(roomId, newPeer);
            console.log(`Added ${userName} to room`);
            // Send existing peers to the new user
            socket.emit("existing-peers", existingPeers);
            console.log(`Sent ${existingPeers.length} existing peers to ${userName}`);
            // Notify other users about the new peer
            socket.to(roomId).emit("user-joined", newPeer);
            console.log(`Notified others about ${userName} joining`);
            const totalInRoom = room_model_1.roomManager.getPeersInRoom(roomId).length;
            console.log(`Total peers now in room: ${totalInRoom}\n`);
        });
        // WebRTC signaling
        socket.on("signal", (data) => {
            console.log(`Signal from ${data.from} to ${data.to}: ${data.type}`);
            // Send signal to specific peer
            io.to(data.to).emit("signal", data);
            // Log for debugging
            if (data.type === "offer") {
                console.log(`  → Offer forwarded to ${data.to}`);
            }
            else if (data.type === "answer") {
                console.log(`  → Answer forwarded to ${data.to}`);
            }
            else if (data.type === "ice-candidate") {
                console.log(`  → ICE candidate forwarded to ${data.to}`);
            }
        });
        // Media state changes (mute/unmute)
        socket.on("media-state-changed", ({ roomId, mediaState }) => {
            console.log(`Media state changed for ${socket.id}:`, mediaState);
            room_model_1.roomManager.updatePeerMediaState(roomId, socket.id, mediaState);
            socket.to(roomId).emit("peer-media-state-changed", {
                peerId: socket.id,
                mediaState,
            });
        });
        // Handle disconnect
        socket.on("disconnect", () => {
            console.log(`\n=== USER DISCONNECTED: ${socket.id} ===`);
            // Find and remove the peer from all rooms
            const allRooms = room_model_1.roomManager.getAllRooms();
            allRooms.forEach((room) => {
                if (room.peers.has(socket.id)) {
                    console.log(`Removing from room: ${room.id}`);
                    room_model_1.roomManager.removePeerFromRoom(room.id, socket.id);
                    socket.to(room.id).emit("user-left", { peerId: socket.id });
                    console.log(`Notified room ${room.id} about disconnect`);
                }
            });
            console.log(`Disconnect cleanup complete\n`);
        });
        // Leave room explicitly
        socket.on("leave-room", ({ roomId }) => {
            console.log(`\n=== LEAVE ROOM ===`);
            console.log(`User: ${socket.id}`);
            console.log(`Room: ${roomId}`);
            socket.leave(roomId);
            room_model_1.roomManager.removePeerFromRoom(roomId, socket.id);
            socket.to(roomId).emit("user-left", { peerId: socket.id });
            const remaining = room_model_1.roomManager.getPeersInRoom(roomId).length;
            console.log(`Peers remaining in room: ${remaining}\n`);
        });
    });
};
exports.setupSocketHandlers = setupSocketHandlers;
//# sourceMappingURL=socket.service.js.map