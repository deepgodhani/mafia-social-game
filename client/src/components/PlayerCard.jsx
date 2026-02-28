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
          panel p-3 flex items-center gap-3
          transition-all duration-150
          ${clickable ? "cursor-pointer active:scale-[0.98]" : ""}
          ${selected ? "ring-2 ring-amber-500" : ""}
          ${!player.alive ? "opacity-50" : ""}
        `}
      >
        <img
          src={player.picture}
          alt={player.name}
          className="w-12 h-12 rounded-full object-cover border border-amber-900/30"
        />
  
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-amber-100 truncate">
            {player.name}
          </p>
  
          <p className="text-xs text-amber-700 uppercase tracking-widest">
            {player.alive ? "Alive" : "Dead"}
          </p>
  
          {showRole && player.role && (
            <p className="text-xs text-amber-400 mt-1">
              {player.role}
            </p>
          )}
        </div>
  
        {isHost && (
          <span className="pill text-[10px]">
            HOST
          </span>
        )}
      </div>
    );
  }
  
  export default PlayerCard;