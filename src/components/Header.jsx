import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
    return (
      <header className="header">
        <nav className="navbar">
          <div className="nav-links">
            <Link to="/">HomePage</Link>
            <Link to="/customers">Customers</Link>
          </div>
          <div className="auth-links">
            <Link to="/login">Login</Link>
            <Link to="/register">Register user</Link>
          </div>
        </nav>
      </header>
    );
  }
