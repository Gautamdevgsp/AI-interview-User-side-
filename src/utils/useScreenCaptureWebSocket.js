import { useEffect, useRef } from "react";

const SCREENSHOT_INTERVAL = 1000; // 1 second

export default function useVideoScreenshotWebSocket(
  wsUrl,
  videoRef,
  onMessage,
) {
  const wsRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);

  const stopWebSocket = () => {
    console.log("🛑 Stopping WebSocket & screenshot loop");

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  useEffect(() => {
    // ❌ Do nothing if wsUrl is not ready
    if (!wsUrl) {
      console.warn("⚠️ WebSocket URL not provided yet");
      return;
    }

    console.log("🚀 Initializing WebSocket:", wsUrl);

    // Create WebSocket
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      console.log("✅ WebSocket connected successfully");
    };

    wsRef.current.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
    };

    wsRef.current.onclose = (event) => {
      console.warn(
        "🔌 WebSocket closed:",
        "code:",
        event.code,
        "reason:",
        event.reason,
      );
    };

    // 📩 RECEIVE MESSAGE
    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📩 WebSocket message received:", data);

        // Send to component if callback exists
        if (onMessage) {
          onMessage(data);
        }
      } catch (err) {
        console.error("❌ Error parsing WebSocket message:", err);
      }
    };

    // Create offscreen canvas
    canvasRef.current = document.createElement("canvas");

    // Start screenshot interval
    intervalRef.current = setInterval(() => {
      captureAndSend();
    }, SCREENSHOT_INTERVAL);

    // Cleanup on unmount or wsUrl change
    return () => {
      console.log("🛑 Cleaning up WebSocket & interval");

      clearInterval(intervalRef.current);
      intervalRef.current = null;

      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [wsUrl]); // 🔥 IMPORTANT: restart when wsUrl changes

  // ---------------- CAPTURE & SEND ----------------
  const captureAndSend = () => {
    if (!wsRef.current) return;
    if (wsRef.current.readyState !== WebSocket.OPEN) return;

    if (!videoRef.current || videoRef.current.readyState < 2) {
      console.warn("⚠️ Video not ready for capture");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = 640;
    canvas.height = 480;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64Image = canvas.toDataURL("image/jpeg", 0.6);

    console.log("📸 Screenshot captured");

    wsRef.current.send(
      JSON.stringify({
        frame: base64Image,
      }),
    );
  };
  
  return { stopWebSocket };

}
