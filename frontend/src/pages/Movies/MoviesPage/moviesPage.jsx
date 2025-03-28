import React from "react";
import { useLoaderData, Link } from "react-router-dom";
import Carousel from "../../../components/Carousel/Carousel";
import Header from "../../../components/Header/Header";
import HeaderPhone from "../../../components/Header/HeaderPhone/HeaderPhone";
import FooterPhone from "../../../components/Header/FooterPhone/FooterPhone";
import HorizontalScroll from "../../../components/HorizontalScroll/HorizontalScroll";
import "./moviesPage.css";

function moviesPage() {
  const movies = useLoaderData();

  const superHerosMovies = movies.filter(
    (film) => film.theme === "Super-Héros",
  );
  return (
    <>
      <Header />
      <HeaderPhone />
      <div className="moviesPage">
        <Carousel />
        <div className="moviesContainer">
          <div className="moviesList">
            <div className="moviesListContainer">
              <HorizontalScroll>
                {movies.map((film) => (
                  <div className="movieCard">
                    <Link key={film.id} to={`/films/${film.id}`}>
                      {film.poster ? (
                        <img src={film.poster} alt={film.title} />
                      ) : (
                        <div className="movieCardFolder">
                          <p>{film.title}</p>
                        </div>
                      )}
                    </Link>
                  </div>
                ))}
              </HorizontalScroll>
            </div>
          </div>
          <div className="moviesList">
            <h2>Les Super-Héros sont là !</h2>
            <div className="moviesListContainer">
              <HorizontalScroll>
                {superHerosMovies.map((film) => (
                  <div className="movieCard">
                    <Link key={film.id} to={`/films/${film.id}`}>
                      {film.poster ? (
                        <img src={film.poster} alt={film.title} />
                      ) : (
                        <div className="movieCardFolder">
                          <p>{film.title}</p>
                        </div>
                      )}
                    </Link>
                  </div>
                ))}
              </HorizontalScroll>
            </div>
          </div>
        </div>
      </div>
      <FooterPhone />
    </>
  );
}

export default moviesPage;
