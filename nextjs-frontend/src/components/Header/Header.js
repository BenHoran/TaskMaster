"use client";
import React, { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import { useAppSelector } from "@/lib/hooks";
import { GrTask } from "react-icons/gr";

const Header = (props) => {
  const user = useAppSelector((state) => state.user);
  const [username, setUsername] = useState("");

  useEffect(() => {
    setUsername(user.username);
  }, [user]);

  return (
    <Fragment>
      <header className={style.header}>
        <div className={style.containerLeft}>
          <GrTask className="text-white h-8 w-8" />
          <span className={style.title}>Task Master</span>
        </div>
        <div className={style.containerRight}>
          <span className={style.username}>{username}</span>
        </div>
      </header>
    </Fragment>
  );
};

const style = {
  link: "text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800",
  header: "bg-slate-500 p-10 flow-root space-x-1",
  title: "text-white font-bold text-4xl",
  username: "text-white font-bold",
  containerLeft: "inline-flex items-baseline float-left space-x-5",
  containerRight: "float-right space-x-5",
};

export default Header;
