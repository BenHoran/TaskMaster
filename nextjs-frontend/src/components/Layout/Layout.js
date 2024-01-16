import React, { Fragment } from "react";

import Sidebar from "../Sidebar/Sidebar";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";

const Layout = ({ children }) => {
  return (
    <Fragment>
      <Header />
      <div className="relative min-h-screen md:flex" >
        <Sidebar />
        {children}
      </div>
      <Footer />
    </Fragment>
  );
};

export default Layout;
