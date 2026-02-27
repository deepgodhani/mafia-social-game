function GameHUD({ phase, timer, role, roomId }) {
    return (
      <div className="p-3 bg-zinc-900 border-b border-zinc-700">
        <p>Room: {roomId}</p>
        <p>Phase: {phase}</p>
        <p>Role: {role}</p>
        <p>Timer: {timer ?? "-"}</p>
      </div>
    );
  }
  
  export default GameHUD;