import React, { useEffect, useContext, useState } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../../../../services/Context/AuthContext";
import connexion from "../../../../services/connexion";
import EigaKunLogo from "../../../../assets/EigaKunLogo.png";
import "./AdminMoviesSection.css";
import { useNavigate } from "react-router-dom";
import AdminMovieModal from "./AdminMovieModal/AdminMovieModal";
import AdminAddMovie from "./AdminAddMovie/AdminAddMovie";

function AdminMovieSection({ setView }) {
  const { user, token, handleAuthError, sessionExpired } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showMovieModal, setShowMovieModal] = useState(false);
  const [showAddMovie, setShowAddMovie] = useState(false);

  useEffect(() => {
    if ((!user || !token) && !sessionExpired) {
      navigate("/");
      return;
    }
    if (user && token) {
      connexion
        .get(`/movies`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setMovies(response.data);
        })
        .catch((error) => {
          handleAuthError(error);
        });
    }
  }, [user, token, handleAuthError, sessionExpired, navigate]);

  const handleOpenMovieModal = async (movie) => {
    // Récupère le film complet avec casting
    const response = await connexion.get(`/movies/${movie.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSelectedMovie(response.data);
    setShowMovieModal(true);
  };

  const handleCloseMovieModal = () => {
    setSelectedMovie(null);
    setShowMovieModal(false);
  };

  const handleUpdateMovie = (formData) => {
    connexion
      .put(`/movies/${selectedMovie.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        const updated = response.data.updateMovie;
        setMovies((prevMovies) =>
          prevMovies.map((movie) =>
            movie.id === selectedMovie.id ? updated : movie
          )
        );
        setSelectedMovie(response.data);
        setShowMovieModal(false);
      })
      .catch((error) => {
        console.error("Error updating movie:", error);
      });
  };

  // ...existing code...
  const handleDeleteMovie = async (movieId) => {
    try {
      await connexion.delete(`/movies/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Rafraîchir la liste après suppression
      const response = await connexion.get(`/movies`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMovies(response.data);
      setShowMovieModal(false);
      setSelectedMovie(null);
    } catch (error) {
      alert("Erreur lors de la suppression du film");
    }
  };
  // ...existing code...
  return (
    <div className="adminMoviesSection">
      <div className="adminMoviesSectionTop">
        <h2>Les films</h2>
        <div>
          <button type="button" onClick={() => setShowAddMovie(true)}>
            Ajouter un film
          </button>
          <button type="button" onClick={() => setView("initial")}>
            Retour
          </button>
        </div>
      </div>
      {showAddMovie && (
        <AdminAddMovie
          onClose={() => setShowAddMovie(false)}
          onMovieAdded={() => {
            connexion
              .get(`/movies`, {
                headers: { Authorization: `Bearer ${token}` },
              })
              .then((response) => {
                setMovies(response.data);
                setShowAddMovie(false);
              })
              .catch((error) => {
                handleAuthError(error);
              });
          }}
        />
      )}
      <div className="adminMoviesList">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="adminMovieCard"
            onClick={() => handleOpenMovieModal(movie)}
          >
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
              />
            ) : (
              <div className="adminMoviePosterHolder">
                <img src={EigaKunLogo} alt={movie.title} />
              </div>
            )}
            <p>{movie.title}</p>
          </div>
        ))}
      </div>
      <AdminMovieModal
        movie={selectedMovie}
        show={showMovieModal}
        onClose={handleCloseMovieModal}
        onUpdate={handleUpdateMovie}
        onDelete={handleDeleteMovie}
      />
    </div>
  );
}

AdminMovieSection.propTypes = {
  setView: PropTypes.func.isRequired,
};

export default AdminMovieSection;
