import { emitRoomState } from "../rooms/emitRoomState.js";
import { advancePhase } from "./advancePhase.js";

export function startPhaseTimer(io, roomId, room, seconds, roomTimers) {

    if (room.game.timer.active) {
        return; //prevent duplicate timers
      }

  // clear existing timer if any
  if (roomTimers[roomId]) {
    clearInterval(roomTimers[roomId]);
  }
  
  room.game.timer.active = true;
  room.game.timer.remaining = seconds;
  
  emitRoomState(io, roomId, room);
  
  roomTimers[roomId] = setInterval(() => {
    room.game.timer.remaining -= 1;
  
    io.to(roomId).emit("timer-tick", {
      remaining: room.game.timer.remaining,
    });
  
    if (room.game.timer.remaining <= 0) {
      clearInterval(roomTimers[roomId]);
      roomTimers[roomId] = null;
  
      room.game.timer.active = false;
  
      advancePhase(io, roomId, room, roomTimers);
    }
  }, 1000);
}