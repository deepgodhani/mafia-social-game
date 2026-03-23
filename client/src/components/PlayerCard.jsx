function PlayerCard({
    player,
    isHost,
    selected,
    clickable,
    onClick,
    showRole,
  }) {
    return (
      <div
        onClick={clickable ? onClick : undefined}
        className={`
          panel p-3 flex items-center gap-4
          transition-all duration-300 group
          ${clickable ? "cursor-pointer active:scale-[0.97] hover:bg-white/5" : ""}
          ${selected ? "border-crimson-600/50 bg-crimson-950/20" : "border-white/5"}
          ${!player.alive ? "grayscale contrast-125 opacity-40" : ""}
        `}
      >
        <div className="relative">
          <div
            className="w-12 h-12 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden rotate-3 group-hover:rotate-0 transition-transform duration-500"
            style={{ backgroundColor: player.color || "#111" }}
          >
            <img
              src={player.picture}
              alt={player.name}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100"
            />
          </div>
          {!player.alive && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="w-8 h-8 bg-crimson-700/80 rounded-full blur-xl animate-pulse"></div>
            </div>
          )}
          {player.connected === false && player.alive && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-zinc-600 rounded-full border-2 border-noir-950 shadow-lg"></div>
          )}
          {player.connected !== false && player.alive && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-noir-950 shadow-lg"></div>
          )}
        </div>
  
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-bold text-white tracking-tight truncate uppercase text-sm">
              {player.displayName || player.name}
            </p>
            {isHost && (
              <span className="text-[8px] bg-white/10 text-white/40 px-1.5 py-0.5 rounded font-black tracking-widest">
                HOST
              </span>
            )}
          </div>
  
          <p className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${!player.alive ? 'text-crimson-600' : 'text-white/30'}`}>
            {player.alive ? "In the shadows" : "Eliminated"}
          </p>
  
          {showRole && player.role && (
            <p className="text-[10px] text-crimson-500 font-bold tracking-[0.2em] mt-1 uppercase">
              {player.role}
            </p>
          )}
        </div>
  
        {selected && (
          <div className="w-2 h-2 rounded-full bg-crimson-600 shadow-[0_0_12px_rgba(175,0,0,0.8)]"></div>
        )}
      </div>
    );
  }
  
  export default PlayerCard;