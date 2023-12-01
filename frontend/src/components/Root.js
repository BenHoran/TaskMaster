import React from "react";
import { useSelector } from "react-redux";
import LoginPage from "./LoginPage";
import ProtectedPage from "./ProtectedPage";

const Root = () => {
  const user = useSelector((state) => state.user);

  return (
      <div>{!user ? <LoginPage /> : <ProtectedPage />}</div>
  );
};

export default Root;
