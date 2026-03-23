import { useState } from "react";
import PlayerBoard from "./PlayerBoard";

function VotingView({ players, myUserId, onVote, timer }) {
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (targetUserId) => {
    setSelectedId(targetUserId);
    onVote(targetUserId);
  };

  return (
    <div className="game-shell space-y-6">
      <div className="text-center py-4">
        <div className="panel-header opacity-40">Phase: 03</div>
        <h1 className="phase-title text-4xl italic text-crimson-600">Judgment</h1>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mt-2">
          A Sacrifice for the Greater Good
        </p>
      </div>

      <div className="panel p-6 border-white/10 bg-noir-900/40">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="panel-header">The Gavel</div>
            <p className="text-sm font-bold text-white uppercase tracking-tight">
              Cast your final verdict
            </p>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-white/20 font-black uppercase tracking-widest">Deliberation</div>
            <div className="text-2xl font-black tabular-nums text-white">{timer}s</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="panel-header px-1">Accused Citizens</div>
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
          <div className="panel p-4 border-crimson-600 bg-crimson-950/30">
            <p className="text-xs font-bold text-white text-center uppercase tracking-widest">
              Verdict has been sealed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default VotingView;