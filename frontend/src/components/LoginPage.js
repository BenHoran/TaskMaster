// LoginPage.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "./store";
import axios from "axios";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const basicAuthToken = btoa(`${username}:${password}`);
      const response = await axios.post(
        "http://flask:5000/login",
        {},
        {
          headers: {
            Authorization: `Basic ${basicAuthToken}`,
          },
        }
      );

      const { access_token, user } = response.data;

      dispatch(login({ username: user, access_token }));
      setError("");
    } catch (error) {
      setError("Incorrect username or password. Please try again.");
      console.error("Login failed:", error.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login</h2>
      <div style={styles.inputContainer}>
        <label style={styles.label}>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />
      </div>
      <div style={styles.inputContainer}>
        <label style={styles.label}>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
      </div>
      <button onClick={handleLogin} style={styles.button}>
        Login
      </button>
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

const styles = {
  container: {
    width: "300px",
    margin: "auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    marginTop: "50px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center",
    fontSize: "1.5em",
    marginBottom: "20px",
  },
  inputContainer: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
  },
  input: {
    boxSizing: 'border-box',
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#4CAF50",
    color: "white",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: "15px",
  },
};

export default LoginPage;
