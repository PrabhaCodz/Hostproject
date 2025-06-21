import React, { useState } from "react";
import { auth } from "../firebaseConfig"; // Ensure firebaseConfig.js is properly set up
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created successfully!");
      navigate("/"); // Redirect to login page after successful signup
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.authBox}>
        <h2 style={styles.heading}>SIGN UP</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form style={styles.form} onSubmit={handleSignup}>
          <div style={styles.inputGroup}>
            <input
              type="email"
              placeholder="E-mail"
              required
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={styles.inputGroup}>
            <input
              type="password"
              placeholder="Password"
              required
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div style={styles.inputGroup}>
            <input
              type="password"
              placeholder="Confirm Password"
              required
              style={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" style={styles.authBtn}>CREATE ACCOUNT</button>
        </form>

        <p style={styles.switch}>
          Already have an account? <a href="/" style={styles.link}>Login here</a>
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
  authBox: {
    background: "rgba(255, 255, 255, 0.27)",
    padding: "40px",
    width: "350px",
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
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


export default Signup;
