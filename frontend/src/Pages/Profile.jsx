import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import API_BASE from "../config/api";
import "../styles/profile.css";

const Profile = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (!user || !user.id) return;

    setLoadingOrders(true);
    axios
      .get(`${API_BASE}/orders?userId=${user.id}`)
      .then((response) => {
        setOrders(response.data);
      })
      .catch(() => {
        setOrders([]);
      })
      .finally(() => {
        setLoadingOrders(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("delivered")) return "status-delivered";
    if (s.includes("processing")) return "status-processing";
    if (s.includes("shipped")) return "status-shipped";
    return "status-pending";
  };

  return (
    <div className="profile-page">

      <div className="profile-header">
        <h1>👤 My Profile</h1>
        <p>Your BookNest account details</p>
      </div>

      {!user ? (
        <div className="profile-login-prompt">
          <h2>You are not logged in</h2>
          <p>
            Please <Link to="/login">login</Link> or{" "}
            <Link to="/register">register</Link> to view your profile.
          </p>
        </div>
      ) : (
        <>
          <div className="profile-card">
            <div className="profile-avatar">👤</div>

            <div className="profile-field">
              <label>Name</label>
              <div>{user.name}</div>
            </div>

            <div className="profile-field">
              <label>Email</label>
              <div>{user.email}</div>
            </div>

            <div className="profile-field">
              <label>Phone</label>
              <div>{user.phone || "—"}</div>
            </div>

            <div className="profile-field">
              <label>Address</label>
              <div>{user.address || "—"}</div>
            </div>
          </div>

          <div className="profile-orders">
            <h2>📦 My Orders</h2>

            {loadingOrders ? (
              <p className="orders-loading">Loading your orders...</p>
            ) : orders.length === 0 ? (
              <p className="orders-empty">
                You have not placed any orders yet.
              </p>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div className="order-card" key={order.id}>
                    <div className="order-card-header">
                      <div>
                        <span className="order-date">
                          {new Date(order.date).toLocaleDateString()}
                        </span>
                        <span className="order-id">#{order.id}</span>
                      </div>
                      <span className={`order-status ${statusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="order-items">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item) => (
                          <div className="order-item" key={item.id}>
                            <span className="order-item-name">
                              {item.name}
                            </span>
                            <span className="order-item-qty">
                              x{item.quantity}
                            </span>
                            <span className="order-item-price">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        ))
                      ) : (
                        <span>No items</span>
                      )}
                    </div>

                    <div className="order-card-footer">
                      <span>
                        {order.paymentMethod || "Cash on Delivery"}
                      </span>
                      <span className="order-total">
                        ₹{order.total}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
};

export default Profile;
