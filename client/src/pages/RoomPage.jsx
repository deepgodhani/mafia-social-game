import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket/socket";
import { useRoomStore } from "../store/roomStore";
import { usePlayerStore } from "../store/playerStore";
import { useNavigate } from "react-router-dom";
import PlayerCard from "../components/PlayerCard";
import { useMicrophone } from "../hooks/useMicrophone";
import { useWebRTC } from "../hooks/useWebRTC";

function RoomPage() {
    const { id } = useParams();
    const { room, setRoom } = useRoomStore();
    const { role, setRole } = usePlayerStore();
    const [timer, setTimer] = useState(null);

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const { stream, error, startMicrophone, audioRef, setMuted } = useMicrophone();
    const { createPeer, getPeer } = useWebRTC();

    const myUserId = token
        ? JSON.parse(atob(token.split(".")[1])).id
        : null;

    useEffect(() => {
        socket.emit("join-room", {
            roomId: id,
        });


        socket.on("room-state", (roomData) => {
            console.log("ROOM UPDATE:", roomData);
            setRoom(roomData);
        });

        socket.on("your-role", ({ role }) => {
            console.log("MY ROLE:", role);
            setRole(role);
        });


        return () => {
            socket.off("room-state");
            socket.off("your-role");
        };

    }, [id, setRoom]);

    useEffect(() => {
        if (room?.game?.timer?.remaining != null) {
            setTimer(room.game.timer.remaining);
        }
    }, [room?.game?.timer?.remaining]);

    useEffect(() => {
        socket.on("timer-tick", ({ remaining }) => {
            setTimer(remaining);
        });

        return () => {
            socket.off("timer-tick");
        };
    }, []);

    useEffect(() => {
        if (room?.game?.phase) {
            console.log("PHASE CHANGED:", room.game.phase);
        }
    }, [room?.game?.phase]);


    useEffect(() => {
        socket.on("webrtc-offer", async ({ offer, fromUserId }) => {
            console.log("[WEBRTC] OFFER RECEIVED");

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
    }, [id]);

    useEffect(() => {
        socket.on("webrtc-answer", async ({ answer, fromUserId }) => {
            const peer = getPeer(fromUserId);
            if (!peer) return;

            console.log("[WEBRTC] ANSWER RECEIVED");

            await peer.setRemoteDescription(
                new RTCSessionDescription(answer)
            );
        });

        return () => socket.off("webrtc-answer");
    }, []);

    useEffect(() => {
        socket.on("webrtc-ice-candidate", async ({ candidate, fromUserId }) => {
            const peer = getPeer(fromUserId);
            if (!peer) return;

            console.log("[WEBRTC] ICE RECEIVED");

            await peer.addIceCandidate(
                new RTCIceCandidate(candidate)
            );
        });

        return () => socket.off("webrtc-ice-candidate");
    }, []);

    useEffect(() => {
        if (!room?.game?.phase || !role) return;

        // DAY → everyone talks
        if (room.game.phase === "DAY") {
            setMuted(false);
        }

        // NIGHT → only mafia talks
        if (room.game.phase === "NIGHT") {
            if (role === "MAFIA") {
                setMuted(false);
            } else {
                setMuted(true);
            }
        }

        // VOTING → everyone muted (optional)
        if (room.game.phase === "VOTING") {
            setMuted(true);
        }

    }, [room?.game?.phase, role]);


    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6">
            <button onClick={() => navigate("/")} className="mb-4 text-blue-400 underline">
                &larr; Back to Home
            </button>
            <h1 className="text-2xl font-bold mb-4">Room: {id}</h1>
            <div className="mb-4 p-3 bg-zinc-800 rounded-lg">
                <p>Phase: {room?.game?.phase}</p>
                <p>Round: {room?.game?.round}</p>
                <p>Timer: {timer ?? room?.game?.timer?.remaining ?? "-"}</p>
            </div>
            {room?.game?.phase === "ENDED" && (
                <div className="mt-4 p-4 bg-green-700 rounded-xl text-center text-xl font-bold">
                    {room?.game?.result === "CITIZENS_WIN"
                        ? "Citizens Win!"
                        : "Mafia Wins!"}
                </div>
            )}

            <div className="mb-4 p-3 bg-zinc-800 rounded-lg">
                <p>My Role: {role || "Unknown"}</p>
            </div>
            {room?.hostId === myUserId && !room?.game?.started && (
                <button
                    onClick={() => socket.emit("start-game", { roomId: id })}
                    className="bg-green-600 px-4 py-2 rounded-lg mb-4"
                >
                    Start Game
                </button>
            )}
            <h2 className="text-xl mb-2">Players:</h2>

            {room?.players?.map((player) => (
                <PlayerCard
                    key={player.userId}
                    player={player}
                    isHost={room?.hostId === player.userId}
                    canVote={
                        room?.game?.phase === "VOTING" &&
                        player.userId !== myUserId &&
                        player.alive
                    }
                    revealRoles={room?.game?.phase === "ENDED"}
                    onVote={() =>
                        socket.emit("vote", {
                            roomId: id,
                            targetId: player.userId,
                        })
                    }
                />
            ))}
            <button
                onClick={startMicrophone}
                className="bg-purple-600 px-4 py-2 rounded-lg mb-4"
            >
                Enable Voice
            </button>
            <audio ref={audioRef} autoPlay />
            <button
                onClick={async () => {
                    const targets = room?.players?.filter(
                        (p) => p.userId !== myUserId
                    );

                    if (!targets?.length) {
                        console.log("[WEBRTC] No targets");
                        return;
                    }

                    for (const target of targets) {
                        const peer = createPeer(target.userId, stream, (candidate) => {
                            socket.emit("webrtc-ice-candidate", {
                                roomId: id,
                                candidate,
                                targetUserId: target.userId,
                            });
                        });

                        const offer = await peer.createOffer();
                        await peer.setLocalDescription(offer);

                        socket.emit("webrtc-offer", {
                            roomId: id,
                            offer,
                            targetUserId: target.userId,
                        });

                        console.log("[WEBRTC] OFFER SENT TO", target.userId);
                    }
                }}
                className="bg-red-600 px-4 py-2 rounded-lg mb-4"
            >
                Create Offer
            </button>
        </div>
    );
}

export default RoomPage;