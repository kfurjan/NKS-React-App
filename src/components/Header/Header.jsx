import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/actions/userActions";
import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const { isUserLoggedIn, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  console.log(user);

  return (
    <header className="header">
      <nav className="navbar">
        <div className="nav-links">
          <Link to="/">HomePage</Link>
          <Link to="/customers">Customers</Link>
        </div>
        <div className="auth-links">
          {!isUserLoggedIn ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <div className="user-info">
              <Link to="/profile" className="email-link">
                {user.email}
              </Link>
              {user.image && (
                <img src={user.image} alt="Profile" className="profile-image" />
              )}
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
