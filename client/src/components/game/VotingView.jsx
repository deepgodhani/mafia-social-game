function VotingView({ players, myUserId, onVote, timer }) {
  return (
    <div className="game-shell pt-4 space-y-4 text-amber-50">

      <div className="panel p-4 text-center">
        <div className="panel-header">Town Decision</div>

        <h1 className="phase-title mt-1">
          Voting Phase
        </h1>

        <p className="text-sm text-amber-700 mt-2">
          Choose carefully. Every vote matters.
        </p>

        <div className="mt-3 text-lg font-bold text-amber-200 tabular-nums">
          {timer}s
        </div>
      </div>

      <div className="space-y-3">
        {players
          .filter(p => p.alive && p.userId !== myUserId)
          .map(p => (
            <button
              key={p.userId}
              onClick={() => onVote(p.userId)}
              className="
                    w-full panel p-3 text-left
                    border border-amber-900/30
                    hover:border-red-700/50
                    active:scale-[0.98]
                    transition-all duration-150
                  "
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-amber-100">
                  {p.name}
                </span>
                <span className="text-xs uppercase tracking-widest text-red-500">
                  Vote
                </span>
              </div>
            </button>
          ))}
      </div>
    </div>
  );
}

export default VotingView;