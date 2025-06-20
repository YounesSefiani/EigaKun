import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import connexion from "./services/connexion";
import MoviesPage from "./pages/Movies/MoviesPage/MoviesPage";
import OneMoviePage from "./pages/Movies/OneMoviePage/OneMoviePage";
import SeriesPage from "./pages/Series/SeriesPage/SeriesPage";
import OneSeriePage from "./pages/Series/OneSeriePage/OneSeriePage";
import PersonalitiesPage from "./pages/Personalities/PersonalitiesPage/PersonalitiesPage";
import OnePersonalityPage from "./pages/Personalities/OnePersonalityPage/OnePersonalityPage";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  // BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
  {
    path: "/personnalités",
    element: <PersonalitiesPage />,
    loader: async () => {
      try {
        const res = await connexion.get("/personalities");
        return res.data;
      } catch (err) {
        return console.error(err);
      }
    },
  },
  {
    path: "/personnalites/:id",
    element: <OnePersonalityPage />,
    loader: async ({ params }) => {
      try {
        const res = await connexion.get(`/personalities/${params.id}`);
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
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
