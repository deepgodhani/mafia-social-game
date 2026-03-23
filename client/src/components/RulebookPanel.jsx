function RulebookPanel({ onClose }) {
  return (
    <div className="fixed inset-0 z-[110] bg-noir-950/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="panel p-8 max-w-lg w-full space-y-6 animate-in fade-in zoom-in duration-300 border-white/10">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="panel-header opacity-40">Intelligence Folder</div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            Close
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto pr-4 space-y-8 custom-scrollbar">
          <section>
            <h2 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-2">
              The Objective
            </h2>
            <p className="text-sm text-white/60 leading-relaxed dossier-text italic">
              Mafia want to quietly outnumber the town. Citizens must expose and eliminate the infiltrators before they are outnumbered.
            </p>
          </section>

          <section>
            <h2 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-2">
              Operational Phases
            </h2>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-[10px] font-black text-crimson-600 mt-1">01</span>
                <p className="text-xs text-white/50"><span className="text-white font-bold uppercase tracking-tight">Night:</span> Mafia, Doctor, and Detective execute secret directives.</p>
              </li>
              <li className="flex gap-3">
                <span className="text-[10px] font-black text-crimson-600 mt-1">02</span>
                <p className="text-xs text-white/50"><span className="text-white font-bold uppercase tracking-tight">Discussion:</span> The city wakes. Gather intelligence and share suspicions.</p>
              </li>
              <li className="flex gap-3">
                <span className="text-[10px] font-black text-crimson-600 mt-1">03</span>
                <p className="text-xs text-white/50"><span className="text-white font-bold uppercase tracking-tight">Judgment:</span> Cast ballots to eliminate a suspected threat.</p>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-2">
              Key Identities
            </h2>
            <div className="grid gap-3">
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg">
                <p className="text-[10px] font-black text-crimson-600 uppercase mb-1">Mafia</p>
                <p className="text-[10px] text-white/40 leading-tight">Eliminate one target per night cycle.</p>
              </div>
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg">
                <p className="text-[10px] font-black text-emerald-500 uppercase mb-1">Doctor</p>
                <p className="text-[10px] text-white/40 leading-tight">Intercept a hit. Target survives if attacked.</p>
              </div>
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg">
                <p className="text-[10px] font-black text-white uppercase mb-1">Detective</p>
                <p className="text-[10px] text-white/40 leading-tight">Verify alignment. Identify the Mafia.</p>
              </div>
            </div>
          </section>
        </div>

        <div className="pt-4 border-t border-white/5 text-center">
           <p className="text-[8px] text-white/20 font-black uppercase tracking-[0.4em]">Confidential - Eyes Only</p>
        </div>
      </div>
    </div>
  );
}

export default RulebookPanel;

