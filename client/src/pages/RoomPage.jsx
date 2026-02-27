import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket/socket";
import { useRoomStore } from "../store/roomStore";
import { usePlayerStore } from "../store/playerStore";

import { useMicrophone } from "../hooks/useMicrophone";
import { useWebRTC } from "../hooks/useWebRTC";

import LobbyView from "../components/game/LobbyView";
import NightView from "../components/game/NightView";
import DayView from "../components/game/DayView";
import VotingView from "../components/game/VotingView";
import EndView from "../components/game/EndGameView";

import PhaseWrapper from "../components/game/PhaseWrapper";
import GameHUD from "../components/game/GameHUD";
import PhaseTransition from "../components/game/PhaseTransition";
import RoleReveal from "../components/game/RoleReveal";
import MorningReport from "../components/game/MorningReport";


function RoomPage() {
  const { id } = useParams();

  const { room, setRoom } = useRoomStore();
  const { role, setRole } = usePlayerStore();

  const [timer, setTimer] = useState(null);

  const token = localStorage.getItem("token");

  const { stream, startMicrophone, audioRef, setMuted } =
    useMicrophone();

  const { createPeer, getPeer } = useWebRTC();

  const [showRoleReveal, setShowRoleReveal] = useState(false);

  const [showMorningReport, setShowMorningReport] =
    useState(false);


  const [previousPhase, setPreviousPhase] = useState(null); 
  const myUserId = token
    ? JSON.parse(atob(token.split(".")[1])).id
    : null;



  // ========================
  // ROOM + ROLE
  // ========================
  useEffect(() => {
    socket.emit("join-room", { roomId: id });

    socket.on("room-state", setRoom);

    socket.on("your-role", ({ role }) => {
      setRole(role);
    });


    return () => {
      socket.off("room-state");
      socket.off("your-role");
    };
  }, [id, setRoom, setRole]);

  // ========================
  // TIMER
  // ========================
  useEffect(() => {
    if (room?.game?.timer?.remaining != null) {
      setTimer(room.game.timer.remaining);
    }
  }, [room?.game?.timer?.remaining]);

  useEffect(() => {
    socket.on("timer-tick", ({ remaining }) => {
      setTimer(remaining);
    });

    return () => socket.off("timer-tick");
  }, []);

  // ========================
  // VOICE MUTE RULES
  // ========================
  useEffect(() => {
    if (!room?.game?.phase || !role) return;

    if (room.game.phase === "DAY") {
      setMuted(false);
    } else if (room.game.phase === "NIGHT") {
      setMuted(role !== "MAFIA");
    } else if (room.game.phase === "VOTING") {
      setMuted(true);
    }
  }, [room?.game?.phase, role, setMuted]);

  // ========================
  // WEBRTC
  // ========================
  useEffect(() => {
    socket.on("webrtc-offer", async ({ offer, fromUserId }) => {
      const peer = createPeer(fromUserId, stream, (candidate) => {
        socket.emit("webrtc-ice-candidate", {
          roomId: id,
          candidate,
          targetUserId: fromUserId,
        });
      });

      await peer.setRemoteDescription(
        new RTCSessionDescription(offer)
      );

      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      socket.emit("webrtc-answer", {
        roomId: id,
        answer,
        targetUserId: fromUserId,
      });
    });

    return () => socket.off("webrtc-offer");
  }, [id, stream, createPeer]);

  useEffect(() => {
    socket.on("webrtc-answer", async ({ answer, fromUserId }) => {
      const peer = getPeer(fromUserId);
      if (!peer) return;

      await peer.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    return () => socket.off("webrtc-answer");
  }, [getPeer]);

  useEffect(() => {
    socket.on("webrtc-ice-candidate", async ({ candidate, fromUserId }) => {
      const peer = getPeer(fromUserId);
      if (!peer) return;

      await peer.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    });

    return () => socket.off("webrtc-ice-candidate");
  }, [getPeer]);

  useEffect(() => {
    if (room?.game?.phase === "STARTING") {
      setShowRoleReveal(true);
    }
  }, [room?.game?.phase]);

  // useEffect(() => {
  //   if (
  //     room?.game?.phase === "DAY" &&
  //     room?.game?.lastNightResult
  //   ) {
  //     setShowMorningReport(true);
  //   }
  // }, [room?.game?.phase, room?.game?.lastNightResult]);

  useEffect(() => {
    if (!room?.game?.phase) return;
  
    // detect NIGHT -> DAY transition
    if (
      previousPhase === "NIGHT" &&
      room.game.phase === "DAY" &&
      room.game.lastNightResult
    ) {
      setShowMorningReport(true);
    }
  
    setPreviousPhase(room.game.phase);
  }, [room?.game?.phase]);

  // ========================
  // PHASE RENDER
  // ========================
  if (!room) return null;

  const phase = room.game.phase;

  let phaseContent = null;

  if (phase === "LOBBY" || phase === "STARTING") {
    phaseContent = (
      <LobbyView
        room={room}
        myUserId={myUserId}
        onStart={() =>
          socket.emit("start-game", { roomId: id })
        }
      />
    );
  } else if (phase === "NIGHT") {
    phaseContent = (
      <NightView
        role={role}
        timer={timer}
        players={room.players}
        myUserId={myUserId}
        onNightAction={(targetUserId) =>
          socket.emit("night-action", {
            roomId: id,
            targetUserId,
          })
        }
      />
    );
  } else if (phase === "DAY") {
    phaseContent = (
      <DayView timer={timer} players={room.players} />
    );
  } else if (phase === "VOTING") {
    phaseContent = (
      <VotingView
        timer={timer}
        players={room.players}
        myUserId={myUserId}
        onVote={(targetId) =>
          socket.emit("vote", {
            roomId: id,
            targetId,
          })
        }
      />
    );
  } else if (phase === "ENDED") {
    phaseContent = (
      <EndView
        result={room.game.result}
        players={room.players}
      />
    );
  }

  // ========================
  // FINAL RENDER
  // ========================
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <GameHUD
        phase={phase}
        timer={timer}
        role={role}
        roomId={id}
      />

      <PhaseTransition phase={phase} />

      {showRoleReveal &&
        room?.game?.phase === "STARTING" &&
        role && (
          <RoleReveal
            role={role}
            onFinish={() => setShowRoleReveal(false)}
          />
        )}

      {showMorningReport && (
        <MorningReport
          result={room.game.lastNightResult}
          onFinish={() => setShowMorningReport(false)}
        />
      )}

      <PhaseWrapper phase={phase}>
        {phaseContent}
      </PhaseWrapper>

      <audio ref={audioRef} autoPlay />
    </div>
  );
}

export default RoomPage;