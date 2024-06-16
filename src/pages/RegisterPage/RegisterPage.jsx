import React, { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../../redux/actions/userActions";
import { formReducer } from "../../redux/reducers/formReducer";
import { SET_FILE, SET_FIELD } from "../../utils/constants";
import "./RegisterPage.css";

const initialRegisterState = {
  name: "",
  username: "",
  password: "",
  file: null,
  validation: {},
};

const RegisterPage = () => {
  const [state, dispatchForm] = useReducer(formReducer, initialRegisterState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  var handleInputChange = function (event) {
    var name = event.target.name;
    var value = event.target.value;
    dispatchForm({ type: SET_FIELD, field: name, value: value });
  };

  var handleFileChange = function (event) {
    dispatchForm({ type: SET_FILE, file: event.target.files[0] });
  };

  var handleSubmit = function (event) {
    event.preventDefault();
    dispatch(
      registerUser(state, function () {
        navigate("/customers");
      })
    );
  };

  var isFormValid = function () {
    return (
      state.name &&
      state.username &&
      state.password &&
      state.file &&
      Object.values(state.validation).every(function (message) {
        return message === "";
      })
    );
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register user</h2>

        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={state.name}
          onChange={handleInputChange}
          required
        />
        {state.validation.name && (
          <div className="validation-message">{state.validation.name}</div>
        )}

        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={state.username}
          onChange={handleInputChange}
          required
        />
        {state.validation.username && (
          <div className="validation-message">{state.validation.username}</div>
        )}

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={state.password}
          onChange={handleInputChange}
          required
        />
        {state.validation.password && (
          <div className="validation-message">{state.validation.password}</div>
        )}

        <div className="avatar-upload">
          <label htmlFor="avatar" className="upload-button">
            Add avatar
          </label>
          <input
            type="file"
            id="avatar"
            name="avatar"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          {state.file && (
            <div className="preview">
              <img
                src={URL.createObjectURL(state.file)}
                alt="Avatar preview"
                onLoad={() => URL.revokeObjectURL(state.file)}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className={`register-btn ${isFormValid() ? "active" : "disabled"}`}
          disabled={!isFormValid()}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
