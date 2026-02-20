import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../assets/styles/Login.css";

import { useNavigate } from "react-router-dom";
import APIser from "../routes/Apiservice";

export default function Login() {
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    setError("");

    try {
      const res = await APIser.studentLogin(form);

      // ✅ STORE USER IN LOCAL STORAGE
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: form.email,
        }),
      );

      localStorage.setItem("token", res.data.token || "logged-in");
     localStorage.setItem("flow", "select");

      setShowModal(true);

      setShowModal(true);

      setTimeout(() => {
        navigate("/selectinterview");
      }, 1500);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.detail || "Error");
    }
  };

  return (
    <>
      {error && (
        <div className="error-modal">
          <span>{error}</span>
          <button onClick={() => setError("")}>✕</button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="login-modal">
          <span>Login successfully</span>
          <button onClick={() => setError("")}>✕</button>
        </div>
      )}

      <div className="inner_page login">
        <div className="full_container">
          <div className="container">
            <div className="center verticle_center full_height">
              <div className="login_section">
                <div className="logo_login d-flex flex-column align-items-center text-center">
                  <div className="center" style={{margin:"1.4rem"}}>
                    <img
                      alt="logo"
                     src="src/assets/images/logo1.png"
                        style={{ maxWidth: "200px", maxHeight: "50px" }}
                    />
                  </div>

                  <div className="login-heading">
                    <h2>Login for the Interview</h2>
                    <p>Welcome! Enter your details below to join the session</p>
                  </div>
                </div>

                <div className="login_form">
                  <form onSubmit={handleSubmit}>
                    <fieldset>
                      <div className="field">
                        <label className="label_field">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          placeholder="E-mail"
                          onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                          }
                        />
                      </div>


                      <div className="field">
                        <label className="label_field">Password</label>

                        <div className="password-container">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            onChange={(e) =>
                              setForm({ ...form, password: e.target.value })
                            }
                          />

                          <span
                            className="eye-icon"
                            onClick={() => setShowPassword(!showPassword)}
                            title={
                              showPassword ? "Hide password" : "Show password"
                            }
                          >
                            {showPassword ? (
                              /* Eye Open SVG */
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="gray"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            ) : (
                              /* 🚫 Eye with FULL diagonal slash (hidden) */
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="gray"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                                <circle cx="12" cy="12" r="3" />
                                <line x1="2" y1="2" x2="22" y2="22" />
                              </svg>
                            )}
                          </span>
                        </div>
                      </div>




                      <div className="field margin_0">
                        <label className="label_field hidden">
                          hidden label
                        </label>
                        <button className="main_bt" type="submit">
                          Login
                        </button>
                      </div>


 <div className="or-divider">
                        <span>or</span>
                      </div>
                     
                      <div className="bottom">
                        <Link to="/register" className="register">
                          <p>
                            {" "}
                            Don't have an account ? <b> Sign up</b>{" "}
                          </p>
                        </Link>
                      </div>
                    </fieldset>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
