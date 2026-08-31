import { useLocation } from "react-router-dom";

import Navbar from "./Components/Navbar";
import AllRoutes from "./AllRoutes";

const App = () => {
  const location = useLocation();

  // Hide navbar on admin and auth pages (login/register)
  const hideNavbar =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <>
      {/* User Navbar only */}
      {!hideNavbar && <Navbar />}

      <AllRoutes />
    </>
  );
};

export default App;