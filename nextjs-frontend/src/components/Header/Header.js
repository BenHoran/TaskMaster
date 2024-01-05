"use client";
import React, { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import { useAppSelector } from "@/lib/hooks";

const Header = (props) => {
  const user = useAppSelector((state) => state.user);
  const [username, setUsername] = useState("")

  useEffect(() => {
    setUsername(user.username);
  }, [user]);


  return (
    <Fragment>
      <header className={style.header}>
        <h1 className={style.title}>Task Master</h1>
        {!user ? (
          <div className={style.container}>
            <Link className={style.link} href="/signup">
              Signup
            </Link>
          </div>
        ) : (
          <div className={style.container}>
            <span className={style.username}>{username}</span>
            <Link className={style.link} href="/logout">
              Logout
            </Link>
          </div>
        )}
      </header>
    </Fragment>
  );
};

const style = {
  link: "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800",
  header: "bg-black p-10 flow-root space-x-1",
  title: "text-white float-left font-bold text-4xl",
  username: "text-white font-bold",
  container: "float-right space-x-5"
};

export default Header;
