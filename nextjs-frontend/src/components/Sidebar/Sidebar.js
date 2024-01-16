"use client";
import React, { Fragment, useState } from "react";
import Link from "next/link";
import { MdMenu } from "react-icons/md";

const Sidebar = ({ children }) => {
  const [showMenu, setShowMenu] = useState(false);

  const buttonHandler = () => {
    setShowMenu(!showMenu);
  };
  return (
    <Fragment>
      <div className="bg-gray-800 text-gray-100 flex md:hidden justify-end">
        <button
          onClick={buttonHandler}
          className="p-4 focus:outline-none focus:bg-gray-700"
        >
          <MdMenu className="h-5 w-5" />
        </button>
      </div>
      <div
        className={styles.sidebar + (showMenu ? " -translate-x-full" : "")}
      >
        <nav>
          <Link className={styles.menulink} href="/app">
            Main
          </Link>
          <Link className={styles.menulink} href="/app/tasks">
            Tasks
          </Link>
          <Link className={styles.menulink} href="/logout">
            Logout
          </Link>
        </nav>
      </div>
    </Fragment>
  );
};

const styles = {
  sidebar:
    "text-gray-900 bg-gray-50 w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform md:relative md:translate-x-0 transition duration-200 ease-in-out",
  menulink:
    "block py-2.5 px-4 hover:bg-green-500 rounded transition duration-200 hover:text-white",
};

export default Sidebar;
