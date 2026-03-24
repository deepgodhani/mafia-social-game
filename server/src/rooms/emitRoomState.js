import { getPublicRoomState } from "./getPublicRoomState.js";

export function emitRoomState(io, roomId, room) {
  const publicState = getPublicRoomState(room);
  io.to(roomId).emit("room-state", publicState);
}