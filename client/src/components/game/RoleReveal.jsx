import { useEffect, useState } from "react";

function getRoleText(role) {
  if (role === "MAFIA")
    return {
      title: "THE ENFORCER",
      desc: "Stay hidden. Eliminate the town before dawn. Your brothers are watching.",
      accent: "text-crimson-600",
      bg: "bg-crimson-950/10",
    };

  if (role === "DETECTIVE")
    return {
      title: "THE INVESTIGATOR",
      desc: "Trust no one. Verify identities in the dead of night.",
      accent: "text-white",
      bg: "bg-white/5",
    };

  if (role === "DOCTOR")
    return {
      title: "THE UNDERGROUND SURGEON",
      desc: "Every life has a price. Choose one to save from the shadows.",
      accent: "text-emerald-500",
      bg: "bg-emerald-950/10",
    };

  return {
    title: "THE CITIZEN",
    desc: "A quiet life in a loud city. Survival is your only objective.",
    accent: "text-white/60",
    bg: "bg-white/[0.02]",
  };
}

function RoleReveal({ role, onFinish }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onFinish();
    }, 6000); 

    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!visible) return null;

  const roleInfo = getRoleText(role);

  return (
    <div className="fixed inset-0 z-[100] bg-noir-950 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]"></div>
      </div>

      <div className={`relative z-10 max-w-sm w-full p-8 rounded-2xl border border-white/10 ${roleInfo.bg} backdrop-blur-md animate-in fade-in zoom-in duration-700`}>
        <div className="panel-header opacity-40 mb-8">Classification: Top Secret</div>
        
        <div className="space-y-6">
          <div>
            <div className="text-[10px] text-white/30 font-black tracking-[0.4em] uppercase mb-2">Subject Identity</div>
            <h1 className={`text-4xl md:text-5xl font-black uppercase tracking-tight leading-none ${roleInfo.accent}`}>
              {roleInfo.title}
            </h1>
          </div>

          <div className="w-12 h-px bg-white/10 mx-auto"></div>

          <p className="text-white/60 text-sm leading-relaxed dossier-text italic">
            "{roleInfo.desc}"
          </p>
        </div>

        <div className="mt-12 text-[8px] text-white/20 font-black tracking-[0.5em] uppercase">
          Signal will terminate shortly
        </div>
      </div>

      {/* Redacted Strips effect */}
      <div className="absolute top-1/4 -left-20 w-64 h-12 bg-noir-900 -rotate-12 border-y border-white/5 opacity-50"></div>
      <div className="absolute bottom-1/4 -right-20 w-64 h-12 bg-noir-900 -rotate-12 border-y border-white/5 opacity-50"></div>
    </div>
  );
}

export default RoleReveal;