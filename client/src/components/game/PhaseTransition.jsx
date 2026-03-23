import { useEffect, useState } from "react";

function getPhaseText(phase) {
  if (phase === "NIGHT") return "🌙 The city sleeps...";
  if (phase === "DAY") return "☀️ Morning arrives...";
  if (phase === "VOTING") return "⚖️ Time to vote...";
  if (phase === "STARTING") return "🎭 Roles are being assigned...";
  if (phase === "ENDED") return "🏁 The game is over...";
  return "";
}

const TRANSITION_PHASES = [
  "STARTING",
  "NIGHT",
  "DAY",
  "VOTING",
  "ENDED",
];

function PhaseTransition({ phase }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // ⭐ ONLY show for real transitions
    if (!TRANSITION_PHASES.includes(phase)) {
      setVisible(false);
      return;
    }

    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [phase]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[150] bg-noir-950/40 backdrop-blur-2xl flex items-center justify-center">
      <div className="panel px-8 py-6 text-center border-white/10 animate-in fade-in zoom-in duration-300">
        <h1 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase drop-shadow-2xl">
          {getPhaseText(phase)}
        </h1>
      </div>
    </div>
  );
}

export default PhaseTransition;