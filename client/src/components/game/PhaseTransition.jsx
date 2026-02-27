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
    }, 2200);

    return () => clearTimeout(timer);
  }, [phase]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      <h1 className="text-3xl md:text-5xl font-bold text-white animate-pulse">
        {getPhaseText(phase)}
      </h1>
    </div>
  );
}

export default PhaseTransition;