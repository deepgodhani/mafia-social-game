import { io } from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

// Initialize with autoConnect: false.
// We will connect manually after a successful login.
const socket = io(SERVER_URL, {
  autoConnect: false,
});

window.addEventListener("beforeunload", () => {
  socket.disconnect();
});

export default socket;