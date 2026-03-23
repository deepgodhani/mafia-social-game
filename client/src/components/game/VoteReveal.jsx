function VoteReveal({ votes, players, onFinish }) {
  if (!votes || votes.length === 0) return null;

  const byId = new Map(players.map((p) => [p.userId, p]));

  const entries = votes.map(({ voterId, targetId }) => {
    const voter = byId.get(voterId);
    const target = byId.get(targetId);

    return {
      voterLabel: voter
        ? voter.displayName || voter.name
        : "Anonymous",
      targetLabel: target
        ? target.displayName || target.name
        : "The Abyss",
    };
  });

  return (
    <div className="fixed inset-0 z-[95] bg-noir-950/80 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="text-center">
          <div className="panel-header opacity-40">Public Judgment</div>
          <h2 className="phase-title text-3xl">The Ballot Box</h2>
        </div>

        <div className="grid gap-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {entries.map((v, i) => (
            <div
              key={i}
              className="panel p-4 flex items-center justify-between border-white/5 bg-noir-900/40"
            >
              <div className="flex flex-col">
                <span className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-0.5">Voter</span>
                <span className="text-sm font-bold text-white uppercase tracking-tight">{v.voterLabel}</span>
              </div>
              
              <div className="h-px flex-1 mx-4 bg-white/5 relative">
                <div className="absolute inset-0 bg-crimson-600/20 blur-sm"></div>
              </div>

              <div className="flex flex-col text-right">
                <span className="text-[10px] text-crimson-600 font-black uppercase tracking-widest mb-0.5">Target</span>
                <span className="text-sm font-bold text-crimson-500 uppercase tracking-tight">{v.targetLabel}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onFinish}
          className="btn-primary"
        >
          Accept Verdict
        </button>
      </div>
    </div>
  );
}

export default VoteReveal;