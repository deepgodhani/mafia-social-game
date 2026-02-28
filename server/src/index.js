import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { generateRoomId } from "./utils/generateRoomId.js";
import { rooms } from "./rooms/rooms.js";
import { addPlayerToRoom } from "./rooms/addPlayerToRoom.js";
import { getPublicRoomState } from "./rooms/getPublicRoomState.js";
import { emitRoomState } from "./rooms/emitRoomState.js";
import { isHost } from "./rooms/isHost.js";
import { changePhase } from "./game/changePhase.js";
import { shuffleArray } from "./game/shuffleArray.js";
import { assignRoles } from "./game/assignRoles.js";
import { sendRoles } from "./game/sendRoles.js";
import { PHASES } from "./game/phases.js";
import { advancePhase } from "./game/advancePhase.js";
import { verifyGoogleToken } from "./auth/verifyGoogleToken.js";
import { createToken } from "./auth/createToken.js";
import { verifyToken } from "./auth/verifyToken.js";
import { sendMafiaTeam } from "./game/sendMafiaTeam.js";
import { resetGame } from "./game/resetGame.js";
import {
  users,
  getOrCreateUserFromGoogle,
  getOrCreateUserFromToken,
  isUsernameTaken,
} from "./auth/userStore.js";

const PLAYER_COLORS = [
  "#f97316", // orange
  "#22c55e", // green
  "#3b82f6", // blue
  "#e11d48", // rose
  "#a855f7", // violet
  "#facc15", // yellow
  "#0ea5e9", // sky
  "#64748b", // slate
  "#f97373", // soft red
  "#10b981", // emerald
  "#6366f1", // indigo
  "#ec4899", // pink
  "#ef4444", // red
  "#14b8a6", // teal
  "#8b5cf6", // purple
  "#eab308", // amber
  "#0f766e", // dark teal
  "#1d4ed8", // deep blue
  "#7c2d12", // burnt orange
  "#3f6212", // moss
];

const app = express();
const roomTimers = {};

app.use(cors());
app.use(express.json());

const disconnectTimers = {};

app.post("/profile/setup", (req, res) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json({ error: "No token" });
  }

  const token = auth.split(" ")[1];

  try {
    const decoded = verifyToken(token);

    const { username, displayName } = req.body;

    if (!username || !displayName) {
      return res
        .status(400)
        .json({ error: "Username and displayName are required" });
    }

    if (isUsernameTaken(username, decoded.id)) {
      return res.status(400).json({ error: "USERNAME_TAKEN" });
    }

    let user = users[decoded.id];
    if (!user) {
      user = getOrCreateUserFromToken(decoded);
    }

    user.username = username;
    user.displayName = displayName;

    res.json({ success: true, user });
  } catch (err) {
    console.error("Profile setup error:", err);
    res.status(401).json({ error: "Invalid token" });
  }
});

app.post("/auth/google", async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({ error: "Missing credential" });
        }

        const googleUser = await verifyGoogleToken(credential);

        console.log("[GOOGLE LOGIN]", googleUser.email);

        const user = getOrCreateUserFromGoogle(googleUser);

        // ⭐ CREATE JWT
        const token = createToken(user);

        res.json({
            token,
            user,
        });

    } catch (err) {
        console.error("Auth error:", err);
        res.status(401).json({ error: "Invalid token" });
    }
});

app.get("/", (req, res) => {
    res.send("Server running");
});

// Create HTTP server manually
const httpServer = createServer(app);

// Attach Socket.IO
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

io.use((socket, next) => {
    try {
        const token = socket.handshake.auth?.token;

        if (!token) {
            return next(new Error("No token"));
        }

        const payload = verifyToken(token);
        const user = getOrCreateUserFromToken(payload);

        // attach enriched user (with username/displayName if set) to socket
        socket.user = user;

        next();
    } catch (err) {
        next(new Error("Invalid token"));
    }
});

