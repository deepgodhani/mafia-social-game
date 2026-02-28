export function sendMafiaTeam(io, room) {
    const mafiaPlayers = Object.values(room.players).filter(
      (p) => p.role === "MAFIA"
    );
  
    const mafiaInfo = mafiaPlayers.map((p) => ({
      userId: p.userId,
      name: p.name,
    }));
  
    // send ONLY to mafia players
    mafiaPlayers.forEach((mafioso) => {
      io.to(mafioso.socketId).emit("mafia-team", mafiaInfo);
    });
  
    console.log("[MAFIA TEAM SENT]");
  }