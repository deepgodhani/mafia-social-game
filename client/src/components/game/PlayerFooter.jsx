function PlayerFooter({
  role,
  roomId,
  me,
  muted,
  hardMuted,
  onToggleMute,
}) {
  if (!me) return null;

  const micLabel = hardMuted
    ? "Muted by phase"
    : muted
      ? "Mic off"
      : "Mic on";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-amber-900/30 bg-black/80 backdrop-blur-md">
      <div className="game-shell py-2">
        <div className="panel px-3 py-2 flex items-center justify-between">
          {/* LEFT — identity */}
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full border border-amber-700/40"
              style={{ backgroundColor: me.color || "#444" }}
            />
            <div>
              <div className="text-sm font-semibold text-amber-100">
                {me.name}
              </div>
              <div className="text-[10px] text-amber-700 uppercase tracking-widest">
                @{me.username || "player"}
              </div>
            </div>
          </div>

          {/* CENTER — role */}
          <div className="text-center">
            <div className="text-[10px] text-amber-700 uppercase tracking-widest">
              Role
            </div>
            <div className="text-sm font-semibold text-amber-200">
              {role || "?"}
            </div>
          </div>

          {/* RIGHT — mic + status */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              disabled={hardMuted}
              onClick={onToggleMute}
              className={`text-xs px-3 py-1 rounded-full border ${
                hardMuted
                  ? "border-zinc-700 text-zinc-500 cursor-not-allowed"
                  : muted
                    ? "border-red-500 text-red-400"
                    : "border-emerald-500 text-emerald-400"
              }`}
            >
              {micLabel}
            </button>

            <div className="text-right">
              <div className="text-[10px] text-amber-700 uppercase tracking-widest">
                Status
              </div>
              <div className="text-sm text-amber-100">
                {me.alive ? "Alive" : "Dead"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerFooter;