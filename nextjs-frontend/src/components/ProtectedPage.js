import React, { Fragment } from "react";

import Layout from "../components/Layout/Layout";
import Header from "./Header/Header";

const ProtectedPage = ({children}) => {
  return (
    <Fragment>
      <Header />
      <Layout>
        {children}
      </Layout>
    </Fragment>
  );
};

export default ProtectedPage;