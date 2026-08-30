import React from "react";
import { Link } from "react-router-dom";
import "../styles/nav.css";

const Nav = () => {
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

        <Link to="/profile">👤 Profile</Link>

        <Link to="/login">Login</Link>

        <Link to="/admin/login">Admin</Link>

      </div>

    </nav>
  );
};

export default Nav;
