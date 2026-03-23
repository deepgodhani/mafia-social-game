import { useEffect } from "react";
import socket from "./socket/socket";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RoomPage from "./pages/RoomPage";
import LandingPage from "./pages/LandingPage";
import ProfileSetup from "./pages/ProfileSetup";

function App() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("connected", (data) => {
      console.log("Server says:", data);
    });

    return () => {
      socket.off("connect");
      socket.off("connected");
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="grain"></div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/room/:id" element={<RoomPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;