// ProtectedPage.js
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./store";
import axios from "axios";

const ProtectedPage = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://tmflask:5000/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        }
      );

      dispatch(logout());
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Welcome, {user.username}!</h2>
      <p style={styles.paragraph}>This is a protected page with authenticated access.</p>
      <button onClick={handleLogout} style={styles.button}>Logout</button>
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
  button: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#4CAF50",
    color: "white",
    cursor: "pointer",
  },
  paragraph: {
    textAlign: "center"
  },
  error: {
    color: "red",
    marginTop: "15px",
  },
};
export default ProtectedPage;
