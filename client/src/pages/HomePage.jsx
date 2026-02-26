import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket/socket";
import { GoogleLogin } from "@react-oauth/google";

function HomePage() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");

  const handleCreateRoom = () => {
    socket.emit("create-room");
  };

  const handleJoinRoom = () => {
    if (!roomCode) return;
    navigate(`/room/${roomCode}`);
  };

  useEffect(() => {
    socket.on("room-created", ({ roomId }) => {
      console.log("Room created:", roomId);

      // ⭐ navigate using URL
      navigate(`/room/${roomId}`);
    });

    return () => {
      socket.off("room-created");
    };
  }, [navigate]);

  return (
    <div className="h-screen bg-zinc-950 text-white flex flex-col items-center justify-center gap-4">

      {/* <GoogleLogin
        onSuccess={async (credentialResponse) => {
          const res = await fetch("http://localhost:3000/auth/google", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              credential: credentialResponse.credential,
            }),
          });
        
          const data = await res.json();
          console.log("BACKEND USER:", data);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      /> */}

      {/* <GoogleLogin
  onSuccess={(res) => console.log("GOOGLE TOKEN:", res)}
  onError={() => console.log("FAILED")}
/> */}

      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          //console.log("GOOGLE TOKEN:", credentialResponse);
          const res = await fetch("http://localhost:3000/auth/google", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              credential: credentialResponse.credential,
            }),
          });

          const data = await res.json();
          localStorage.setItem("token", data.token);

          console.log("JWT SAVED:", data.token);
          console.log("BACKEND USER:", data);
        }}
        onError={() => console.log("FAILED")}
      />

      <button
        onClick={handleCreateRoom}
        className="bg-green-600 px-6 py-3 rounded-xl"
      >
        Create Room
      </button>

      <input
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
        placeholder="Enter room code"
        className="px-4 py-2 rounded text-black"
      />

      <button
        onClick={handleJoinRoom}
        className="bg-blue-600 px-6 py-3 rounded-xl"
      >
        Join Room
      </button>

    </div>
  );
}

export default HomePage;