import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { register } from "../redux/actions/userActions";
import "./RegisterPage.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    file: null,
  });
  const [validation, setValidation] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const registerAndNavigate = (formData) => {
    return (dispatch) => {
      dispatch(register(formData, () => navigate("/customers")));
    };
  };

  const validateField = (name, value) => {
    let message = "";
    switch (name) {
      case "name":
        message = value ? "" : "Name is not allowed to be empty";
        break;
      case "username":
        message = /^\S+@\S+\.\S+$/.test(value)
          ? ""
          : "Username must be a valid email";
        break;
      case "password":
        message =
          value.length >= 3
            ? ""
            : "Password length must be at least 3 characters long";
        break;
      default:
        break;
    }
    setValidation({ ...validation, [name]: message });
  };

  const handleFileChange = (event) => {
    setFormData({ ...formData, file: event.target.files[0] });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
    dispatch(registerAndNavigate(formData));
  };

  const isFormValid = () => {
    return (
      formData.name &&
      formData.username &&
      formData.password &&
      formData.file &&
      Object.values(validation).every((message) => message === "")
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
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        {validation.name && (
          <div className="validation-message">{validation.name}</div>
        )}

        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          required
        />
        {validation.username && (
          <div className="validation-message">{validation.username}</div>
        )}

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        {validation.password && (
          <div className="validation-message">{validation.password}</div>
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
          {formData.file && (
            <div className="preview">
              <img
                src={URL.createObjectURL(formData.file)}
                alt="Avatar preview"
                onLoad={() => URL.revokeObjectURL(formData.file)}
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
