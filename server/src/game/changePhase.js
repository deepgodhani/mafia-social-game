import { emitRoomState } from "../rooms/emitRoomState.js";

export function changePhase(io, roomId, room, newPhase) {
  const oldPhase = room.game.phase;

  room.game.phase = newPhase;

  console.log(
    `[PHASE] ${roomId}: ${oldPhase} -> ${newPhase}`
  );

  emitRoomState(io, roomId, room);
}