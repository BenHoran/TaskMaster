"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Input from "../Input";
import FormAction from "../FormAction";

import { editTask } from "@/lib/features/taskActions";

const EditTask = (props) => {
  const [error, setError] = useState("");

  const user = useAppSelector((state) => state.user);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(editTask(props.task, user, router));
    props.handleClose();
    setError("");
  };

  return (
    <>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="">
          {fields.map((field) => (
            <Input
              key={field.id}
              handleChange={handleChange}
              value={taskState[field.id]}
              labelText={field.labelText}
              labelFor={field.labelFor}
              id={field.id}
              name={field.name}
              type={field.type}
              isRequired={field.isRequired}
              placeholder={field.placeholder}
            />
          ))}
          <p className="text-red-500 text-center">{error ? error : ""}</p>
          <FormAction handleSubmit={handleSubmit} text="Add Task" />
          <button
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mt-10"
            onClick={props.handleClose}
          >
            Close
          </button>
        </div>
      </form>
    </>
  );
};

export default EditTask;
