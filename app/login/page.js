"use client";

import { useState } from "react";
import { login } from "../services/auth.service";

export default function LoginPage({ onLogin, onForgotPassword }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login(username, password);
      console.log("Logged in user:", data.user);
      localStorage.setItem("token", data.token); // store token
      onLogin(); // redirect
    } catch (err) {
      console.error("Login error caught in page:", err);
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      {/* ORANGE TOP SECTION */}

      <div className="login-card">
        <div className="card-header-orange">
          <img src="/croissant.png" alt="logo" className="login-logo" />
          <h1 className="title">Yama Bakery</h1>
          <h2 className="subtitle">Management System</h2>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-container">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-container">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="forgot-link">
            <p onClick={onForgotPassword} style={{ cursor: "pointer" }}>
              Forgot Password?
            </p>
          </div>

          <button type="submit" className="signin-btn">
            Sign In
          </button>
        </form>

        {/* FOOTER */}
        <div className="footer-text">
          © 2025 Yama Bakery. All rights reserved.
        </div>
      </div>
    </div>
  );
}
