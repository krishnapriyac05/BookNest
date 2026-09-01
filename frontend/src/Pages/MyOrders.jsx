import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import "../styles/myorders.css";

const MyOrders = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadOrders = () => {
    if (!user || !user.id) return;

    setLoading(true);
    axios
      .get(`http://localhost:5000/orders?userId=${user.id}`)
      .then((response) => {
        setOrders(response.data);
      })
      .catch(() => {
        setOrders([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canCancel = (status) => {
    const s = (status || "").toLowerCase();
    return s.includes("pending") || s.includes("processing");
  };

  const handleCancel = (order) => {
    if (!window.confirm(`Cancel order #${order.id}?`)) return;
    if (!user || !user.id) return;

    setMessage("");

    axios
      .patch(`http://localhost:5000/orders/${order.id}`, {
        status: "Cancelled",
      })
      .then(() => {
        setMessage("Order cancelled successfully.");
        loadOrders();
      })
      .catch(() => {
        setMessage("Could not cancel the order. Please try again.");
      });
  };

  const statusClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("delivered")) return "status-delivered";
    if (s.includes("processing")) return "status-processing";
    if (s.includes("shipped")) return "status-shipped";
    if (s.includes("cancelled") || s.includes("cancel"))
      return "status-cancelled";
    return "status-pending";
  };

  return (
    <div className="myorders-page">
      <div className="myorders-header">
        <h1>📦 My Orders</h1>
        <p>View your orders and their status</p>
      </div>

      {!user ? (
        <div className="myorders-empty">
          <h2>You are not logged in</h2>
          <p>
            Please <Link to="/login">login</Link> or{" "}
            <Link to="/register">register</Link> to view your orders.
          </p>
        </div>
      ) : (
        <div className="myorders-container">
          {message && <div className="myorders-message">{message}</div>}

          {loading ? (
            <p className="myorders-note">Loading your orders...</p>
          ) : orders.length === 0 ? (
            <div className="myorders-empty">
              <h2>No orders yet</h2>
              <p>You have not placed any orders.</p>
              <Link className="myorders-shop-btn" to="/">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="myorders-list">
              {orders.map((order) => {
                const cancellable = canCancel(order.status);
                return (
                  <div className="myorder-card" key={order.id}>
                    <div className="myorder-card-header">
                      <div>
                        <span className="myorder-date">
                          {new Date(order.date).toLocaleDateString()}
                        </span>
                        <span className="myorder-id">#{order.id}</span>
                      </div>
                      <span
                        className={`myorder-status ${statusClass(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="myorder-items">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item) => (
                          <div className="myorder-item" key={item.id}>
                            <span className="myorder-item-name">
                              {item.name}
                            </span>
                            <span className="myorder-item-qty">
                              x{item.quantity}
                            </span>
                            <span className="myorder-item-price">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        ))
                      ) : (
                        <span>No items</span>
                      )}
                    </div>

                    <div className="myorder-card-footer">
                      <div>
                        <span className="myorder-payment">
                          {order.paymentMethod || "Cash on Delivery"}
                        </span>
                        <span className="myorder-total">
                          Total: ₹{order.total}
                        </span>
                      </div>

                      {cancellable ? (
                        <button
                          className="myorder-cancel-btn"
                          onClick={() => handleCancel(order)}
                        >
                          Cancel Order
                        </button>
                      ) : (
                        <span className="myorder-noncancel">
                          Cancellation not available
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
