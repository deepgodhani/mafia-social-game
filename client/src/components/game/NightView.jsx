function NightView({ role, timer, players, myUserId, onNightAction }) {
    const canAct = ["MAFIA", "DOCTOR", "DETECTIVE"].includes(role);
  
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
  
        <h1 className="text-3xl font-bold mb-2">🌙 Night Phase</h1>
        <p className="text-zinc-400 mb-6">The city sleeps...</p>
  
        <p className="mb-4 text-lg">Timer: {timer}</p>
  
        {canAct ? (
          <>
            <p className="mb-4">Choose your target:</p>
  
            <div className="grid grid-cols-2 gap-3">
              {players
                .filter(p => p.userId !== myUserId && p.alive)
                .map(p => (
                  <button
                    key={p.userId}
                    onClick={() => onNightAction(p.userId)}
                    className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded-lg"
                  >
                    {p.name}
                  </button>
                ))}
            </div>
          </>
        ) : (
          <p className="text-zinc-500 mt-8">
            Stay quiet... waiting for morning.
          </p>
        )}
      </div>
    );
  }
  
  export default NightView;