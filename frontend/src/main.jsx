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
import MoviesPage from "./pages/Movies/MoviesPage/moviesPage";
import OneMoviePage from "./pages/Movies/OneMoviePage/oneMoviePage";
import connexion from "./services/connexion";
import SeriesPage from "./pages/Series/SeriesPage/SeriesPage";
import OneSeriePage from "./pages/Series/OneSeriePage/OneSeriePage";

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
  {
    path: "/films",
    element: <MoviesPage />,
    loader: async () => {
      try {
        const res = await connexion.get("/movies");
        return res.data;
      } catch (err) {
        return console.error(err);
      }
    },
  },
  {
    path: "/films/:id",
    element: <OneMoviePage />,
    loader: async ({ params }) => {
      try {
        const res = await connexion.get(`/movies/${params.id}`);
        return res.data;
      } catch (err) {
        return console.error(err);
      }
    },
  },
  {
    path: "/series",
    element: <SeriesPage />,
    loader: async () => {
      try {
        const res = await connexion.get("/series");
        return res.data;
      } catch (err) {
        return console.error(err);
      }
    },
  },
  {
    path: "/series/:id",
    element: <OneSeriePage />,
    loader: async ({ params }) => {
      try {
        const res = await connexion.get(`/series/${params.id}`);
        return res.data;
      } catch (err) {
        return console.error(err);
      }
    },
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
