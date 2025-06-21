import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig"; // Ensure firebaseConfig.js is correctly set up
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate(); // Hook for navigation

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login Successful!");
      navigate("/home"); // Redirect to Home page after successful login
    } catch (error) {
      setError("Invalid Email or Password");
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div> {/* Dark Overlay for readability */}
      <div style={styles.authBox}>
        <h2 style={styles.heading}>LOGIN</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form style={styles.form} onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <input
              type="email"
              placeholder="Email"
              required
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={styles.inputGroup}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.showPasswordBtn}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div style={styles.rememberMe}>
            <input type="checkbox" id="remember" />
            <label htmlFor="remember" style={styles.label}>
              Remember me
            </label>
          </div>

          <button type="submit" style={styles.authBtn} disabled={loading}>
            {loading ? "Logging in..." : "LOGIN"}
          </button>
        </form>

        <p style={styles.switch}>
          Don't have an account?{" "}
          <a href="/signup" style={styles.link}>
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh", // Ensures full screen coverage
    width: "100vw",
    backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGsVYy3sDzdjDdY2HBcsz11nbodFK7AmEAmA&s')", // Background Image
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "fixed",
    top: 0,
    left: 0,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.5)", // Dark overlay for better readability
    zIndex: 1,
  },
  authBox: {
    background: "rgba(255, 255, 255, 0.27)", // Slight transparency
    padding: "40px",
    width: "350px",
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    zIndex: 2, // Ensures it's above the overlay
  },
  heading: {
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  inputGroup: {
    position: "relative",
    marginBottom: "15px",
    background: "white",
    borderRadius: "5px",
    padding: "10px",
    display: "flex",
    alignItems: "center",
  },
  input: {
    width: "100%",
    border: "none",
    outline: "none",
    padding: "5px",
    fontSize: "16px",
  },
  showPasswordBtn: {
    background: "none",
    border: "none",
    color: "#2196f3",
    cursor: "pointer",
    fontSize: "14px",
    marginLeft: "5px",
  },
  rememberMe: {
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    marginBottom: "15px",
  },
  label: {
    marginLeft: "5px",
  },
  authBtn: {
    width: "100%",
    padding: "10px",
    background: "#2196f3",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "0.3s",
  },
  switch: {
    marginTop: "15px",
    fontSize: "14px",
  },
  link: {
    color: "#2196f3",
    textDecoration: "none",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginBottom: "10px",
  },
};

export default Signin;
