import {
  LOGIN_SUCCESS,
  LOGOUT,
  LOGIN_FAILURE,
  REGISTER_SUCCESS,
  UPDATE_USER,
} from "../actions/userActions";

const defaultUserState = {
  isUserLoggedIn: false,
  user: null,
  error: null,
};

const userReducer = (state = defaultUserState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      return handleLoginOrRegisterSuccess(state, action);

    case UPDATE_USER:
      return handleUpdateUser(state, action);

    case LOGIN_FAILURE:
      return handleLoginFailure(state, action);

    case LOGOUT:
      return handleLogout(state);

    default:
      return state;
  }
};

const handleLoginOrRegisterSuccess = (state, action) => ({
  ...state,
  isUserLoggedIn: true,
  user: {
    ...state.user,
    ...action.payload,
  },
  error: null,
});

const handleUpdateUser = (state, action) => ({
  ...state,
  user: {
    ...state.user,
    ...action.payload,
  },
  error: null,
});

const handleLoginFailure = (state, action) => ({
  ...state,
  error: action.payload,
});

const handleLogout = (state) => ({
  ...state,
  isUserLoggedIn: false,
  user: null,
  error: null,
});

export default userReducer;
