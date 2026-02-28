import { io } from "socket.io-client";

const token = localStorage.getItem("token");

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

const socket = io(SERVER_URL, {
  auth: { token },
});

export default socket;