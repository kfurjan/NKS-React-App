import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/actions/authActions";
import "./Login.css";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const loginError = useSelector((state) => state.auth.error);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Dispatch the login action with the login data
    dispatch(login({ email: loginData.email, password: loginData.password }));
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/'); // Navigate to the home page
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
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
        {loginError && <div className="error">{loginError}</div>}{" "}
        {/* Display the error message if it exists */}
      </form>
    </div>
  );
};

export default LoginPage;
