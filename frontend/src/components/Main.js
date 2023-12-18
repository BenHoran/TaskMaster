import React from "react";
import { useSelector } from "react-redux";

const Main = () => {
  const user = useSelector((state) => state.user);
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Welcome, {user.username}!</h2>
    </div>
  );
};

export default Main;

const styles = {
  container: "w-100 m-auto p-7 rounded-lg mt-12 border-solid shadow-md",
  title: "text-center text-2xl mb-5"
};