import { PHASES } from "../game/phases.js";

export function getPublicRoomState(room) {
  return {
    id: room.id,
    hostId: room.hostId,

    players: Object.values(room.players).map((p) => ({
      id: p.id,
      userId: p.userId,
      name: p.name,
      picture: p.picture,
      alive: p.alive,
      username: p.username || null,
      displayName: p.displayName || p.name,
      color: p.color || null,
      connected: p.connected,

      // ⭐ only reveal roles after game ends
      role: room.game.phase === PHASES.END_GAME ? p.role : null,
    })),

    game: {
      started: room.game.started,
      phase: room.game.phase,
      round: room.game.round,
      timer: room.game.timer,
      result: room.game.result,
      lastNightResult: room.game.lastNightResult,
      lastEliminated: room.game.lastEliminated || null,
      lastVotes: room.game.lastVotes || [],
    },
  };
}