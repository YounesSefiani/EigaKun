import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleLeft } from "@fortawesome/free-solid-svg-icons";
import connexion from "../../../services/connexion";
import HorizontalScroll from "../../../components/HorizontalScroll/HorizontalScroll";
import { AuthContext } from "../../../context/AuthContext";
import "./FavoritesMovies.css";

function FavoritesMovies({ setView }) {
  const { user } = useContext(AuthContext); // Récupérer l'utilisateur
  const [likedMovies, setLikedMovies] = useState([]); // Initialiser avec useState([])
  const [favoritesMovies, setFavoritesMovies] = useState([]);
  const [seenMovies, setSeenMovies] = useState([]);
  const [toWatchMovies, setToWatchMovies] = useState([]);
  useEffect(() => {
    const fetchFavoriteMovies = async () => {
      if (!user || !user.id) {
        console.error("User is not available");
        return;
      }

      const token = localStorage.getItem("authToken");

      if (!token) {
        console.error("Token is missing");
        return;
      }

      try {
        const [
          likedMoviesResponse,
          favoriteMoviesResponse,
          seenMoviesResponse,
          toWatchMoviesResponse,
        ] = await Promise.all([
          connexion.get(`/userLiked/${user.id}/likedMovies`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          connexion.get(`/userFavorites/${user.id}/favoritesMovies`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          connexion.get(`/userSeen/${user.id}/seenMovies`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          connexion.get(`/userToWatch/${user.id}/toWatchMovies`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        // Vérifier la structure des données avant de les déstructurer
        const likedMoviesData = likedMoviesResponse.data?.likedMovies || {};
        const favoritesMoviesData =
          favoriteMoviesResponse.data?.favoritesMovies || {};
        const seenMoviesData = seenMoviesResponse.data?.seenMovies || {};
        const toWatchMoviesData =
          toWatchMoviesResponse.data?.toWatchMovies || {};

        if (Array.isArray(likedMoviesData)) {
          setLikedMovies(likedMoviesData);
        } else {
          console.error("No liked movies found in the response.");
        }

        if (Array.isArray(favoritesMoviesData)) {
          setFavoritesMovies(favoritesMoviesData);
        } else {
          console.error("No favorite movies found in the response.");
        }

        if (Array.isArray(seenMoviesData)) {
          setSeenMovies(seenMoviesData);
        } else {
          console.error("No seen movies found in the response.");
        }

        if (Array.isArray(toWatchMoviesData)) {
          setToWatchMovies(toWatchMoviesData);
        } else {
          console.error("No movies to watch found in the response.");
        }
      } catch (error) {
        console.error("Error fetching favorite movies:", error);
      }
    };

    fetchFavoriteMovies();
  }, [user]);

  return (
    <div className="favoritesMoviesContainer">
      <button
        type="button"
        className="backBtn"
        onClick={() => setView("initial")}
      >
        <FontAwesomeIcon icon={faCircleLeft} />
      </button>

      <div className="userMovies">
        <h3>Les films que j'aime</h3>

        {likedMovies.length > 0 ? (
          <div className="userMoviesList">
            <HorizontalScroll>
              {likedMovies.map((movie) => (
                <div className="userMovieCard" key={movie.movie_id}>
                  <Link to={`/films/${movie.movie_id}`}>
                    {movie.movie_poster ? (
                      <>
                        <img src={movie.movie_poster} alt={movie.movie_title} />
                        <p>{movie.movie_title}</p>
                      </>
                    ) : (
                      <div className="movieCardFolder">
                        <p>{movie.movie_title}</p>
                      </div>
                    )}
                  </Link>
                </div>
              ))}
            </HorizontalScroll>
          </div>
        ) : (
          <div className="moviesBlank">
            <p>Aucun film aimé pour le moment</p>
          </div>
        )}
      </div>

      <div className="userMovies">
        <h3>Les films favoris</h3>

        {favoritesMovies.length > 0 ? (
          <div className="userMoviesList">
            <HorizontalScroll>
              {favoritesMovies.map((movie) => (
                <div className="userMovieCard" key={movie.movie_id}>
                  <Link to={`/films/${movie.movie_id}`}>
                    {movie.movie_poster ? (
                      <>
                        <img src={movie.movie_poster} alt={movie.movie_title} />
                        <p>{movie.movie_title}</p>
                      </>
                    ) : (
                      <div className="movieCardFolder">
                        <p>{movie.movie_title}</p>
                      </div>
                    )}
                  </Link>
                </div>
              ))}
            </HorizontalScroll>
          </div>
        ) : (
          <div className="moviesBlank">
            <p>Aucun film favori pour le moment</p>
          </div>
        )}
      </div>

      <div className="userMovies">
        <h3>Les films vus</h3>

        {seenMovies.length > 0 ? (
          <div className="userMoviesList">
            <HorizontalScroll>
              {seenMovies.map((movie) => (
                <div className="userMovieCard" key={movie.movie_id}>
                  <Link to={`/films/${movie.movie_id}`}>
                    {movie.movie_poster ? (
                      <>
                        <img src={movie.movie_poster} alt={movie.movie_title} />
                        <p>{movie.movie_title}</p>
                      </>
                    ) : (
                      <div className="movieCardFolder">
                        <p>{movie.movie_title}</p>
                      </div>
                    )}
                  </Link>
                </div>
              ))}
            </HorizontalScroll>
          </div>
        ) : (
          <div className="moviesBlank">
            <p>Aucun film vu pour le moment</p>
          </div>
        )}
      </div>
      <div className="userMovies">
        <h3>Les films à voir</h3>
        {toWatchMovies.length > 0 ? (
          <div className="userMoviesList">
            <HorizontalScroll>
              {toWatchMovies.map((movie) => (
                <div className="userMovieCard" key={movie.movie_id}>
                  <Link to={`/films/${movie.movie_id}`}>
                    {movie.movie_poster ? (
                      <>
                        <img src={movie.movie_poster} alt={movie.movie_title} />
                        <p>{movie.movie_title}</p>
                      </>
                    ) : (
                      <div className="movieCardFolder">
                        <p>{movie.movie_title}</p>
                      </div>
                    )}
                  </Link>
                </div>
              ))}
            </HorizontalScroll>
          </div>
        ) : (
          <div className="moviesBlank">
            <p>Aucun film à voir pour le moment</p>
          </div>
        )}
      </div>
      <FontAwesomeIcon />
    </div>
  );
}

FavoritesMovies.propTypes = {
  setView: PropTypes.func.isRequired,
};

export default FavoritesMovies;
