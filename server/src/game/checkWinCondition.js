export function checkWinCondition(room) {
  const players = Object.values(room.players);

  const mafiaAlive = players.filter(
    (p) => p.alive && p.role === "MAFIA"
  ).length;

  // ⭐ ALL NON-MAFIA = TOWN
  const townAlive = players.filter(
    (p) => p.alive && p.role !== "MAFIA"
  ).length;

  // ⭐ citizens win if mafia dead
  if (mafiaAlive === 0) {
    return "CITIZENS_WIN";
  }

  // ⭐ mafia wins if equal or more than town
  if (mafiaAlive >= townAlive) {
    return "MAFIA_WIN";
  }

  return null;
}