import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import connexion from "../../../services/connexion";
import { AuthContext } from "../../../services/Context/AuthContext";
import { Link } from "react-router-dom";
import "./UserFavoritesMoviesSection.css";
import HorizontalScroll from "../../../components/HorizontalScroll/HorizontalScroll";

function UserFavoritesMoviesSection({ setView }) {
  const { user, token, handleAuthError } = useContext(AuthContext);
  const [movies, setMovies] = useState([]);

  const likedMovies = movies.filter((movie) => movie.status === "liked");
  const favoritesMovies = movies.filter((movie) => movie.status === "favorite");
  const seenMovies = movies.filter((movie) => movie.status === "seen");
  const toWatchMovies = movies.filter((movie) => movie.status === "toWatch");
  useEffect(() => {
    if (!user || !token) return;
    connexion
      .get(`/userFavorites/${user.id}/movies`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((res) => setMovies(res.data))
      .catch((error) => {
        if (!handleAuthError(error)) {
          setMovies([]);
          console.info("Votre session a expiré !");
        }
      });
  }, [user, token, handleAuthError]);

  if (!user || !token) {
    return (
      <div className="sessionExpired">
        <h2>Aouch !</h2>
        <p>Ta session a été expiré. Il faut te reconnecter.</p>
        <p>Pa de soucis, tu peux le faire <a href="/authentification">ici</a> !</p>
      </div>
    );
  }

  return (
    <div className="userFavoritesMoviesSection">
      <h2>Mes films</h2>
      <button
        type="button"
        className="backBtn"
        onClick={() => {
          setView("initial");
        }}
      >
        Retour
      </button>
      {movies.length === 0 && <p>Aucun film favori.</p>}
      <div className="userMoviesList">
        <h3>Les films que j'ai aimés</h3>
        <HorizontalScroll>
          {likedMovies.map((movie) => (
            <div className="userMovieCard" key={movie.movie_id}>
              <Link to={`/films/${movie.movie_id}`}>
                            <img
              src={
                movie.movie_poster && movie.movie_poster.startsWith("http")
                  ? movie.movie_poster
                  : movie.movie_poster
                  ? `http://localhost:3994/src/assets/Movies/Posters/${movie.movie_poster}`
                  : ""
              }
              alt={movie.title}
            />

                <h3>{movie.movie_title}</h3>
              </Link>
            </div>
          ))}
        </HorizontalScroll>
      </div>
      <div className="userMoviesList">
        <h3>Mes films favoris</h3>
        <HorizontalScroll>
          {favoritesMovies.map((movie) => (
            <div className="userMovieCard" key={movie.movie_id}>
              <Link to={`/films/${movie.movie_id}`}>
                            <img
              src={
                movie.movie_poster && movie.movie_poster.startsWith("http")
                  ? movie.movie_poster
                  : movie.movie_poster
                  ? `http://localhost:3994/src/assets/Movies/Posters/${movie.movie_poster}`
                  : ""
              }
              alt={movie.title}
            />
                <h3>{movie.movie_title}</h3>
              </Link>
            </div>
          ))}
        </HorizontalScroll>
      </div>
      <div className="userMoviesList">
        <h3>Les films que j'ai vus</h3>
        <HorizontalScroll>
          {seenMovies.map((movie) => (
            <div className="userMovieCard" key={movie.movie_id}>
              <Link to={`/films/${movie.movie_id}`}>
                            <img
              src={
                movie.movie_poster && movie.movie_poster.startsWith("http")
                  ? movie.movie_poster
                  : movie.movie_poster
                  ? `http://localhost:3994/src/assets/Movies/Posters/${movie.movie_poster}`
                  : ""
              }
              alt={movie.title}
            />
                <h3>{movie.movie_title}</h3>
              </Link>
            </div>
          ))}
        </HorizontalScroll>
      </div>
      <div className="userMoviesList">
        <h3>Les films à voir</h3>
        <HorizontalScroll>
          {toWatchMovies.map((movie) => (
            <div className="userMovieCard" key={movie.movie_id}>
              <Link to={`/films/${movie.movie_id}`}>
                            <img
              src={
                movie.movie_poster && movie.movie_poster.startsWith("http")
                  ? movie.movie_poster
                  : movie.movie_poster
                  ? `http://localhost:3994/src/assets/Movies/Posters/${movie.movie_poster}`
                  : ""
              }
              alt={movie.title}
            />
                <h3>{movie.movie_title}</h3>
              </Link>
            </div>
          ))}
        </HorizontalScroll>
      </div>
    </div>
  );
}

UserFavoritesMoviesSection.propTypes = {
  setView: PropTypes.func.isRequired,
};

export default UserFavoritesMoviesSection;
