import { useState, useEffect } from "react";

import Navbar from "./Components/Navbar";
import AllRoutes from "./AllRoutes";

const App = () => {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setPathname(window.location.pathname);
    };

    const originalPush = history.pushState;
    const originalReplace = history.replaceState;

    history.pushState = function (...args) {
      originalPush.apply(this, args);
      handleLocationChange();
    };

    history.replaceState = function (...args) {
      originalReplace.apply(this, args);
      handleLocationChange();
    };

    window.addEventListener("popstate", handleLocationChange);

    return () => {
      history.pushState = originalPush;
      history.replaceState = originalReplace;
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  const hideNavbar =
    pathname.startsWith("/admin") ||
    pathname === "/login" ||
    pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <AllRoutes />
    </>
  );
};

export default App;