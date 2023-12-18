import React, { Fragment } from "react";

import Sidebar from "../Sidebar/Sidebar";
import Footer from "../Footer/Footer";

const Layout = ({ children }) => {
  return (
    <Fragment>
      <main className="flex" >
        <Sidebar />
        {children}
      </main>
      <Footer />
    </Fragment>
  );
};

export default Layout;
