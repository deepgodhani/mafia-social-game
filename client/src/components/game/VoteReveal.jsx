
function VoteReveal({ votes, players, onFinish }) {
  if (!votes || votes.length === 0) return null;

  const byId = new Map(players.map((p) => [p.userId, p]));

  const entries = votes.map(({ voterId, targetId }) => {
    const voter = byId.get(voterId);
    const target = byId.get(targetId);

    return {
      voterLabel: voter
        ? voter.displayName || voter.name
        : "Unknown",
      targetLabel: target
        ? target.displayName || target.name
        : "No one",
    };
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
      <div className="panel p-5 w-[90%] max-w-md text-center">
        <div className="panel-header">Voting Result</div>

        <h2 className="phase-title mt-1">
          Votes Revealed
        </h2>

        <div className="mt-4 space-y-2 text-left max-h-72 overflow-y-auto">
          {entries.map((v, i) => (
            <div
              key={i}
              className="panel p-2 flex justify-between"
            >
              <span className="text-amber-100">
                {v.voterLabel}
              </span>
              <span className="text-red-400">
                → {v.targetLabel}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={onFinish}
          className="btn-primary mt-4"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default VoteReveal;