function EndView({ result, players }) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center p-6">
  
        <h1 className="text-4xl font-bold mb-6">
          {result === "CITIZENS_WIN"
            ? "🏆 Citizens Win!"
            : "💀 Mafia Wins!"}
        </h1>
  
        <div className="space-y-2">
          {players.map(p => (
            <div key={p.userId}>
              {p.name} — {p.role}
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  export default EndView;