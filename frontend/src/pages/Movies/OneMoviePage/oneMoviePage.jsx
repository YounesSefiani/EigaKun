import React from "react";
import { useLoaderData } from "react-router-dom";
import Header from "../../../components/Header/Header";
import HeaderPhone from "../../../components/Header/HeaderPhone/HeaderPhone";
import FooterPhone from "../../../components/Header/FooterPhone/FooterPhone";
import UserInteractionsButtons from "../../../components/UserInteractionsButtons/UserInteractionsButtons";
import EigaKunLogo from "../../../assets/EigaKunLogo.png";
import MovieCasting from "../../../components/MovieCasting/MovieCasting";
import "./oneMoviePage.css";

function OneMoviePage() {
  const movie = useLoaderData();

  // Fonction pour formater la date
  const formatDate = (date) => {
    const zeroPad = (number) => (number < 10 ? `0${number}` : number);
    const movieDate = new Date(date);
    const day = zeroPad(movieDate.getDate());
    const month = zeroPad(movieDate.getMonth() + 1);
    const year = movieDate.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Fonction pour formater la durée
  const formatDuration = (duration) => {
    if (!duration) return "";
    const [hh, mm] = duration.split(":");
    return `${parseInt(hh, 10)}:${mm}`;
  };

  return (
    <>
      <Header />
      <HeaderPhone />
      <div className="oneMoviePage">
        <div className="oneMovieHeader">
          {movie.background ? (
            <img
              className="oneMovieBackground"
              src={movie.background}
              alt={movie.title}
            />
          ) : (
            <div className="oneMovieBackgroundFolder" />
          )}
          <div className="oneMovieHeaderContent">
            <div className="oneMoviePoster">
              <UserInteractionsButtons movie={movie} movieId={movie.id} />
              {movie.poster ? (
                <img src={movie.poster} alt={movie.title} />
              ) : (
                <div className="oneMoviePosterFolder">
                  <img src={EigaKunLogo} alt="EigaKunLogo" />
                  <p>{movie.title}</p>
                  <p className="notPoster">
                    Pas d'affiche disponible pour le moment.
                  </p>
                </div>
              )}
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
                    <strong>Date de sortie :</strong>{" "}
                    {formatDate(movie.release_date)}
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
                  {movie.universe && (
                    <p>
                      <strong>Univers :</strong> {movie.universe}
                    </p>
                  )}
                  {movie.subUniverse && (
                    <p>
                      <strong>Sous-Univers :</strong> {movie.subUniverse}
                    </p>
                  )}
                  {movie.streaming && (
                    <p>
                      <strong>Disponible sur :</strong> {movie.streaming}
                    </p>
                  )}
                  {movie.original && (
                    <p>
                      <strong>Une production exclusive de :</strong>{" "}
                      {movie.original}
                    </p>
                  )}
                </div>
                <div className="oneMovieSynopsis">
                  {movie.synopsis ? (
                    <p>{movie.synopsis}</p>
                  ) : (
                    <p style={{ fontSize: "15px" }}>
                      Pas de synopsis pour le moment.
                    </p>
                  )}
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

export default OneMoviePage;
