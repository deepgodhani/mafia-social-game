# Mafia Noir — Server

> Node.js + Socket.IO game server for the Mafia Noir social deduction game.

---

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────┐
│                  Express HTTP Server                      │
│                                                          │
│  POST /auth/google  ──▶  verifyGoogleToken               │
│                          getOrCreateUserFromGoogle        │
│                          createToken (JWT)  ──▶ client   │
│                                                          │
│  POST /profile/setup ──▶ verifyToken (JWT middleware)    │
│                          update username / displayName    │
└──────────────────────────────────────────────────────────┘
                          │
                    Socket.IO
                          │
┌──────────────────────────────────────────────────────────┐
│                   Socket.IO Server                        │
│                                                          │
│  Middleware: verifyToken → attach user to socket         │
│                                                          │
│  Events (inbound):                                       │
│    create-room  join-room  start-game                    │
│    vote  night-action  play-again  disconnect            │
│    webrtc-offer  webrtc-answer  webrtc-ice-candidate     │
│                                                          │
│  Events (outbound):                                      │
│    room-state  your-role  mafia-team  timer-tick         │
│    detective-result  doctor-result  room-created         │
└──────────────────────────────────────────────────────────┘
                          │
              In-memory Room Store (rooms{})
```

---

## Why This Exists

The server is the single source of truth for all game state. It enforces rules (role assignments, win conditions, legal actions per phase), drives timed phase transitions, and relays WebRTC signalling between peers. Keeping the game logic server-side prevents cheating and keeps the client purely reactive.

---

## Key Technical Highlights

- **Authoritative game engine** — every phase transition, elimination, night resolution, and win-condition check runs exclusively on the server; the client receives a sanitised public snapshot so roles and night actions are never exposed to the wrong player.
- **Phase timer broadcast** — `startPhaseTimer` runs a `setInterval` on the server and emits `timer-tick` every second, ensuring all connected clients share an identical countdown regardless of clock drift.
- **Role-based targeted events** — after `assignRoles`, each player receives their own role via `socket.to(socketId).emit("your-role", ...)` and Mafia members receive their teammates via a separate `mafia-team` event, keeping sensitive data off the broadcast channel.
- **Reconnection handling** — when a player reconnects, their user ID (from the JWT) is matched to the existing room entry and their socket ID is updated; a `disconnectTimers` map delays room deletion by 5 s (60 s post-game) to survive brief disconnects.
- **Socket.IO middleware auth** — every connection is authenticated synchronously in a middleware: the JWT is extracted from `socket.handshake.auth.token`, verified, and the resulting user object is attached to the socket before any event handler runs.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js (ES Modules) | Runtime |
| Express 5 | HTTP API (`/auth/google`, `/profile/setup`, `/health`) |
| Socket.IO 4 | Real-time bidirectional events |
| jsonwebtoken | JWT creation and verification |
| google-auth-library | Server-side Google ID token verification |
| uuid | Room ID generation |
| dotenv | Environment variable loading |
| nodemon | Hot-reload during development |

---

## How to Run Locally

### Prerequisites

- Node.js ≥ 18
- A Google OAuth Client ID (from [Google Cloud Console](https://console.cloud.google.com/))

### Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=3000
JWT_SECRET=your_jwt_secret_here
GOOGLE_CLIENT_ID=your_google_client_id_here
```

### Start the dev server (with hot-reload)

```bash
npm run dev
```

### Start in production mode

```bash
npm start
```

### Health check

```
GET http://localhost:3000/health
→ { "status": "ok" }
```

---

## Architecture Overview

```
src/
├── index.js                 # Express + Socket.IO bootstrap, all socket event handlers
│
├── auth/
│   ├── verifyGoogleToken.js # Validates Google ID token via google-auth-library
│   ├── createToken.js       # Signs a JWT for the user
│   ├── verifyToken.js       # Verifies a JWT (used in middleware & REST routes)
│   └── userStore.js         # In-memory user registry (id → user object)
│
├── game/
│   ├── phases.js            # PHASES enum (LOBBY, NIGHT, DISCUSSION, VOTING, …)
│   ├── assignRoles.js       # Distributes MAFIA / DETECTIVE / DOCTOR / CITIZEN
│   ├── sendRoles.js         # Emits "your-role" to each player's socket
│   ├── sendMafiaTeam.js     # Emits "mafia-team" to Mafia sockets only
│   ├── changePhase.js       # Updates room.game.phase + broadcasts room-state
│   ├── advancePhase.js      # Phase transition logic + timer kickoff
│   ├── startPhaseTimer.js   # setInterval countdown broadcaster
│   ├── resolveVotes.js      # Tallies votes, returns eliminated player ID
│   ├── resolveNight.js      # Applies Mafia kill, Doctor save, Detective check
│   ├── checkWinCondition.js # Returns "CITIZENS_WIN" | "MAFIA_WIN" | null
│   ├── resetGame.js         # Resets room.game for a rematch
│   └── shuffleArray.js      # Fisher-Yates shuffle utility
│
├── rooms/
│   ├── rooms.js             # Shared in-memory rooms object
│   ├── getPublicRoomState.js# Strips private data before broadcast
│   ├── emitRoomState.js     # Calls getPublicRoomState → io.to(roomId).emit
│   └── isHost.js            # Checks whether a userId is the room host
│
└── utils/
    └── generateRoomId.js    # Generates short alphanumeric room codes
```

### Game Phase Flow

```
start-game
    │
    ▼
STARTING (2 s) ──▶ NIGHT (90 s)
                        │
                        ▼
                   DAY_RESULT (7 s) ──▶ DISCUSSION (4 min)
                                              │
                                              ▼
                                         VOTING (20 s)
                                              │
                                    ┌─────────┴──────────┐
                              win condition?           no win
                                    │                    │
                                    ▼                    ▼
                                END_GAME         ELIMINATION (8 s)
                                                         │
                                                         ▼
                                                    NIGHT (90 s) …
```

---

## Known Limitations / What I'd Improve

| Limitation | Improvement |
|---|---|
| State stored in RAM | Use Redis to persist rooms — survive restarts and enable horizontal scaling |
| Single Mafia kill vote | Collect individual Mafia votes server-side and use majority to pick the target |
| No TURN server | Relay WebRTC signalling but also provide TURN credentials for restrictive NAT environments |
| No rate limiting | Add express-rate-limit on auth endpoints to prevent brute-force |
| No persistent users | Store user profiles in a database (e.g., PostgreSQL) to enable stats and history |
| No test suite | Add unit tests for `assignRoles`, `resolveVotes`, `checkWinCondition`, and `resolveNight` |
