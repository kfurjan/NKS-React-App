import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function UserLoggedInRoute({ children }) {
  const { isUserLoggedIn } = useSelector((state) => state.auth);

  return isUserLoggedIn ? children : <Navigate to="/login" replace />;
}

export default UserLoggedInRoute;