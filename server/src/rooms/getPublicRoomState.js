export function getPublicRoomState(room) {
    return {
      id: room.id,
      hostId: room.hostId,
  
      // convert object → array for frontend
      players: Object.values(room.players),
  
      game: {
        started: room.game.started,
        phase: room.game.phase,
        round: room.game.round,
        timer: room.game.timer,
        result: room.game.result,
      },
    };
  }