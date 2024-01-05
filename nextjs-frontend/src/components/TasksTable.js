"use client";
import React, { useState, useEffect, Fragment } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import createApi from "@/lib/axios";

const TaskTable = () => {
  const user = useAppSelector((state) => state.user);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const api = createApi({dispatch, user, router});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/tasks");
        setData(response.data.results);
        setLoading(false);
        setErrorMessage("");
      } catch (err) {
        setData([]);
        setLoading(false);
        setErrorMessage("Error fetching data. Please try again.");
        console.error("API call failed: [ " + err + "]");
        // router.push("/logout", { replace: true });
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {loading ? (
          <p>Loading...</p>
        ) : errorMessage ? (
          <p className={styles.error}>{errorMessage}</p>
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
