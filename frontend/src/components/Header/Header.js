import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = (props) => {
  const user = useSelector((state) => state.user);

  return (
    <Fragment>
      <header className={style.header}>
        <h1 className={style.title}>Task Master</h1>
        {!user ? (
          <div>
            <Link
              className={style.link}
              to={"/signup"}
            >
              Signup
            </Link>
          </div>
        ) : (
          <div>
            <Link
              className={style.link}
              to={"/app/logout"}
            >
              Logout
            </Link>
          </div>
        )}
      </header>
    </Fragment>
  );
};

const style = {
  link: "float-right text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800",
  header: "bg-cyan-500 p-10 flow-root space-x-1",
  title: "float-left font-bold text-4xl"
}

export default Header;
