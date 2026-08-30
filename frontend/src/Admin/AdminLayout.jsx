import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../styles/admindashboard.css";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("loggedInAdmin");
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">

      {/* Sidebar */}
      <aside className="admin-sidebar">

        <Link to="/admin/dashboard" className="admin-logo" style={{ textDecoration: "none", color: "white", display: "block" }}>
          📚 BookNest
        </Link>

        <div className="admin-title">
          Admin Panel
        </div>

        <nav className="admin-menu">

          <Link to="/admin/dashboard">
            📊 Dashboard
          </Link>

          <Link to="/admin/products">
            📦 Products
          </Link>

          <Link to="/admin/add-products">
            ➕ Add Product
          </Link>

          <Link to="/admin/orders">
            🛒 Orders
          </Link>

          <Link to="/admin/users">
            👥 Users
          </Link>

          <Link to="/admin/categories">
            📚 Categories
          </Link>

          <Link to="/admin/reports">
            📈 Reports
          </Link>

          <Link to="/admin/settings">
            ⚙️ Settings
          </Link>

        </nav>

        <button
          className="admin-logout"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>

      </aside>

      {/* Admin Page Content */}
      <main className="admin-main">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;