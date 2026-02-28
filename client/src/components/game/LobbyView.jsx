function LobbyView({ room, myUserId, onStart }) {
  const players = room?.players || [];
  const isHost = room?.hostId === myUserId;

  return (
    <div className="game-shell pt-6 space-y-6 text-amber-50">

      {/* ROOM CODE */}
      <div className="panel p-5 text-center">
        <div className="panel-header">Room Code</div>

        <div className="text-4xl font-bold tracking-[0.35em] mt-2 text-amber-200">
          {room?.id}
        </div>
      </div>
      <div className="panel p-3 text-center">
        {room.hostId === myUserId ? (
          <p className="text-amber-300 text-sm">
            Waiting for players to join...
          </p>
        ) : (
          <p className="text-amber-700 text-sm">
            Waiting for host to start the game...
          </p>
        )}
      </div>
      {/* PLAYER GRID */}
      <div className="grid grid-cols-2 gap-3">

        {players.map((player) => (
          <div
            key={player.userId}
            className="panel p-3 flex flex-col items-center"
          >
            <img
              src={player.picture}
              alt={player.name}
              className="w-16 h-16 rounded-full object-cover mb-2"
            />

            <p className="text-sm font-semibold text-center">
              {player.name}
            </p>

            {room.hostId === player.userId && (
              <span className="pill mt-2 text-[10px]">
                HOST
              </span>
            )}
          </div>
        ))}
      </div>

      {/* HOST CONTROLS */}
      {isHost && (
        <div className="mt-10">
          <button
            onClick={onStart}
            className="btn-primary px-8"          >
            Start Game
          </button>
        </div>
      )}

      {!isHost && (
        <p className="mt-10 text-zinc-400">
          Waiting for host to start...
        </p>
      )}
    </div>
  );
}

export default LobbyView;