io.on("connection", (socket) => {
    console.log(`[CONNECT] ${socket.id}`);
    console.log("[SOCKET USER]", socket.user);

    socket.emit("connected", {
        id: socket.id,
        message: "Connected to server",
    });

    //  CREATE ROOM EVENT
    socket.on("create-room", () => {
        const roomId = generateRoomId();

        const userId = socket.user.id;


        rooms[roomId] = {
            id: roomId,
            hostId: userId,

            players: {
                [userId]: {
                    userId,
                    socketId: socket.id,
                    name: socket.user.displayName || socket.user.name,
                    picture: socket.user.picture,
                    username: socket.user.username || null,
                    displayName: socket.user.displayName || socket.user.name,
                    color: PLAYER_COLORS[0],
                    alive: true,
                    role: null,
                    connected: true,
                },
            },

            game: {
                started: false,
                phase: PHASES.LOBBY,

                roles: {},        // playerId -> role
                votes: {},        // voterId -> targetId

                alivePlayers: [], // list of alive player IDs

                timer: {
                    active: false,
                    remaining: 0,
                },

                round: 0,
                
                nightActions: {
                    mafiaTarget: null,
                    doctorSave: null,
                    detectiveCheck: null,
                },
            },
        };

        socket.join(roomId);
        emitRoomState(io, roomId, rooms[roomId]);
        console.log(socket.rooms);

        console.log(`[ROOM CREATED] ${roomId} by ${socket.id}`);

        console.log(rooms[roomId]);

        socket.emit("room-created", { roomId });
    });

    socket.on("join-room", ({ roomId }) => {
        const room = rooms[roomId];
        const userId = socket.user.id;

        if (!room) {
            socket.emit("error-message", { message: "Room not found" });
            return;
        }

        if (disconnectTimers[roomId]) {
            clearTimeout(disconnectTimers[roomId]);
            disconnectTimers[roomId] = null;
        }

        // ⭐ reconnect or new join
        if (room.players[userId]) {
            room.players[userId].socketId = socket.id;
            room.players[userId].connected = true;

            console.log(`[RECONNECT] ${room.players[userId].name}`);
        } else {
            const index = Object.keys(room.players).length;
            room.players[userId] = {
                userId,
                socketId: socket.id,
                name: socket.user.displayName || socket.user.name,
                picture: socket.user.picture,
                username: socket.user.username || null,
                displayName: socket.user.displayName || socket.user.name,
                color: PLAYER_COLORS[index % PLAYER_COLORS.length],
                alive: true,
                role: null,
                connected: true,
            };
        }

        socket.join(roomId);
        emitRoomState(io, roomId, room);
    });

    socket.on("start-game", ({ roomId }) => {
        const room = rooms[roomId];
        if (!room) return;

        if (!isHost(room, socket.user.id)) {
            console.log(`[START DENIED] ${socket.id} not host`);
            return;
        }

        if (room.game.started) return;

        room.game.started = true;
        room.game.round = 1;

        const playerIds = Object.keys(room.players);
        const shuffledPlayers = shuffleArray(playerIds);

        assignRoles(room, shuffledPlayers);

        console.log("[ROLES]", room.game.roles);
        sendRoles(io, room);
        sendMafiaTeam(io, room);
        changePhase(io, roomId, room, PHASES.STARTING);

        console.log(`[GAME STARTED] ${roomId}`);



        // ⭐ auto move to DAY (temporary delay)
        setTimeout(() => {
            if (rooms[roomId]) {
                advancePhase(io, roomId, room, roomTimers);
            }
        }, 2000);
    });

    socket.on("vote", ({ roomId, targetId }) => {
        const room = rooms[roomId];
        if (!room) return;

        // only during voting phase
        if (room.game.phase !== PHASES.VOTING) return;

        //const voter = room.players[socket.id];
        const userId = socket.user.id;
        const voter = room.players[userId];
        const target = room.players[targetId];

        // validate players exist
        if (!voter || !target) return;

        // ⭐ only alive players can vote
        if (!voter.alive) return;

        // cannot vote dead players
        if (!target.alive) return;

        // optional: prevent self vote (remove if you want allow)
        if (socket.id === targetId) return;

        // ⭐ store / overwrite vote keyed by userId
        room.game.votes[userId] = targetId;

        console.log(`[VOTE] ${userId} -> ${targetId}`);

        emitRoomState(io, roomId, room);
    });

    socket.on("webrtc-offer", ({ roomId, offer, targetUserId }) => {
        const room = rooms[roomId];
        if (!room) return;

        const target = room.players[targetUserId];
        if (!target) return;

        io.to(target.socketId).emit("webrtc-offer", {
            offer,
            fromUserId: socket.user.id,
        });
    });

    socket.on("webrtc-answer", ({ roomId, answer, targetUserId }) => {
        const room = rooms[roomId];
        if (!room) return;

        const target = room.players[targetUserId];
        if (!target) return;

        io.to(target.socketId).emit("webrtc-answer", {
            answer,
            fromUserId: socket.user.id,
        });
    });

    socket.on("webrtc-ice-candidate", ({ roomId, candidate, targetUserId }) => {
        const room = rooms[roomId];
        if (!room) return;

        const target = room.players[targetUserId];
        if (!target) return;

        io.to(target.socketId).emit("webrtc-ice-candidate", {
            candidate,
            fromUserId: socket.user.id,
        });
    });

    socket.on("night-action", ({ roomId, targetUserId }) => {
        const room = rooms[roomId];
        if (!room) return;
      
        const player = room.players[socket.user.id];
        if (!player) return;
      
        if (room.game.phase !== PHASES.NIGHT) return;
      
        const role = player.role;
      
        if (role === "MAFIA") {
          room.game.nightActions.mafiaTarget = targetUserId;
        }
      
        if (role === "DOCTOR") {
          room.game.nightActions.doctorSave = targetUserId;
        }
      
        if (role === "DETECTIVE") {
          room.game.nightActions.detectiveCheck = targetUserId;
        }
      
        console.log("[NIGHT ACTION]", role, "->", targetUserId);
      });

      socket.on("play-again", ({ roomId }) => {
        const room = rooms[roomId];
        if (!room) return;
      
        // only host can restart
        if (room.hostId !== socket.user.id) return;
      
        resetGame(room);
      
        console.log("[GAME RESET]", roomId);
      
        emitRoomState(io, roomId, room);
      });

    socket.on("disconnect", () => {
        console.log(`[DISCONNECT] ${socket.id}`);

        for (const roomId in rooms) {
            const room = rooms[roomId];

            const userId = socket.user.id;

            if (room.players[userId]) {
                console.log(`[PLAYER LEFT] ${userId} from ${roomId}`);

                const wasHost = room.hostId === userId;

                // mark player as disconnected
                room.players[userId].connected = false;

                console.log(`[PLAYER DISCONNECTED] ${userId}`);

                // ⭐ delete room if empty
                if (Object.keys(room.players).length === 0) {

                    // wait before deleting (refresh protection)
                    disconnectTimers[roomId] = setTimeout(() => {

                        // check again after delay
                        if (
                            rooms[roomId] &&
                            Object.keys(rooms[roomId].players).length === 0
                        ) {
                            console.log(`[ROOM DELETED] ${roomId}`);
                            delete rooms[roomId];
                        }

                    }, 5000); // ⭐ 5 seconds grace
                }

                // ⭐ assign new host if needed
                if (wasHost) {
                    const remainingPlayers = Object.keys(room.players);

                    if (remainingPlayers.length > 0) {
                        room.hostId = remainingPlayers[0];
                        console.log(`[NEW HOST] ${room.hostId} in ${roomId}`);
                    } else {
                        room.hostId = null;
                    }
                }

                // sync state
                emitRoomState(io, roomId, room);

                break;
            }
        }
    });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});