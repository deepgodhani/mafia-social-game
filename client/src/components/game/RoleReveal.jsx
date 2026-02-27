import { useEffect, useState } from "react";

function getRoleText(role) {
  if (role === "MAFIA")
    return {
      title: "YOU ARE MAFIA",
      desc: "Eliminate the town at night.",
      color: "text-red-500",
    };

  if (role === "DETECTIVE")
    return {
      title: "YOU ARE THE DETECTIVE",
      desc: "Investigate one player each night.",
      color: "text-blue-400",
    };

  if (role === "DOCTOR")
    return {
      title: "YOU ARE THE DOCTOR",
      desc: "Protect someone each night.",
      color: "text-green-400",
    };

  return {
    title: "YOU ARE A CITIZEN",
    desc: "Find the Mafia and survive.",
    color: "text-yellow-300",
  };
}

function RoleReveal({ role, onFinish }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onFinish();
    }, 5000); // show for 5 sec

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const roleInfo = getRoleText(role);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="text-center animate-fadeIn">
        <h1 className={`text-4xl md:text-6xl font-bold ${roleInfo.color}`}>
          {roleInfo.title}
        </h1>

        <p className="text-zinc-300 mt-4 text-lg">
          {roleInfo.desc}
        </p>
      </div>
    </div>
  );
}

export default RoleReveal;