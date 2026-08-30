import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/nav.css";

const Nav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    const loggedInAdmin = localStorage.getItem("loggedInAdmin");

    setIsLoggedIn(Boolean(loggedInUser || loggedInAdmin));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("loggedInAdmin");
    setIsLoggedIn(false);
    navigate("/home");
  };

  return (
    <nav className="navbar">

      <Link to="/" className="logo">
        📚 BookNest
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/books">Books</Link>
        <Link to="/stationery">Stationery</Link>
        <Link to="/categories">Categories</Link>
      </div>

      <div className="nav-actions">

        <div className="search-box">
          <input
            type="text"
            placeholder="Search books, stationery..."
          />
          <button>🔍</button>
        </div>

        <Link to="/cart">🛒 Cart</Link>

        {isLoggedIn ? (
          <Link to="/profile">👤 Profile</Link>
        ) : null}

        {isLoggedIn ? (
          <button
            className="nav-logout"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        ) : (
          <Link to="/login">Login</Link>
        )}

      </div>

    </nav>
  );
};

export default Nav;