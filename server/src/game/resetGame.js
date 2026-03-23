import { PHASES } from "./phases.js";

export function resetGame(room, roomId, roomTimers) {
  if (roomId && roomTimers && roomTimers[roomId]) {
    clearInterval(roomTimers[roomId]);
    roomTimers[roomId] = null;
  }

  room.game = {
    started: false,
    phase: PHASES.LOBBY,
    roles: {},
    votes: {},
    alivePlayers: [],
    timer: {
      active: false,
      remaining: 0,
    },
    round: 0,
    result: null,
    lastNightResult: null,
    lastEliminated: null,
    lastVotes: [],
    nightActions: {
      mafiaTarget: null,
      doctorSave: null,
      detectiveCheck: null,
    },
  };

  // reset players
  Object.values(room.players).forEach((p) => {
    p.alive = true;
    p.role = null;
  });
}