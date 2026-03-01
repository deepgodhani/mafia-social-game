import { useEffect, useRef, useState } from "react";
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
import PlayerFooter from "../components/game/PlayerFooter";
import VoteReveal from "../components/game/VoteReveal";
import DetectiveResult from "../components/game/DetectiveResult";
import DoctorResult from "../components/game/DoctorResult";

function RoomPage() {
  const { id } = useParams();

  const { room, setRoom } = useRoomStore();
  const { role, setRole } = usePlayerStore();

  const [timer, setTimer] = useState(null);

  const token = localStorage.getItem("token");

  const { stream, startMicrophone, audioRef, setMuted, stopMicrophone } =
    useMicrophone();

  const { createPeer, getPeer, closeAll } = useWebRTC();

  const [showRoleReveal, setShowRoleReveal] = useState(false);
  const [showMorningReport, setShowMorningReport] = useState(false);

  const [previousPhase, setPreviousPhase] = useState(null);

  const myUserId = token ? JSON.parse(atob(token.split(".")[1])).id : null;

  const [showVoteReveal, setShowVoteReveal] = useState(false);

  const [detectiveResult, setDetectiveResult] = useState(null);
  const [doctorResult, setDoctorResult] = useState(null);

  const [userMuted, setUserMuted] = useState(false);
  const [mafiaTeam, setMafiaTeam] = useState([]);

  // ========================
  // ICE candidate queue (fix: candidates arriving before remoteDescription)
  // ========================
  const pendingIceRef = useRef(new Map()); // Map<fromUserId, RTCIceCandidateInit[]>

  const queueIce = (fromUserId, candidate) => {
    const map = pendingIceRef.current;
    const list = map.get(fromUserId) ?? [];
    list.push(candidate);
    map.set(fromUserId, list);
  };

  const flushIce = async (fromUserId, peer) => {
    const map = pendingIceRef.current;
    const list = map.get(fromUserId);
    if (!list?.length) return;

    for (const c of list) {
      try {
        await peer.addIceCandidate(new RTCIceCandidate(c));
      } catch (e) {
        console.warn("Failed to add queued ICE candidate", { fromUserId, e });
      }
    }

    map.delete(fromUserId);
  };

  // ========================
  // ROOM + ROLE
  // ========================
  useEffect(() => {
    const onRoomState = (nextRoom) => setRoom(nextRoom);

    const onYourRole = ({ role }) => {
      setRole(role);
    };

    const onDetectiveResult = (payload) => setDetectiveResult(payload);
    const onDoctorResult = (payload) => setDoctorResult(payload);

    const onMafiaTeam = (team) => {
      // team: [{ userId, name }]
      setMafiaTeam(team.map((m) => m.userId));
    };

    socket.emit("join-room", { roomId: id });

    socket.on("room-state", onRoomState);
    socket.on("your-role", onYourRole);
    socket.on("detective-result", onDetectiveResult);
    socket.on("doctor-result", onDoctorResult);
    socket.on("mafia-team", onMafiaTeam);

    return () => {
      socket.off("room-state", onRoomState);
      socket.off("your-role", onYourRole);
      socket.off("detective-result", onDetectiveResult);
      socket.off("doctor-result", onDoctorResult);
      socket.off("mafia-team", onMafiaTeam);
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
    const onTick = ({ remaining }) => setTimer(remaining);

    socket.on("timer-tick", onTick);
    return () => socket.off("timer-tick", onTick);
  }, []);

  // ========================
  // MICROPHONE START
  // ========================
  // useEffect(() => {
  //   startMicrophone();
  //   return () => {
  //     stopMicrophone();
  //   };
  // }, [startMicrophone, stopMicrophone]);


  useEffect(() => {
    startMicrophone();
  
    return () => {
      stopMicrophone();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);   // ⭐ RUN ONLY ONCE

  // ========================
  // VOICE MUTE RULES (phase + user toggle)
  // ========================
  const phase = room?.game?.phase || "LOBBY";
  const me = room?.players?.find((p) => p.userId === myUserId);

  const hardMuted = !me?.alive || (phase === "NIGHT" && role !== "MAFIA") || phase === "VOTING";

  useEffect(() => {
    const effectiveMuted = hardMuted || userMuted;
    setMuted(effectiveMuted);
  }, [hardMuted, userMuted, setMuted]);

  // ========================
  // WEBRTC - signaling handlers with state guards + ICE queue
  // ========================
  useEffect(() => {
    const onOffer = async ({ offer, fromUserId }) => {
      const peer = createPeer(fromUserId, stream, (candidate) => {
        socket.emit("webrtc-ice-candidate", {
          roomId: id,
          candidate,
          targetUserId: fromUserId,
        });
      });

      try {
        // Basic glare tolerance: if we aren't stable, attempt rollback.
        // (Not supported in all browsers; safe to ignore failures.)
        if (peer.signalingState !== "stable") {
          try {
            await peer.setLocalDescription({ type: "rollback" });
          } catch {
            // ignore
          }
        }

        await peer.setRemoteDescription(new RTCSessionDescription(offer));
        await flushIce(fromUserId, peer);

        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);

        socket.emit("webrtc-answer", {
          roomId: id,
          answer,
          targetUserId: fromUserId,
        });
      } catch (e) {
        console.error("Error handling webrtc-offer", { fromUserId, e });
      }
    };

    socket.on("webrtc-offer", onOffer);
    return () => socket.off("webrtc-offer", onOffer);
  }, [id, stream, createPeer]);

  useEffect(() => {
    const onAnswer = async ({ answer, fromUserId }) => {
      const peer = getPeer(fromUserId);
      if (!peer) return;

      try {
        // Fix: ignore duplicate/late answers (prevents "Called in wrong state: stable").
        if (peer.signalingState !== "have-local-offer") return;

        await peer.setRemoteDescription(new RTCSessionDescription(answer));
        await flushIce(fromUserId, peer);
      } catch (e) {
        console.error("Error handling webrtc-answer", { fromUserId, e });
      }
    };

    socket.on("webrtc-answer", onAnswer);
    return () => socket.off("webrtc-answer", onAnswer);
  }, [getPeer]);

  useEffect(() => {
    const onIceCandidate = async ({ candidate, fromUserId }) => {
      const peer = getPeer(fromUserId);
      if (!peer) return;

      try {
        // Fix: queue ICE until a remoteDescription is set.
        if (!peer.remoteDescription) {
          queueIce(fromUserId, candidate);
          return;
        }

        await peer.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.warn("Error handling webrtc-ice-candidate", { fromUserId, e });
      }
    };

    socket.on("webrtc-ice-candidate", onIceCandidate);
    return () => socket.off("webrtc-ice-candidate", onIceCandidate);
  }, [getPeer]);

  // create offers to other players once we have stream + room
  useEffect(() => {
    if (!room || !stream || !myUserId) return;

    // Normalize to string so comparisons are consistent (avoids string/number weirdness).
    const myIdKey = String(myUserId);

    const connect = async () => {
      for (const p of room.players) {
        if (p.userId === myUserId) continue;

        const otherIdKey = String(p.userId);

        // tie-breaker: only user with smaller id starts the connection
        if (myIdKey >= otherIdKey) continue;

        if (getPeer(p.userId)) continue;

        const peer = createPeer(p.userId, stream, (candidate) => {
          socket.emit("webrtc-ice-candidate", {
            roomId: id,
            candidate,
            targetUserId: p.userId,
          });
        });

        try {
          const offer = await peer.createOffer();
          await peer.setLocalDescription(offer);

          socket.emit("webrtc-offer", {
            roomId: id,
            offer,
            targetUserId: p.userId,
          });
        } catch (e) {
          console.error("Failed creating/sending offer", { targetUserId: p.userId, e });
        }
      }
    };

    connect();
  }, [room, stream, myUserId, createPeer, getPeer, id]);

  // cleanup peers on unmount
  useEffect(() => {
    return () => {
      closeAll();
      pendingIceRef.current.clear();
    };
  }, [closeAll]);

  useEffect(() => {
    if (room?.game?.phase === "STARTING") {
      setShowRoleReveal(true);
    }
  }, [room?.game?.phase]);

  useEffect(() => {
    if (!room?.game?.phase) return;

    // detect NIGHT -> DAY transition
    if (
      previousPhase === "NIGHT" &&
      room.game.phase === "DAY_RESULT" &&
      room.game.lastNightResult
    ) {
      setShowMorningReport(true);
    }

    if (previousPhase === "VOTING" && room.game.phase !== "VOTING") {
      setShowVoteReveal(true);
    }

    setPreviousPhase(room.game.phase);
  }, [room?.game?.phase, previousPhase, room?.game?.lastNightResult]);

  // hide morning report once we leave DAY_RESULT
  useEffect(() => {
    if (!room?.game?.phase) return;
    if (room.game.phase !== "DAY_RESULT" && showMorningReport) {
      setShowMorningReport(false);
    }
  }, [room?.game?.phase, showMorningReport]);

  // ========================
  // REMOTE AUDIO PLAYBACK RULES
  // ========================
  useEffect(() => {
    if (!room || !myUserId) return;

    room.players.forEach((p) => {
      if (p.userId === myUserId) return;

      const peer = getPeer(p.userId);
      if (!peer || !peer._remoteAudio) return;

      let mutePlayback = false;

      if (!me?.alive) {
        // dead players can listen to everything
        mutePlayback = false;
      } else if (phase === "DISCUSSION" || phase === "DAY_RESULT") {
        mutePlayback = false;
      } else if (phase === "NIGHT") {
        if (role === "MAFIA") {
          // mafia hear only other mafia teammates at night
          mutePlayback = !mafiaTeam.includes(p.userId);
        } else {
          mutePlayback = true;
        }
      } else if (phase === "VOTING") {
        mutePlayback = true;
      } else {
        mutePlayback = false;
      }

      peer._remoteAudio.muted = mutePlayback;
    });
  }, [room, myUserId, getPeer, phase, role, mafiaTeam, me?.alive]);

  // ========================
  // PHASE RENDER
  // ========================
  if (!room) return null;

  let phaseContent = null;

  if (phase === "LOBBY" || phase === "STARTING") {
    phaseContent = (
      <LobbyView
        room={room}
        myUserId={myUserId}
        onStart={() => socket.emit("start-game", { roomId: id })}
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
  } else if (phase === "DAY_RESULT" || phase === "DISCUSSION") {
    phaseContent = (
      <DayView
        timer={timer}
        players={room.players}
        onShowMorningReport={() => setShowMorningReport(true)}
      />
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
  } else if (phase === "END_GAME") {
    phaseContent = <EndView result={room.game.result} players={room.players} />;
  }

  // ========================
  // FINAL RENDER
  // ========================
  return (
    <div className="min-h-screen bg-black text-amber-50 flex flex-col">
      <GameHUD phase={phase} timer={timer} role={role} roomId={id} />

      <PhaseTransition phase={phase} />

      {showRoleReveal && room?.game?.phase === "STARTING" && role && (
        <RoleReveal role={role} onFinish={() => setShowRoleReveal(false)} />
      )}

      {showMorningReport && (
        <MorningReport
          result={room.game.lastNightResult}
          onFinish={() => setShowMorningReport(false)}
        />
      )}

      {detectiveResult && (
        <DetectiveResult result={detectiveResult} onClose={() => setDetectiveResult(null)} />
      )}

      {doctorResult && (
        <DoctorResult result={doctorResult} onClose={() => setDoctorResult(null)} />
      )}

      {showVoteReveal && (
        <VoteReveal
          votes={room.game?.lastVotes || []}
          players={room.players}
          onFinish={() => setShowVoteReveal(false)}
        />
      )}

      <div className="flex-1">
        <PhaseWrapper phase={phase}>{phaseContent}</PhaseWrapper>
      </div>

      <PlayerFooter
        role={role}
        roomId={id}
        me={me}
        muted={hardMuted || userMuted}
        hardMuted={hardMuted}
        onToggleMute={() => setUserMuted((prev) => !prev)}
      />

      <audio ref={audioRef} autoPlay />
    </div>
  );
}

export default RoomPage;