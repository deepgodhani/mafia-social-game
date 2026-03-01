import { useState, useRef, useCallback } from "react";

export function useMicrophone() {
  const [error, setError] = useState(null);

  const streamRef = useRef(null);   // ⭐ IMPORTANT
  const audioRef = useRef(null);

  const startMicrophone = useCallback(async () => {
    if (streamRef.current) {
      console.log("[MIC] already running");
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = mediaStream;

      if (audioRef.current) {
        audioRef.current.srcObject = mediaStream;
      }

      console.log("[MIC] Access granted");
    } catch (err) {
      console.error("[MIC ERROR]", err);
      setError(err.message);
    }
  }, []);

  const setMuted = useCallback((muted) => {
    if (!streamRef.current) return;

    streamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = !muted;
    });

    console.log("[VOICE] muted:", muted);
  }, []);

  const stopMicrophone = useCallback(() => {
    if (!streamRef.current) return;

    streamRef.current.getTracks().forEach((track) => {
      track.stop();
    });

    if (audioRef.current) {
      audioRef.current.srcObject = null;
    }

    streamRef.current = null;

    console.log("[MIC] Stopped");
  }, []);

  return {
    stream: streamRef.current,
    error,
    audioRef,
    startMicrophone,
    setMuted,
    stopMicrophone,
  };
}