import { PHASES } from "./phases.js";
import { changePhase } from "./changePhase.js";
import { startPhaseTimer } from "./startPhaseTimer.js";
import { resolveVotes } from "./resolveVotes.js";
import { checkWinCondition } from "./checkWinCondition.js";
import { emitRoomState } from "../rooms/emitRoomState.js";
import { resolveNight } from "./resolveNight.js";

export function advancePhase(io, roomId, room, roomTimers) {
    const current = room.game.phase;

    switch (current) {

        case PHASES.STARTING:
            changePhase(io, roomId, room, PHASES.NIGHT);
            startPhaseTimer(io, roomId, room, 10, roomTimers);
            break;

        case PHASES.DAY_RESULT:
            changePhase(io, roomId, room, PHASES.DISCUSSION);
            startPhaseTimer(io, roomId, room, 240, roomTimers); // 4 min discussion
            break;

        case PHASES.DISCUSSION:
            changePhase(io, roomId, room, PHASES.VOTING);
            startPhaseTimer(io, roomId, room, 20, roomTimers); // 20 sec vote
            break;

        case PHASES.VOTING: {

            // ⭐ snapshot votes for frontend reveal
            room.game.lastVotes = Object.entries(room.game.votes || {}).map(
                ([voterId, targetId]) => ({
                    voterId,
                    targetId,
                })
            );

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
                changePhase(io, roomId, room, PHASES.END_GAME);
                room.game.result = result;

                console.log("[GAME ENDED]", result);

                emitRoomState(io, roomId, room);
                return;
            }
            // clear votes for next round
            room.game.votes = {};

            room.game.lastEliminated = eliminatedId || null;

            changePhase(io, roomId, room, PHASES.ELIMINATION);
            startPhaseTimer(io, roomId, room, 8, roomTimers);

            break;
        }

        case PHASES.ELIMINATION:
            room.game.votes = {};

            changePhase(io, roomId, room, PHASES.NIGHT);
            startPhaseTimer(io, roomId, room, 90, roomTimers); // 1.5 min night
            break;

        case PHASES.NIGHT:
            room.game.lastNightResult = null;

            room.game.round += 1;

            // ⭐ resolve night actions
            const killedPlayer = resolveNight(io, roomId, room);

            // ⭐ save result for frontend newspaper
            if (killedPlayer) {
                room.game.lastNightResult = {
                    type: "KILL",
                    playerName: killedPlayer.name,
                };
            } else {
                room.game.lastNightResult = {
                    type: "NO_KILL",
                };
            }
            changePhase(io, roomId, room, PHASES.DAY_RESULT);
            // show night result card for ~7 seconds before discussion
            startPhaseTimer(io, roomId, room, 7, roomTimers);
            break;

        default:
            break;
    }
}