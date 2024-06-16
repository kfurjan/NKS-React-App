import React from "react";
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../pages/AppLayout";
import HomePage from "../pages/HomePage/HomePage";
import CustomersPage from "../pages/CustomersPage/CustomersPage";
import LoginPage from "../pages/LoginPage/LoginPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import UserLoggedInRoute from "../components/UserLoggedInRoute";
import AccountItemsPage from "../pages/AccountItemsPage/AccountItemsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "customers", element: <CustomersPage /> },
      {
        path: "items/:id",
        element: (
          <UserLoggedInRoute>
            <AccountItemsPage />
          </UserLoggedInRoute>
        ),
      },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      {
        path: "profile",
        element: (
          <UserLoggedInRoute>
            <ProfilePage />
          </UserLoggedInRoute>
        ),
      },
    ],
  },
]);

export default router;
