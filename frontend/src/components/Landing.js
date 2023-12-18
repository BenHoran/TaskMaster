import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import SignUp from "./Signup";

const Landing = () => {
  return (
    <Fragment>
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Landing page.</h1>
          <Link className={styles.linkbutton} to={"/login"}>
            Login
          </Link>
        </div>
      </div>
      <SignUp></SignUp>
    </Fragment>
  );
};

const styles = {
  container: "flex",
  card: "p-6 max-w-sm m-auto bg-white rounded-xl shadow-lg flex items-center space-x-4",
  title: "text-2xl font-medium text-black",
  linkbutton: "text-bold bg-cyan-400 py-3 px-5 rounded-xl",
};

export default Landing;
