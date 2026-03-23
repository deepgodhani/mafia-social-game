import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProfileSetup() {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const email = payload.email || "";
      const name = payload.name || "";

      const emailPrefix = email.split("@")[0] || "player";
      const suggestedUsername = emailPrefix
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "_");

      setUsername((prev) => prev || suggestedUsername);
      setDisplayName((prev) => prev || name || suggestedUsername);
    } catch {
      // if token is malformed just send them back to landing
      navigate("/");
    }
  }, [navigate]);

  const saveProfile = async () => {
    setError("");
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000"; 

    const res = await fetch(`${SERVER_URL}/profile/setup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: username.trim(),
        displayName: displayName.trim(),
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      if (data.error === "USERNAME_TAKEN") {
        setError("That alias is already on the records. Choose another.");
      } else {
        setError("Network failure. The records could not be updated.");
      }
      return;
    }

    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-noir-950 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-sm w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="text-center space-y-2">
          <div className="panel-header opacity-40">Documentation</div>
          <h2 className="text-3xl font-black uppercase italic tracking-tight">Identity Records</h2>
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">How should the city address you?</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Coded Alias</label>
            <input
              placeholder="UNIQUE_ID"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white font-mono uppercase tracking-widest focus:outline-none focus:border-white/20 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Public Name</label>
            <input
              placeholder="DISPLAY_NAME"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white font-bold uppercase tracking-widest focus:outline-none focus:border-white/20 transition-all"
            />
          </div>
        </div>

        {error && (
          <div className="panel p-3 border-crimson-900/50 bg-crimson-950/20">
            <p className="text-[10px] font-black text-crimson-500 text-center uppercase tracking-widest">
              {error}
            </p>
          </div>
        )}

        <button
          onClick={saveProfile}
          className="btn-primary"
        >
          Confirm Identity
        </button>

        <p className="text-[8px] text-center text-white/10 font-black uppercase tracking-[0.4em] pt-4">
          Unverified identities will be purged
        </p>
      </div>
    </div>
  );
}

export default ProfileSetup;