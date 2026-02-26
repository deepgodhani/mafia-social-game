export function checkWinCondition(room) {
    const alivePlayers = Object.values(room.players).filter(
      (p) => p.alive
    );
  
    const mafiaAlive = alivePlayers.filter(
      (p) => p.role === "MAFIA"
    ).length;
  
    const citizensAlive = alivePlayers.filter(
      (p) => p.role === "CITIZEN"
    ).length;
  
    if (mafiaAlive === 0) return "CITIZENS_WIN";
    if (mafiaAlive >= citizensAlive) return "MAFIA_WIN";
  
    return null;
  }