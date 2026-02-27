function VotingView({ players, myUserId, onVote, timer }) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white p-6">
  
        <h1 className="text-3xl font-bold mb-4">🗳 Voting Phase</h1>
        <p className="mb-6">Timer: {timer}</p>
  
        <div className="space-y-3">
          {players
            .filter(p => p.alive && p.userId !== myUserId)
            .map(p => (
              <button
                key={p.userId}
                onClick={() => onVote(p.userId)}
                className="w-full bg-red-600 hover:bg-red-700 p-3 rounded-lg text-left"
              >
                Vote {p.name}
              </button>
            ))}
        </div>
      </div>
    );
  }
  
  export default VotingView;