import React, { useState, useEffect, Fragment } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TaskTable = () => {
  const user = useSelector((state) => state.user);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/tasks", {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        });
        setData(response.data.results);
        setLoading(false);
        setError("");
      } catch {
        setData([]);
        setLoading(false);
        setError("Error fetching data. Please try again.");
        console.error("API call failed: ");
        navigate("/", { replace: true });
      }
    };
    if (user && user.access_token) {
      fetchData();
    }
  }, [user,navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <Fragment>
            <h3 className={styles.title}>Data Table</h3>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.table_header}>Task</th>
                  <th className={styles.table_header}>Date</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.task_id}>
                    <td className={styles.row}>{item.task_name}</td>
                    <td className={styles.row}>{item.task_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Fragment>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: "max-w-2xl mx-auto",
  card: "bg-white shadow-md border border-gray-200 rounded-lg max-w-sm p-4 sm:p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-700",
  title: "text-center text-xl mb-5",
  error: "text-red-500",
  table: "table-auto border",
  table_header: "font-bold p-2 border-b",
  row: "p-2 border-b",
};

export default TaskTable;
