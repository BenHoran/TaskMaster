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
  container: "flex-1 p-10 text-2xl font-bold",
  title: "text-center mb-5",
};
