import React from "react";

const Footer = ({ children }) => {
  return (
    <footer className={style.footer}>
      <div>
        <p>Copyright 2023</p>
      </div>
    </footer>
  );
};

const style = {
  footer: "flex center-items bg-cyan-500"
}

export default Footer;
