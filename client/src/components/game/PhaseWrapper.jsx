import { motion, AnimatePresence } from "framer-motion";

const phaseStyles = {
  LOBBY: "bg-zinc-950",
  NIGHT: "bg-black",
  DAY: "bg-zinc-900",
  VOTING: "bg-red-950",
  ENDED: "bg-zinc-950",
};

function PhaseWrapper({ phase, children }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={phase}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className={`min-h-screen text-white transition-colors duration-700 ${phaseStyles[phase]}`}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default PhaseWrapper;