import React from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./pages/RootLayout.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import CustomersPage from "./pages/CustomersPage/CustomersPage.jsx";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.jsx";
import ErrorPage from "./pages/ErrorPage/ErrorPage.jsx";
import ProfilePage from "./pages/ProfilePage/ProfilePage.jsx";
import UserLoggedInRoute from "./components/UserLoggedInRoute.jsx";
import AccountItemsPage from "./pages/AccountItemsPage/AccountItemsPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
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

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
