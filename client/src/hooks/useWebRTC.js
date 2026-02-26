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
  
    // ⭐ RECEIVE REMOTE AUDIO
    peer.ontrack = (event) => {
      console.log("[WEBRTC] REMOTE AUDIO RECEIVED");
  
      const remoteAudio = new Audio();
      remoteAudio.srcObject = event.streams[0];
      remoteAudio.autoplay = true;
    };
  
    peersRef.current[userId] = peer;
  
    console.log("[WEBRTC] Peer created for", userId);
  
    return peer;
  };

  const getPeer = (userId) => {
    return peersRef.current[userId];
  };

  return {
    peersRef,
    createPeer,
    getPeer,
  };
}