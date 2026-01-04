"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomManager = void 0;
class RoomManager {
    constructor() {
        this.rooms = new Map();
    }
    createRoom(roomId) {
        const room = {
            id: roomId,
            peers: new Map(),
            createdAt: new Date(),
        };
        this.rooms.set(roomId, room);
        return room;
    }
    getRoom(roomId) {
        return this.rooms.get(roomId);
    }
    getRoomOrCreate(roomId) {
        let room = this.getRoom(roomId);
        if (!room) {
            room = this.createRoom(roomId);
        }
        return room;
    }
    addPeerToRoom(roomId, peer) {
        const room = this.getRoomOrCreate(roomId);
        // Check if peer already exists
        if (room.peers.has(peer.socketId)) {
            console.log(`⚠️ Peer ${peer.socketId} already in room ${roomId}, updating...`);
            room.peers.set(peer.socketId, peer);
            return;
        }
        room.peers.set(peer.socketId, peer);
        console.log(`✅ Added peer ${peer.socketId} to room ${roomId}. Total: ${room.peers.size}`);
    }
    removePeerFromRoom(roomId, socketId) {
        const room = this.getRoom(roomId);
        if (room) {
            room.peers.delete(socketId);
            // Clean up empty rooms
            if (room.peers.size === 0) {
                this.rooms.delete(roomId);
            }
        }
    }
    getPeersInRoom(roomId) {
        const room = this.getRoom(roomId);
        return room ? Array.from(room.peers.values()) : [];
    }
    updatePeerMediaState(roomId, socketId, mediaState) {
        const room = this.getRoom(roomId);
        if (room) {
            const peer = room.peers.get(socketId);
            if (peer) {
                Object.assign(peer, mediaState);
            }
        }
    }
    getAllRooms() {
        return Array.from(this.rooms.values());
    }
}
exports.roomManager = new RoomManager();
//# sourceMappingURL=room.model.js.map