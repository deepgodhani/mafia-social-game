function LobbyView({ room, myUserId, onStart }) {
  const players = room?.players || [];
  const isHost = room?.hostId === myUserId;

  return (
    <div className="game-shell pt-6 space-y-8">
      {/* ROOM CODE */}
      <div className="text-center relative">
        <div className="panel-header opacity-50">Secure Channel</div>
        <div className="text-5xl font-black tracking-[0.2em] mt-2 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          {room?.id}
        </div>
        <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-white/10"></div>
        <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-white/10"></div>
      </div>

      <div className="panel p-4 text-center bg-white/[0.02]">
        {room.hostId === myUserId ? (
          <p className="text-white/60 text-xs font-bold uppercase tracking-widest">
            Waiting for the family to assemble...
          </p>
        ) : (
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest">
            The boss is deciding our move...
          </p>
        )}
      </div>

      {/* PLAYER GRID */}
      <div>
        <div className="panel-header mb-4 px-1">Connected Identities ({players.length})</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {players.map((player) => (
            <div
              key={player.userId}
              className="panel p-4 flex items-center gap-4 border-white/5 transition-all duration-500 hover:bg-white/5"
            >
              <div
                className="w-14 h-14 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden grayscale group-hover:grayscale-0 transition-all"
                style={{ backgroundColor: player.color || "#111" }}
              >
                <img
                  src={player.picture}
                  alt={player.name}
                  className="w-full h-full object-cover opacity-60"
                />
              </div>

              <div className="flex-1">
                <p className="text-sm font-black uppercase tracking-tight text-white/90">
                  {player.displayName || player.name}
                </p>
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-0.5">
                  {player.connected !== false ? 'Encrypted' : 'Signal Lost'}
                </p>
              </div>

              {room.hostId === player.userId && (
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* HOST CONTROLS */}
      {isHost && (
        <div className="pt-8">
          <button onClick={onStart} className="btn-primary">
            Initiate Operation
          </button>
        </div>
      )}

      {!isHost && (
        <p className="text-center text-[10px] text-white/20 font-bold uppercase tracking-[0.3em] animate-pulse">
          Awaiting Signal
        </p>
      )}
    </div>
  );
}

export default LobbyView;