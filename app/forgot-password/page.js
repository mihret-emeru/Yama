"use client";

import { useState } from "react";

export default function ForgotPasswordPage({ onBackToLogin }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email === "admin@gmail.com") {
      setMessage("✅ Password reset instructions sent to admin@gmail.com!");
    } else {
      setMessage("❌ Email not found.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="card-header-orange">
          <img src="/croissant.png" alt="logo" className="login-logo" />
          <h1 className="title">Yama Bakery</h1>
          <h2 className="subtitle">Password Recovery</h2>
        </div>

        <p className="recovery-text">Enter your email address</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-container">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {message && (
            <div className="message-box">
              <p>{message}</p>
            </div>
          )}

          <div className="button-group">
            <button type="submit" className="signin-btn">
              Send Reset Instructions
            </button>

            {/* FIXED BUTTON */}
            <button type="button" className="back-btn" onClick={onBackToLogin}>
              Back to Login
            </button>
          </div>
        </form>

        <div className="footer-text">
          © 2025 Yama Bakery. All rights reserved.
        </div>
      </div>
    </div>
  );
}
