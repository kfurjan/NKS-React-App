import axios from "axios";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGOUT = "LOGOUT";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const UPDATE_USER = "UPDATE_USER";

// Async action creator for login
export const login = (loginData) => {
  return (dispatch) => {
    axios
      .post("http://localhost:3000/auth/login", {
        email: loginData.email,
        password: loginData.password,
      })
      .then((response) => {
        const { access_token } = response.data;
        console.log("Login: ", loginData);

        localStorage.setItem("token", access_token);
        dispatch(loginSuccess(loginData));
      })
      .catch((error) => {
        const errorMsg = error.response
          ? error.response.data.message
          : error.message;
        console.error("Login failed:", error);
        dispatch(loginFailure(errorMsg));
      });
  };
};

// Sync action creator for login success
export const loginSuccess = (userData) => ({
  type: LOGIN_SUCCESS,
  payload: userData,
});

export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: error,
});

// Sync action creator for logout
export const logout = () => ({
  type: LOGOUT,
});

export const register = (formData, callback) => {
  return (dispatch) => {
    axios
      .post("http://localhost:3000/auth/register", {
        name: formData.name,
        email: formData.username,
        password: formData.password,
      })
      .then((response) => {
        const userData = response.data;
        dispatch(registerSuccess(response.data));
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
        // Handle errors
        console.error("Registration failed:", error);
      });
  };
};

export const registerSuccess = (userData) => ({
  type: REGISTER_SUCCESS,
  payload: userData,
});

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
        dispatch({
          type: UPDATE_USER,
          payload: updatePayload,
        });
        callback();
      };
      reader.onerror = (error) => {
        console.error("Error converting file to base64 string:", error);
      };
    } else {
      dispatch({
        type: UPDATE_USER,
        payload: {
          ...formData,
          email: formData.username,
        },
      });
      callback(); 
    }
  };
};
