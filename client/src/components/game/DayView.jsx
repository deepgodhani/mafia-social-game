import PlayerBoard from "./PlayerBoard";

function DayView({ timer, players , onShowMorningReport}) {
  return (
    <div className="game-shell space-y-6">
      <div className="text-center py-4">
        <div className="panel-header opacity-40">Phase: 01</div>
        <h1 className="phase-title text-4xl italic">Daylight</h1>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mt-2">
          The Truth is Hidden in Plain Sight
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onShowMorningReport}
          className="panel p-4 text-center hover:bg-white/5 transition-colors border-white/10"
        >
          <div className="panel-header">Archive</div>
          <div className="text-[10px] font-black uppercase tracking-widest">Morning Paper</div>
        </button>

        <div className="panel p-4 text-center border-white/5">
          <div className="panel-header">Adjournment</div>
          <div className="text-[10px] font-black uppercase tracking-widest tabular-nums">{timer}s Remaining</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="panel-header px-1">Living Souls</div>
        <PlayerBoard
          players={players}
          selectable={false}
        />
      </div>
    </div>
  );
}

export default DayView;