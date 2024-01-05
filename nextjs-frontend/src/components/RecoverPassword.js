import React from "react";
import { Link } from "react-router-dom";

const RecoverPassword = () => {
  return (
    <div className={styles.container}>
      <span>Password recovery</span>
      <Link to={"/"}>Home</Link>
    </div>
  );
};

const styles = {
    container: "container grid"
}

export default RecoverPassword;
