function LobbyView({ room, myUserId, onStart }) {
  const players = room?.players || [];
  const isHost = room?.hostId === myUserId;

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center p-6">

      {/* ROOM CODE */}
      <h1 className="text-zinc-400 text-sm tracking-widest mb-2">
        ROOM CODE
      </h1>

      <div className="text-5xl font-bold tracking-[0.5em] mb-8">
        {room?.id}
      </div>
      {room.hostId === myUserId ? (
        <p className="text-zinc-300">
          Waiting for players...
        </p>
      ) : (
        <p className="text-zinc-400">
          Waiting for host to start the game...
        </p>
      )}
      {/* PLAYER GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-4xl">

        {players.map((player) => (
          <div
            key={player.userId}
            className="bg-zinc-800 rounded-2xl p-4 flex flex-col items-center border border-zinc-700"
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
              <span className="text-xs bg-yellow-600 px-2 py-1 rounded mt-2">
                👑 HOST
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
            className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-xl text-lg font-semibold"
          >
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