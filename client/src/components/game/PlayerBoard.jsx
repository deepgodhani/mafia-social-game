import PlayerCard from "../PlayerCard";

function PlayerBoard({
  players,
  myUserId,
  hostId,
  selectable = false,
  selectedId = null,
  onSelect,
  showRoles = false,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {players.map((player) => (
        <PlayerCard
          key={player.userId}
          player={player}
          isHost={hostId === player.userId}
          selected={selectedId === player.userId}
          clickable={
            selectable &&
            player.alive &&
            player.userId !== myUserId
          }
          onClick={() => onSelect?.(player.userId)}
          showRole={showRoles}
        />
      ))}
    </div>
  );
}

export default PlayerBoard;