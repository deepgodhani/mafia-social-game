export function assignRoles(room, players) {
    const total = players.length;
  
    const mafiaCount = Math.max(1, Math.floor(total / 4));
  
    const roles = [];
  
    // mafia
    for (let i = 0; i < mafiaCount; i++) {
      roles.push("MAFIA");
    }
  
    // add detective
    roles.push("DETECTIVE");
  
    // add doctor
    roles.push("DOCTOR");
  
    // remaining citizens
    while (roles.length < total) {
      roles.push("CITIZEN");
    }
  
    // shuffle roles
    roles.sort(() => Math.random() - 0.5);
  
    players.forEach((playerId, i) => {
      room.players[playerId].role = roles[i];
      room.game.roles[playerId] = roles[i];
    });
  }