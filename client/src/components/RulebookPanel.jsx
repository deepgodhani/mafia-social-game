function RulebookPanel({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
      <div className="panel p-6 max-w-lg w-[90%] space-y-4">
        <div className="flex items-center justify-between">
          <div className="panel-header">Rulebook</div>
          <button
            onClick={onClose}
            className="text-amber-500 text-xs uppercase tracking-widest"
          >
            Close
          </button>
        </div>

        <section>
          <h2 className="text-sm font-semibold text-amber-200 uppercase tracking-widest">
            Objective
          </h2>
          <p className="text-sm text-amber-600 mt-1">
            Mafia want to quietly outnumber the town. Citizens want to
            expose and eliminate all mafia.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-amber-200 uppercase tracking-widest">
            Phases
          </h2>
          <ul className="mt-1 text-sm text-amber-600 space-y-1 list-disc list-inside">
            <li>
              <span className="font-semibold">Night</span>: Mafia,
              Doctor, and Detective act in secret.
            </li>
            <li>
              <span className="font-semibold">Day &amp; Discussion</span>:
              Everyone talks and shares suspicions.
            </li>
            <li>
              <span className="font-semibold">Voting</span>: Town votes
              to eliminate a suspect.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-amber-200 uppercase tracking-widest">
            Roles
          </h2>
          <ul className="mt-1 text-sm text-amber-600 space-y-1 list-disc list-inside">
            <li>
              <span className="font-semibold text-red-400">
                Mafia
              </span>
              : Choose one player to kill each night.
            </li>
            <li>
              <span className="font-semibold text-emerald-400">
                Doctor
              </span>
              : Protect one player each night. If they are attacked,
              they survive.
            </li>
            <li>
              <span className="font-semibold text-sky-400">
                Detective
              </span>
              : Investigate one player each night to learn if they are
              mafia.
            </li>
            <li>
              <span className="font-semibold text-amber-300">
                Citizen
              </span>
              : No night power. Use your voice and vote.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-amber-200 uppercase tracking-widest">
            Voting Rules
          </h2>
          <ul className="mt-1 text-sm text-amber-600 space-y-1 list-disc list-inside">
            <li>Only alive players can vote.</li>
            <li>
              You can vote for one player each round. Your choice is
              highlighted on your screen.
            </li>
            <li>
              If there is a tie for most votes, nobody is eliminated
              that round.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default RulebookPanel;

