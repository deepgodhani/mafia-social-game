import { PHASES } from "./phases.js";

export function resolveNight(io, roomId, room) {
  const { mafiaTarget, doctorSave, detectiveCheck } =
    room.game.nightActions;

  let killedPlayer = null;

  if (mafiaTarget && mafiaTarget !== doctorSave) {
    const targetPlayer = Object.values(room.players).find(
      (p) => p.userId === mafiaTarget
    );

    if (targetPlayer) {
      targetPlayer.alive = false;
      killedPlayer = targetPlayer;
      console.log("[NIGHT KILL]", targetPlayer.name);
    }
  } else {
    console.log("[DOCTOR SAVED]");
  }

  // detective logic stays same...

  room.game.nightActions = {
    mafiaTarget: null,
    doctorSave: null,
    detectiveCheck: null,
  };

  return killedPlayer;
}