function GameHUD({ phase, timer, role, roomId }) {
  return (
    <div className="sticky top-0 z-40 border-b border-white/5 bg-noir-950/80 backdrop-blur-xl">
      <div className="max-w-lg mx-auto px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between">

          {/* LEFT — PHASE */}
          <div className="flex flex-col">
            <span className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] mb-0.5">Phase</span>
            <span className="text-xs font-bold text-white tracking-widest uppercase">{phase}</span>
          </div>

          {/* CENTER — TIMER */}
          <div className="text-center bg-white/5 px-4 py-1 rounded-full border border-white/5">
            <div
              className={`text-xl font-black tabular-nums leading-none ${timer <= 10
                  ? "text-crimson-500 animate-pulse"
                  : "text-white"
                }`}
            >
              {timer ?? "00"}
            </div>
          </div>

          {/* RIGHT — ROLE */}
          <div className="text-right">
            <div className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] mb-0.5">
              Your Identity
            </div>
            <div className="text-xs font-bold text-white tracking-widest uppercase accent-crimson">
              {role || "Unassigned"}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default GameHUD;