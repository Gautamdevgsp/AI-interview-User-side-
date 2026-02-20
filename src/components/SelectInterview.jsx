import "../assets/styles/Interview1.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import APIser from "../routes/Apiservice";
import Header from "../components/Header";
import { ClipLoader } from "react-spinners";

function SelectInterview() {
  let [loading, setLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [assignedInterviews, setAssignedInterviews] = useState([]);
  const [showAttemptedModal, setShowAttemptedModal] = useState(false);
  const [userName, setUserName] = useState("");

  const cardImages = [
    "https://img.freepik.com/free-vector/job-interview-conversation_74855-7566.jpg?semt=ais_hybrid&w=740&q=80",
    "https://www.investopedia.com/thmb/2FhTZblV83RR8iKmYMvVsl_1PDA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1011442304-753aa9168be547d78fede34155d1c3ba.jpg",
    "https://img.freepik.com/free-vector/flat-design-coworking-illustration_23-2150320193.jpg?t=st=1770878646~exp=1770882246~hmac=fbef35c2fc949f896237b019f19f7be25e4533549e104230647faeb42e127285",
    "https://img.freepik.com/free-vector/flat-design-coworking-illustration_23-2150320190.jpg?t=st=1770878754~exp=1770882354~hmac=76e93a5070c309b6d2a84b655f52abc790f29be74d6881be6863e3fad1b49177"
  ];

  const navigate = useNavigate();
  const isAttempted = (interviewId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return false;

    const data = JSON.parse(localStorage.getItem("attempted_interviews")) || {};
    return data[user.email]?.includes(interviewId);
  };

  useEffect(() => {
    const fetchAssignedInterviews = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.email) {
          alert("User not logged in");
          return;
        }
        const res = await APIser.getAssignedInterview(user.email);
        setAssignedInterviews(res.data.assigned_interviews || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignedInterviews();
  }, []);


  const handleInterviewClick = async (interviewId) => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.email) {
        alert("User not logged in");
        return;
      }

      localStorage.setItem("selected_interview_id", interviewId);

      const res = await APIser.startInterview(
        user.email,
        interviewId
      );

      const { session_id, interview_id } = res.data;

      localStorage.setItem("session_id", session_id);
      localStorage.setItem("active_interview_id", interview_id);
      localStorage.setItem("flowStep", "2");

      navigate("/inter");
    } catch (error) {
      console.error("ERROR:", error.response?.data || error.message);
      alert("Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("flow");
    localStorage.removeItem("flowStep");
    navigate("/", { replace: true });
  };

  const handleNext = () => {
    updateFlowStep(2);
    navigate("/inter");
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.email) {
      const name = user.email.split("@")[0];
      setUserName(name);
    }
  }, []);

  return (
    <div>
      <Header
        showProfile={true}
        userName={userName}
        showReport={true}
        onLogoutClick={() => setShowLogoutModal(true)}
      />

      {(!loading && <div className="main-container">
        <div className="select-container">
          <div className="interview-page">
            <h2 className="page-title text-center">Welcome! Select your interview</h2>

            <div className="card-grid">
              {assignedInterviews.length > 0 ? (
                assignedInterviews.map((interview) => (
                  <div
                    key={interview.interview_id}
                    className="interview-card"
                    onClick={() => {
                      if (isAttempted(interview.interview_id)) {
                        setShowAttemptedModal(true);
                        return;
                      }
                      handleInterviewClick(interview.interview_id);
                    }}
                  >
                    <div className="card-image">
                      <img
                        src={
                          cardImages[
                          interview.interview_id
                            .toString()
                            .split("")
                            .reduce((a, c) => a + c.charCodeAt(0), 0) %
                          cardImages.length
                          ]
                        }
                        alt="Interview"
                      />
                    </div>

                    <div className="card-content">
                      <h3 className="interview-title">{interview.title}</h3>
                      <p className="interview-desc">
                        {interview.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-interviews">
                  <img src="https://img.freepik.com/free-vector/waiting-concept-illustration_114360-2603.jpg" alt="No Interviews" className="no-interviews-img" />
                  <h3>No Interviews Assigned Yet</h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>)}

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

      {/* Attempted Modal */}
      {showAttemptedModal && (
        <div className="attempted-modal-overlay">
          <div className="attempted-modal">
            <h3>Interview Already Attempted</h3>
            <p>Multiple attempts are not allowed.</p>
            <button
              className="attempted-btn"
              onClick={() => setShowAttemptedModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Spinner */}
      {loading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999999,
          }}
        >
          <ClipLoader size={70} color="#2563eb" />
        </div>
      )}
    </div>
  );
}
export default SelectInterview;