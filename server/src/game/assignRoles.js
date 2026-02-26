export function assignRoles(room, playerIds) {
    const mafiaCount = 1;
  
    playerIds.forEach((userId, index) => {
      const role = index < mafiaCount ? "MAFIA" : "CITIZEN";
  
      room.players[userId].role = role;
    });
  }