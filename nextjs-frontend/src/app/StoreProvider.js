"use client";
import { Provider } from "react-redux";
import store from '@/lib/store'
import { persistStore } from "redux-persist"

persistStore(store)

const StoreProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
