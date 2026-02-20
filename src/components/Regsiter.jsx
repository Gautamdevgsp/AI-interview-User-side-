import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import "../assets/styles/Login.css";
import { useNavigate } from "react-router-dom";
import APIser from "../routes/Apiservice";
import logo from "../assets/images/logo1.png";

export default function Register() {
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ VALIDATION
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    setError("");

    // try {
    //   const res = await APIser.studentRegister(form);

    //   const loginRes = await APIser.studentLogin({
    //     email: form.email,
    //     password: form.password,
    //   });

    //   localStorage.setItem("token", res.data.token);
    //   localStorage.setItem("user", JSON.stringify(res.data.user));

    //   setShowModal(true);

    //   setTimeout(() => {
    //     navigate("/selectinterview");
    //   }, 800);
    // } catch (err) {
    //   console.log(err);
    //   alert(err.response?.data?.detail || "Error");
    // }

    try {
  // 1️⃣ Register user
  await APIser.studentRegister(form);

  // 2️⃣ Auto login after register
  const loginRes = await APIser.studentLogin({
    email: form.email,
    password: form.password,
  });

  // 3️⃣ Store user consistently
  localStorage.setItem(
    "user",
    JSON.stringify({
      email: form.email,
    })
  );

  localStorage.setItem(
    "token",
    loginRes.data.token || "logged-in"
  );

  localStorage.setItem("flow", "select");

  setShowModal(true);

  setTimeout(() => {
    navigate("/selectinterview");
  }, 1000);
} catch (err) {
  console.log(err);
  alert(err.response?.data?.detail || "Error");
}

  };

  return (
    <>
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
            <span>Registered successfully</span>
            <button onClick={() => setError("")}>✕</button>
          </div>
        )}

        <div className="inner_page login">
          <div className="full_container">
            <div className="container">
              <div className="center verticle_center full_height">
                <div className="login_section1">
                  <div className="logo_login">
                    <div className="center" style={{margin:"1.4rem"}}>
                      <img
                                               src={logo} alt="logo" 
                                       style={{ maxWidth: "200px", maxHeight: "50px" }}
                     />
                    </div>

                    <div className="login-heading">
                      <h2>Register yourself for Interview</h2>
                      <p>
                        Welcome! Enter your details below to join the session
                      </p>
                    </div>
                  </div>

                  <div className="login_form">
                    <form onSubmit={handleSubmit}>
                      <fieldset>
                        <div className="field">
                          <label className="label_field">Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            placeholder="Name"
                            required=""
                            onChange={(e) =>
                              setForm({ ...form, name: e.target.value })
                            }
                          />
                        </div>

                        <div className="field">
                          <label className="label_field">Email Address</label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            placeholder="you@example.com"
                            required=""
                            onChange={(e) =>
                              setForm({ ...form, email: e.target.value })
                            }
                          />
                        </div>
{/* 
                        <div className="field">
                          <label className="label_field">Password</label>
                            <div className="password-container">
                          <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            placeholder="Enter password"
                            required=""
                            onChange={(e) =>
                              setForm({ ...form, password: e.target.value })
                            }
                          />
                        

                          </div>
                        </div> */}

                       
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
                              /*Eye with FULL diagonal slash (hidden) */
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
                            Register
                          </button>
                        </div>

                        <div className="bottom">
                          <Link to="/" class="register">
                            <p>
                              {" "}
                              Already have an account ? <b> Sign in</b>{" "}
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
    </>
  );
}
