import React, { useReducer, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/actions/userActions";
import { formReducer } from "../../redux/reducers/formReducer";
import { SET_FIELD } from "../../utils/constants";
import "./LoginPage.css";

const initialState = {
  email: "",
  password: "",
};

const LoginPage = () => {
  const [state, dispatchForm] = useReducer(formReducer, initialState);
  const dispatch = useDispatch();
  const loginError = useSelector((state) => state.auth.error);
  const isUserLoggedIn = useSelector((state) => state.auth.isUserLoggedIn);
  const navigate = useNavigate();

  var handleInputChange = function (event) {
    var name = event.target.name;
    var value = event.target.value;
    dispatchForm({ type: SET_FIELD, field: name, value: value });
  };

  var handleSubmit = function (event) {
    event.preventDefault();
    dispatch(loginUser({ email: state.email, password: state.password }));
  };

  useEffect(() => {
    if (isUserLoggedIn) {
      navigate("/customers");
    }
  }, [isUserLoggedIn, navigate]);

  useEffect(() => {
    const titleElement = document.getElementById("login-title");
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
          value={state.email}
          onChange={handleInputChange}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          value={state.password}
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
