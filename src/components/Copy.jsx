import React from "react";
import "../assets/styles/interview.css";

function Copy() {
  return (
    <div className="interview-container">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="top-left">Interview</div>
        <div className="top-right">Technical Support Agent</div>
      </div>

      <div className="main-content">
        {/* Left Panel */}
        <div className="left-panel">
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: "10%" }}></div>
          </div>

          <h3>Interview Instructions</h3>
          <ol className="small-text">
            <li>Introduce yourself briefly</li>
            <li>Answer clearly</li>
            <li>Be confident</li>
          </ol>
          <hr className="divider" />

          <h4>Questions</h4>
          <h4 className="small-text">
            1. Why do you want to join our organization?
          </h4>
          
          <h4 className="small-text">
            2. Why do you want to join our organization?
          </h4>
        
        </div>

        {/* Main Video Area */}
        <div className="video-panel">
          <div className="video-box interviewer">
            <span className="badge">Trevor Jones</span>
            <div className="video-placeholder">Interviewer Video</div>
          </div>

          <div className="video-box candidate">
            <span className="badge">You</span>
            <div className="video-placeholder">Candidate Video</div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="right-panel"></div>
      </div>

      {/* Bottom Controls */}
      <div className="bottom-controls">
        <button>
        <svg viewBox="0 0 24 24" className="icon">
          <path d="M17 10.5V7c0-1.1-.9-2-2-2H5C3.9 5 3 5.9 3 7v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-3.5l4 4v-11l-4 4z" />
        </svg>
        </button>

        <button>
        <svg viewBox="0 0 24 24" className="icon">
          <path d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3zm5-3a5 5 0 01-10 0H5a7 7 0 0014 0h-2z" />
        </svg>
        </button>

        <button className="icon-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <path d="M12 7v6" />
            <path d="M9 10l3-3 3 3" />
            <line x1="8" y1="21" x2="16" y2="21" />
          </svg>
        </button>
        <button className="leave-btn">Leave</button>
      </div>
    </div>
  );
}

export default Copy;
