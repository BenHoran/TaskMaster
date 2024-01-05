"use client";
import { useAppSelector } from "@/lib/hooks";
import React, { useState, useEffect } from "react";

const Main = () => {
  const user = useAppSelector((state) => state.user);
  const [title, setTitle] = useState("")

  useEffect(() => {
    setTitle("Welcome, " + user.username + "!");
  }, [user]);

  return (
    <div className={styles.container}>
      <span className={styles.title}>{title}</span>
    </div>
  );
};

export default Main;

const styles = {
  container: "w-100 m-auto p-7 rounded-lg mt-12 border-solid shadow-md",
  title: "text-center text-2xl mb-5",
};
