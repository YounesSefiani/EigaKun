import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App/App";
import AuthentificationPage from "./pages/Authentification/AuthentificationPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import { AuthProvider } from "./context/AuthContext";
import UserLayout from "./services/UserLayout";
import ValidationPage from "./pages/Authentification/ValidationPage/ValidationPage";
import ForgotPassword from "./pages/Authentification/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/Authentification/ResetPassword/ResetPassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/authentification",
    element: <AuthentificationPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password-confirm/:token",
    element: <ResetPassword />,
  },
  {
    path: "user",
    element: <UserLayout />,
    children: [
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "validation/:token",
        element: <ValidationPage />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);
