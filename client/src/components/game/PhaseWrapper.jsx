import { motion, AnimatePresence } from "framer-motion";

const phaseStyles = {
  LOBBY: "bg-noir-950",
  STARTING: "bg-noir-950",
  NIGHT: "bg-gradient-to-b from-noir-950 via-crimson-950/10 to-noir-950",
  DAY_RESULT: "bg-noir-950",
  DISCUSSION: "bg-noir-950",
  VOTING: "bg-gradient-to-b from-noir-950 via-crimson-950/20 to-noir-950",
  ELIMINATION: "bg-gradient-to-b from-noir-950 via-crimson-950/30 to-noir-950",
  END_GAME: "bg-noir-950",
};

function PhaseWrapper({ phase, children }) {
  return (
    <AnimatePresence mode="wait" >
      <motion.div
        key={phase}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className={`
          min-h-screen text-white
          transition-colors duration-1000
          ${phaseStyles[phase] || phaseStyles.LOBBY}
        `}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default PhaseWrapper;