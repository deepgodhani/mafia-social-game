import { PHASES } from "./phases.js";
import { changePhase } from "./changePhase.js";
import { startPhaseTimer } from "./startPhaseTimer.js";
import { resolveVotes } from "./resolveVotes.js";
import { checkWinCondition } from "./checkWinCondition.js";
import { emitRoomState } from "../rooms/emitRoomState.js";

export function advancePhase(io, roomId, room, roomTimers) {
    const current = room.game.phase;

    switch (current) {

        case PHASES.STARTING:
            changePhase(io, roomId, room, PHASES.DAY);
            startPhaseTimer(io, roomId, room, 15, roomTimers);
            break;

        case PHASES.DAY:
            changePhase(io, roomId, room, PHASES.VOTING);
            startPhaseTimer(io, roomId, room, 10, roomTimers);
            break;

        case PHASES.VOTING: {

            // ⭐ resolve voting
            const eliminatedId = resolveVotes(room);

            if (eliminatedId && room.players[eliminatedId]) {
                room.players[eliminatedId].alive = false;

                console.log(
                    `[ELIMINATED] ${room.players[eliminatedId].name} (${room.players[eliminatedId].role})`
                  );
            }

            const result = checkWinCondition(room);

            if (result) {
                room.game.phase = "ENDED";
                room.game.result = result;

                console.log("[GAME ENDED]", result);

                emitRoomState(io, roomId, room);
                return;
            }
            // clear votes for next round
            room.game.votes = {};

            changePhase(io, roomId, room, PHASES.NIGHT);
            startPhaseTimer(io, roomId, room, 10, roomTimers);

            break;
        }

        case PHASES.NIGHT:
            room.game.round += 1;
            changePhase(io, roomId, room, PHASES.DAY);
            startPhaseTimer(io, roomId, room, 15, roomTimers);
            break;

        default:
            break;
    }
}