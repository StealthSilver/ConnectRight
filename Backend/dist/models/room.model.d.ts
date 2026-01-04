import { Room, Peer } from "../types";
declare class RoomManager {
    private rooms;
    constructor();
    createRoom(roomId: string): Room;
    getRoom(roomId: string): Room | undefined;
    getRoomOrCreate(roomId: string): Room;
    addPeerToRoom(roomId: string, peer: Peer): void;
    removePeerFromRoom(roomId: string, socketId: string): void;
    getPeersInRoom(roomId: string): Peer[];
    updatePeerMediaState(roomId: string, socketId: string, mediaState: Partial<Peer>): void;
    getAllRooms(): Room[];
}
export declare const roomManager: RoomManager;
export {};
//# sourceMappingURL=room.model.d.ts.map