import React from "react";
import { useLocation } from "react-router-dom";

import Navbar from "./Components/Navbar";
import AllRoutes from "./AllRoutes";

const App = () => {
  const location = useLocation();

  // Check whether the current page is an admin page
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {/* User Navbar only */}
      {!isAdminPage && <Navbar />}

      <AllRoutes />
    </>
  );
};

export default App;