// ProtectedPage.js
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./store";
import axios from "axios";

const ProtectedPage = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "/api/tasks",
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
            }
          },
        );
        setData(response.data.results);
        setLoading(false);
        setError("");
      } catch {
        setData([]);
        setLoading(false);
        setError("Error fetching data. Please try again.");
        console.error("API call failed: ");
      }
    };
    if (user && user.access_token) {
      fetchData();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "/api/logout",
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
      <button onClick={handleLogout} style={styles.button}>
        Logout
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div>
          <h3>Data Table</h3>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={styles.cell}>Task</th>
                <th style={styles.cell}>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.task_id}>
                  <td style={styles.cell}>{item.task_name}</td>
                  <td style={styles.cell}>{item.task_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  cell: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
  },
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
    textAlign: "center",
  },
  error: {
    color: "red",
    marginTop: "15px",
  },
};
export default ProtectedPage;
