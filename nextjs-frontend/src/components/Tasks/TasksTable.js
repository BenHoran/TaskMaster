"use client";
import React, { useState, useEffect, Fragment } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import createApi from "@/lib/axios";
import Modal from "../Modal/Modal";
import AddTask from "./AddTask";
import { getTasks, completeTask } from "@/lib/features/taskActions";

import { MdEdit, MdDelete, MdCheckCircle } from "react-icons/md";
import DeleteTask from "./DeleteTask";

const TaskTable = () => {
  const user = useAppSelector((state) => state.user);
  const tasks = useAppSelector((state) => state.tasks);

  const [modalData, setModalData] = useState();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const dispatch = useAppDispatch();
  const api = createApi({ dispatch, user, router });

  const [isAddOpen, setAddIsOpen] = useState(false);
  const [isDeleteOpen, setDeleteIsOpen] = useState(false);

  useEffect(() => {
    dispatch(getTasks(user, router));
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    setData(tasks.tasks);
  }, [tasks]);

  const editTaskHandler = (task_id) => {
    alert("Edit task: " + task_id);
  };

  const completeTaskHandler = (props) => {
    console.log(props)
    dispatch(completeTask(props, user, router))
  };

  const deleteTask = (props) => {
    setDeleteIsOpen(true);
    setModalData(props)
  };

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
                  <th className={styles.table_header}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.task_id} className={item.task_complete ? "line-through" : ""}>
                    <td className={styles.row}>{item.task_name}</td>
                    <td className={styles.row}>{item.task_date}</td>
                    <td className="p-2 border-b text-center">
                      <span className="inline-flex items-baseline space-x-2">
                        <MdCheckCircle
                          id="Complete"
                          title="Complete"
                          onClick={() => completeTaskHandler(item)}
                        />
                        <MdEdit
                          id="Edit"
                          title="Edit"
                          onClick={() => editTaskHandler(item.task_id)}
                        />
                        <MdDelete
                          id="Delete"
                          title="Delete"
                          onClick={() => deleteTask(item)}
                        />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={() => setAddIsOpen(true)}
              className={styles.button}
            >
              New Task
            </button>
            <Modal
              handleClose={() => setAddIsOpen(false)}
              isOpen={isAddOpen}
              modalTitle="Add Task"
            >
              <AddTask
                handleClose={() => setAddIsOpen(false)}
                isOpen={isAddOpen}
              />
            </Modal>
            <Modal
              handleClose={() => setDeleteIsOpen(false)}
              isOpen={isDeleteOpen}
              modalTitle="Confirm Delete Task"
            >
              <DeleteTask
                handleClose={() => setDeleteIsOpen(false)}
                task={modalData}
                isOpen={isDeleteOpen}
              />
            </Modal>
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
  button:
    "m-4 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800",
};

export default TaskTable;
