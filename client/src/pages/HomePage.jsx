import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket/socket";
import RulebookPanel from "../components/RulebookPanel";

function HomePage() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");
  const [userLabel, setUserLabel] = useState("");
  const [showRulebook, setShowRulebook] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    // If we have a token but the socket isn't connected, connect it.
    // This handles users who were already logged in.
    if (token && !socket.connected) {
      socket.auth = { token };
      socket.connect();
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserLabel(payload.email || payload.name || "Player");
    } catch {
      setUserLabel("Player");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleCreateRoom = () => {
    socket.emit("create-room");
  };

  const handleJoinRoom = () => {
    if (!roomCode) return;
    navigate(`/room/${roomCode}`);
  };

  useEffect(() => {
    socket.on("room-created", ({ roomId }) => {
      navigate(`/room/${roomId}`);
    });

    return () => {
      socket.off("room-created");
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-noir-950 text-white flex flex-col overflow-x-hidden">
      {/* Top navigation */}
      <header className="border-b border-white/5 bg-noir-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate("/home")}>
            <span className="text-xl font-black tracking-tighter italic">
              MAFIA
            </span>
            <span className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em] group-hover:text-crimson-600 transition-colors">
              Noir 
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
              onClick={() => setShowRulebook(true)}
            >
              Rules
            </button>
            <div className="w-1 h-1 bg-white/10 rounded-full"></div>
            <button
              className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
              onClick={() => navigate("/profile-setup")}
            >
              Profile
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          
          <div className="text-center space-y-2">
            <div className="panel-header opacity-40">Intelligence Hub</div>
            <h1 className="text-4xl font-black uppercase tracking-tight leading-none italic">
              Central Station
            </h1>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] max-w-[200px] mx-auto">
              Initiate a new operation or join a signal.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleCreateRoom}
              className="btn-primary"
            >
              New Operation
            </button>

            <div className="relative group">
              <input
                value={roomCode}
                onChange={(e) =>
                  setRoomCode(e.target.value.toUpperCase())
                }
                placeholder="SIGNAL CODE"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-center font-black tracking-[0.5em] text-white placeholder:text-white/10 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all"
              />
              {roomCode && (
                <button
                  onClick={handleJoinRoom}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/40 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="pt-8 text-center border-t border-white/5">
             <div className="inline-flex items-center gap-3">
                <span className="text-[10px] text-white/20 font-black uppercase tracking-widest">{userLabel}</span>
                <div className="w-1 h-1 bg-white/10 rounded-full"></div>
                <button
                  onClick={handleLogout}
                  className="text-[10px] text-white/20 hover:text-crimson-600 font-black uppercase tracking-widest transition-colors"
                >
                  Terminate Session
                </button>
             </div>
          </div>
        </div>
      </main>

      {showRulebook && (
        <RulebookPanel onClose={() => setShowRulebook(false)} />
      )}
    </div>
  );
}

export default HomePage;
