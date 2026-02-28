import { PHASES } from "./phases.js";

export function resolveNight(io, roomId, room) {
  const { mafiaTarget, doctorSave, detectiveCheck } =
    room.game.nightActions;

  let killedPlayer = null;

  const players = Object.values(room.players);

  const findByUserId = (userId) =>
    players.find((p) => p.userId === userId);

  // mafia kill vs doctor save
  if (mafiaTarget && mafiaTarget !== doctorSave) {
    const targetPlayer = findByUserId(mafiaTarget);

    if (targetPlayer) {
      targetPlayer.alive = false;
      killedPlayer = targetPlayer;
      console.log("[NIGHT KILL]", targetPlayer.name);
    }
  } else if (mafiaTarget && doctorSave && mafiaTarget === doctorSave) {
    console.log("[DOCTOR SAVED]", mafiaTarget);
  }

  // doctor result (did you save your target?)
  if (doctorSave) {
    const doctorPlayers = players.filter(
      (p) => p.role === "DOCTOR"
    );
    const target = findByUserId(doctorSave);
    const saved =
      !!mafiaTarget && mafiaTarget === doctorSave && !killedPlayer;

    doctorPlayers.forEach((doc) => {
      io.to(doc.socketId).emit("doctor-result", {
        targetName: target ? target.name : "Unknown",
        saved,
      });
    });
  }

  // detective result (is target mafia?)
  if (detectiveCheck) {
    const detectivePlayers = players.filter(
      (p) => p.role === "DETECTIVE"
    );
    const target = findByUserId(detectiveCheck);
    const isMafia = target?.role === "MAFIA";

    detectivePlayers.forEach((det) => {
      io.to(det.socketId).emit("detective-result", {
        targetName: target ? target.name : "Unknown",
        isMafia,
      });
    });
  }

  room.game.nightActions = {
    mafiaTarget: null,
    doctorSave: null,
    detectiveCheck: null,
  };

  return killedPlayer;
}