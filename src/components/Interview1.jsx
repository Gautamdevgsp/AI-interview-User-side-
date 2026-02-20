import React from "react";
import { useState, useEffect, useRef } from "react";
import "../assets/styles/Interview1.css";
import "../assets/styles/Interview.css";
import Countdown from "./Countdown";
import useVideoScreenshotWebSocket from "../utils/useScreenCaptureWebSocket";
import useAudioRecorderWav from "../utils/useAudioRecorderWav";
import { useNavigate } from "react-router-dom";
import APIser from "../routes/Apiservice";
import logo from "../assets/images/logo1.png";

function Interview1() {
  const TOTAL_TIME = 20;
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const videoRef = useRef(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wsUrl, setWsUrl] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { startRecording, stopRecording } = useAudioRecorderWav();
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const [showEyeModal, setShowEyeModal] = useState(false);
  const [eyeMessage, setEyeMessage] = useState("");
  const [showKeyboardModal, setShowKeyboardModal] = useState(false);
  const [showTabSwitchModal, setShowTabSwitchModal] = useState(false);

  const [interviewTerminated, setInterviewTerminated] = useState(false);


  const terminateTimeoutRef = useRef(null);
  const detectionEnabledRef = useRef(false);

  const VISIBLE_COUNT = 5;

  const [wsModal, setWsModal] = useState({
    open: false,
    status: "",
    reason: "",
  });
  const cameraStreamRef = useRef(null);
  const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);
  const [fullscreenTimer, setFullscreenTimer] = useState(5);
  const fullscreenTimeoutRef = useRef(null);

  useEffect(() => {
    // Push current page into history
    window.history.pushState(null, "", window.location.href);

    const handleBackButton = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);

  //  SESSION ID + WS URL
  useEffect(() => {
    const sessionId = localStorage.getItem("session_id");

    console.log(" session_id :", sessionId);
    if (!sessionId) {
      console.error("session_id not found");
      return;
    }
    const url = `wss://clostridial-chester-hydrostatically.ngrok-free.dev/ws/interview/${sessionId}`;
    console.log("WebSocket URL:", url);
    setWsUrl(url);
  }, []);

  useVideoScreenshotWebSocket(wsUrl, videoRef, (data) => {
    if (data?.status === "terminated") {
      setWsModal({
        open: true,
        status: data.status,
        reason: data.reason,
      });
    }

    //  EYE CONTACT WARNING
    if (data?.status === "ok" && data?.metrics) {
      const { eye_contact, eye_message } = data.metrics;

      if (eye_contact === 0) {
        setEyeMessage(eye_message || "Please look at the camera");
        setShowEyeModal(true);
      } else if (eye_contact === 1) {
        setShowEyeModal(false);
        setEyeMessage("");
      }
    }
  });

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const sessionId = localStorage.getItem("session_id");

        if (!sessionId) {
          console.error("Session ID not found");
          return;
        }

        const res = await APIser.getInterviewQuestions(sessionId);

        console.log("QUESTIONS RESPONSE:", res.data);

        setQuestions(res.data.questions || res.data);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  //   useEffect(() => {
  //     const container = containerRef.current;
  //     if (!container) return;

  //     // ---- ENTER FULLSCREEN ----
  //     container.requestFullscreen().catch(() => {});

  //     let detectionEnabled = false;
  //     let terminateTimeout = null;

  //     // Enable detection AFTER fullscreen settles
  //     const enableDetectionTimer = setTimeout(() => {
  //       detectionEnabled = true;
  //       console.log("Cheating detection enabled");
  //     }, 1500); // critical fix

  //     const terminateInterview = () => {
  //       if (terminateTimeout) return;

  //       setShowTabSwitchModal(true);

  //       terminateTimeout = setTimeout(() => {
  //         stopAllMedia();
  //         submitLastAnswer();
  //         navigate("/interviewresult");
  //       }, 700);
  //     };

  //     // ---- FULLSCREEN EXIT ----
  //     // const handleFullscreenChange = () => {
  //     //   if (!detectionEnabled) return;

  //     //   if (!document.fullscreenElement) {
  //     //     console.warn("Fullscreen exited");
  //     //     setShowFullscreenWarning(true);
  //     //     terminateInterview();
  //     //   }
  //     // };

  // document.addEventListener("fullscreenchange", handleFullscreenChange);
  //     // const handleFullscreenChange = () => {
  //     //   // if (!detectionEnabled) return;

  //     //   if (!document.fullscreenElement) {
  //     //     console.warn("Fullscreen exited");

  //     //     // Reset timer every time ESC is pressed
  //     //     setFullscreenTimer(5);
  //     //     setShowFullscreenWarning(true);

  //     //     // Clear previous timeout (important)
  //     //     clearTimeout(fullscreenTimeoutRef.current);

  //     //     // ⏳ Redirect after 5 seconds
  //     //     fullscreenTimeoutRef.current = setTimeout(() => {
  //     //       stopAllMedia();
  //     //       submitLastAnswer();
  //     //       navigate("/interviewresult");
  //     //     }, 5000);
  //     //   }
  //     // };

  //     //     const handleFullscreenChange = () => {
  //     //   if (!detectionEnabled) return;

  //     //   if (!document.fullscreenElement) {
  //     //     console.warn("Fullscreen exited");

  //     //     setFullscreenTimer(5);
  //     //     setShowFullscreenWarning(true);

  //     //     // ⏳ Auto terminate after 5 seconds
  //     //     fullscreenTimeoutRef.current = setTimeout(() => {
  //     //       stopAllMedia();
  //     //       submitLastAnswer();
  //     //       navigate("/interviewresult");
  //     //     }, 500);
  //     //   }
  //     // };

  //     // ---- TAB SWITCH / APP SWITCH ----
  //     const handleVisibilityChange = () => {
  //       if (!detectionEnabled) return;
  //       if (document.hidden) {
  //         console.warn(" Tab hidden");
  //         terminateInterview();
  //       }
  //     };

  //     const handleWindowBlur = () => {
  //       if (!detectionEnabled) return;
  //       console.warn(" Window lost focus");
  //       terminateInterview();
  //     };

  //     // ---- BLOCK CHEATING KEYS ONLY ----
  //     // const handleKeyDown = (e) => {
  //     //   if (!detectionEnabled) return;

  //     //   const forbidden =
  //     //     e.key === "F12" ||
  //     //     (e.ctrlKey && ["C", "V", "X", "U"].includes(e.key.toUpperCase())) ||
  //     //     (e.ctrlKey &&
  //     //       e.shiftKey &&
  //     //       ["I", "J", "C"].includes(e.key.toUpperCase()));

  //     //   if (forbidden) {
  //     //     e.preventDefault();
  //     //     terminateInterview();
  //     //   }
  //     // };

  //     // const handleKeyboardBlock = (e) => {
  //     //   if (!detectionEnabled) return;

  //     //   e.preventDefault();
  //     //   e.stopPropagation();

  //     //   console.warn("Keyboard usage blocked:", e.key);
  //     //   terminateInterview();
  //     // };

  //     // ---- DISABLE RIGHT CLICK ----
  //     const disableRightClick = (e) => e.preventDefault();

  //     // ---- EVENT LISTENERS ----
  //     // document.addEventListener("fullscreenchange", handleFullscreenChange);
  //     document.addEventListener("visibilitychange", handleVisibilityChange);
  //     window.addEventListener("blur", handleWindowBlur);
  //     // document.addEventListener("keydown", handleKeyboardBlock);
  //     document.addEventListener("contextmenu", disableRightClick);

  //     // document.addEventListener("keyup", handleKeyboardBlock, true);
  //     // document.addEventListener("keypress", handleKeyboardBlock, true);

  //     // ---- CLEANUP ----
  //     return () => {
  //       clearTimeout(enableDetectionTimer);
  //       clearTimeout(terminateTimeout);

  //       // document.removeEventListener("fullscreenchange", handleFullscreenChange);
  //       document.removeEventListener("visibilitychange", handleVisibilityChange);
  //       window.removeEventListener("blur", handleWindowBlur);

  //       // document.removeEventListener("keydown", handleKeyboardBlock);
  //       // document.removeEventListener("keyup", handleKeyboardBlock, true);
  //       // document.removeEventListener("keypress", handleKeyboardBlock, true);

  //       document.removeEventListener("contextmenu", disableRightClick);
  //     };
  //   }, []);


      const terminateInterview = () => {
      if (terminateTimeoutRef.current) return;

      setInterviewTerminated(true);
      setShowTabSwitchModal(true);
    };

      const terminateInterview1 = () => {
      if (terminateTimeoutRef.current) return;

      setInterviewTerminated(true);

    };


    useEffect(() => {
  if (!interviewTerminated) return;

  const timer = setTimeout(async () => {
    await navigate("/interviewresult", { replace: true });
    stopAllMedia();
    localStorage.setItem("flowStep", "4");
    
  }, 500);
  return () => clearTimeout(timer);
}, [interviewTerminated]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ---- ENTER FULLSCREEN ----
    container.requestFullscreen?.().catch(() => {});

    let detectionEnabled = false;
   

    const enableDetectionTimer = setTimeout(() => {
      detectionEnabledRef.current = true;
      console.log("Cheating detection enabled");
    }, 100);


    // const terminateInterview1 = () => {
    //   if (terminateTimeout) return;

    //   setShowKeyboardModal(true);

    //   terminateTimeout = setTimeout(() => {
    //     stopAllMedia();
    //     submitLastAnswer();
    //     navigate("/interviewresult");
    //   }, 2000); // 2 seconds delay
    // };


    // ---- FULLSCREEN EXIT ----
    // const handleFullscreenChange = () => {
    //   if (!detectionEnabledRef.current) return;

    //   if (!document.fullscreenElement) {
    //     setShowFullscreenWarning(true);
    //     terminateInterview();
    //   }
    // };


    const handleFullscreenChange = () => {
  if (!detectionEnabledRef.current) return;

  // ESC pressed / fullscreen exited
  if (!document.fullscreenElement) {
    console.warn("Fullscreen exited");

    setFullscreenTimer(5);
    setShowFullscreenWarning(true);

    // clear old timer if exists
    clearTimeout(fullscreenTimeoutRef.current);

    // ⏳ give user 5 seconds to return fullscreen
    fullscreenTimeoutRef.current = setTimeout(() => {
      console.warn("Did not return to fullscreen in time");
      terminateInterview1();
    }, 5000);
  }
};

    // ---- TAB SWITCH ----
    const handleVisibilityChange = () => {
      if (!detectionEnabledRef.current) return;
      if (document.hidden) {
        console.warn("Tab hidden");
        terminateInterview();
      }
    };

    const handleWindowBlur = () => {
      if (!detectionEnabledRef.current) return;
      console.warn("Window blur");
      terminateInterview();
    };

    // ---- BLOCK COMPLETE KEYBOARD ----
    const handleKeyboardBlock = (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!detectionEnabled) return;

      console.warn("Keyboard blocked:", e.key);
       setShowKeyboardModal(true);
    };

    // const handleKeyboardBlock = (e) => {
    //   if (!detectionEnabledRef.current) return;

    //   const forbidden =
    //     e.key === "F12" ||
    //     (e.ctrlKey && ["C", "V", "X", "U"].includes(e.key.toUpperCase())) ||
    //     (e.ctrlKey &&
    //       e.shiftKey &&
    //       ["I", "J", "C"].includes(e.key.toUpperCase()));

    //   if (forbidden) {
    //     e.preventDefault();
    //     setShowKeyboardModal(true);
    //     terminateInterview();
    //   }
    // };

    // ---- DISABLE RIGHT CLICK ----
    const disableRightClick = (e) => {
      e.preventDefault();
    };

    // ---- EVENT LISTENERS ----
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);

    document.addEventListener("keydown", handleKeyboardBlock, true);
    document.addEventListener("keyup", handleKeyboardBlock, true);
    document.addEventListener("keypress", handleKeyboardBlock, true);

    document.addEventListener("contextmenu", disableRightClick);

    // ---- CLEANUP ----
    return () => {
      clearTimeout(enableDetectionTimer);
      // clearTimeout(terminateTimeout);

      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);

      document.removeEventListener("keydown", handleKeyboardBlock, true);
      document.removeEventListener("keyup", handleKeyboardBlock, true);
      document.removeEventListener("keypress", handleKeyboardBlock, true);

      document.removeEventListener("contextmenu", disableRightClick);
    };
  }, []);

  useEffect(() => {
    if (!showFullscreenWarning) return;

    const interval = setInterval(() => {
      setFullscreenTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showFullscreenWarning]);

  // Question switch
  
  useEffect(() => {
    if (!questions.length) return;

    if (timeLeft === 0) {
      //  LAST QUESTION FINISHED
      if (currentIndex === questions.length - 1) {
        console.log("Interview completed. Redirecting...");
        setShowCompleteModal(true); //  SHOW MODAL
        return;
      }

      //  MOVE TO NEXT QUESTION
      setCurrentIndex((prev) => prev + 1);
      setTimeLeft(TOTAL_TIME);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, currentIndex, questions.length]);

  // const downloadAudio = (blob, filename) => {
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.style.display = "none";
  //   a.href = url;
  //   a.download = filename;
  //   document.body.appendChild(a);
  //   a.click();

  //   URL.revokeObjectURL(url);
  //   document.body.removeChild(a);
  // };

  // Recording
  useEffect(() => {
    if (!questions.length) return;
    console.log("[Audio] Starting recording for question:", currentIndex);

    //  START recording when a question appears
    startRecording()
      .then(() => {
        console.log("[Audio] Recording started");
      })
      .catch((err) => {
        console.error("[Audio] Failed to start recording:", err);
      });

    return () => {
      console.log("⏹ [Audio] Stopping recording for question:", currentIndex);

      // ⏹ STOP recording when question changes or component unmounts
      stopRecording().then((wavBlob) => {
        if (!wavBlob) return;

        //  DOWNLOAD LOCALLY
        // downloadAudio(wavBlob, `question_${currentIndex + 1}.wav`);

        const sessionId = localStorage.getItem("session_id");

        if (!sessionId) {
          console.error("session_id missing while submitting answer");
          return;
        }

        const currentQuestion = questions[currentIndex]?.question || "";

        const durationSec = TOTAL_TIME - timeLeft; // actual spoken duration

        const formData = new FormData();
        formData.append("audio", wavBlob, `answer_${currentIndex + 1}.wav`);
        formData.append("question", currentQuestion);
        formData.append("duration_sec", durationSec.toString());

        APIser.submitAudioAnswer(sessionId, formData)

          .then((res) => {
            console.log("Answer submitted");
            console.log(" Transcription:", res.data.transcribed_text);
            console.log(" Scores:", res.data.scores);
          })
          .catch((err) => {
            console.error(
              "Answer submission failed:",
              err.response?.data || err.message,
            );
          });
      });
    };
  }, [currentIndex, questions.length]);

  const submitLastAnswer = async () => {
    console.log("📤 Submitting last answer");

    const wavBlob = await stopRecording();
    if (!wavBlob) return;

    const sessionId = localStorage.getItem("session_id");
    if (!sessionId) return;

    const currentQuestion = questions[currentIndex]?.question || "";
    const durationSec = TOTAL_TIME - timeLeft;

    const formData = new FormData();
    formData.append("audio", wavBlob, `answer_${currentIndex + 1}.wav`);
    formData.append("question", currentQuestion);
    formData.append("duration_sec", durationSec.toString());

    await APIser.submitAudioAnswer(sessionId, formData);
  };

  const progressWidth = (timeLeft / TOTAL_TIME) * 100;

  const getTimerColor = () => {
    if (timeLeft > TOTAL_TIME * 0.5) return "#98f428ff"; // green
    if (timeLeft > TOTAL_TIME * 0.2) return "#ffc107"; // yellow
    return "#ff6978ff"; // red
  };

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        cameraStreamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    }

    startCamera();

    // CLEANUP: stop camera when component unmounts
    return () => {
      console.log(" Stopping camera");
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((track) => track.stop());
        cameraStreamRef.current = null;
      }
    };
  }, []);

  const [time, setTime] = useState(TOTAL_TIME);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev === 1) {
          return TOTAL_TIME; //  reset to 20
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const stopAllMedia = () => {
    console.log("Stopping all media");

    // Stop camera
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }

    // Stop microphone (from recorder hook if any)
    if (navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          stream.getTracks().forEach((track) => track.stop());
        })
        .catch(() => {});
    }
  };

  const startIndex = Math.max(0, currentIndex - (VISIBLE_COUNT - 1));
  const visibleQuestions = questions.slice(
    startIndex,
    startIndex + VISIBLE_COUNT,
  );
  
  useEffect(() => {
  if (!wsModal.open) return;

  const timer = setTimeout(() => {
    setWsModal({ open: false, status: "", reason: "" });
    stopAllMedia();
    submitLastAnswer();
    localStorage.setItem("flowStep", "4");
    navigate("/interviewresult");
  }, 2000);

  return () => clearTimeout(timer);
}, [wsModal.open]);


  // useEffect(() => {
  //   if (!showTabSwitchModal) return;

  //   const timer = setTimeout(() => {
  //     stopAllMedia();
  //     submitLastAnswer();
  //     localStorage.setItem("flowStep", "4");
  //     navigate("/interviewresult");
  //   }, 300);

  //   return () => clearTimeout(timer);
  // }, [showTabSwitchModal]);

  
  return (
    <div ref={containerRef} className="interview-container">
      {wsModal.open && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3> Interview Terminated</h3>

            <p>{wsModal.reason}</p>

            <button
              className="modal-btn"
              onClick={() => {
                setWsModal({ open: false, status: "", reason: "" });
                stopAllMedia();
                submitLastAnswer();
                localStorage.setItem("flowStep", "4");
                navigate("/interviewresult");
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
      


      {showFullscreenWarning && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 style={{ color: "Red" }}> Fullscreen Required</h3>
            <p>
              Please return to fullscreen within{" "}
              <b style={{ color: "red" }}>{fullscreenTimer}</b> seconds.
            </p>

            <button
              className="modal-btn"
              onClick={async () => {
                clearTimeout(fullscreenTimeoutRef.current);
                setShowFullscreenWarning(false);

                try {
                  await containerRef.current.requestFullscreen();
                } catch (err) {
                  console.error("Failed to re-enter fullscreen", err);
                }
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {showCompleteModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Interview Completed</h3>
            <p>You have successfully answered all questions.</p>

            <button
              className="modal-btn"
              onClick={() => {
                setShowCompleteModal(false);
                // optional cleanup
                // localStorage.removeItem("session_id");
                stopAllMedia();
                submitLastAnswer();

                localStorage.setItem("flowStep", "4");
                navigate("/interviewresult");
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {showLeaveModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Leave Interview?</h3>
            <p>Your progress may be lost. Are you sure?</p>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowLeaveModal(false)}
              >
                Cancel
              </button>

              <button
                className="confirm-btn1"
                onClick={() => {
                  setShowLeaveModal(false);
                  stopAllMedia();
                  submitLastAnswer();
                  localStorage.setItem("flowStep", "4");
                  navigate("/interviewresult");
                }}
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {showSubmitModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Submit Interview?</h3>
            <p>Once submitted, you cannot change your answers.</p>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowSubmitModal(false)}
              >
                Cancel
              </button>

              <button
                className="confirm-btn"
                onClick={() => {
                  setShowSubmitModal(false);

                  //if needed, stop recording / submit answers here
                  stopAllMedia();
                  submitLastAnswer();
                  localStorage.setItem("flowStep", "4");
                  navigate("/interviewresult");

                  navigate("/interviewresult"); // redirect
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {showTabSwitchModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2> Warning !!</h2>
            <p>
              Tab switching detected<br></br> Interview is over Now{" "}
            </p>
            <button
              className="modal-btn"
              onClick={() => {
                setShowTabSwitchModal(false);
                stopAllMedia();
                submitLastAnswer();
                localStorage.setItem("flowStep", "4");
                navigate("/interviewresult");
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {showEyeModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 style={{ color: "#ff9800" }}>⚠ Eye Contact Warning</h3>
            <p>{eyeMessage}</p>

            <p style={{ fontSize: "14px", opacity: 0.7 }}>
              Please maintain eye contact with the camera
            </p>
          </div>
        </div>
      )}

      {showKeyboardModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 style={{ color: "#d32f2f" }}>Keyboard Activity Detected</h3>

            <p style={{ marginTop: "10px" }}>
              Keyboard usage is not allowed during the interview.
            </p>

            <button
              className="modal-btn"
              onClick={() => setShowKeyboardModal(false)}
              style={{
                marginTop: "15px",
                padding: "8px 20px",
                backgroundColor: "#d32f2f",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
      

      {/* Top Bar */}
      <div className="top-bar">
        <div className="top-left">
          <img
            alt="logo"
            src={logo}
            style={{
              width: "200px",
              height: "60px",
              padding: "4px",
              margin: "4px",
            }}
          />
        </div>
        <div className="top-right">
          <span
            className="header-linker"
            onClick={() => setShowLeaveModal(true)}
          >
            Leave
          </span>

          <span className="vertical-divider"></span>

          <button
            className="logout-btn"
            onClick={() => setShowSubmitModal(true)}
          >
            Submit
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        {/* VIDEO + CONTROLS — 30% */}
        <div className="right-section">
          <div className="video-box candidate">
            <span className="badge">You</span>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="video-preview"
            />
          </div>

          {/* <Countdown />

          <div className="timer-bar">
            <div
              className="timer-bar-fill"
              style={{
                width: `${progressWidth}%`,
                backgroundColor: getTimerColor(),
              }}
            ></div>
          </div> */}

          <div className="upper-box">
            <div className="upper">
              <h3>Interview Instructions</h3>
            </div>
            <ol className="instructions">
              <li>Introduce yourself briefly</li>
              <li>Answer clearly</li>
              <li>Be confident</li>
              <li>Don't exit full Screen while interview</li>
              <li>Don't switch tab while interview</li>
              <li>You have 20 seconds for each question</li>
            </ol>
          </div>
        </div>

        {/* QUESTIONS — 70% */}
        <div className="left-panel">
          <div className="lowerr-box">
            <div className="question-header">
              <h2>Question</h2>
              <div className="countdown-1">Left time: {time}s</div>
            </div>

            <div className="divider">
              <div
                className="divider-progress"
                style={{
                  width: `${(time / TOTAL_TIME) * 100}%`,
                }}
              />
            </div>

            {/* <h5 className="small-text">
              {questions.length > 0
                ? questions[currentIndex].question
                : "Loading question..."}
            </h5> */}

            {/* <div className="questions-list">
              {visibleQuestions.map((q, index) => {
                const isActive = index === currentIndex;
                const isPast = index < currentIndex;
                const isFuture = index > currentIndex;

                return (
                  <div
                    key={index}
                    className={`question-item
          ${isActive ? "active" : ""}
          ${isPast ? "past" : ""}
          ${isFuture ? "future" : ""}
        `}
                  >
                    <div className="question-box">
                      <h5 className="small-text">
                        <span className="q-number">Q{index + 1}.</span>{" "}
                        {q.question}
                      </h5>
                    </div>
                  </div>
                );
              })}
            </div> */}

            <div className="questions-list">
              {visibleQuestions.map((q, index) => {
                const absoluteIndex = startIndex + index;

                const isActive = absoluteIndex === currentIndex;
                const isPast = absoluteIndex < currentIndex;
                const isFuture = absoluteIndex > currentIndex;

                return (
                  <div
                    key={absoluteIndex}
                    className={`question-item
          ${isActive ? "active" : ""}
          ${isPast ? "past" : ""}
          ${isFuture ? "future" : ""}
        `}
                  >
                    <div className="question-box">
                      <h5 className="small-text">
                        <span className="q-number">Q{absoluteIndex + 1}.</span>{" "}
                        {q.question}
                      </h5>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Interview1;
