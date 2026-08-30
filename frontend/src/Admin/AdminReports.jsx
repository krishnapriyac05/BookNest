import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/adminlist.css";

const AdminReports = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/products")
      .then((res) => setProducts(res.data))
      .catch(() => {});

    axios
      .get("http://localhost:3000/users")
      .then((res) => setUsers(res.data))
      .catch(() => {});

    axios
      .get("http://localhost:3000/orders")
      .then((res) => setOrders(res.data))
      .catch(() => {});
  }, []);

  const books = products.filter((p) => p.type === "Book");
  const stationery = products.filter((p) => p.type === "Stationery");

  const categoryCounts = {};
  products.forEach((p) => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });

  const totalRevenue = orders.reduce(
    (sum, o) => sum + (Number(o.total) || 0),
    0
  );

  const lowStock = products.filter((p) => p.stock <= 15);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>📈 Reports</h1>
          <p>Store performance and inventory overview</p>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <h2>{products.length}</h2>
          <p>Total Products</p>
        </div>

        <div className="stat-card">
          <h2>{users.length}</h2>
          <p>Registered Users</p>
        </div>

        <div className="stat-card">
          <h2>{orders.length}</h2>
          <p>Total Orders</p>
        </div>

        <div className="stat-card">
          <h2>₹{totalRevenue}</h2>
          <p>Total Revenue</p>
        </div>

        <div className="stat-card">
          <h2>{books.length}</h2>
          <p>Books</p>
        </div>

        <div className="stat-card">
          <h2>{stationery.length}</h2>
          <p>Stationery</p>
        </div>

        <div className="stat-card">
          <h2>{lowStock.length}</h2>
          <p>Low Stock Items</p>
        </div>
      </div>

      <h2 style={{ color: "#172554", margin: "30px 0 15px" }}>
        Products by Category
      </h2>

      <div className="report-cards">
        {Object.entries(categoryCounts).map(([category, count]) => (
          <div className="report-card" key={category}>
            <h4>{category}</h4>
            <div className="count">{count}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReports;
