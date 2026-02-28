import { useRef } from "react";

export function useWebRTC() {
  const peersRef = useRef({});

  const createPeer = (userId, stream, onIceCandidate) => {
    const peer = new RTCPeerConnection();

    // ⭐ ADD AUDIO TRACKS
    if (stream) {
      stream.getTracks().forEach((track) => {
        peer.addTrack(track, stream);
      });
    }

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        onIceCandidate(event.candidate);
      }
    };

    // ⭐ RECEIVE REMOTE AUDIO (track per user)
    peer.ontrack = (event) => {
      console.log("[WEBRTC] REMOTE AUDIO RECEIVED", userId);

      const remoteAudio = new Audio();
      remoteAudio.srcObject = event.streams[0];
      remoteAudio.autoplay = true;
      remoteAudio.muted = false;

      // attach for later control (phase / role based)
      // eslint-disable-next-line no-param-reassign
      peer._remoteAudio = remoteAudio;
    };

    peersRef.current[userId] = peer;

    console.log("[WEBRTC] Peer created for", userId);

    return peer;
  };

  const getPeer = (userId) => {
    return peersRef.current[userId];
  };

  const closeAll = () => {
    Object.values(peersRef.current).forEach((peer) => {
      try {
        if (peer._remoteAudio) {
          peer._remoteAudio.pause();
          peer._remoteAudio.srcObject = null;
        }
        peer.close();
      } catch {
        // ignore
      }
    });
    peersRef.current = {};
    console.log("[WEBRTC] All peers closed");
  };

  return {
    peersRef,
    createPeer,
    getPeer,
    closeAll,
  };
}