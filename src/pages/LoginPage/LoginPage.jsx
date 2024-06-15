import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../redux/actions/userActions";
import "./LoginPage.css";

const LoginPage = () => {
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const loginError = useSelector((state) => state.auth.error);
  const isUserLoggedIn = useSelector((state) => state.auth.isUserLoggedIn);
  const navigate = useNavigate();

  const handleInputChange = function (event) { // using function declaration instead of arrow function
    var name = event.target.name;
    var value = event.target.value;
    setUserCredentials(Object.assign({}, userCredentials, { [name]: value }));
  };

  const handleSubmit = function (event) {
    event.preventDefault();
    dispatch(login({ email: userCredentials.email, password: userCredentials.password }));
  };

  useEffect(function () {
    if (isUserLoggedIn) {
      navigate('/customers');
    }
  }, [isUserLoggedIn, navigate]);

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
          value={userCredentials.email}
          onChange={handleInputChange}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          value={userCredentials.password}
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
