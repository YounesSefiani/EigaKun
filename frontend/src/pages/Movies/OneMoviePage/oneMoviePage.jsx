import React from "react";
import { useLoaderData } from "react-router-dom";
import "./oneMoviePage.css";
import Header from "../../../components/Header/Header";
import HeaderPhone from "../../../components/Header/HeaderPhone/HeaderPhone";
import FooterPhone from "../../../components/Header/FooterPhone/FooterPhone";
import MovieCasting from "../../../components/MovieCasting/MovieCasting";

function oneMoviePage() {
  const movie = useLoaderData();

  const zero = (number) => (number < 10 ? `0${number}` : number);

  const date = new Date(movie.release_date);
  const day = zero(date.getDate());
  const month = zero(date.getMonth() + 1);
  const year = date.getFullYear();

  const formattedDate = `${day}-${month}-${year}`;

  const formatDuration = (duration) => {
    if (!duration) return ""; // Sécurité si la durée est vide

    const [hh, mm] = duration.split(":"); // Sépare heures et minutes
    const hours = parseInt(hh, 10); // Convertit en nombre pour supprimer le 0 devant
    return `${hours}:${mm}`;
  };

  return (
    <>
      <Header />
      <HeaderPhone />
      <div className="oneMoviePage">
        <div className="oneMovieHeader">
          <img
            className="oneMovieBackground"
            src={movie.background}
            alt={movie.title}
          />
          <div className="oneMovieHeaderContent">
            <div className="oneMoviePoster">
              <img src={movie.poster} alt={movie.title} />
            </div>
            <div className="oneMovieHeaderInfos">
              {movie.logo ? (
                <img src={movie.logo} alt={movie.title} />
              ) : (
                <h3>{movie.title}</h3>
              )}
              <div className="oneMovieHeaderInfosContainer">
                <div className="oneMovieDetails">
                  <p>
                    <strong>Date de sortie :</strong> {formattedDate}
                  </p>
                  <p>
                    <strong>Durée :</strong> {formatDuration(movie.duration)}
                  </p>
                  <p>
                    <strong>Genres :</strong> {movie.genre}
                  </p>
                  <p>
                    <strong>Themes :</strong> {movie.theme}
                  </p>
                  <p>
                    <strong>Sortie :</strong> {movie.screen}
                  </p>
                  <p>
                    <strong>Origine :</strong> {movie.country}
                  </p>
                  {movie.universe ? (
                    <p>
                      <strong>Univers :</strong> {movie.universe}
                    </p>
                  ) : null}
                  {movie.subUniverse ? (
                    <p>
                      <strong>Sous-Univers :</strong> {movie.subUniverse}
                    </p>
                  ) : null}
                  {movie.streaming ? (
                    <p>
                      <strong>Disponible sur :</strong> {movie.streaming}
                    </p>
                  ) : null}
                  {movie.original ? (
                    <p>
                      <strong>Une production exclusive de :</strong>{" "}
                      {movie.original}
                    </p>
                  ) : null}
                </div>
                <div className="oneMovieSynopsis">
                  <p>{movie.synopsis}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="castingContainer">
          <MovieCasting movieCasting={movie.casting} />
        </div>
      </div>
      <FooterPhone />
    </>
  );
}

export default oneMoviePage;
