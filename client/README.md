# Mafia Noir — Client

> React 19 + Vite frontend for the Mafia Noir social deduction game.

---

## Screenshot / UI Flow

```
/ (Landing)          /profile-setup          /home                 /room/:id
┌───────────┐        ┌──────────────┐        ┌──────────────┐      ┌───────────────┐
│  MAFIA    │ Google │ Set username │        │ New Operation│      │  Game HUD     │
│  NOIR     │──────▶ │ + display    │──────▶ │ Join by code │────▶ │  Phase Views  │
│  [Sign in]│  OAuth │ name         │        │              │      │  Voice Chat   │
└───────────┘        └──────────────┘        └──────────────┘      └───────────────┘
```

---

## Why This Exists

The client is the single-page application that ties together the live game UI, phase-aware voice chat, and animated role/event reveals — all rendered in one tab with no external tools needed.

---

## Key Technical Highlights

- **Phase-driven rendering** — a single `RoomPage` component switches between `LobbyView`, `NightView`, `DayView`, `VotingView`, and `EndGameView` based on the server-authoritative phase received over Socket.IO.
- **WebRTC voice with smart muting** — `useWebRTC` manages peer connections; `useMicrophone` captures the local stream. Audio playback is automatically muted per-player based on the game phase (e.g., non-Mafia players cannot hear anything during the night phase).
- **ICE candidate queuing** — candidates that arrive before `setRemoteDescription` completes are buffered in a `Map` and flushed once the remote description is ready, preventing dropped connections in fast-join scenarios.
- **Animated overlays** — Framer Motion powers role reveal cards, morning-newspaper results, and vote reveal sequences layered over the game view without unmounting it.
- **Zustand stores** — `roomStore` and `playerStore` keep the shared room snapshot and the local player's private role in sync with Socket.IO events, avoiding prop-drilling across the component tree.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 7 | Build tool & dev server |
| Tailwind CSS 3 | Utility-first styling |
| Zustand | Client-side state management |
| Framer Motion | Animations & transitions |
| React Router DOM 7 | Client-side routing |
| Socket.IO Client 4 | Real-time server communication |
| WebRTC (browser-native) | Peer-to-peer voice chat |
| @react-oauth/google | Google One Tap / OAuth flow |

---

## How to Run Locally

### Prerequisites

- Node.js ≥ 18
- The [server](../server/README.md) running on `http://localhost:3000`
- A Google OAuth Client ID

### Setup

```bash
cd client
npm install
```

Create a `.env` file in the `client/` directory:

```env
VITE_SERVER_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Start the dev server

```bash
npm run dev
# → http://localhost:5173
```

### Build for production

```bash
npm run build
# Output: dist/
```

### Lint

```bash
npm run lint
```

---

## Architecture Overview

```
src/
├── pages/
│   ├── LandingPage.jsx      # Google OAuth login
│   ├── ProfileSetup.jsx     # One-time username / display name
│   ├── HomePage.jsx         # Create / join room lobby
│   └── RoomPage.jsx         # Full game view (phases, voice, overlays)
│
├── components/
│   ├── game/
│   │   ├── LobbyView.jsx    # Pre-game player list
│   │   ├── NightView.jsx    # Role action panel
│   │   ├── DayView.jsx      # Discussion view
│   │   ├── VotingView.jsx   # Vote panel
│   │   ├── EndGameView.jsx  # Win / loss screen
│   │   ├── RoleReveal.jsx   # Animated role card on game start
│   │   ├── MorningReport.jsx# Night result newspaper
│   │   ├── VoteReveal.jsx   # Post-vote summary
│   │   ├── DetectiveResult  # Detective investigation result
│   │   ├── DoctorResult     # Doctor save result
│   │   ├── GameHUD.jsx      # Persistent timer + phase badge
│   │   └── PlayerFooter.jsx # Mic toggle + role reminder
│   ├── PlayerCard.jsx
│   ├── RulebookPanel.jsx
│   └── PageLayout.jsx
│
├── hooks/
│   ├── useWebRTC.js         # RTCPeerConnection management
│   └── useMicrophone.js     # getUserMedia + mute control
│
├── socket/
│   └── socket.js            # Singleton Socket.IO client
│
└── store/
    ├── roomStore.js          # Zustand: room state snapshot
    └── playerStore.js        # Zustand: local player role
```

---

## Known Limitations / What I'd Improve

| Limitation | Improvement |
|---|---|
| No TURN server | Add Twilio / coturn TURN credentials for players behind strict NATs |
| Text chat fallback | Add a text chat channel for players without a microphone |
| No TypeScript | Migrate to TypeScript for better type safety across stores and socket events |
| Role reveal only at start | Let dead players spectate with full role visibility |
| No mobile layout polish | Add responsive breakpoints for smaller screens |

