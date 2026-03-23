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
    ? "Signal Blocked"
    : muted
      ? "Mic Cut"
      : "Channel Open";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/5 bg-noir-950/80 backdrop-blur-xl">
      <div className="max-w-lg mx-auto px-4 py-3 sm:px-6">
        <div className="panel px-4 py-3 flex items-center justify-between border-white/10 bg-white/[0.02]">
          {/* LEFT — identity */}
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded border border-white/10 rotate-3"
              style={{ backgroundColor: me.color || "#111" }}
            />
            <div>
              <div className="text-xs font-black text-white uppercase tracking-tight">
                {me.name}
              </div>
              <div className="text-[8px] text-white/30 font-bold uppercase tracking-widest leading-none">
                {me.alive ? "OPERATIVE" : "COMPROMISED"}
              </div>
            </div>
          </div>

          {/* RIGHT — mic + status */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={hardMuted}
              onClick={onToggleMute}
              className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded border transition-all ${
                hardMuted
                  ? "border-white/5 text-white/10 cursor-not-allowed"
                  : muted
                    ? "border-crimson-900/50 text-crimson-500 bg-crimson-950/20"
                    : "border-emerald-900/50 text-emerald-500 bg-emerald-950/20"
              }`}
            >
              {micLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerFooter;