import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import API_BASE from "../config/api";
import "../styles/register.css";

const Register = () => {
  const navigate = useNavigate();
  const { user, admin } = useAuth();

  useEffect(() => {
    if (admin) {
      navigate("/admin/dashboard");
    } else if (user) {
      navigate("/home");
    }
  }, [user, admin, navigate]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const NAME_REGEX = /^[a-zA-Z\s]{3,}$/;
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const PHONE_REGEX = /^[6-9][0-9]{9}$/;
  const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
  const ADDRESS_REGEX = /^[a-zA-Z0-9\s,.-]{5,}$/;

  const handleRegister = (e) => {
    e.preventDefault();

    if (!NAME_REGEX.test(name.trim())) {
      alert("Name must be at least 3 letters (letters and spaces only).");
      return;
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!PHONE_REGEX.test(phone.trim())) {
      alert("Phone number must be a valid 10-digit Indian mobile number.");
      return;
    }

    if (!ADDRESS_REGEX.test(address.trim())) {
      alert("Address must be at least 5 characters.");
      return;
    }

    if (!PASSWORD_REGEX.test(password)) {
      alert("Password must be at least 6 characters with letters and numbers.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    axios
      .get(`${API_BASE}/users`)
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
          role: "user",
        };

        return axios.post(
          `${API_BASE}/users`,
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