import { useState, useRef } from "react";

export function useMicrophone() {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);

  const audioRef = useRef(null);

  const startMicrophone = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      setStream(mediaStream);

      // attach stream to audio element
      if (audioRef.current) {
        audioRef.current.srcObject = mediaStream;
      }

      console.log("[MIC] Access granted");
    } catch (err) {
      console.error("[MIC ERROR]", err);
      setError(err.message);
    }
  };

  const setMuted = (muted) => {
    if (!stream) return;
  
    stream.getAudioTracks().forEach((track) => {
      track.enabled = !muted;
    });
  
    console.log("[VOICE] muted:", muted);
  };

  const stopMicrophone = () => {
    if (!stream) return;

    stream.getTracks().forEach((track) => {
      track.stop();
    });

    if (audioRef.current) {
      audioRef.current.srcObject = null;
    }

    setStream(null);
    console.log("[MIC] Stopped");
  };

  return {
    stream,
    error,
    startMicrophone,
    audioRef,
    setMuted,
    stopMicrophone,
  };
}