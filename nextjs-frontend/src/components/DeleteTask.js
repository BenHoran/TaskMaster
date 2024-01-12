"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";

import { deleteTask } from "@/lib/features/taskActions";

const DeleteTask = (props) => {
  const [error, setError] = useState("");

  const user = useAppSelector((state) => state.user);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(deleteTask(props.task.task_id, user, router));
    props.handleClose();
    setError("");
  };

  return (
    <>
      <p>Confirm delete</p>
      <p>{props.task.task_name}</p>
      <p>{props.task.task_date}</p>
      <p className="text-red-500 text-center">{error ? error : ""}</p>
      <button
        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mt-10"
        onClick={handleSubmit}
      >
        Delete
      </button>
      <button
        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mt-10"
        onClick={props.handleClose}
      >
        Close
      </button>
    </>
  );
};

export default DeleteTask;
