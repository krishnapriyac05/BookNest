import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("loggedInUser");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [admin, setAdmin] = useState(() => {
    try {
      const stored = localStorage.getItem("loggedInAdmin");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const loginAsUser = (userData) => {
    localStorage.removeItem("loggedInAdmin");
    localStorage.setItem("loggedInUser", JSON.stringify(userData));
    setAdmin(null);
    setUser(userData);
  };

  const loginAsAdmin = (adminData) => {
    localStorage.removeItem("loggedInUser");
    localStorage.setItem("loggedInAdmin", JSON.stringify(adminData));
    setUser(null);
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("loggedInAdmin");
    setUser(null);
    setAdmin(null);
  };

  const isLoggedIn = Boolean(user || admin);

  const value = {
    user,
    admin,
    isLoggedIn,
    loginAsUser,
    loginAsAdmin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
