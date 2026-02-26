import { emitRoomState } from "../rooms/emitRoomState.js";
import { PHASES } from "./phases.js";

export function resolveNight(io, roomId, room) {
  const { mafiaTarget, doctorSave, detectiveCheck } =
    room.game.nightActions;

  console.log("[NIGHT RESOLVE]", room.game.nightActions);

  // ========================
  // 1️⃣ MAFIA KILL
  // ========================
  if (mafiaTarget && mafiaTarget !== doctorSave) {
    const targetPlayer = Object.values(room.players).find(
      (p) => p.userId === mafiaTarget
    );

    if (targetPlayer) {
      targetPlayer.alive = false;
      console.log("[NIGHT KILL]", targetPlayer.name);
    }
  } else {
    console.log("[DOCTOR SAVED]");
  }

  // ========================
  // 2️⃣ DETECTIVE RESULT
  // ========================
  if (detectiveCheck) {
    const checkedPlayer = Object.values(room.players).find(
      (p) => p.userId === detectiveCheck
    );

    if (checkedPlayer) {
      const detective = Object.values(room.players).find(
        (p) => p.role === "DETECTIVE" && p.alive
      );

      if (detective) {
        io.to(detective.id).emit("detective-result", {
          targetName: checkedPlayer.name,
          role: checkedPlayer.role,
        });
      }
    }
  }

  // ========================
  // 3️⃣ RESET NIGHT ACTIONS
  // ========================
  room.game.nightActions = {
    mafiaTarget: null,
    doctorSave: null,
    detectiveCheck: null,
  };

  // ========================
  // 4️⃣ GO TO DAY
  // ========================
  room.game.phase = PHASES.DAY;

  emitRoomState(io, roomId, room);
}