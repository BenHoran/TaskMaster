import { taskActions } from "./taskSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import createApi from "@/lib/axios";

export const getTasks = (user, router) => {
  return async (dispatch) => {
    const api = createApi({ dispatch, user, router });

    const fetchData = async () => {
      const response = await api.get("/api/tasks");
      if (!response.status === 200) {
        throw Error("Failed to get Tasks.");
      }
      return response.data;
    };

    try {
      const taskList = await fetchData();
      dispatch(taskActions.getTasks({ tasks: taskList }));
    } catch (error) {
      console.log(error);
    }
  };
};

export const addTask = (taskName, dateDue, user, router) => {
  return async (dispatch) => {
    const api = createApi({ dispatch, user, router });

    const postData = async () => {
      const newTask = {
        taskName,
        dateDue
      };
      const response = await api.post("/api/tasks", newTask);
      if (!response.status === 201) {
        throw Error("Failed to add task.");
      }
      return response.data;
    };

    try {
      const taskResult = await postData();
      dispatch(taskActions.addTask(taskResult));
    } catch (error) {
      console.log(error);
    }
  };
};

export const deleteTask = (taskId, user, router) => {
  return async (dispatch) => {
    const api = createApi({ dispatch, user, router });

    const deleteData = async () => {
      const response = await api.delete("/api/tasks("+ taskId +")");
      if (!response.status === 202) {
        throw Error("Failed to delete task.");
      }
      return response.data;
    };

    try {
      const taskResult = await deleteData();
      dispatch(taskActions.deleteTask(taskResult));
    } catch (error) {
      console.log(error);
    }
  };
};