import { getPublicRoomState } from "./getPublicRoomState.js";

export function emitRoomState(io, roomId, room) {
  io.to(roomId).emit(
    "room-state",
    getPublicRoomState(room)
  );
}