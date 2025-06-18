import React from "react";
import { useLoaderData, Link, Outlet } from "react-router-dom";
import Header from "../../../components/Header/Header";
import HeaderPhone from "../../../components/HeaderPhone/HeaderPhone";
import FooterPhone from "../../../components/FooterPhone/FooterPhone";
import EigaKunLogo from "../../../assets/EigaKunLogo.png";
import HorizontalScroll from "../../../components/HorizontalScroll/HorizontalScroll";
import "./MoviesPage.css";

function MoviesPage() {
  const movies = useLoaderData();

  return (
    <>
      <Header />
      <HeaderPhone />
      <div className="moviesPage">
        <h2>Les films</h2>
        <div className="moviesContainer">
          <div className="moviesList">
            <HorizontalScroll>
            {movies.map((film) => (
              <div className="movieCard" key={film.id}>
                <Link to={`/films/${film.id}`}>
                  {film.poster ? (
                    <img src={film.poster} alt={film.title} />
                  ) : (
                    <div className="posterPlaceholder">
                      <img src={EigaKunLogo} alt={film.title} />
                    </div>
                  )}
                  <h3>{film.title}</h3>
                </Link>
              </div>
            ))}
            </HorizontalScroll>
          </div>
        </div>
      </div>
      <Outlet />
      <FooterPhone />
    </>
  );
}

export default MoviesPage;
