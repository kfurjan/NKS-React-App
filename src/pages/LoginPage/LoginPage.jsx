import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../redux/actions/userActions";
import "./LoginPage.css";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const loginError = useSelector((state) => state.auth.error);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  const handleInputChange = function (event) { // using function declaration instead of arrow function
    var name = event.target.name;
    var value = event.target.value;
    setLoginData(Object.assign({}, loginData, { [name]: value }));
  };

  const handleSubmit = function (event) {
    event.preventDefault();
    dispatch(login({ email: loginData.email, password: loginData.password }));
  };

  useEffect(function () {
    if (isAuthenticated) {
      navigate('/customers');
    }
  }, [isAuthenticated, navigate]);

  useEffect(function () {
    // ES5 Vanilla JS DOM manipulation example
    var titleElement = document.getElementById("login-title");
    if (titleElement) {
      titleElement.innerHTML = "Please Login";
    }
  }, []);

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 id="login-title">Login</h2>
        <label htmlFor="email">Username:</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          value={loginData.email}
          onChange={handleInputChange}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          value={loginData.password}
          onChange={handleInputChange}
          required
        />
        <button type="submit" className="login-btn">
          Login
        </button>
        {loginError && <div className="error">{loginError}</div>}
      </form>
    </div>
  );
};

export default LoginPage;
