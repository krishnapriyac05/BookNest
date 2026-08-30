import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/adminlogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    axios
      .get("http://localhost:3000/admin")
      .then((response) => {
        const admins = response.data;

        const admin = admins.find(
          (item) =>
            item.email === email &&
            item.password === password
        );

        if (admin) {
          localStorage.setItem(
            "loggedInAdmin",
            JSON.stringify(admin)
          );
          navigate("/admin/dashboard");
        } else {
          setError("Invalid admin email or password");
        }
      })
      .catch(() => {
        setError(
          "Unable to reach the server. Make sure JSON Server is running on port 3000."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="admin-login-page">

      <div className="admin-login-card">

        <div className="admin-login-header">
          <h1>📚 BookNest</h1>
          <h2>Admin Login</h2>
          <p>Manage your BookNest store</p>
        </div>

        <form onSubmit={handleLogin}>

          <div className="form-group">
            <label>Admin Email</label>

            <input
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="admin-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="admin-login-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "18px",
            fontSize: "14px",
          }}
        >
          Don't have an admin account?{" "}
          <Link
            to="/admin/register"
            style={{ color: "#2563eb" }}
          >
            Register here
          </Link>
        </p>

      </div>

    </div>
  );
};

export default AdminLogin;
