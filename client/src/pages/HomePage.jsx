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
    <div className="min-h-screen bg-black text-amber-100 flex flex-col">
      {/* Top navigation */}
      <header className="border-b border-amber-900/40 bg-black/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-widest">
              MAFIA
            </span>
            <span className="text-[10px] text-amber-700 uppercase tracking-[0.2em]">
              Noir 
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <button
              className="pill text-xs"
              onClick={() => setShowRulebook(true)}
            >
              Rulebook
            </button>

            <button
              className="pill text-xs"
              onClick={() => navigate("/profile-setup")}
            >
              Profile
            </button>

            <div className="h-4 w-px bg-amber-900/40" />

            <span className="text-xs text-amber-500 max-w-[120px] truncate">
              {userLabel}
            </span>

            <button
              onClick={handleLogout}
              className="text-xs text-amber-400 hover:text-red-400 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full px-4 space-y-6">
          <div className="panel p-5 text-center space-y-2">
            <div className="panel-header">Central Station</div>
            <p className="text-sm text-amber-700">
              Create a new room for your crew or join an existing code.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleCreateRoom}
              className="btn-primary w-full py-3"
            >
              Create Room
            </button>

            <div className="panel p-3 flex gap-2 items-center">
              <input
                value={roomCode}
                onChange={(e) =>
                  setRoomCode(e.target.value.toUpperCase())
                }
                placeholder="Enter room code"
                className="flex-1 px-3 py-2 rounded bg-zinc-900 text-amber-50 placeholder:text-amber-700 text-sm"
              />

              <button
                onClick={handleJoinRoom}
                className="btn-secondary px-4 py-2 text-sm"
              >
                Join
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

