"use client";

import { useState, useEffect } from "react";

import Sidebar from "./sidebar";
import LoginPage from "../login/page";
import ForgotPasswordPage from "../forgot-password/page";

export default function AppContent({ children }) {
  const [view, setView] = useState("loading");
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    const logged = localStorage.getItem("loggedIn");

    if (logged === "true") {
      setView("app");
    } else {
      setView("login");
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem("loggedIn", "true");
    setView("app");
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    setView("login");
  };

  if (view === "loading") return null;

  if (view === "login") {
    return (
      <LoginPage
        onLogin={handleLogin}
        onForgotPassword={() => setView("forgot")}
      />
    );
  }

  if (view === "forgot") {
    return <ForgotPasswordPage onBackToLogin={() => setView("login")} />;
  }

  return (
    <div className="app-content">
      <Sidebar onLogout={handleLogout} />
      <main className="main-content">{children}</main>
    </div>
  );
}
