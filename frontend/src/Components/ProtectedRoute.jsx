import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const loggedInUser = localStorage.getItem("loggedInUser");
  const loggedInAdmin = localStorage.getItem("loggedInAdmin");

  if (!loggedInUser && !loggedInAdmin) {
    return <Navigate to="/register" replace />;
  }

  return children;
};

export default ProtectedRoute;