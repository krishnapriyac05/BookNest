import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    axios
      .get("http://localhost:3000/users")
      .then((response) => {
        const users = response.data;

        const existingUser = users.find(
          (user) => user.email === email
        );

        if (existingUser) {
          alert("Email already registered");
          return;
        }

        const newUser = {
          name,
          email,
          phone,
          address,
          password,
        };

        return axios.post(
          "http://localhost:3000/users",
          newUser
        );
      })
      .then((response) => {
        if (response) {
          alert("Registration successful!");
          navigate("/login");
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Registration failed");
      });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        {/* LEFT IMAGE */}
        <div className="auth-image">
          <img
            src="/images/register.svg"
            alt="Register"
          />
        </div>

        {/* RIGHT FORM */}
        <div className="auth-form">

          <h2>Create Account</h2>

          <p>Join BookNest today</p>

          <form onSubmit={handleRegister}>

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              required
            />

            <button type="submit">
              Register
            </button>

          </form>

          <span>
            Already have an account?{" "}

            <button
              type="button"
              className="login-link"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </span>

        </div>
      </div>
    </div>
  );
};

export default Register;