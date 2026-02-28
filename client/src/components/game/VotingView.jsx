import PlayerBoard from "./PlayerBoard";


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

      <PlayerBoard
  players={players.filter(
    (p) => p.alive && p.userId !== myUserId
  )}
  myUserId={myUserId}
  selectable={true}
  onSelect={onVote}
/>
    </div>
  );
}

export default VotingView;