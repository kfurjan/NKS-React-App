import {
  LOGIN_SUCCESS,
  LOGOUT,
  LOGIN_FAILURE,
  REGISTER_SUCCESS,
  UPDATE_USER,
} from "../actions/userActions";

const initialState = {
  isAuthenticated: false,
  user: null,
  error: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: {
          ...state.user,
          ...action.payload,
        },
        error: null,
      };
    case UPDATE_USER:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
        error: null,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: null,
      };
    default:
      return state;
  }
};

export default userReducer;
