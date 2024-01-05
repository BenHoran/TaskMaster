import React, { Fragment } from "react";

import Sidebar from "../Sidebar/Sidebar";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";

const Layout = ({ children }) => {
  return (
    <Fragment>
      <Header />
      <main className="flex" >
        <Sidebar />
        {children}
      </main>
      <Footer />
    </Fragment>
  );
};

export default Layout;
