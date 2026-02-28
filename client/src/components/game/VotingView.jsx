import { useState } from "react";
import PlayerBoard from "./PlayerBoard";

function VotingView({ players, myUserId, onVote, timer }) {
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (targetUserId) => {
    setSelectedId(targetUserId);
    onVote(targetUserId);
  };

  return (
    <div className="game-shell pt-4 space-y-4 text-amber-50">
      <div className="panel p-4 text-center">
        <div className="panel-header">Town Decision</div>

        <h1 className="phase-title mt-1">Voting Phase</h1>

        <p className="text-sm text-amber-700 mt-2">
          Choose carefully. Every vote matters.
        </p>

        <div className="mt-3 text-lg font-bold text-amber-200 tabular-nums">
          {timer}s
        </div>
      </div>

      <PlayerBoard
        players={players.filter(
          (p) => p.alive && p.userId !== myUserId
        )}
        myUserId={myUserId}
        selectable={true}
        selectedId={selectedId}
        onSelect={handleSelect}
      />

      {selectedId && (
        <p className="mt-2 text-xs text-amber-500">
          Your vote has been cast.
        </p>
      )}
    </div>
  );
}

export default VotingView;