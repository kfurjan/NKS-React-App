import axios from "axios";

// Constants
const DOMAIN = "localhost";
const PORT = 3000;
const BASE_URL = `http://${DOMAIN}:${PORT}`;
const LOGIN_URL = `${BASE_URL}/auth/login`;
const REGISTER_URL = `${BASE_URL}/auth/register`;

// Action Types
export const LOGOUT = "LOGOUT";
export const UPDATE_USER = "UPDATE_USER";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";

// Action Creators
export const loginSuccess = (userData) => ({
  type: LOGIN_SUCCESS,
  payload: userData,
});

export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: error,
});

export const logout = () => ({
  type: LOGOUT,
});

export const registerSuccess = (userData) => ({
  type: REGISTER_SUCCESS,
  payload: userData,
});

export const updateUserSuccess = (updatePayload) => ({
  type: UPDATE_USER,
  payload: updatePayload,
});

// Thunk Actions
export const login = (loginData) => {
  return (dispatch) => {
    axios
      .post(LOGIN_URL, {
        email: loginData.email,
        password: loginData.password,
      })
      .then((response) => {
        const { access_token } = response.data;
        localStorage.setItem("token", access_token);
        dispatch(loginSuccess(loginData));
      })
      .catch((error) => {
        const errorMsg = error.response
          ? error.response.data.message
          : error.message;
        console.error("Login failed:", errorMsg);
        dispatch(loginFailure(errorMsg));
      });
  };
};

export const register = (formData, callback) => {
  return (dispatch) => {
    axios
      .post(REGISTER_URL, {
        name: formData.name,
        email: formData.username,
        password: formData.password,
      })
      .then((response) => {
        const userData = response.data;
        dispatch(registerSuccess(userData));
        const reader = new FileReader();
        reader.readAsDataURL(formData.file);
        reader.onload = () => {
          const loginData = {
            id: userData.id,
            name: formData.name,
            email: formData.username,
            password: formData.password,
            image: reader.result,
          };
          dispatch(login(loginData));
          if (callback) callback();
        };
        reader.onerror = (error) => {
          console.error("Error converting file to base64 string:", error);
        };
      })
      .catch((error) => {
        const errorMsg = error.response
          ? error.response.data.message
          : error.message;
        console.error("Registration failed:", errorMsg);
        dispatch(loginFailure(errorMsg));
      });
  };
};

export const updateUser = (formData, callback) => {
  return (dispatch) => {
    if (formData.file) {
      const reader = new FileReader();
      reader.readAsDataURL(formData.file);
      reader.onload = () => {
        const updatePayload = {
          ...formData,
          email: formData.username,
          image: reader.result,
        };
        dispatch(updateUserSuccess(updatePayload));
        if (callback) callback();
      };
      reader.onerror = (error) => {
        console.error("Error converting file to base64 string:", error);
      };
    } else {
      const updatePayload = {
        ...formData,
        email: formData.username,
      };
      dispatch(updateUserSuccess(updatePayload));
      if (callback) callback();
    }
  };
};
