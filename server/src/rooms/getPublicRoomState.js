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
  
        // ⭐ only reveal roles after game ends
        role: room.game.phase === "ENDED" ? p.role : null,
      })),
  
      game: {
        started: room.game.started,
        phase: room.game.phase,
        round: room.game.round,
        timer: room.game.timer,
        result: room.game.result,
        lastNightResult: room.game.lastNightResult,
      },
    };
  } 