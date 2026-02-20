import React from "react";
import "../assets/styles/Inter.css";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo1.png";
import Header from "../components/Header";

function Inter() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [cameraStatus, setCameraStatus] = useState("idle");

  const micBarRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const micStreamRef = useRef(null);

  const micAnimationRef = useRef(null);

  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [micError, setMicError] = useState(false);

  const cameraStreamRef = useRef(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [micReady, setMicReady] = useState(false);

  const canStartInterview = cameraReady && micReady;

  const [showInstructions, setShowInstructions] = useState(true);
  const [agreeInstructions, setAgreeInstructions] = useState(false);

  // useEffect(() => {
  //   // Push current page into history
  //   window.history.pushState(null, "", window.location.href);

  //   const handleBackButton = () => {
  //     window.history.pushState(null, "", window.location.href);
  //   };

  //   window.addEventListener("popstate", handleBackButton);

  //   return () => {
  //     window.removeEventListener("popstate", handleBackButton);
  //   };
  // }, []);

  const handleClick = () => {
    navigate("/interview1");
    localStorage.setItem("flowStep", "3");
    navigate("/interview1");
  };

  // useEffect(() => {
  //   startCamera();
  //   startMic();

  //   return () => {
  //     stopCamera();
  //     stopMic();
  //   };
  // }, []);

  useEffect(() => {
    if (!showInstructions) {
      startCamera();
      startMic();
    }

    return () => {
      stopCamera();
      stopMic();
    };
  }, [showInstructions]);

  const startCamera = async () => {
    try {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      cameraStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch((e) => console.error("Play error:", e));
          setCameraReady(true);
          setCameraStatus("working");
        };
      }

      setIsCameraOn(true);
    } catch (err) {
      console.error("Camera error:", err);
      setCameraReady(false);
      setCameraStatus("error");
    }
  };

  const stopCamera = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => {
        track.stop();
        track.enabled = false;
      });
      cameraStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraReady(false);
    setIsCameraOn(false);
  };

  const toggleCamera = async () => {
    if (isCameraOn) {
      stopCamera();
    } else {
      await startCamera();
    }
  };

  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      if (audioContextRef.current) await audioContextRef.current.close();

      audioContextRef.current = new (
        window.AudioContext || window.webkitAudioContext
      )();
      const source = audioContextRef.current.createMediaStreamSource(stream);

      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;

      source.connect(analyserRef.current);
      visualizeMic();

      setIsMicOn(true);
      setMicReady(true);
      setMicError(false);
    } catch (err) {
      console.error("Mic error:", err);
      setMicError(true);
      setMicReady(false);
    }
  };

  const stopMic = async () => {
    if (micAnimationRef.current) {
      cancelAnimationFrame(micAnimationRef.current);
    }

    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => {
        track.stop();
        track.enabled = false;
      });
      micStreamRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      await audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (micBarRef.current) micBarRef.current.style.width = "0%";
    setIsMicOn(false);
    setMicReady(false);
  };

  const toggleMic = async () => {
    if (isMicOn) {
      await stopMic();
    } else {
      await startMic();
    }
  };

  const visualizeMic = () => {
    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const update = () => {
      if (!analyserRef.current) return;

      analyser.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }

      const average = sum / dataArray.length;
      const percentage = Math.min(100, average);

      if (micBarRef.current) {
        micBarRef.current.style.width = `${percentage}%`;
      }

      micAnimationRef.current = requestAnimationFrame(update);
    };

    update();
  };

  return (
    <>

      {!showInstructions && (
        <>
          <Header showHome={true} />

          <div className="device-test-wrapper">
            <div className="device-card">
              {/* Header */}
              <div className="device-header">
                <h3>Interview Room</h3>
                <p>Check your audio and video devices before starting</p>
              </div>

              {/* Content */}
              <div className="device-content">
                {/* Video Preview */}
                <div className="video-section">
                  <div className="video-box">
                    {cameraStatus === "error" ? (
                      <span style={{ color: "red" }}>Camera not accessible</span>
                    ) : (
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="video-preview"
                      />
                    )}

                    <div className="video-controls">
                      {/* CAMERA */}
                      <div
                        className={`control-icon video-icon ${!isCameraOn ? "off" : ""
                          }`}
                        title={isCameraOn ? "Turn camera off" : "Turn camera on"}
                        onClick={toggleCamera}
                      >
                        <svg viewBox="0 0 24 24" className="icon">
                          <path d="M17 10.5V7c0-1.1-.9-2-2-2H5C3.9 5 3 5.9 3 7v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-3.5l4 4v-11l-4 4z" />
                        </svg>

                        {!isCameraOn && <span className="slash"></span>}
                      </div>

                      {/* MIC */}
                      <div
                        className={`control-icon mic-icon ${!isMicOn ? "off" : ""}`}
                        title={isMicOn ? "Mute mic" : "Unmute mic"}
                        onClick={toggleMic}
                      >
                        <svg viewBox="0 0 24 24" className="icon">
                          <path d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3zm5-3a5 5 0 01-10 0H5a7 7 0 0014 0h-2z" />
                        </svg>

                        {!isMicOn && <span className="slash"></span>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Device Settings */}
                <div className="settings-section">
                  {/* Camera */}
                  <div className="setting-block">
                    <div className="setting-header">
                      <div className="left-section">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#005BAB"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="2" y="6" width="14" height="12" rx="2" ry="2" />
                          <polygon points="16 10 22 6 22 18 16 14" />
                        </svg>
                        <label>Video Device</label>
                      </div>
                      {/* <span className="refresh">
                      <svg
                        className="refresh-icon"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M17.65 6.35A7.95 7.95 0 0012 4V1L7 6l5 5V7a5 5 0 11-5 5H5a7 7 0 107.65-5.65z" />
                      </svg>
                      Refresh
                    </span> */}
                    </div>
                    <select>
                      <option>Default Camera</option>
                    </select>
                  </div>

                  {/* Microphone */}
                  <div className="setting-block">
                    <div className="setting-header">
                      <div className="left-section">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#005BAB"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="9" y="2" width="6" height="12" rx="3" />
                          <path d="M5 10v2a7 7 0 0014 0v-2" />
                          <line x1="12" y1="19" x2="12" y2="22" />
                          <line x1="8" y1="22" x2="16" y2="22" />
                        </svg>
                        <label>Audio Device</label>
                      </div>
                      {/* <span className="refresh">
                      <svg
                        className="refresh-icon"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M17.65 6.35A7.95 7.95 0 0012 4V1L7 6l5 5V7a5 5 0 11-5 5H5a7 7 0 107.65-5.65z" />
                      </svg>
                      Refresh
                    </span> */}
                    </div>
                    <select>
                      <option>Default Microphone</option>
                    </select>

                    <div className="mic-level">
                      <div className="mic-bar" ref={micBarRef}></div>
                    </div>

                    <small
                      style={{
                        color: micError || !isMicOn ? "red" : "#777",
                      }}
                    >
                      {micError
                        ? "Microphone not accessible"
                        : !isMicOn
                          ? "Microphone is turned off"
                          : ""}
                    </small>
                  </div>
                  <div className="device-footer">
                <button
                  className="start-btn"
                  onClick={() => {
                    handleClick();

                  }}
                  disabled={!canStartInterview}
                  style={{
                    opacity: canStartInterview ? 1 : 0.5,
                    cursor: canStartInterview ? "pointer" : "not-allowed",
                  }}
                >
                  Start Interview
                </button>
              </div>
                </div>
                
              </div>

              {/* Footer */}
              
            </div>
          </div>
        </>
      )}

      {showInstructions && (
        <div className="instruction-overlay">
          <div className="instruction-modal">
            <h2>Interview Instructions</h2>

            <ul className="instruction-list">
              <li>Ensure stable internet connection and proper lighting.</li>
              <li>Camera and microphone access is mandatory.</li>
              <li>No external devices or mobile phones allowed.</li>
              <li>Interview is monitored using AI-based proctoring.</li>
              <li>Any suspicious activity may lead to auto rejection.</li>
              <li>Do not refresh or close the browser during interview.</li>
              <li>Each interview can be attempted only once.</li>
              <li>Avoid frequently looking away from the screen.</li>
              <li>Avoid covering your face or camera</li>
            </ul>

            <div className="instruction-divider"></div>

            <div className="instruction-footer">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={agreeInstructions}
                  onChange={(e) => setAgreeInstructions(e.target.checked)}
                />
                <span>I have read and understood all the instructions.</span>
              </label>

              <button
                className="btn btn-primary mt-3"
                disabled={!agreeInstructions}
                onClick={() => setShowInstructions(false)}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}


    </>
  );
}

export default Inter;
