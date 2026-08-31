import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { syncCart } from "../Redux/CartSlice";
import "../styles/login.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    const loggedInAdmin = localStorage.getItem("loggedInAdmin");

    if (loggedInAdmin) {
      navigate("/admin/dashboard");
    } else if (loggedInUser) {
      navigate("/home");
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();

    axios
      .all([
        axios.get("http://localhost:5000/users"),
        axios.get("http://localhost:5000/admin"),
      ])
      .then(
        axios.spread((usersResponse, adminsResponse) => {
          const users = usersResponse.data;
          const admins = adminsResponse.data;

          const user = users.find(
            (item) =>
              item.email === email &&
              item.password === password
          );

          const admin = admins.find(
            (item) =>
              item.email === email &&
              item.password === password
          );

          if (admin) {
            console.log("Logged in admin:", admin);

            // Store logged-in admin, clear any user session
            localStorage.removeItem("loggedInUser");
            localStorage.setItem(
              "loggedInAdmin",
              JSON.stringify(admin)
            );

            alert("Admin login successful!");

            dispatch(syncCart());

            // Stay on the admin dashboard
            navigate("/admin/dashboard");
          } else if (user) {
            console.log("Logged in user:", user);

            // Store logged-in user, clear any admin session
            localStorage.removeItem("loggedInAdmin");
            localStorage.setItem(
              "loggedInUser",
              JSON.stringify(user)
            );

            alert("Login successful!");

            dispatch(syncCart());

            // Navigate to home
            navigate("/home");
          } else {
            alert("Invalid email or password");
          }
        })
      )
      .catch((error) => {
        console.log("Login error:", error);
        alert("Unable to login. Please try again.");
      });
  };

  return (
    <div className="login-page">

      <div className="login-card">

        {/* Left Side - Image */}
        <div className="login-image">
          <img
            src="/images/login.svg"
            alt="BookNest Login"
          />

          <div className="image-overlay">
            <h2>Welcome to BookNest</h2>
            <p>
              Discover books, stationery and more.
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-section">

          <h1>Welcome Back!</h1>

          <p className="login-subtitle">
            Login to your BookNest account
          </p>

          <form onSubmit={handleLogin}>

            {/* Email */}
            <div className="input-group">
              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="input-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="login-button"
            >
              Login
            </button>

          </form>

          {/* Register */}
          <p className="register-text">
            Don't have an account?
          </p>

          <button
            className="create-account-button"
            onClick={() => navigate("/register")}
          >
            Create Account
          </button>

        </div>
      </div>
    </div>
  );
};

export default Login;