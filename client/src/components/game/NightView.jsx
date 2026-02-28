function NightView({ role, timer, players, myUserId, onNightAction }) {
  const canAct = ["MAFIA", "DOCTOR", "DETECTIVE"].includes(role);

  return (
    <div className="game-shell pt-4 space-y-4">

      <div className="panel p-4 text-center">
        <div className="panel-header">Night Falls</div>

        <h1 className="phase-title mt-1">
          The City Sleeps
        </h1>

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

          <div className="grid grid-cols-2 gap-3">
            {players
              .filter(p => p.userId !== myUserId && p.alive)
              .map(p => (
                <button
                  key={p.userId}
                  onClick={() => onNightAction(p.userId)}
                  className="
  panel w-full py-3 px-4
  text-amber-100 font-semibold
  border border-amber-900/30
  hover:border-amber-600/40
  active:scale-[0.98]
  transition-all duration-150
"
                >
                  {p.name}
                </button>
              ))}
          </div>
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