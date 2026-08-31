import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/admindashboard.css";

const AdminDashBoard = () => {
  const [counts, setCounts] = useState({
    products: 0,
    orders: 0,
    users: 0,
    admins: 0,
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/products")
      .then((res) =>
        setCounts((c) => ({ ...c, products: res.data.length }))
      )
      .catch(() => {});

    axios
      .get("http://localhost:5000/orders")
      .then((res) =>
        setCounts((c) => ({ ...c, orders: res.data.length }))
      )
      .catch(() => {});

    axios
      .get("http://localhost:5000/users")
      .then((res) =>
        setCounts((c) => ({ ...c, users: res.data.length }))
      )
      .catch(() => {});
  }, []);

  return (
    <>
      <div className="admin-topbar">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome to BookNest Admin Panel</p>
        </div>

        <div className="admin-profile">
          👤 Admin
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="dashboard-cards">

        <Link to="/admin/products" className="dashboard-card" style={{ textDecoration: "none" }}>
          <div className="card-icon">📦</div>
          <div>
            <h3>{counts.products}</h3>
            <p>Products</p>
          </div>
        </Link>

        <Link to="/admin/orders" className="dashboard-card" style={{ textDecoration: "none" }}>
          <div className="card-icon">🛒</div>
          <div>
            <h3>{counts.orders}</h3>
            <p>Orders</p>
          </div>
        </Link>

        <Link to="/admin/users" className="dashboard-card" style={{ textDecoration: "none" }}>
          <div className="card-icon">👥</div>
          <div>
            <h3>{counts.users}</h3>
            <p>Users</p>
          </div>
        </Link>

        <Link to="/admin/categories" className="dashboard-card" style={{ textDecoration: "none" }}>
          <div className="card-icon">📚</div>
          <div>
            <h3>Categories</h3>
            <p>Manage Categories</p>
          </div>
        </Link>

      </div>

      {/* Quick Actions */}
      <section className="quick-actions">

        <h2>Quick Actions</h2>

        <div className="quick-action-buttons">

          <Link to="/admin/add-products">
            ➕ Add New Product
          </Link>

          <Link to="/admin/products">
            📦 View Products
          </Link>

          <Link to="/admin/orders">
            🛒 View Orders
          </Link>

          <Link to="/admin/users">
            👥 View Users
          </Link>

        </div>

      </section>
    </>
  );
};

export default AdminDashBoard;
