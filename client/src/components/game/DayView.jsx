import PlayerBoard from "./PlayerBoard";

function DayView({ timer, players , onShowMorningReport}) {
  return (
    <div className="game-shell pt-4 space-y-4 text-amber-50">

      <div className="panel p-4 text-center">
        <div className="panel-header">Morning Report</div>

        <h1 className="phase-title mt-1">
          Day Phase
        </h1>

        <p className="text-sm text-amber-700 mt-2">
          Discuss, observe, and decide who to trust.
        </p>

        <div className="mt-3 text-lg font-bold text-amber-200 tabular-nums">
          {timer}s
        </div>
      </div>

      <div className="flex justify-center">
  <button
    onClick={onShowMorningReport}
    className="pill hover:border-amber-500 transition"
  >
    View Last Night
  </button>
</div>

      <PlayerBoard
        players={players}
        selectable={false}
      />
    </div>
  );
}

export default DayView;