function DayView({ timer, players }) {
    return (
      <div className="min-h-screen bg-zinc-100 text-black p-6">
  
        <h1 className="text-3xl font-bold mb-2">☀️ Day Phase</h1>
        <p className="mb-6">Discuss and find the Mafia.</p>
  
        <p className="mb-6">Timer: {timer}</p>
  
        <div className="space-y-3">
          {players.map(p => (
            <div
              key={p.userId}
              className={`p-3 rounded-lg border ${
                p.alive ? "bg-white" : "bg-zinc-300 line-through"
              }`}
            >
              {p.name}
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  export default DayView;