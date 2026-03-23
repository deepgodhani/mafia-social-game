function EndView({ result, players }) {
  const isMafiaWin = result === "MAFIA_WIN";

  return (
    <div className="game-shell pt-12 space-y-10">
      <div className="relative">
        <div className="text-center space-y-2">
          <div className="panel-header opacity-40">Final Disposition</div>
          <h1 className={`text-5xl font-black uppercase tracking-tighter italic ${isMafiaWin ? 'text-crimson-600' : 'text-white'}`}>
            {isMafiaWin ? "The Family Wins" : "Order Restored"}
          </h1>
          <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.4em]">
            The operation has concluded
          </p>
        </div>
        
        {isMafiaWin && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-64 h-24 bg-crimson-900/10 blur-3xl rounded-full pointer-events-none"></div>
        )}
      </div>

      <div className="space-y-3">
        <div className="panel-header px-1">Case Files: All Identities</div>
        <div className="grid gap-2">
          {players.map(p => (
            <div
              key={p.userId}
              className="panel p-4 flex justify-between items-center border-white/5 bg-white/[0.02]"
            >
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white uppercase tracking-tight">
                  {p.displayName || p.name}
                </span>
                <span className={`text-[8px] font-black uppercase tracking-widest mt-0.5 ${p.alive ? 'text-emerald-500' : 'text-white/20'}`}>
                  {p.alive ? "Survived" : "Eliminated"}
                </span>
              </div>
            
              <div className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-tighter border ${
                p.role === 'MAFIA' ? 'border-crimson-900 text-crimson-500 bg-crimson-950/20' : 'border-white/10 text-white/40'
              }`}>
                {p.role}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-8">
        <button 
          onClick={() => window.location.reload()} 
          className="btn-outline"
        >
          Return to Shadows
        </button>
      </div>
    </div>
  );
}

export default EndView;