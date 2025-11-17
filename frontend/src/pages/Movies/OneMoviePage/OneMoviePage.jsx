import React from "react";
import { useLoaderData } from "react-router-dom";
import EigaKunLogo from "../../../assets/EigaKunLogo.png";
import CastingContainer from "../../../components/CastingContainer/CastingContainer";
import UserInteractionsButtons from "../../../components/UserInteractionsButtons/UserInteractionsButtons";
import "./OneMoviePage.css";

function OneMoviePage() {
  const movie = useLoaderData();

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("fr-FR");
  };

  const formatDuration = (duration) => {
    if (!duration) return "";
    const [hh, mm] = duration.split(":");
    return `${parseInt(hh, 10)}:${mm}`;
  };

  return (
    <div className="oneMoviePage">
      <div className="oneMovieHeader">
        {movie.background ? (
          <img
            src={
              movie.background && movie.background.startsWith("http")
                ? movie.background
                : movie.background
                ? `http://localhost:3994/src/assets/Movies/Backgrounds/${movie.background}`
                : ""
            }
            className="oneMovieBackground"
            alt={movie.title}
          />
        ) : (
          <div className="oneMovieBackgroundFolder" />
        )}
        <div className="oneMovieHeaderContent">
          <div className="oneMovieHeaderContentLeft">
            <UserInteractionsButtons
              favoriteId={movie.id}
              favoriteType="movie"
              isMovie={true}
              title={movie.title}
            />
            {movie.poster ? (
              <img
                src={
                  movie.poster && movie.poster.startsWith("http")
                    ? movie.poster
                    : movie.poster
                    ? `http://localhost:3994/src/assets/Movies/Posters/${movie.poster}`
                    : ""
                }
                alt={movie.title}
                className="oneMoviePoster"
              />
            ) : (
              <div className="oneMoviePosterPlaceholder">
                <img src={EigaKunLogo} alt={movie.title} />
                <p>Aucune affiche pour le moment.</p>
              </div>
            )}
          </div>
          <div className="oneMovieHeaderContentRight">
              {movie.logo ? (
                <img
                  src={
                    movie.logo && movie.logo.startsWith("http")
                      ? movie.logo
                      : movie.logo
                      ? `http://localhost:3994/src/assets/Movies/Logos/${movie.logo}`
                      : ""
                  }
                  className="oneMovieLogo"
                  alt={movie.title}
                />
              ) : (
                <h4>{movie.title}</h4>
              )}
            <div className="oneMovieDetails">
              <div className="oneMovieInfos">
                <p>
                  <strong>
                    Date de sortie :<br />
                    {formatDate(movie.release_date)}
                  </strong>
                </p>
                <p>
                  <strong>
                    Durée :<br />
                    {formatDuration(movie.duration)}
                  </strong>
                </p>
                <p>
                  <strong>
                    Genre(s) :<br />
                    {movie.genre}
                  </strong>
                </p>
                <p>
                  <strong>
                    Thème(s) :<br />
                    {movie.theme}
                  </strong>
                </p>
                <p>
                  <strong>
                    Origine(s) :<br />
                    {movie.country}
                  </strong>
                </p>
                <p>
                  <strong>
                    Sortie :<br />
                    {movie.screen}
                  </strong>
                </p>
                {movie.streaming ? (
                  <p>
                    <strong>
                      Streaming :<br />
                      {movie.streaming}
                    </strong>
                  </p>
                ) : null}{" "}
                {movie.original ? (
                  <p>
                    <strong>
                      Original :<br />
                      {movie.original}
                    </strong>
                  </p>
                ) : null}
                {movie.universe ? (
                  <p>
                    <strong>
                      Univers :<br />
                      {movie.universe}
                    </strong>
                  </p>
                ) : null}
                {movie.subUniverse ? (
                  <p>
                    <strong>
                      Sous-Univers :<br />
                      {movie.subUniverse}
                    </strong>
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
      <div className="castingSection">
        <h3>Casting du film "{movie.title}"</h3>
        <CastingContainer casting={movie.casting} />
      </div>
      {/* Reviews & Trailer */}
      <div className="movieReviewsAndTrailer">
        <div className="movieReviews">
          <h4>Reviews</h4>
        </div>
        <div className="movieTrailer">
          <h4>Trailer du film "{movie.title}"</h4>
          <iframe src={movie.trailer} title={`Trailer de ${movie.title}`} />
        </div>
      </div>
    </div>
  );
}

export default OneMoviePage;
