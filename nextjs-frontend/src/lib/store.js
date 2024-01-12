// store.js (Redux store configuration)
import { configureStore } from "@reduxjs/toolkit";
import userSlice from "@/lib/features/authSlice";
import taskSlice from "@/lib/features/taskSlice";
import { persistReducer } from "redux-persist";
import storage from "./customStorage";
import logger from "redux-logger";

const authPersistConfig = {
  key: "auth",
  storage: storage,
  whitelist: ["access_token", "refresh_token", "username"],
};

const taskPersistConfig = {
  key: "tasks",
  storage: storage,
  whitelist: [ "tasks" ]
}

const store = configureStore({
  reducer: {
    user: persistReducer(authPersistConfig, userSlice),
    tasks: persistReducer(taskPersistConfig, taskSlice)
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logger),
});

export default store;
