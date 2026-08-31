import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/adminlist.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  const getOrders = () => {
    axios
      .get("http://localhost:5000/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getOrders();
  }, []);

  const updateStatus = (order, status) => {
    axios
      .patch(`http://localhost:5000/orders/${order.id}`, { status })
      .then(() => {
        alert("Order status updated!");
        getOrders();
      })
      .catch((err) => console.log(err));
  };

  const deleteOrder = (id) => {
    if (!window.confirm("Delete this order?")) return;

    axios
      .delete(`http://localhost:5000/orders/${id}`)
      .then(() => {
        alert("Order deleted!");
        getOrders();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>🛒 Orders</h1>
          <p>Manage all customer orders</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="no-data">No orders found.</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.customerName || order.userName || "—"}</td>
                <td>
                  {Array.isArray(order.items)
                    ? order.items.reduce((s, i) => s + (i.quantity || 1), 0)
                    : order.itemCount || "—"}
                </td>
                <td>₹{order.total || "—"}</td>
                <td>
                  <select
                    className="status-select"
                    value={order.status || "Pending"}
                    onChange={(e) => updateStatus(order, e.target.value)}
                  >
                    <option>Pending</option>
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </td>
                <td>
                  <button
                    className="btn btn-delete"
                    onClick={() => deleteOrder(order.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminOrders;
