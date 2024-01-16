import React, { Fragment } from "react";
import Link from "next/link"
import SignUp from "@/components/PriceCard";

const Landing = () => {
  return (
    <Fragment>
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Landing page.</h1>
          <Link className={styles.linkbutton} href="/login">
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
  linkbutton: "text-bold bg-green-500 py-3 px-5 rounded-xl",
};

export default Landing;
