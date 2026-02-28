import { useState } from "react";
import PlayerBoard from "./PlayerBoard";

function NightView({ role, timer, players, myUserId, onNightAction }) {
  const canAct = ["MAFIA", "DOCTOR", "DETECTIVE"].includes(role);
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (targetUserId) => {
    setSelectedId(targetUserId);
    onNightAction(targetUserId);
  };

  return (
    <div className="game-shell pt-4 space-y-4">
      <div className="panel p-4 text-center">
        <div className="panel-header">Night Falls</div>

        <h1 className="phase-title mt-1">The City Sleeps</h1>

        <p className="text-sm text-amber-700 mt-2">
          Make your move before dawn.
        </p>

        <div className="mt-3 text-lg font-bold text-amber-200 tabular-nums">
          {timer}s
        </div>
      </div>

      {canAct ? (
        <>
          <p className="text-sm uppercase tracking-widest text-amber-700 mb-3">
            Choose your target
          </p>

          <PlayerBoard
            players={players.filter(
              (p) => p.userId !== myUserId && p.alive
            )}
            myUserId={myUserId}
            selectable={canAct}
            selectedId={selectedId}
            onSelect={handleSelect}
          />

          {selectedId && (
            <p className="mt-2 text-xs text-amber-500">
              You have selected a target for tonight.
            </p>
          )}
        </>
      ) : (
        <p className="text-zinc-500 mt-8">
          Stay quiet... waiting for morning.
        </p>
      )}
    </div>
  );
}

export default NightView;