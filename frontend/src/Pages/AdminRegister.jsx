import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import API_BASE from "../config/api";
import "../styles/adminlogin.css";

const AdminRegister = () => {

  const navigate = useNavigate();
  const { admin } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const NAME_REGEX = /^[a-zA-Z\s]{3,}$/;
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

  const handleRegister = (e) => {
    e.preventDefault();

    if (admin) {
      setError("You are already logged in as an admin.");
      return;
    }

    if (!NAME_REGEX.test(name.trim())) {
      setError("Name must be at least 3 letters (letters and spaces only).");
      return;
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!PASSWORD_REGEX.test(password)) {
      setError("Password must be at least 6 characters with letters and numbers.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    axios
      .get(`${API_BASE}/admin`)
      .then((response) => {
        const admins = response.data;

        const existing = admins.find(
          (item) => item.email === email
        );

        if (existing) {
          throw new Error("Admin email already registered");
        }

        const adminData = {
          name,
          email,
          password,
          role: "admin"
        };

        return axios.post(`${API_BASE}/admin`, adminData);
      })
      .then(() => {
        alert("Admin registration successful!");
        navigate("/admin/login");
      })
      .catch((err) => {
        console.log(err);
        setError(
          err.message === "Admin email already registered"
            ? err.message
            : "Admin registration failed"
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
          <h2>Admin Registration</h2>
          <p>Create an admin account</p>
        </div>

        <form onSubmit={handleRegister}>

          <div className="form-group">
            <label>Admin Name</label>

            <input
              type="text"
              placeholder="Enter admin name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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

          <div className="form-group">
            <label>Confirm Password</label>

            <input
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "Registering..." : "Register Admin"}
          </button>

        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "18px",
            fontSize: "14px",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "#2563eb" }}
          >
            Login here
          </Link>
        </p>

      </div>

    </div>
  );
};

export default AdminRegister;
