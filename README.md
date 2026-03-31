# 🎭 Mafia Noir

> A real-time, browser-based social deduction game with live voice chat.

---

## Demo 

```
┌─────────────────────────────────────────────────────┐
│                     MAFIA  NOIR                     │
│                  ─── Noir ───                       │
│                                                     │
│  ┌──────────┐   NIGHT PHASE  ┌──────────────────┐  │
│  │ 🎭 Role  │   Timer: 01:23 │  Player Board    │  │
│  │  MAFIA   │                │  ● Alice  (alive) │  │
│  │          │  Target:       │  ● Bob    (alive) │  │
│  │ [Act]    │  ○ Bob         │  ✕ Carol  (dead)  │  │
│  └──────────┘  ○ Dave        └──────────────────┘  │
│                                                     │
│   [ 🎤 Mic ]  DISCUSSION → VOTING → ELIMINATION    │
└─────────────────────────────────────────────────────┘
```

**Live demo:** https://mafia.deepgodhani.me

---

## Why I Built This

Classic Mafia / Werewolf is a beloved party game, but playing it digitally forces you to bounce between a game tab and a Discord/Zoom call. I wanted a single, self-contained experience where voice chat, role reveals, timed phases, and voting all live in the same window — no external tools required. The noir theme made it feel like an actual secret society.

---

## Key Technical Highlights

- **WebRTC peer-to-peer voice** — players hear each other in real time; audio is automatically muted/unmuted based on the current phase (e.g., only Mafia members hear each other at night, everyone is muted during voting).
- **Event-driven game engine** — the server drives every phase transition (`LOBBY → NIGHT → DAY_RESULT → DISCUSSION → VOTING → ELIMINATION → END_GAME`) with countdown timers broadcast via Socket.IO; the client is purely reactive.
- **Reconnection resilience** — disconnected players rejoin their room automatically (socket ID is re-mapped to user ID from the JWT); the room is kept alive for 60 seconds after a game ends to allow a replay.
- **Google OAuth + JWT** — authentication is handled server-side with `google-auth-library`; a short-lived JWT is issued and verified on every Socket.IO handshake via middleware.
- **Animated phase UI** — Framer Motion drives smooth phase transitions (role reveals, morning newspapers, vote reveals) layered over a single-page game view managed by Zustand.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend framework** | React 19 + Vite 7 |
| **Styling** | Tailwind CSS 3 |
| **State management** | Zustand |
| **Animations** | Framer Motion |
| **Routing** | React Router DOM 7 |
| **Real-time (client)** | Socket.IO Client 4 |
| **Voice chat** | WebRTC (browser-native) |
| **Authentication (client)** | @react-oauth/google |
| **Backend runtime** | Node.js (ES Modules) |
| **HTTP server** | Express 5 |
| **Real-time (server)** | Socket.IO 4 |
| **Auth** | Google Auth Library + jsonwebtoken |
| **Hosting — client** | Azure Static Web Apps |
| **Hosting — server** | Azure App Service |

---

## How to Run Locally

### Prerequisites

- Node.js ≥ 18
- A Google OAuth Client ID (from [Google Cloud Console](https://console.cloud.google.com/))

### 1. Clone the repo

```bash
git clone https://github.com/deepgodhani/mafia-social-game.git
cd mafia-social-game
```

### 2. Start the server

```bash
cd server
npm install

# Create a .env file
cat > .env <<'EOF'
PORT=3000
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
EOF

npm run dev      # uses nodemon for hot-reload
```

### 3. Start the client

```bash
cd client
npm install

# Create a .env file
cat > .env <<'EOF'
VITE_SERVER_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
EOF

npm run dev      # Vite dev server on http://localhost:5173
```

Open **http://localhost:5173** in two or more browser tabs to test multiplayer.

---

## Architecture Overview

```
Browser A                    Browser B
   │  Socket.IO + WebRTC  │     │  Socket.IO + WebRTC  │
   └──────────┬───────────┘     └───────────┬──────────┘
              │                             │
              ▼                             ▼
       ┌─────────────────────────────────────────┐
       │          Node.js / Express Server        │
       │                                          │
       │  ┌──────────────┐  ┌──────────────────┐ │
       │  │  REST API    │  │   Socket.IO       │ │
       │  │ /auth/google │  │  Game Engine      │ │
       │  │ /profile     │  │  Phase Manager    │ │
       │  └──────────────┘  │  Room Store (RAM) │ │
       │                    └──────────────────┘ │
       └─────────────────────────────────────────┘
```

- **Rooms** are stored in server memory (a plain JS object keyed by room ID).
- **Game state** is authoritative on the server; clients receive a sanitised snapshot (`getPublicRoomState`) on every change — private info (roles, night actions) is sent via targeted `socket.to(socketId).emit(...)` calls.
- **WebRTC signalling** (offer / answer / ICE candidates) is relayed through the Socket.IO server; after the handshake, audio streams travel peer-to-peer.
- **Phase timers** run on the server (`setInterval`) and broadcast `timer-tick` events each second so all clients stay in sync.

---

## Known Limitations / What I'd Improve

| Limitation | Improvement |
|---|---|
| Room state stored in RAM | Persist rooms in Redis so the server can restart without losing active games |
| No TURN server configured | Add a TURN/STUN server (e.g., Twilio) for players behind strict NATs |
| Single Mafia vote | Allow individual Mafia members to submit a kill target and use majority vote |
| No chat fallback | Add a text chat channel for players whose microphone is unavailable |
| No spectator mode | Let observers join a finished/running game without a role |
| Max ~20 players (PLAYER_COLORS array) | Dynamically generate colours and test with larger lobbies |
