import { SET_FILE, SET_FIELD } from "../../utils/constants";

export const formReducer = (state, action) => {
  switch (action.type) {
    case SET_FIELD:
      return {
        ...state,
        [action.field]: action.value,
        validation: {
          ...state.validation,
          [action.field]: validateField(action.field, action.value),
        },
      };
    case SET_FILE:
      return {
        ...state,
        file: action.file,
      };
    default:
      return state;
  }
};

export const validateField = (name, value) => {
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
  return message;
};
