import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/styles/interviewResult.css";
import { useNavigate } from "react-router-dom";
import APIser from "../routes/Apiservice";
import logo from "../assets/images/logo1.png";
import Header from "./Header";

export default function ResultDashboard() {
  const [result, setResult] = useState(null);
  const [noResult, setNoResult] = useState(false);
  const [userName, setUserName] = useState("");

  const MetricCard = ({ title, value }) => (
  <div className="metric-card">
    <div className="metric-header">
      <span className="metric-title">{title}</span>
      <span className="metric-value">{value}%</span>
    </div>

    <div className="minimal-progress">
      <div
        className="minimal-bar"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);


  const BreakItem = ({ label, value }) => (
    <div className="break-item">
      <span>{label}</span>
      <strong>{value}%</strong>
    </div>
  );


  const navigate = useNavigate();

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handleBackButton = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);

  useEffect(() => {
    const sessionId = localStorage.getItem("session_id");

    if (!sessionId) {
      setNoResult(true);
      return;
    }

    APIser.getInterviewResult(sessionId)
      .then((res) => {
        const data = res.data;

        if (!data || data.show_result_to_user === false) {
          setNoResult(true);
        } else {
          setResult(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch result", err);
        setNoResult(true);
      });
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const interviewId = localStorage.getItem("active_interview_id");

    if (!user || !interviewId) return;

    const key = "attempted_interviews";
    const data = JSON.parse(localStorage.getItem(key)) || {};

    if (!data[user.email]) {
      data[user.email] = [];
    }

    if (!data[user.email].includes(interviewId)) {
      data[user.email].push(interviewId);
    }

    localStorage.setItem(key, JSON.stringify(data));
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.email) {
      const name = user.email.split("@")[0]; // gautam
      setUserName(name);
    }
  }, []);

  if (noResult) {
    return (
      <>
        {/* Top Bar */}
        <Header
          showProfile={true}
          userName={userName}
          showReport={false}
          onLogoutClick={() => setShowLogoutModal(true)}
        />

        {/* Center Content */}
        <div className="center-screen">
          <div className="no-result-card">
            <img
              src="https://img.freepik.com/free-vector/completed-concept-illustration_114360-3891.jpg"
              alt="Interview Completed"
              className="no-result-img"
            />

            <h2>Interview Completed</h2>

            <p className="no-result-text">
              Your performance report has been successfully submitted to the
              admin.
            </p>

            <button
              className="primary-btn"
              onClick={() => navigate("/selectinterview")}
            >
              Go back to Home
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!result) {
    return (
      <div className="page-wrapper loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Loading result...</p>
      </div>
    );
  }

  // Helpers
  const percent = (v) => Math.round(v * 100);

  const getLevel = (v) => {
    if (v >= 0.7) return "High";
    if (v >= 0.4) return "Moderate";
    return "Low";
  };


  return (
    <>
      {/* Top Bar */}

      <Header
        showProfile={true}
        userName={userName}
        showReport={false}
        onLogoutClick={() => setShowLogoutModal(true)}
      />

      <div className="page-wrapper">
        <div className="result-page">

          {/* Interview Info Header */}
          <div className="result-header">
            <div>
              <h2>Interview Report</h2>
              <p className="result-sub">
                {result.interview_id} • {result.interview_date} • {result.interview_time}
              </p>
            </div>

            <div
              className={`decision-badge ${result.decision === "No Hire"
                ? "badge-danger"
                : result.decision === "Maybe"
                  ? "badge-warning"
                  : "badge-success"
                }`}
            >
              {result.decision === "No Hire"
                ? "Not Selected"
                : result.decision === "Maybe"
                  ? "Needs Review"
                  : "Selected"}
            </div>
          </div>

          <div className="status-grid">
            <div className="status-card">
              <span className="status-label">Final Decision</span>
              <span
                className={`status-value ${result.decision === "No Hire"
                    ? "text-danger"
                    : result.decision === "Maybe"
                      ? "text-warning"
                      : "text-success"
                  }`}
              >
                {result.decision === "No Hire"
                  ? "Not Selected"
                  : result.decision === "Maybe"
                    ? "Needs Further Review"
                    : "Selected"}
              </span>
            </div>

            <div className="status-card">
              <span className="status-label">Cheating Detection</span>
              <span
                className={`status-value ${result.cheating ? "text-danger" : "text-success"
                  }`}
              >
                {result.cheating ? "Detected" : "Not Detected"}
              </span>
            </div>
          </div>


          <div className="metrics-grid">
            <MetricCard title="Confidence" value={percent(result.confidence)} />
            <MetricCard title="Nervousness" value={percent(result.nervousness)} />
            <MetricCard title="Accuracy" value={percent(result.average_accuracy)} />
          </div>
          <div className="breakdown-card">
            <h4>Performance Breakdown</h4>

            <div className="breakdown-grid">
              <BreakItem label="Eye Contact" value={percent(result.metrics_breakdown.eye_contact)} />
              <BreakItem label="Dress Score" value={percent(result.metrics_breakdown.dress_score)} />
              <BreakItem label="Relevance" value={percent(result.metrics_breakdown.relevance)} />
              <BreakItem label="Fluency" value={percent(result.metrics_breakdown.fluency_score)} />
            </div>
          </div>

          <div className="interview-complete">
            Thank you for attending the interview. Your session has been
            successfully completed.
          </div>
        </div>
      </div>
    </>
  );
}