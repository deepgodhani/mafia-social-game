function EndView({ result, players }) {
  return (
    <div className="game-shell pt-8 space-y-6 text-amber-50 text-center">

      <div className="panel p-6">
        <div className="panel-header">Game Over</div>

        <h1 className="text-3xl font-bold mt-2 text-amber-200">
          {result === "CITIZENS_WIN"
            ? "🏆 Citizens Win"
            : "💀 Mafia Wins"}
        </h1>

        <p className="text-sm text-amber-700 mt-2">
          Roles have been revealed.
        </p>
      </div>

      <div className="space-y-2">
        {players.map(p => (
          <div
          key={p.userId}
          className="panel p-3 flex justify-between items-center"
        >
          <span className="font-semibold text-amber-100">
            {p.name}
          </span>
        
          <span className="text-sm uppercase tracking-widest text-amber-700">
            {p.role}
          </span>
        </div>
        ))}
      </div>
    </div>
  );
}

export default EndView;