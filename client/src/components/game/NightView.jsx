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
    <div className="game-shell space-y-6">
      <div className="text-center py-4">
        <div className="panel-header opacity-40">Phase: 02</div>
        <h1 className="phase-title text-4xl italic">Night Falls</h1>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mt-2">
          The City Sleeps... For Now
        </p>
      </div>

      <div className="panel p-6 border-crimson-900/30 bg-crimson-950/5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="panel-header text-crimson-600">Current Directive</div>
            <p className="text-sm font-bold text-white uppercase tracking-tight">
              {canAct ? "Select your objective" : "Remain Silent"}
            </p>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-white/20 font-black uppercase tracking-widest">Time Remaining</div>
            <div className="text-2xl font-black tabular-nums text-white">{timer}s</div>
          </div>
        </div>
      </div>

      {canAct ? (
        <div className="space-y-4">
          <div className="panel-header px-1">Active Targets</div>
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
            <div className="panel p-3 border-crimson-600/30 bg-crimson-600/10 animate-pulse">
              <p className="text-[10px] font-black text-crimson-500 text-center uppercase tracking-[0.2em]">
                Objective Locked. Awaiting Dawn.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="pt-12 text-center space-y-4">
          <div className="w-12 h-12 border-2 border-white/5 rounded-full mx-auto flex items-center justify-center animate-spin duration-[3000ms]">
            <div className="w-1 h-1 bg-white/20 rounded-full"></div>
          </div>
          <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.4em]">
            Listening to the rain...
          </p>
        </div>
      )}
    </div>
  );
}

export default NightView;