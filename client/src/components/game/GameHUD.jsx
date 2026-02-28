function GameHUD({ phase, timer, role, roomId }) {
  return (
    <div className="sticky top-0 z-40 border-b border-amber-900/30 bg-black/70 backdrop-blur-md">
      <div className="game-shell py-2">
        <div className="flex items-center justify-between">

          {/* LEFT — PHASE */}
          <div className="flex flex-col">
            <span className="pill">{phase}</span>
            <span className="text-[10px] text-amber-700 mt-1 tracking-wide uppercase">
              Room {roomId}
            </span>
          </div>

          {/* CENTER — TIMER (MAIN FOCUS) */}
          <div className="text-center">
            <div
              className={`text-2xl font-bold tracking-wider tabular-nums ${timer <= 10
                  ? "text-red-500 animate-pulse"
                  : "text-amber-200"
                }`}
            >
              {timer ?? "-"}
            </div>
            <div className="text-[10px] text-amber-700 uppercase tracking-widest">
              seconds
            </div>
          </div>

          {/* RIGHT — ROLE */}
          <div className="text-right">
            <div className="text-[10px] text-amber-700 uppercase tracking-widest">
              Role
            </div>
            <div className="text-sm font-semibold text-amber-100">
              {role}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default GameHUD;