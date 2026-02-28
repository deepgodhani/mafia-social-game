import { PHASES } from "./phases.js";

export function resetGame(room) {
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
  };

  // reset players
  Object.values(room.players).forEach((p) => {
    p.alive = true;
    p.role = null;
  });
}