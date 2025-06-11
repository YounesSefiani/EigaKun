import React from "react";
import { useLoaderData } from "react-router-dom";
import Header from "../../../components/Header/Header";
import HeaderPhone from "../../../components/HeaderPhone/HeaderPhone";
import FooterPhone from "../../../components/FooterPhone/FooterPhone";
import EigaKunLogo from "../../../assets/EigaKunLogo.png";
import "./OneMoviePage.css";

function OneMoviePage() {
  const movie = useLoaderData();

  const formatDate = (date) => {
    const zeroPad = (number) => (number < 10 ? "0" : "") + number;
    const movieDate = new Date(date);
    const day = zeroPad(movieDate.getDate());
    const month = zeroPad(movieDate.getMonth() + 1);
    const year = movieDate.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const formatDuration = (duration) => {
    if (!duration) return "";
    const [hh, mm] = duration.split(":");
    return `${parseInt(hh, 10)}:${mm}`;
  }
  return (
    <>
      <Header />
      <HeaderPhone />
      <div className="oneMoviePage">
        <div className="oneMovieHeader">
          <div className="oneMovieBackground">
            {movie.background ? (
              <img
                src={movie.background}
                alt={`Background du film ${movie.title}`}
              />
            ) : (
              <div className="oneMovieBackgroundFolder" />
            )}
          </div>
          <div className="oneMovieHeaderContent">
            <div className="oneMoviePoster">
              {movie.poster ? (
                <img src={movie.poster} alt={movie.title} />
              ) : (
                <div className="oneMoviePosterFolder">
                  <img src={EigaKunLogo} alt={movie.title} />
                </div>
              )}
            </div>
            <div className="oneMovieHeaderLeftSide">
              {movie.logo ? (
                <img src={movie.logo} alt={movie.title} />
              ) : (
                <h4>{movie.title}</h4>
              )}
              <div className="oneMovieDetails">
                <div className="oneMovieInfos">
                  <p>
                    Date de sortie : <br />
                    <strong>{formatDate(movie.release_date)}</strong>
                  </p>
                  <p>
                    Durée : <br />
                    <strong>{formatDuration(movie.duration)}</strong>
                  </p>
                  <p>
                    Genre(s) : <br />
                    <strong>{movie.genre}</strong>
                  </p>
                  <p>
                    Thème(s) : <br />
                    <strong>{movie.theme}</strong>
                  </p>
                  <p>
                    Sortie : <br />
                    <strong>{movie.screen}</strong>
                  </p>
                  {movie.original ? (
                    <p>
                      Original: <br />
                      <strong>{movie.original}</strong>
                    </p>
                  ) : null}
                  {movie.streaming ? (
                    <p>
                      Streaming : <br />
                      <strong>{movie.streaming}</strong>
                    </p>
                  ) : null}
                  {movie.universe ? (
                    <p>
                      Univers : <br />
                      <strong>{movie.universe}</strong>
                    </p>
                  ) : null}
                  {movie.subUniverse ? (
                    <p>
                      Sous-univers : <br />
                      <strong>{movie.subUniverse}</strong>
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
        <div className="reviewsAndTrailer">
          <div className="reviews">
            <h4>Reviews</h4>
          </div>
          <div className="trailer">
            <h4>Trailer du film "{movie.title}"</h4>
            <iframe src={movie.trailer} title={`Trailer de ${movie.title}`} />
          </div>
        </div>
      </div>
      <FooterPhone />
    </>
  );
}

export default OneMoviePage;
