import { postRequest } from "../../utils/api";
import { BASE_URL } from "../../utils/constants";

const LOGIN_URL = `${BASE_URL}/auth/login`;
const REGISTER_URL = `${BASE_URL}/auth/register`;

export const LOGOUT = "LOGOUT";
export const UPDATE_USER = "UPDATE_USER";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";

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

export const loginUser = (loginData) => {
  return async (dispatch) => {
    try {
      const data = await postRequest(LOGIN_URL, {
        email: loginData.email,
        password: loginData.password,
      });
      const { access_token } = data;
      localStorage.setItem("token", access_token);
      dispatch(loginSuccess(loginData));
    } catch (error) {
      console.error("Login failed:", error);
      dispatch(loginFailure(error.message));
    }
  };
};

export const registerUser = (formData, callback) => {
  return async (dispatch) => {
    try {
      const userData = await postRequest(REGISTER_URL, {
        name: formData.name,
        email: formData.username,
        password: formData.password,
      });
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
        dispatch(loginUser(loginData));
        if (callback) callback();
      };
      reader.onerror = (error) => {
        console.error("Error converting file to base64 string:", error);
      };
    } catch (error) {
      console.error("Registration failed:", error.message);
      dispatch(loginFailure(error.message));
    }
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
