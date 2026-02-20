import React, { useEffect, useState } from "react";
import "../assets/styles/Report.css";
import "../assets/styles/Interview1.css";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Report() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [userName, setUserName] = useState("");


  // const data = [
  //   {
  //     interview: "Technical Interview",
  //     cheating: "No",
  //     confidence: "60%",
  //     decision: "Selected",
  //     accuracy: "41%",
  //     time: "29 Jan 2026, 10:30 AM",
  //   },
  //   {
  //     interview: "HR Interview",
  //     cheating: "Yes",
  //     confidence: "30%",
  //     accuracy: "28%",
  //     decision: "Rejected",
  //     time: "28 Jan 2026, 04:15 PM",
  //   },
  // ];

  const user = JSON.parse(localStorage.getItem("user"));
  const userEmail = user?.email;

  useEffect(() => {
    if (!userEmail) {
      navigate("/login");
      return;
    }

    axios
      .get(
        `https://interview.ksesystem.com/
admin/students/${userEmail}/attempted-interviews/visible`,
        {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        }
      )
      .then((res) => {
        setInterviews(res.data.attempted_interviews);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch report", err);
        setLoading(false);
      });
  }, [userEmail, navigate]);



  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.email) {
      const name = user.email.split("@")[0]; // gautam
      setUserName(name);
    }
  }, []);


  const formatDateTime = (timestamp) => {
    if (!timestamp) return "-";

    const date = new Date(timestamp);

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("flow");
    localStorage.removeItem("flowStep");
    navigate("/", { replace: true });
  };

  return (
    <>
      <Header
        showProfile={true}
        userName={userName}
        showReport={true}
        onLogoutClick={() => setShowLogoutModal(true)}
      />


        <div className="table-container">
          <h2> Interview Report</h2>
          <div className="table-scroll">
            <table className="interview-table">
              <thead>
                <tr>
                  <th>Interview_Id</th>
                  <th>Cheating</th>
                  <th>Confidence</th>
                  <th>Accuracy</th>
                  <th>Decision</th>
                  <th>Time & Date</th>
                  <th>Cheating Reason</th>
                  {/* <th>View</th> */}
                </tr>
              </thead>

              <tbody>
                {interviews.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      No interviews attempted
                    </td>
                  </tr>
                ) : (
                  interviews.map((item, index) => (
                    <tr key={index}>
                      <td>{item.interview_id}</td>

                      <td className={item.cheating ? "danger" : "safe"}>
                        {item.cheating ? "Yes" : "No"}
                      </td>

                      <td>{(item.confidence * 100).toFixed(0)}%</td>

                      <td>{(item.nervousness * 100).toFixed(0)}%</td>

                      <td
                        className={item.decision === "Hire" ? "safe" : "danger"}
                      >
                        {item.decision}
                      </td>

                      <td>{formatDateTime(item.attempted_at)}</td>

                      <td>{item.cheating_reason || "-"}</td>

                      {/* <td>
                      <span
                        className="view-icon"
                        title="View Details"
                        onClick={() => console.log("Viewing:", item)}
                      >
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
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </span>
                    </td> */}
                    </tr>
                  ))
                )}
              </tbody>
            </table></div>
        </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out?</p>
            <div className="logout-modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Report;
