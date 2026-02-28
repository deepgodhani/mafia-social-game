import { motion, AnimatePresence } from "framer-motion";

const phaseStyles = {
  LOBBY: "bg-gradient-to-b from-black via-zinc-950 to-black",
  NIGHT: "bg-gradient-to-b from-black via-zinc-950 to-black",
  DAY: "bg-gradient-to-b from-zinc-900 via-zinc-950 to-black",
  VOTING: "bg-gradient-to-b from-black via-red-950/40 to-black",
  ENDED: "bg-gradient-to-b from-black via-zinc-900 to-black",
};
function PhaseWrapper({ phase, children }) {
  return (
    <AnimatePresence mode="wait" >
      <motion.div
        key={phase}
        initial={{ opacity: 0, y: 6 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -6 }}
transition={{ duration: 0.35 }}
        className={`
          min-h-screen text-amber-50
          transition-colors duration-700
          ${phaseStyles[phase]}
        `}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default PhaseWrapper;