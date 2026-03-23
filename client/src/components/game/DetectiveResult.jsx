function DetectiveResult({ result, onClose }) {
  if (!result) return null;

  const { targetName, isMafia } = result;

  return (
    <div className="fixed inset-0 z-[120] bg-noir-950/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="panel p-8 max-w-sm w-full text-center border-white/10 animate-in fade-in zoom-in duration-300">
        <div className="panel-header opacity-40">Intelligence Report</div>

        <h2 className="phase-title mt-2 text-2xl">
          Investigation Results
        </h2>

        <div className="mt-6 p-4 bg-white/[0.02] border border-white/5 rounded-lg">
          <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">Subject</p>
          <p className="text-lg font-bold text-white uppercase tracking-tight">{targetName}</p>
        </div>

        <div className="mt-4">
          <p
            className={`text-xl font-black uppercase tracking-tighter italic ${
              isMafia ? "text-crimson-600 drop-shadow-[0_0_10px_rgba(175,0,0,0.3)]" : "text-emerald-500"
            }`}
          >
            {isMafia ? "Identified: Syndicate Member" : "Status: Non-Combatant"}
          </p>
        </div>

        <button
          onClick={onClose}
          className="btn-primary mt-8"
        >
          Destroy Evidence
        </button>
      </div>
    </div>
  );
}

export default DetectiveResult;

