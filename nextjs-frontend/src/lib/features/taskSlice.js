import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  tasks: [],
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    getTasks: (state, action) => {
      state.tasks = action.payload.tasks.results;
    },
    addTask: (state, action) => {
      return { ...state, tasks: [...state.tasks, action.payload.task] };
    },
    deleteTask: (state, action) => {
      return {...state, tasks: [...state.tasks.filter((item) => item.task_id !== action.payload.task_id)]}
    },
    completeTask: (state, action) => {
      return {...state, tasks: [...state.tasks.map((item) => {return item.task_id === action.payload.task.task_id ? action.payload.task : item})]}
    },
    editTask: (state, action) => {
      return {...state, tasks: [...state.tasks.map((item) => {return item.task_id === action.payload.task.task_id ? action.payload.task : item})]}
    }
  },
});

export const taskActions = taskSlice.actions;
export default taskSlice.reducer;
