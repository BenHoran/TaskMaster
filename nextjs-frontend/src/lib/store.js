// store.js (Redux store configuration)
import { configureStore } from "@reduxjs/toolkit";
import userSlice from "@/lib/features/auth/authSlice";
import { persistReducer } from "redux-persist";
import storage from "./customStorage";
import logger from "redux-logger";

const authPersistConfig = {
  key: "auth",
  storage: storage,
  whitelist: ["access_token", "username"],
};

const store = configureStore({
  reducer: {
    user: persistReducer(authPersistConfig, userSlice),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logger),
});

export default store;
